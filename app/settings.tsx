// app/settings.tsx
import { useEffect, useState } from 'react';
import {
  Alert, ScrollView, StyleSheet, Switch, Text, TextInput,
  TouchableOpacity, View, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import Constants from 'expo-constants';

import { DarkTheme } from '../src/common/theme';

const SS_USER = 'cts_bio_user';
const SS_PASS = 'cts_bio_pass';
const SS_SERVER_URL = 'cts_server_url';
const DEFAULT_SERVER_URL = 'ws://192.168.56.100:9401';

export default function SettingsScreen() {
  const router = useRouter();

  const [bioAvailable, setBioAvailable] = useState(false);
  const [bioEnabled, setBioEnabled] = useState(false);
  const [bioLoading, setBioLoading] = useState(false);

  // password entry for enabling
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [pendingPassword, setPendingPassword] = useState('');
  const [pendingUsername, setPendingUsername] = useState('');

  // server URL
  const [serverUrl, setServerUrl] = useState(DEFAULT_SERVER_URL);
  const [serverUrlDraft, setServerUrlDraft] = useState(DEFAULT_SERVER_URL);

  useEffect(() => {
    (async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setBioAvailable(hasHardware && enrolled);

      const savedUser = await SecureStore.getItemAsync(SS_USER);
      const savedPass = await SecureStore.getItemAsync(SS_PASS);
      setBioEnabled(!!savedUser && !!savedPass);

      const savedUrl = await SecureStore.getItemAsync(SS_SERVER_URL);
      if (savedUrl) {
        setServerUrl(savedUrl);
        setServerUrlDraft(savedUrl);
      }
    })();
  }, []);

  // ---- biometric ----
  const onToggleBiometric = (next: boolean) => {
    if (next) {
      // can't enable without a password to save
      setPendingUsername('');
      setPendingPassword('');
      setShowPasswordPrompt(true);
    } else {
      setBioLoading(true);
      (async () => {
        try {
          await SecureStore.deleteItemAsync(SS_USER);
          await SecureStore.deleteItemAsync(SS_PASS);
          setBioEnabled(false);
        } catch (e) {
          console.log('[settings] disable biometric error', e);
        } finally {
          setBioLoading(false);
        }
      })();
    }
  };

  const cancelPasswordPrompt = () => {
    setShowPasswordPrompt(false);
    setPendingPassword('');
    setPendingUsername('');
  };

  const confirmPasswordPrompt = async () => {
    if (!pendingUsername.trim() || !pendingPassword) {
      Alert.alert('Enable Biometric', 'Enter both username and password');
      return;
    }
    setBioLoading(true);
    try {
      // OPTION B: save without verification.
      // TODO: (Option A) open a throwaway WS, send a logon, inspect the reply.
      await SecureStore.setItemAsync(SS_USER, pendingUsername.trim());
      await SecureStore.setItemAsync(SS_PASS, pendingPassword);
      setBioEnabled(true);
      setShowPasswordPrompt(false);
      setPendingPassword('');
      setPendingUsername('');
      Alert.alert(
        'Biometric Enabled',
        'You can now sign in with Face ID / fingerprint.',
      );
    } catch (e) {
      console.log('[settings] enable biometric error', e);
      Alert.alert('Error', 'Could not enable biometric login');
    } finally {
      setBioLoading(false);
    }
  };

  // ---- server url ----
  const saveServerUrl = async () => {
    const trimmed = serverUrlDraft.trim();
    if (!/^wss?:\/\/.+/.test(trimmed)) {
      Alert.alert('Invalid URL', 'Must start with ws:// or wss://');
      return;
    }
    try {
      await SecureStore.setItemAsync(SS_SERVER_URL, trimmed);
      setServerUrl(trimmed);
      Alert.alert('Saved', 'Server URL updated. Takes effect on next login.');
    } catch (e) {
      console.log('[settings] save server url error', e);
      Alert.alert('Error', 'Could not save server URL');
    }
  };

  const resetServerUrl = async () => {
    try {
      await SecureStore.deleteItemAsync(SS_SERVER_URL);
      setServerUrl(DEFAULT_SERVER_URL);
      setServerUrlDraft(DEFAULT_SERVER_URL);
    } catch (e) {
      console.log('[settings] reset server url error', e);
    }
  };

  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <View style={[styles.container, { backgroundColor: DarkTheme.background }]}>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Text style={[styles.backText, { color: DarkTheme.codeText }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: DarkTheme.text }]}>Settings</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

        {/* ---------- Security ---------- */}
        <Text style={[styles.section, { color: DarkTheme.textMuted }]}>Security</Text>

        <View style={[styles.row, { borderBottomColor: DarkTheme.cellBorder }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowLabel, { color: DarkTheme.text }]}>
              Biometric Login
            </Text>
            <Text style={[styles.rowSub, { color: DarkTheme.textMuted }]}>
              {bioAvailable
                ? bioEnabled
                  ? 'Enabled — sign in with Face ID / fingerprint'
                  : 'Sign in with Face ID / fingerprint'
                : 'Not available on this device'}
            </Text>
          </View>
          {bioLoading ? (
            <ActivityIndicator color={DarkTheme.accent} />
          ) : (
            <Switch
              value={bioEnabled}
              onValueChange={onToggleBiometric}
              disabled={!bioAvailable}
              trackColor={{ false: DarkTheme.cellBorder, true: DarkTheme.accent }}
              thumbColor={bioEnabled ? DarkTheme.positive : '#ccc'}
            />
          )}
        </View>

        {/* ---------- Connection (dev) ---------- */}
        <Text style={[styles.section, { color: DarkTheme.textMuted }]}>Connection</Text>

        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <Text style={[styles.inputLabel, { color: DarkTheme.textMuted }]}>
            Server URL
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                color: DarkTheme.text,
                borderColor: DarkTheme.cellBorder,
                backgroundColor: DarkTheme.surface,
              },
            ]}
            value={serverUrlDraft}
            onChangeText={setServerUrlDraft}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="ws://host:port"
            placeholderTextColor={DarkTheme.textMuted}
          />
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: DarkTheme.positive }]}
              onPress={saveServerUrl}
            >
              <Text style={styles.btnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: DarkTheme.surfaceAlt }]}
              onPress={resetServerUrl}
            >
              <Text style={[styles.btnText, { color: DarkTheme.text }]}>Reset</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.hint, { color: DarkTheme.textMuted }]}>
            Current: {serverUrl}
          </Text>
        </View>

        {/* ---------- About ---------- */}
        <Text style={[styles.section, { color: DarkTheme.textMuted }]}>About</Text>
        <View style={[styles.row, { borderBottomColor: DarkTheme.cellBorder }]}>
          <Text style={[styles.rowLabel, { color: DarkTheme.text, flex: 1 }]}>Version</Text>
          <Text style={{ color: DarkTheme.textMuted }}>{version}</Text>
        </View>

      </ScrollView>

      {/* Password prompt modal for enabling biometrics */}
      {showPasswordPrompt && (
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: DarkTheme.surface }]}>
            <Text style={[styles.modalTitle, { color: DarkTheme.text }]}>
              Enable Biometric Login
            </Text>
            <Text style={[styles.modalHint, { color: DarkTheme.textMuted }]}>
              Enter your credentials. They will be securely stored on this device
              and used the next time you sign in.
            </Text>

            <Text style={[styles.inputLabel, { color: DarkTheme.textMuted }]}>Username</Text>
            <TextInput
              style={[styles.input, { color: DarkTheme.text, borderColor: DarkTheme.cellBorder }]}
              value={pendingUsername}
              onChangeText={setPendingUsername}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={DarkTheme.textMuted}
            />

            <Text style={[styles.inputLabel, { color: DarkTheme.textMuted, marginTop: 10 }]}>
              Password
            </Text>
            <TextInput
              style={[styles.input, { color: DarkTheme.text, borderColor: DarkTheme.cellBorder }]}
              value={pendingPassword}
              onChangeText={setPendingPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={DarkTheme.textMuted}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: DarkTheme.surfaceAlt }]}
                onPress={cancelPasswordPrompt}
                disabled={bioLoading}
              >
                <Text style={{ color: DarkTheme.text, fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: DarkTheme.positive }]}
                onPress={confirmPasswordPrompt}
                disabled={bioLoading}
              >
                {bioLoading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={{ color: '#fff', fontWeight: 'bold' }}>Enable</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  backBtn: { paddingVertical: 6, paddingHorizontal: 4, width: 60, justifyContent: 'center' },
  backText: { fontSize: 16, fontWeight: 'bold' },

  section: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  rowLabel: { fontSize: 15, fontWeight: '600' },
  rowSub: { fontSize: 12, marginTop: 2 },

  inputLabel: { fontSize: 12, marginBottom: 4, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 14,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
  hint: { fontSize: 11, marginTop: 8, fontFamily: 'monospace' },

  modalBackdrop: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 10,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  modalHint: { fontSize: 12, marginBottom: 12 },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
  modalBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    minWidth: 90,
    alignItems: 'center',
  },
});