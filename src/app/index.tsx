import { useRef, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MSGTYPE_HEARTBEAT, MSGTYPE_TS_LOGON } from '../common/msg_types';
import { JSON_KEY_BROWSER_SESSION_ID, JSON_KEY_IN_SEQ, JSON_KEY_MESSAGE_TYPE, JSON_KEY_PASSWORD, JSON_KEY_SUBMITTER, JSON_KEY_TEST_ID, JSON_KEY_USER } from '../common/common.ts';

const TRANSACTION_URL = 'ws://192.168.56.100:9401';
const HEARTBEAT_INTERVAL = 20000; // 20 seconds

export default function HomeScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('Disconnected');

  const wsRef = useRef<WebSocket | null>(null);

  const bsidRef = useRef(
    'mobile-' +
    Date.now().toString(36) +
    '-' +
    Math.random().toString(36).substring(2, 10)
  );

  function handleLogin() {
    if (!username || !password) {
      Alert.alert('Login', 'Please enter User Id and Password');
      return;
    }

    setStatus('Connecting...');

    const ws = new WebSocket(TRANSACTION_URL);
    wsRef.current = ws;

    const heartbeatInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        const heartbeatMessage = {
          [JSON_KEY_USER]: username,
          [JSON_KEY_SUBMITTER]: username,
          [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_HEARTBEAT,
          [JSON_KEY_TEST_ID]: 'ABCDE',
        };

        ws.send(JSON.stringify(heartbeatMessage));

        // console.log('[CTS Mobile] Heartbeat sent:', heartbeatMessage);
      }
    }, HEARTBEAT_INTERVAL);

    ws.onopen = () => {
      setStatus('Connected - sending logon');

      const loginMessage = {
        [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_TS_LOGON,
        [JSON_KEY_USER]: username,
        [JSON_KEY_SUBMITTER]: username,
        [JSON_KEY_PASSWORD]: password,
        [JSON_KEY_IN_SEQ]: 0,
        [JSON_KEY_BROWSER_SESSION_ID]: bsidRef.current,
      };

      console.log('[CTS Mobile] Sending logon:', loginMessage);

      ws.send(JSON.stringify(loginMessage));

      setStatus('Logon sent');
    };

    ws.onmessage = (event) => {
      setStatus('Receiving CTS messages');
    };

    ws.onerror = (error) => {
      console.error('[CTS Mobile] WebSocket error:', error);
      setStatus('Connection error');
      Alert.alert('CTS', 'WebSocket connection error');
    };

    ws.onclose = () => {
      console.log('[CTS Mobile] WebSocket closed');
      setStatus('Disconnected');
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

        <Text style={styles.status}>
          Status: {status}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  subtitle: {
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
  },

  form: {
    marginTop: 40,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    paddingHorizontal: 14,
    marginBottom: 16,
    fontSize: 16,
  },

  button: {
    height: 50,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  status: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 14,
  },
});