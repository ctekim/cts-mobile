// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { DarkTheme } from '../../src/common/theme';

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
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="instruments"
        options={{
          title: 'Instruments',
          tabBarIcon: ({ focused }) => <TabIcon label="📊" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ focused }) => <TabIcon label="📋" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="trades"
        options={{
          title: 'Trades',
          tabBarIcon: ({ focused }) => <TabIcon label="💱" focused={focused} />,
        }}
      />
    </Tabs>
  );
}