// src/screens/HomeScreen.tsx
import { useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ProcessMessage } from '../services/process_message';
import { setSeqNum, setRoleId, setIsMarketController, setForcePasswordChange } from '../redux/globalsSlice';
import { MSGTYPE_HEARTBEAT, MSGTYPE_TS_LOGON } from '../common/msg_types';

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

  const dispatch = useDispatch();
  const isMarketController = useSelector((s: any) => s.globals.isMarketController);

  function handleLogin() {
    if (!username || !password) {
      Alert.alert('Login', 'Please enter User Id and Password');
      return;
    }

    setStatus('Connecting...');
    const ws = new WebSocket(TRANSACTION_URL);
    wsRef.current = ws;

    heartbeatRef.current = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          user: username,
          submitter: username,
          m_type: MSGTYPE_HEARTBEAT,
          testId: 'ABCDE',
        }));
      }
    }, HEARTBEAT_INTERVAL);

    ws.onopen = () => {
      setStatus('Connected - sending logon');
      ws.send(JSON.stringify({
        m_type: MSGTYPE_TS_LOGON,
        user: username,
        submitter: username,
        password,
        in_seq: 0,
        bsid: bsidRef.current,
      }));
    };

    ws.onmessage = (event) => {
      try {
        const json = JSON.parse(event.data);
        ProcessMessage(
          json,
          dispatch,
          setLoggedOn,
          username,
          isMarketController
        );
      } catch (e) {
        console.error('[CTS] Bad message', e, event.data);
      }
    };

    ws.onerror = (error) => {
      console.error('[CTS] WebSocket error', error);
      setStatus('Connection error');
    };

    ws.onclose = () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      setStatus('Disconnected');
      setLoggedOn(false);
    };
  }

  // ... your existing JSX, plus maybe show loggedOn state ...
}