// app/firm_create.tsx
import { useEffect, useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Modal, FlatList, Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppSelector } from '../src/redux/hooks';
import {
  selectTSConnected, selectIsMarketController, selectTSUserId,
} from '../src/redux/globalsSlice';
import { DarkTheme } from '../src/common/theme';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import { sendFirmCreate } from '../src/services/firm_messages';
import {
  FIRM_TYPE_BROKER, FIRM_TYPE_NAME_BROKER,
  FIRM_TYPE_DATAVENDOR, FIRM_TYPE_NAME_DATAVENDOR,
  FIRM_TYPE_CLEARING, FIRM_TYPE_NAME_CLEARING,
  FIRM_TYPE_EXCHANGE, FIRM_TYPE_NAME_EXCHANGE,
  FIRM_TYPE_SURVEILLANCE, FIRM_TYPE_NAME_SURVEILLANCE,
  DROPDOWN_LIST_NONE,
} from '../src/common/common';

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

export default function FirmCreateScreen() {
  const router = useRouter();
  const connected = useAppSelector(selectTSConnected);
  const isMarketController = useAppSelector(selectIsMarketController);
  const submitter = useAppSelector(selectTSUserId);

  const [code, setCode] = useState('');
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

  const validate = (): string | null => {
    if (!code.trim()) return 'Code is required';
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
    const ok = sendFirmCreate({
      code: code.trim(),
      description: description.trim(),
      type: Number(type),
      submitter,
    });
    if (!ok) console.warn('[firm_create] not connected');
    setConfirm(false);
    goBack();
  };

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
        <Text style={[styles.title, { color: DarkTheme.text }]}>Create Firm</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Field label="Code" value={code} onChange={setCode} />
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
          title="Create Firm"
          message={`Create firm "${code}"?`}
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
  label, value, onChange,
}: {
  label: string; value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={[styles.label, { color: DarkTheme.textMuted }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          {
            color: DarkTheme.text,
            borderColor: DarkTheme.cellBorder,
            backgroundColor: DarkTheme.surface,
          },
        ]}
        value={value}
        onChangeText={onChange}
        placeholderTextColor={DarkTheme.textMuted}
        autoCapitalize="characters"
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