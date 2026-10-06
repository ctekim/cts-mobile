// app/market_modify.tsx
import { useMemo, useState } from 'react';
import {
  ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppSelector } from '../src/redux/hooks';
import { sendMarketModify } from '../src/services/market_messages';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import { Picker } from '../src/components/Picker';
import { DarkTheme } from '../src/common/theme';
import { STATUS_ACTIVE } from '../src/common/common';

export default function MarketModifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ code?: string }>();

  const markets = useAppSelector(
    (s: any) => s.tables.tables.MarketsTable ?? []
  );
  const exchanges = useAppSelector(
    (s: any) => s.tables.tables.ExchangesTable ?? []
  );

  const code = typeof params.code === 'string' ? params.code : '';
  const existing = (markets as any[]).find((m) => m.code === code);

  const [description, setDescription] = useState(existing?.descr ?? '');
  const [exchange, setExchange] = useState(existing?.exch ?? '');

  const [validationError, setValidationError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const exchangeOptions = useMemo(
    () =>
      (exchanges as any[])
        .map((e) => ({ value: e.code, label: e.code }))
        .sort((a, b) => a.value.localeCompare(b.value)),
    [exchanges]
  );

  const onSubmit = () => {
    if (!code) return setValidationError('No market selected.');
    if (!description.trim()) return setValidationError('Description is missing.');
    if (!exchange) return setValidationError('Exchange is missing.');
    setConfirmOpen(true);
  };

  const doSend = () => {
    const ok = sendMarketModify(code, description.trim(), exchange, STATUS_ACTIVE, 'N');
    setConfirmOpen(false);
    if (!ok) {
      setValidationError('The socket is not open. Try again.');
      return;
    }
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: DarkTheme.background }]}>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: DarkTheme.codeText }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.toolbarTitle, { color: DarkTheme.text }]}>Modify Market</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.inputBlock}>
          <Text style={[styles.label, { color: DarkTheme.textMuted }]}>Code (read-only)</Text>
          <TextInput
            value={code}
            editable={false}
            style={[styles.input, { color: DarkTheme.textMuted, borderColor: DarkTheme.cellBorder, backgroundColor: DarkTheme.surfaceAlt }]}
          />
        </View>

        <View style={styles.inputBlock}>
          <Text style={[styles.label, { color: DarkTheme.textMuted }]}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholderTextColor={DarkTheme.textMuted}
            style={[styles.input, { color: DarkTheme.text, borderColor: DarkTheme.cellBorder, backgroundColor: DarkTheme.surface }]}
          />
        </View>

        <Picker
          label="Exchange"
          value={exchange}
          options={exchangeOptions}
          onChange={setExchange}
          placeholder="Select Exchange"
        />

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: DarkTheme.surface, borderColor: DarkTheme.cellBorder, borderWidth: 1 }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.buttonText, { color: DarkTheme.text }]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: DarkTheme.accent }]}
            onPress={onSubmit}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={validationError !== null}
        title="Modify Market"
        message={validationError ?? ''}
        variant="error"
        actions={[{ label: 'OK', style: 'default', onPress: () => {} }]}
        onClose={() => setValidationError(null)}
      />

      <ConfirmDialog
        visible={confirmOpen}
        title="Modify Market"
        message={`Update ${code} — ${description} on ${exchange}?`}
        variant="default"
        actions={[
          { label: 'Back', style: 'cancel', onPress: () => {} },
          { label: 'Update', style: 'success', onPress: doSend },
        ]}
        onClose={() => setConfirmOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  toolbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8 },
  toolbarTitle: { fontSize: 18, fontWeight: 'bold' },
  backBtn: { paddingVertical: 6, paddingHorizontal: 4, width: 60 },
  backText: { fontSize: 16, fontWeight: 'bold' },
  scroll: { padding: 16, paddingBottom: 40 },
  inputBlock: { marginTop: 12 },
  label: { fontSize: 13, marginBottom: 6 },
  input: { height: 48, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, fontSize: 16 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 32 },
  button: { flex: 1, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});