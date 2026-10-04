// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router/react-navigation';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme, View } from 'react-native';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Stack } from 'expo-router';
import { store } from '../src/redux/store';
import { ResultToast } from '../src/components/ResultToast';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }} />
          <ResultToast />
        </View>
      </ThemeProvider>
    </Provider>
  );
}