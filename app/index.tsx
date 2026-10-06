// app/index.tsx
import { useEffect, useRef, useState } from 'react';
import {
  Alert, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { MSGTYPE_HEARTBEAT, MSGTYPE_TS_LOGON } from '../src/common/msg_types';
import {
  JSON_KEY_BROWSER_SESSION_ID, JSON_KEY_IN_SEQ, JSON_KEY_MESSAGE_TYPE,
  JSON_KEY_PASSWORD, JSON_KEY_SUBMITTER, JSON_KEY_TEST_ID, JSON_KEY_USER,
} from '../src/common/common';

import { store } from '../src/redux/store';
import { ProcessMessage } from '../src/services/process_message';
import { registerCloseHandler } from '../src/services/ts_connection';
import { setTSUserId, setBSId, selectForcePasswordChange } from '../src/redux/globalsSlice';
import { DebugPanel } from '../src/components/DebugPanel';
import { setWs, setHeartbeat } from '../src/services/ws_state';
import { useAppSelector } from '../src/redux/hooks';

const TRANSACTION_URL = 'ws://192.168.56.100:9401';
const HEARTBEAT_INTERVAL = 20000;

export default function HomeScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('Disconnected');
  const [loggedOn, setLoggedOn] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bsidRef = useRef(
    'mobile-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 10)
  );

  const router = useRouter();
  const forcePasswordChange = useAppSelector(selectForcePasswordChange);

  useEffect(() => {
    if (forcePasswordChange) {
      router.replace('/change_password?forced=1');
      return;
    }
    if (loggedOn) {
      router.replace('/(tabs)/instruments');
    }
  }, [loggedOn, forcePasswordChange, router]);

  function handleLogin() {
    if (!username || !password) {
      Alert.alert('Login', 'Please enter User Id and Password');
      return;
    }

    store.dispatch(setTSUserId(username));
    store.dispatch(setBSId(bsidRef.current));
    setStatus('Connecting...');

    const ws = new WebSocket(TRANSACTION_URL);
    wsRef.current = ws;
    setWs(ws);

    registerCloseHandler(() => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      if (ws.readyState === WebSocket.OPEN) ws.close();
      setStatus('Logged out by server');
    });

    heartbeatRef.current = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          [JSON_KEY_USER]: username,
          [JSON_KEY_SUBMITTER]: username,
          [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_HEARTBEAT,
          [JSON_KEY_TEST_ID]: 'ABCDE',
        }));
      }
    }, HEARTBEAT_INTERVAL);

    setHeartbeat(heartbeatRef.current);

    ws.onopen = () => {
      setStatus('Connected - sending logon');
      ws.send(JSON.stringify({
        [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_TS_LOGON,
        [JSON_KEY_USER]: username,
        [JSON_KEY_SUBMITTER]: username,
        [JSON_KEY_PASSWORD]: password,
        [JSON_KEY_IN_SEQ]: 0,
        [JSON_KEY_BROWSER_SESSION_ID]: bsidRef.current,
      }));
      setStatus('Logon sent');
    };

    ws.onmessage = (event) => {
      try {
        const json = JSON.parse(event.data);
        const { isMarketController } = store.getState().globals;
        ProcessMessage(
          json,
          store.dispatch,
          setLoggedOn,
          username,
          isMarketController
        );
      } catch (e) {
        console.error('[CTS] bad message', e, event.data);
      }
    };

    ws.onerror = (e) => {
      console.error('[CTS] WS error', e);
      setStatus('Connection error');
    };

    ws.onclose = (e: CloseEvent) => {
      console.log('[WS CLOSED]', e.code, e.reason, 'wasClean:', e.wasClean);
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      setStatus('Disconnected');
      setLoggedOn(false);
    };
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CTS Mobile</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.status}>Status: {status}</Text>
        {loggedOn && <Text style={styles.status}>Logged on ✅</Text>}
      </View>
      {__DEV__ && <DebugPanel />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { marginTop: 8, fontSize: 16, textAlign: 'center' },
  form: { marginTop: 40 },
  input: {
    height: 50, borderWidth: 1, borderColor: '#999', borderRadius: 6,
    paddingHorizontal: 14, marginBottom: 16, fontSize: 16,
  },
  button: {
    height: 50, borderRadius: 6, alignItems: 'center',
    justifyContent: 'center', backgroundColor: '#222',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  status: { marginTop: 20, textAlign: 'center', fontSize: 14 },
});