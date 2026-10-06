// src/components/ConfirmDialog.tsx
import {
  Modal, View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import { DarkTheme } from '../common/theme';

interface Action {
  label: string;
  onPress: () => void;
  style?: 'default' | 'cancel' | 'destructive' | 'success';
}

interface Props {
  visible: boolean;
  title: string;
  message: string;
  actions: Action[];
  onClose: () => void;
  variant?: 'default' | 'error' | 'success';
  accentColor?: string; 
}

export function ConfirmDialog({
  visible,
  title,
  message,
  actions,
  onClose,
  variant = 'default',
  accentColor,
}: Props) {
const titleColor =
  accentColor
    ? accentColor
    : variant === 'error'
    ? DarkTheme.negative
    : variant === 'success'
    ? DarkTheme.positive
    : DarkTheme.text;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View
            style={[
              styles.actions,
              actions.length === 1 && { justifyContent: 'center' },
              actions.length >= 3 && styles.actionsColumn,
            ]}
          >
            {actions.map((action, idx) => {
              const isCancel = action.style === 'cancel';
              const isDestructive = action.style === 'destructive';
              const bgColor = isDestructive
                ? DarkTheme.danger
                : isCancel
                ? 'transparent'
                : action.style === 'success'
                ? DarkTheme.positive
                : DarkTheme.accent;
              const borderColor = isCancel ? DarkTheme.cellBorder : bgColor;
              const textColor = isCancel ? DarkTheme.text : '#fff';

              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.button,
                    {
                      backgroundColor: bgColor,
                      borderColor,
                      borderWidth: isCancel ? 1 : 0,
                    },
                    actions.length === 1 && { minWidth: 140 },
                  ]}
                  onPress={() => {
                    action.onPress();
                    onClose();
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.buttonText, { color: textColor }]}>
                    {action.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: DarkTheme.surface,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: DarkTheme.cellBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: DarkTheme.textMuted,
    lineHeight: 20,
    marginBottom: 20,
  },
  actionsColumn: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  button: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 90,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
});