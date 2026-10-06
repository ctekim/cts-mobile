// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { DarkTheme } from '../../src/common/theme';
import { ResultToast } from '../../src/components/ResultToast';

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text
      style={{
        fontSize: 18,
        color: focused ? DarkTheme.codeText : DarkTheme.textMuted,
      }}
    >
      {label}
    </Text>
  );
}

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: DarkTheme.headerBg,
            borderTopColor: DarkTheme.cellBorder,
            borderTopWidth: 1,
          },
          tabBarActiveTintColor: DarkTheme.codeText,
          tabBarInactiveTintColor: DarkTheme.textMuted,
          tabBarLabelStyle: { fontSize: 9, marginBottom: 2 },
          tabBarIconStyle: { marginTop: 2 },
        }}
      >
        <Tabs.Screen
          name="instruments"
          options={{ title: 'Instr', tabBarIcon: ({ focused }) => <TabIcon label="📊" focused={focused} /> }}
        />
        <Tabs.Screen
          name="orders"
          options={{ title: 'Orders', tabBarIcon: ({ focused }) => <TabIcon label="📋" focused={focused} /> }}
        />
        <Tabs.Screen
          name="trades"
          options={{ title: 'Trades', tabBarIcon: ({ focused }) => <TabIcon label="💱" focused={focused} /> }}
        />
        <Tabs.Screen
          name="holdings"
          options={{ title: 'Holdings', tabBarIcon: ({ focused }) => <TabIcon label="💼" focused={focused} /> }}
        />
        <Tabs.Screen
          name="notifications"
          options={{ title: 'Alerts', tabBarIcon: ({ focused }) => <TabIcon label="🔔" focused={focused} /> }}
        />
        <Tabs.Screen
          name="more"
          options={{ title: 'More', tabBarIcon: ({ focused }) => <TabIcon label="☰" focused={focused} /> }}
        />
      </Tabs>
      <ResultToast />
    </View>
  );
}