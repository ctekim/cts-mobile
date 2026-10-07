// app/firm_modify.tsx
import { useEffect, useMemo, useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Modal, FlatList, Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppSelector } from '../src/redux/hooks';
import {
  selectTSConnected, selectIsMarketController, selectTSUserId,
} from '../src/redux/globalsSlice';
import { DarkTheme } from '../src/common/theme';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import { sendFirmModify } from '../src/services/firm_messages';
import {
  FIRM_TYPE_BROKER, FIRM_TYPE_NAME_BROKER,
  FIRM_TYPE_DATAVENDOR, FIRM_TYPE_NAME_DATAVENDOR,
  FIRM_TYPE_CLEARING, FIRM_TYPE_NAME_CLEARING,
  FIRM_TYPE_EXCHANGE, FIRM_TYPE_NAME_EXCHANGE,
  FIRM_TYPE_SURVEILLANCE, FIRM_TYPE_NAME_SURVEILLANCE,
  DROPDOWN_LIST_NONE,
} from '../src/common/common';

const EMPTY_ARRAY: any[] = [];
const NONE = DROPDOWN_LIST_NONE ?? 'None';

const TYPE_OPTIONS = [
  { id: NONE,                    name: NONE },
  { id: FIRM_TYPE_BROKER,        name: FIRM_TYPE_NAME_BROKER },
  { id: FIRM_TYPE_DATAVENDOR,    name: FIRM_TYPE_NAME_DATAVENDOR },
  { id: FIRM_TYPE_CLEARING,      name: FIRM_TYPE_NAME_CLEARING },
  { id: FIRM_TYPE_EXCHANGE,      name: FIRM_TYPE_NAME_EXCHANGE },
  { id: FIRM_TYPE_SURVEILLANCE,  name: FIRM_TYPE_NAME_SURVEILLANCE },
];

function typeNameFor(typeId: any): string {
  if (typeId == null || typeId === '') return NONE;
  const found = TYPE_OPTIONS.find((o) => String(o.id) === String(typeId));
  return found ? found.name : String(typeId);
}

export default function FirmModifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ code?: string }>();
  const connected = useAppSelector(selectTSConnected);
  const isMarketController = useAppSelector(selectIsMarketController);
  const submitter = useAppSelector(selectTSUserId);

  const firms: any[] = useAppSelector(
    (s: any) => s.tables.tables.ParticipantsTable ?? EMPTY_ARRAY
  );

  const firmCode = String(params.code ?? '');
  const firm = useMemo(
    () => firms.find((f: any) => String(f.code) === firmCode),
    [firms, firmCode]
  );

  const [description, setDescription] = useState('');
  const [type, setType] = useState<string>(NONE);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [picker, setPicker] = useState<null | 'type'>(null);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/firms');
  };

  useEffect(() => {
    if (!connected) router.replace('/');
    else if (!isMarketController) router.replace('/(tabs)/more');
  }, [connected, isMarketController, router]);

  useEffect(() => {
    if (!firm) return;
    setDescription(String(firm.descr ?? ''));
    setType(firm.p_type != null ? String(firm.p_type) : NONE);
  }, [firm]);

  const validate = (): string | null => {
    if (!firm) return 'Firm not found';
    if (!description.trim()) return 'Description is required';
    if (!type || type === NONE) return 'Type is required';
    return null;
  };

  const submit = () => {
    const err = validate();
    if (err) return setError(err);
    setError(null);
    setConfirm(true);
  };

  const doSubmit = () => {
    if (!firm) return;
    const ok = sendFirmModify({
      code: String(firm.code),
      description: description.trim(),
      type: Number(type),
      submitter,
    });
    if (!ok) console.warn('[firm_modify] not connected');
    setConfirm(false);
    goBack();
  };

  if (!firm) {
    return (
      <View style={[styles.container, { backgroundColor: DarkTheme.background }]}>
        <View style={styles.toolbar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn} hitSlop={8}>
            <Text style={[styles.backText, { color: DarkTheme.codeText }]}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: DarkTheme.text }]}>Modify Firm</Text>
          <View style={{ width: 60 }} />
        </View>
        <Text style={{ color: DarkTheme.text, padding: 20 }}>Firm not found</Text>
      </View>
    );
  }

  const typePickerOptions = TYPE_OPTIONS.map((t) => ({
    id: String(t.id),
    name: t.name,
  }));

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: DarkTheme.background, paddingTop: 40 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn} hitSlop={8}>
          <Text style={[styles.backText, { color: DarkTheme.codeText }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: DarkTheme.text }]} numberOfLines={1}>
          Modify Firm #{firm.code}
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Field label="Code (read-only)" value={String(firm.code ?? '')} editable={false} />
        <Field label="Description" value={description} onChange={setDescription} />

        <SelectField
          label="Type"
          value={type}
          display={typeNameFor(type)}
          onOpen={() => setPicker('type')}
        />

        {error && <Text style={{ color: DarkTheme.negative, marginTop: 8 }}>{error}</Text>}

        <TouchableOpacity
          style={[styles.submit, { backgroundColor: DarkTheme.positive }]}
          onPress={submit}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>

      {confirm && (
        <ConfirmDialog
          visible
          title="Modify Firm"
          message={`Submit changes for firm ${firm.code}?`}
          variant="default"
          accentColor={DarkTheme.positive}
          actions={[
            { label: 'Cancel', style: 'cancel', onPress: () => {} },
            { label: 'Confirm', style: 'success', onPress: doSubmit },
          ]}
          onClose={() => setConfirm(false)}
        />
      )}

      <PickerModal
        visible={picker === 'type'}
        title="Select Type"
        value={type}
        options={typePickerOptions}
        onSelect={setType}
        onClose={() => setPicker(null)}
      />
    </KeyboardAvoidingView>
  );
}

// ---------- small components ----------
function Field({
  label, value, onChange, editable = true,
}: {
  label: string; value: string;
  onChange?: (v: string) => void;
  editable?: boolean;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={[styles.label, { color: DarkTheme.textMuted }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          {
            color: editable ? DarkTheme.text : DarkTheme.textMuted,
            borderColor: DarkTheme.cellBorder,
            backgroundColor: editable ? DarkTheme.surface : DarkTheme.surfaceAlt,
          },
        ]}
        value={value}
        onChangeText={onChange}
        editable={editable}
        placeholderTextColor={DarkTheme.textMuted}
      />
    </View>
  );
}

function SelectField({
  label, value, display, onOpen,
}: {
  label: string; value: string; display: string; onOpen: () => void;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={[styles.label, { color: DarkTheme.textMuted }]}>{label}</Text>
      <TouchableOpacity
        onPress={onOpen}
        style={[
          styles.input,
          {
            borderColor: DarkTheme.cellBorder,
            backgroundColor: DarkTheme.surface,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          },
        ]}
      >
        <Text style={{ color: DarkTheme.text, fontSize: 14 }} numberOfLines={1}>
          {display}
        </Text>
        <Text style={{ color: DarkTheme.textMuted, fontSize: 14 }}>▾</Text>
      </TouchableOpacity>
    </View>
  );
}

function PickerModal({
  visible, title, value, options, onSelect, onClose,
}: {
  visible: boolean; title: string; value: string;
  options: { id: string; name: string }[];
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.pickerBackdrop} onPress={onClose}>
        <Pressable
          style={[styles.pickerCard, { backgroundColor: DarkTheme.surface }]}
          onPress={() => {}}
        >
          <Text style={[styles.modalTitle, { color: DarkTheme.text }]}>{title}</Text>
          <FlatList
            data={options}
            keyExtractor={(o) => o.id}
            style={{ maxHeight: 400 }}
            renderItem={({ item }) => {
              const selected = item.id === value;
              return (
                <TouchableOpacity
                  onPress={() => { onSelect(item.id); onClose(); }}
                  style={[
                    styles.pickerRow,
                    {
                      backgroundColor: selected ? DarkTheme.surfacePressed : 'transparent',
                      borderBottomColor: DarkTheme.cellBorder,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: selected ? DarkTheme.accent : DarkTheme.text,
                      fontWeight: selected ? 'bold' : 'normal',
                      fontSize: 14,
                    }}
                  >
                    {item.name}
                  </Text>
                  {selected && <Text style={{ color: DarkTheme.accent }}>✓</Text>}
                </TouchableOpacity>
              );
            }}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: DarkTheme.surfaceAlt }]}
              onPress={onClose}
            >
              <Text style={{ color: DarkTheme.text, fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
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
  label: { fontSize: 12, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 14,
  },
  submit: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
  },
  modalBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6 },
  pickerBackdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center', alignItems: 'center', padding: 20,
  },
  pickerCard: {
    width: '100%', maxWidth: 420, maxHeight: '80%',
    borderRadius: 10, padding: 16,
  },
  pickerRow: {
    paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
});