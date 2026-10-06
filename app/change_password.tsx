// app/change_password.tsx
import { useEffect, useRef, useState } from 'react';
import {
  StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppSelector } from '../src/redux/hooks';
import {
  selectUserId,
  selectForcePasswordChange,
} from '../src/redux/globalsSlice';
import { store } from '../src/redux/store';
import { setForcePasswordChange } from '../src/redux/globalsSlice';
import { sendChangePassword } from '../src/services/user_messages';
import { DarkTheme } from '../src/common/theme';
import { ConfirmDialog } from '../src/components/ConfirmDialog';

export default function ChangePasswordScreen() {
   const router = useRouter();
   const params = useLocalSearchParams<{ forced?: string }>();
   const forced = params.forced === '1';

   const userId = useAppSelector(selectUserId);
   const forcePasswordChange = useAppSelector(selectForcePasswordChange);

   const [currentPassword, setCurrentPassword] = useState('');
   const [newPassword, setNewPassword] = useState('');
   const [confirmationPassword, setConfirmationPassword] = useState('');
   const [status, setStatus] = useState('');
   const wasForcedRef = useRef(forcePasswordChange);
   const [validationError, setValidationError] = useState<string | null>(null);
   const [confirmOpen, setConfirmOpen] = useState(false);
   const [forcedNoticeOpen, setForcedNoticeOpen] = useState(false);
   
   useEffect(() => {
   // If we were forced (flag was true at mount) and it's now false,
   // the server accepted the change — navigate away.
   if (wasForcedRef.current && !forcePasswordChange) {
      router.replace('/(tabs)/instruments');
   }
   }, [forcePasswordChange, router]);

   const validate = (): string | null => {
      if (!currentPassword) return 'Current password is missing';
      if (!newPassword) return 'New password is missing';
      if (!confirmationPassword) return 'Confirmation password is missing';
      if (newPassword !== confirmationPassword) return 'New passwords do not match';
      if (currentPassword === newPassword) return 'New password must be different to current password';
      return null;
   };

   const onSubmit = () => {
      const error = validate();
      if (error) {
         setValidationError(error);
         return;
      }
      setConfirmOpen(true);
   };

   const doSubmit = () => {
      const ok = sendChangePassword(
         userId,
         currentPassword,
         newPassword,
         confirmationPassword
      );
      setConfirmOpen(false);
      if (!ok) {
         setValidationError('The socket is not open. Try again.');
         return;
      }
      setStatus('Change sent — waiting for server…');
   };

   const onCancel = () => {
      if (forced) {
         // Forced change — user must change before continuing.
         // They can log out instead.
         setForcedNoticeOpen(true);
         return;
      }
      router.back();
   };

   return (
      <View style={[styles.container, { backgroundColor: DarkTheme.background }]}>
         <View style={styles.toolbar}>
         <TouchableOpacity onPress={onCancel} style={styles.backBtn}>
            <Text style={[styles.backText, { color: DarkTheme.codeText }]}>
               {forced ? '✕' : '‹ Back'}
            </Text>
         </TouchableOpacity>
         <Text style={[styles.toolbarTitle, { color: DarkTheme.text }]}>
            Change Password
         </Text>
         <View style={{ width: 60 }} />
         </View>

         <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
         <Text style={[styles.intro, { color: DarkTheme.textMuted }]}>
            {forced
               ? 'Your password must be changed before you continue.'
               : `Changing password for user: ${userId}`}
         </Text>

         <View style={styles.inputBlock}>
            <Text style={[styles.label, { color: DarkTheme.textMuted }]}>Current Password</Text>
            <TextInput
               value={currentPassword}
               onChangeText={setCurrentPassword}
               secureTextEntry
               autoCapitalize="none"
               placeholderTextColor={DarkTheme.textMuted}
               style={[
               styles.input,
               { color: DarkTheme.text, borderColor: DarkTheme.cellBorder, backgroundColor: DarkTheme.surface },
               ]}
            />
         </View>

         <View style={styles.inputBlock}>
            <Text style={[styles.label, { color: DarkTheme.textMuted }]}>New Password</Text>
            <TextInput
               value={newPassword}
               onChangeText={setNewPassword}
               secureTextEntry
               autoCapitalize="none"
               placeholderTextColor={DarkTheme.textMuted}
               style={[
               styles.input,
               { color: DarkTheme.text, borderColor: DarkTheme.cellBorder, backgroundColor: DarkTheme.surface },
               ]}
            />
         </View>

         <View style={styles.inputBlock}>
            <Text style={[styles.label, { color: DarkTheme.textMuted }]}>Repeat New Password</Text>
            <TextInput
               value={confirmationPassword}
               onChangeText={setConfirmationPassword}
               secureTextEntry
               autoCapitalize="none"
               placeholderTextColor={DarkTheme.textMuted}
               style={[
               styles.input,
               { color: DarkTheme.text, borderColor: DarkTheme.cellBorder, backgroundColor: DarkTheme.surface },
               ]}
            />
         </View>

         <View style={styles.actions}>
            <TouchableOpacity
               style={[styles.button, { backgroundColor: DarkTheme.surface, borderColor: DarkTheme.cellBorder, borderWidth: 1 }]}
               onPress={onCancel}
            >
               <Text style={[styles.buttonText, { color: DarkTheme.text }]}>
               {forced ? 'Log Out' : 'Back'}
               </Text>
            </TouchableOpacity>
            <TouchableOpacity
               style={[styles.button, { backgroundColor: DarkTheme.accent }]}
               onPress={onSubmit}
            >
               <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
         </View>

            {!!status && (
               <Text style={[styles.status, { color: DarkTheme.textMuted }]}>
                  {status}
               </Text>
            )}
         </ScrollView>

         <ConfirmDialog
         visible={validationError !== null}
         title="Change Password"
         message={validationError ?? ''}
         variant="error"
         actions={[
            { label: 'OK', style: 'default', onPress: () => {} },
         ]}
         onClose={() => setValidationError(null)}
         />

         <ConfirmDialog
         visible={confirmOpen}
         title="Change Password"
         message={`Change password for user: ${userId}?`}
         variant="default"
         actions={[
            { label: 'Cancel', style: 'cancel', onPress: () => {} },
            { label: 'Submit', style: 'default', onPress: doSubmit },
         ]}
         onClose={() => setConfirmOpen(false)}
         />

         <ConfirmDialog
         visible={forcedNoticeOpen}
         title="Password Change Required"
         message="You must change your password before continuing."
         variant="error"
         actions={[
            { label: 'Stay', style: 'cancel', onPress: () => {} },
            {
               label: 'Log Out',
               style: 'destructive',
               onPress: () => {
               store.dispatch(setForcePasswordChange(false));
               router.replace('/');
               },
            },
         ]}
         onClose={() => setForcedNoticeOpen(false)}
         />
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
  toolbarTitle: { fontSize: 18, fontWeight: 'bold' },
  backBtn: { paddingVertical: 6, paddingHorizontal: 4, width: 60 },
  backText: { fontSize: 16, fontWeight: 'bold' },

  scroll: { padding: 16, paddingBottom: 40 },
  intro: { fontSize: 14, marginBottom: 20, lineHeight: 20 },

  inputBlock: { marginTop: 12 },
  label: { fontSize: 13, marginBottom: 6 },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },

  actions: { flexDirection: 'row', gap: 12, marginTop: 32 },
  button: { flex: 1, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

  status: { marginTop: 16, textAlign: 'center', fontSize: 13 },
});