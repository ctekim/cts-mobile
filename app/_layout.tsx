import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router/react-navigation';
import * as SplashScreen from 'expo-splash-screen';
import { AppState, useColorScheme, View, Text, ScrollView, StyleSheet } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { Provider } from 'react-redux';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { store } from '../src/redux/store';
import { ResultToast } from '../src/components/ResultToast';
import { handleAppForeground } from '../src/services/ts_connection';
import { useRouter } from 'expo-router';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import { installLogoutDialog } from '../src/services/logout_coordinator';
import { handleLogout } from '../src/services/logout';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [lines, setLines] = useState<string[]>([]);
  const bufRef = useRef<string[]>([]);
  const router = useRouter();
  const [logoutPrompt, setLogoutPrompt] = useState<null | ((ok: boolean) => void)>(null);

  useEffect(() => {
    installLogoutDialog((onResolve) => {
      setLogoutPrompt(() => onResolve);
    });
  }, []);

  // Capture logs by patching console.log ONCE, and push into React state.
  useEffect(() => {
    const origLog = console.log;
    (globalThis as any).__pushLog = (msg: string) => {
      const t = new Date().toISOString().substring(11, 23);
      bufRef.current.push(`${t} ${msg}`);
      if (bufRef.current.length > 50) bufRef.current.shift();
    };
    console.log = (...args: any[]) => {
      try {
        const msg = args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
        (globalThis as any).__pushLog(msg);
      } catch {}
      origLog(...args);
    };
    return () => { console.log = origLog; };
  }, []);

  // Force a re-render every 500ms so the debug pane updates
  useEffect(() => {
    const id = setInterval(() => {
      setLines([...bufRef.current]);
    }, 500); 
    return () => clearInterval(id);
  }, []);

  // AppState diagnostics
  useEffect(() => {
    SplashScreen.hideAsync();
    // console.log('[app-root] registering AppState listener');
    const sub = AppState.addEventListener('change', (next) => {
      console.log('[app-root] AppState changed:', next);

      if (next === 'active') {
        console.log('[app-root] calling handleAppForeground');
        handleAppForeground();
      }
    });
    
    // const iv = setInterval(() => {
    //   if (AppState.currentState === 'active') {
    //     console.log('[app-root] state check; current state:', AppState.currentState);
    //   }
    // }, 5000);

    // return () => { sub.remove(); clearInterval(iv); };

    return () => { sub.remove(); };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <BottomSheetModalProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <View style={{ flex: 1 }}>
              <Stack screenOptions={{ headerShown: false }} />
              <ResultToast />

              <ConfirmDialog
                visible={logoutPrompt !== null}
                title="Log Out"
                message="Are you sure you want to log out?"
                variant="default"
                actions={[
                  {
                    label: 'Cancel',
                    style: 'cancel',
                    onPress: () => {
                      const cb = logoutPrompt;
                      setLogoutPrompt(null);
                      cb?.(false);
                    },
                  },
                  {
                    label: 'Log Out',
                    style: 'destructive',
                    onPress: () => {
                      const cb = logoutPrompt;
                      setLogoutPrompt(null);
                      cb?.(true);
                    },
                  },
                ]}
                onClose={() => {
                  const cb = logoutPrompt;
                  setLogoutPrompt(null);
                  cb?.(false);
                }}
              />
            </View>
          </ThemeProvider>
        </BottomSheetModalProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  debugOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 130,
    backgroundColor: 'rgba(0,0,0,0.85)',
    padding: 4,
  },
  debugTitle: { color: '#ff0', fontSize: 10, fontFamily: 'monospace' },
  debugText: { color: '#0f0', fontSize: 9, fontFamily: 'monospace' },
});