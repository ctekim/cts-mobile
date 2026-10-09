// app/index.tsx
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Alert, ImageBackground, KeyboardAvoidingView,
  Platform, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

import { MSGTYPE_HEARTBEAT, MSGTYPE_TS_LOGON } from '../src/common/msg_types';
import {
  JSON_KEY_BROWSER_SESSION_ID, JSON_KEY_IN_SEQ, JSON_KEY_MESSAGE_TYPE,
  JSON_KEY_PASSWORD, JSON_KEY_SUBMITTER, JSON_KEY_TEST_ID, JSON_KEY_USER,
} from '../src/common/common';

import { store } from '../src/redux/store';
import { ProcessMessage } from '../src/services/process_message';
import { registerCloseHandler } from '../src/services/ts_connection';
import { setTSUserId, setBSId, selectForcePasswordChange } from '../src/redux/globalsSlice';
// import { DebugPanel } from '../src/components/DebugPanel';
import { setWs, setHeartbeat } from '../src/services/ws_state';
import { useAppSelector } from '../src/redux/hooks';

const DEFAULT_TRANSACTION_URL = 'ws://192.168.56.100:9401';
const HEARTBEAT_INTERVAL = 20000;

// SecureStore keys
const SS_USER = 'cts_bio_user';
const SS_PASS = 'cts_bio_pass';
const SS_SERVER_URL = 'cts_server_url';

// Survives for the lifetime of the JS process.
// Resets on cold start — so a fresh app launch will prompt once.
let biometricPromptAnswered = false;

// Background image you added
const BG_IMAGE = require('../assets/images/login-bg.jpg');

export default function HomeScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('Disconnected');
  const [loggedOn, setLoggedOn] = useState(false);
  const [connecting, setConnecting] = useState(false);

  // biometric state
  const [bioAvailable, setBioAvailable] = useState(false);
  const [hasSavedCreds, setHasSavedCreds] = useState(false);
  const [bioChecking, setBioChecking] = useState(false);

  // server url (from Settings)
  const [transactionUrl, setTransactionUrl] = useState(DEFAULT_TRANSACTION_URL);

  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // const bsidRef = useRef(
  //   'mobile-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 10)
  // );
  const bsidRef = useRef('');
  const router = useRouter();
  const forcePasswordChange = useAppSelector(selectForcePasswordChange);

  // ---------- init: biometric availability + saved creds + server url ----------
  useEffect(() => {
    (async () => {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setBioAvailable(hasHardware && enrolled);

        const savedUser = await SecureStore.getItemAsync(SS_USER);
        const savedPass = await SecureStore.getItemAsync(SS_PASS);
        // console.log('[bio-check] hardware:', hasHardware, '| enrolled:', enrolled, '| savedUser:', !!savedUser, '| savedPass:', !!savedPass);
        setHasSavedCreds(!!savedUser && !!savedPass);

        const savedUrl = await SecureStore.getItemAsync(SS_SERVER_URL);
        
        if (savedUrl) setTransactionUrl(savedUrl);
      } catch (e) {
        console.log('[login] init error', e);
      }
    })();
  }, []);

  useEffect(() => {
    if (forcePasswordChange) {
      router.replace('/change_password?forced=1');
      return;
    }
    if (loggedOn) {
      router.replace('/(tabs)/instruments');
    }
  }, [loggedOn, forcePasswordChange, router]);

  // ---------- core login (shared by manual + biometric) ----------
  function startLogin(user: string, pass: string, allowBioPrompt: boolean) {
    bsidRef.current = `${user}-mobile`; 
    store.dispatch(setTSUserId(user));
    store.dispatch(setBSId(bsidRef.current));
    setStatus('Connecting…');
    setConnecting(true);

    const ws = new WebSocket(transactionUrl);
    bsidRef.current = `${user}-mobile`;
    wsRef.current = ws;
    setWs(ws);

    registerCloseHandler(() => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      if (ws.readyState === WebSocket.OPEN) ws.close();
      setStatus('Logged out by server');
      setConnecting(false);
    });

    heartbeatRef.current = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          [JSON_KEY_USER]: user,
          [JSON_KEY_SUBMITTER]: user,
          [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_HEARTBEAT,
          [JSON_KEY_TEST_ID]: 'ABCDE',
        }));
      }
    }, HEARTBEAT_INTERVAL);

    setHeartbeat(heartbeatRef.current);

    ws.onopen = () => {
      setStatus('Authenticating…');
      ws.send(JSON.stringify({
        [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_TS_LOGON,
        [JSON_KEY_USER]: user,
        [JSON_KEY_SUBMITTER]: user,
        [JSON_KEY_PASSWORD]: pass,
        [JSON_KEY_IN_SEQ]: 0,
        [JSON_KEY_BROWSER_SESSION_ID]: bsidRef.current,
      }));
    };

    ws.onmessage = (event) => {
      try {
        const json = JSON.parse(event.data);
        const { isMarketController } = store.getState().globals;
        ProcessMessage(
          json,
          store.dispatch,
          (v: boolean) => {
            setLoggedOn(v);
            // On successful login, offer to save credentials — but only once
            // per app session, and only if the user hasn't already saved them.
            if (v && allowBioPrompt && bioAvailable && !hasSavedCreds && !biometricPromptAnswered) {
              biometricPromptAnswered = true;
              Alert.alert(
                'Enable Biometric Login',
                'Save your credentials so you can sign in next time with Face ID / fingerprint?',
                [
                  { text: 'Not Now', style: 'cancel' },
                  {
                    text: 'Enable',
                    onPress: async () => {
                      try {
                        await SecureStore.setItemAsync(SS_USER, user);
                        await SecureStore.setItemAsync(SS_PASS, pass);
                        setHasSavedCreds(true);
                      } catch (e) {
                        console.log('[biometric] save error', e);
                      }
                    },
                  },
                ]
              );
            }
          },
          user,
          isMarketController
        );
      } catch (e) {
        console.error('[CTS] bad message', e, event.data);
      }
    };

    ws.onerror = () => {
      setStatus('Connection error');
      setConnecting(false);
    };

    ws.onclose = (e: CloseEvent) => {
      console.log('[WS CLOSED]', e.code, e.reason, 'wasClean:', e.wasClean);
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      setStatus('Disconnected');
      setConnecting(false);
      setLoggedOn(false);
    };
  }

  // ---------- manual login button ----------
  function handleLogin() {
    if (!username || !password) {
      Alert.alert('Login', 'Please enter User Id and Password');
      return;
    }
    // Prompt (if applicable) is deferred to post-login inside startLogin.
    startLogin(username, password, /* allowBioPrompt */ true);
  }

  // ---------- biometric login button ----------
  async function handleBiometricLogin() {
    if (!bioAvailable || !hasSavedCreds) return;
    setBioChecking(true);
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Sign in to CTS',
        fallbackLabel: 'Use password',
        cancelLabel: 'Cancel',
      });

      if (!result.success) {
        setStatus('Biometric cancelled');
        setBioChecking(false);
        return;
      }

      const savedUser = await SecureStore.getItemAsync(SS_USER);
      const savedPass = await SecureStore.getItemAsync(SS_PASS);
      setBioChecking(false);

      if (!savedUser || !savedPass) {
        Alert.alert('Biometric', 'No saved credentials found. Please sign in manually.');
        setHasSavedCreds(false);
        return;
      }

      setUsername(savedUser);
      setPassword(savedPass);
      // Don't re-prompt for biometrics after a biometric login.
      startLogin(savedUser, savedPass, /* allowBioPrompt */ false);
    } catch (e) {
      console.log('[biometric] auth error', e);
      setBioChecking(false);
    }
  }

  const showBioButton = bioAvailable && hasSavedCreds && !connecting;

  return (
    <ImageBackground source={BG_IMAGE} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <View style={styles.brand}>
            <Text style={styles.brandTitle}>CTS</Text>
            <Text style={styles.brandSub}>Mobile Trading App</Text>
          </View>

          <View style={styles.card}>
            {showBioButton && (
              <>
                <TouchableOpacity
                  style={[styles.bioButton, bioChecking && styles.buttonDisabled]}
                  onPress={handleBiometricLogin}
                  disabled={bioChecking}
                  activeOpacity={0.85}
                >
                  {bioChecking ? (
                    <ActivityIndicator color="#2f7dd1" />
                  ) : (
                    <>
                      <Text style={styles.bioIcon}>🔒</Text>
                      <Text style={styles.bioText}>Sign in with Biometrics</Text>
                    </>
                  )}
                </TouchableOpacity>

                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>
              </>
            )}

            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. jsmith"
              placeholderTextColor="#6b7a90"
              autoCapitalize="none"
              autoCorrect={false}
              value={username}
              onChangeText={setUsername}
              editable={!connecting}
            />

            <Text style={[styles.label, { marginTop: 12 }]}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#6b7a90"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!connecting}
            />

            <TouchableOpacity
              style={[styles.button, connecting && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={connecting}
              activeOpacity={0.85}
            >
              {connecting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.statusRow}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      status === 'Disconnected' ? '#7a8598'
                      : status.startsWith('Connection') || status.startsWith('Logged out') || status.startsWith('Biometric') ? '#e06060'
                      : '#4ec98a',
                  },
                ]}
              />
              <Text style={styles.statusText}>{status}</Text>
            </View>

            {loggedOn && (
              <Text style={[styles.statusText, { marginTop: 6, color: '#4ec98a' }]}>
                Logged on ✓
              </Text>
            )}
          </View>

          <Text style={styles.footer}>© {new Date().getFullYear()} CTS</Text>
        </View>
      </KeyboardAvoidingView>

      {/* {__DEV__ && <DebugPanel />} */}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#040a14' },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(4,10,20,0.78)',
  },
  flex: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'center',
  },

  brand: { alignItems: 'center', marginBottom: 32 },
  brandTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: '#e8eef7',
    letterSpacing: 4,
  },
  brandSub: {
    marginTop: 6,
    fontSize: 13,
    color: '#7a8598',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  card: {
    backgroundColor: 'rgba(12, 20, 32, 0.85)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },

  label: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#e8eef7',
  },

  button: {
    marginTop: 20,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2f7dd1',
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.4 },

  bioButton: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#2f7dd1',
    backgroundColor: 'rgba(47,125,209,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  bioIcon: { fontSize: 18 },
  bioText: { color: '#2f7dd1', fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 11,
    color: '#6b7a90',
    letterSpacing: 1,
    fontWeight: '600',
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    gap: 8,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 13, color: '#8b98ad' },

  footer: {
    marginTop: 32,
    textAlign: 'center',
    fontSize: 11,
    color: '#4b5568',
    letterSpacing: 0.6,
  },
});