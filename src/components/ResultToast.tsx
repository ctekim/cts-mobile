import { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { selectCurrentResult, clearResult } from '../redux/notificationSlice';
import { DarkTheme } from '../common/theme';

const AUTO_DISMISS_MS = 3500;

export function ResultToast() {
  const dispatch = useAppDispatch();
  const result = useAppSelector(selectCurrentResult);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-40)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!result) return;

    // Reset animation
    opacity.setValue(0);
    translateY.setValue(-40);

    // Fade in + slide down
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();

    // Auto-dismiss
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -40, duration: 200, useNativeDriver: true }),
      ]).start(() => {
        dispatch(clearResult());
      });
    }, AUTO_DISMISS_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [result?.id]);

  if (!result) return null;

  const bg =
    result.type === 'error'
      ? DarkTheme.danger
      : result.type === 'success'
      ? '#0a7'                // green (adjust to your palette)
      : DarkTheme.accent;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          backgroundColor: bg,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.title}>
        {result.type === 'error' ? '✕  Error' : result.type === 'success' ? '✓  Success' : 'ℹ  Info'}
      </Text>
      <Text style={styles.message} numberOfLines={4}>
        {result.message}
      </Text>
      <Text style={styles.time}>{result.time}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 12,
    right: 12,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    // shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 9999,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 2,
  },
  message: {
    color: '#fff',
    fontSize: 13,
    lineHeight: 17,
  },
  time: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
});