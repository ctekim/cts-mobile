// app/account_create.tsx
import { useEffect, useMemo, useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Modal, FlatList, Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppSelector } from '../src/redux/hooks';
import { selectTSConnected, selectIsMarketController, selectTSUserId } from '../src/redux/globalsSlice';
import { DarkTheme } from '../src/common/theme';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import { sendAccountCreate } from '../src/services/account_messages';
import {
  FOREIGN_ID, FOREIGN_NAME,
  GENERAL_ID, GENERAL_NAME,
  HOUSE_ID, HOUSE_NAME,
  INSTITUTIONAL_ID, INSTITUTIONAL_NAME,
  OMNIBUS_ID, OMNIBUS_NAME,
  OTHER_ID, OTHER_NAME,
  DROPDOWN_LIST_NONE,
} from '../src/common/common';

const EMPTY_ARRAY: any[] = [];
const NONE = DROPDOWN_LIST_NONE ?? 'None';

const TYPE_OPTIONS = [
  { id: FOREIGN_ID,       name: FOREIGN_NAME },
  { id: GENERAL_ID,       name: GENERAL_NAME },
  { id: HOUSE_ID,         name: HOUSE_NAME },
  { id: INSTITUTIONAL_ID, name: INSTITUTIONAL_NAME },
  { id: OMNIBUS_ID,       name: OMNIBUS_NAME },
  { id: OTHER_ID,         name: OTHER_NAME },
];

function typeNameFor(typeId: any): string {
  if (typeId == null || typeId === '') return NONE;
  const found = TYPE_OPTIONS.find((o) => String(o.id) === String(typeId));
  return found ? found.name : String(typeId);
}

export default function AccountCreateScreen() {
  const router = useRouter();
  const connected = useAppSelector(selectTSConnected);
  const isMarketController = useAppSelector(selectIsMarketController);
  const submitter = useAppSelector(selectTSUserId);

  const firms: any[] = useAppSelector(
    (s: any) => s.tables.tables.ParticipantsTable ?? EMPTY_ARRAY
  );
  const users: any[] = useAppSelector(
    (s: any) => s.tables.tables.UsersTable ?? EMPTY_ARRAY
  );

  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [firm, setFirm] = useState<string>(NONE);
  const [user, setUser] = useState<string>(NONE);
  const [type, setType] = useState<string>(String(OTHER_ID));

  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [picker, setPicker] = useState<null | 'firm' | 'user' | 'type'>(null);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/accounts');
  };

  useEffect(() => {
    if (!connected) router.replace('/');
    else if (!isMarketController) router.replace('/(tabs)/more');
  }, [connected, isMarketController, router]);

  const visibleUsers = useMemo(() => {
    if (!firm || firm === NONE) return users;
    return users.filter((u: any) => String(u.firm ?? '') === firm);
  }, [users, firm]);

  useEffect(() => {
    if (!user || user === NONE) return;
    const stillVisible = visibleUsers.some((u: any) => String(u.code) === user);
    if (!stillVisible) setUser(NONE);
  }, [visibleUsers, user]);

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
    const ok = sendAccountCreate({
      code: code.trim(),
      description: description.trim(),
      type: type,
      firm: firm && firm !== NONE ? firm : undefined,
      user: user && user !== NONE ? user : undefined,
      submitter,
    });
    if (!ok) console.warn('[account_create] not connected');
    setConfirm(false);
    goBack();
  };

  const firmOptions = [
    { id: NONE, name: NONE },
    ...firms
      .map((f: any) => ({ id: String(f.code ?? ''), name: String(f.code ?? '') }))
      .filter((o) => o.id),
  ];
  const userOptions = [
    { id: NONE, name: NONE },
    ...visibleUsers
      .map((u: any) => ({ id: String(u.code ?? ''), name: String(u.code ?? '') }))
      .filter((o) => o.id),
  ];
  const typeOptions = TYPE_OPTIONS.map((t) => ({ id: String(t.id), name: t.name }));

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: DarkTheme.background, paddingTop: 40 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn} hitSlop={8}>
          <Text style={[styles.backText, { color: DarkTheme.codeText }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: DarkTheme.text }]}>Create Account</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Field label="Code" value={code} onChange={setCode} />
        <Field label="Description" value={description} onChange={setDescription} />

        <SelectField label="Firm" value={firm} display={firm}
          onOpen={() => setPicker('firm')} />

        <SelectField label="User" value={user} display={user}
          onOpen={() => setPicker('user')} />

        <SelectField label="Type" value={type} display={typeNameFor(type)}
          onOpen={() => setPicker('type')} />

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
          title="Create Account"
          message={`Create account "${code}"?`}
          variant="default"
          accentColor={DarkTheme.positive}
          actions={[
            { label: 'Cancel', style: 'cancel', onPress: () => {} },
            { label: 'Confirm', style: 'success', onPress: doSubmit },
          ]}
          onClose={() => setConfirm(false)}
        />
      )}

      <PickerModal visible={picker === 'firm'} title="Select Firm" value={firm}
        options={firmOptions} onSelect={setFirm} onClose={() => setPicker(null)} />

      <PickerModal visible={picker === 'user'} title="Select User" value={user}
        options={userOptions} onSelect={setUser} onClose={() => setPicker(null)} />

      <PickerModal visible={picker === 'type'} title="Select Type" value={type}
        options={typeOptions} onSelect={setType} onClose={() => setPicker(null)} />
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
          { color: DarkTheme.text, borderColor: DarkTheme.cellBorder, backgroundColor: DarkTheme.surface },
        ]}
        value={value}
        onChangeText={onChange}
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
                  <Text style={{
                    color: selected ? DarkTheme.accent : DarkTheme.text,
                    fontWeight: selected ? 'bold' : 'normal',
                    fontSize: 14,
                  }}>
                    {item.name}
                  </Text>
                  {selected && <Text style={{ color: DarkTheme.accent }}>✓</Text>}
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <Text style={{ color: DarkTheme.textMuted, padding: 12 }}>No options</Text>
            }
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