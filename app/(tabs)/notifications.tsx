// app/(tabs)/notifications.tsx
import { useRef, useEffect } from 'react';
import {
  View, Text, FlatList, ScrollView, TouchableOpacity, Pressable,
  StyleSheet, NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppSelector } from '../../src/redux/hooks';
import { selectTSConnected } from '../../src/redux/globalsSlice';
import { handleLogout } from '../../src/services/logout';
import { DarkTheme } from '../../src/common/theme';
import {
  convertSeverity,
  severityKey,
} from '../../src/common/notification_constants';

const ID_WIDTH = 60;
const ROW_HEIGHT = 44;   // taller rows — messages wrap to 2 lines
const MESSAGE_WIDTH = 400;

const EMPTY_ARRAY: any[] = [];

// Severity → color mapping
function severityColor(severity: any): string {
  switch (severityKey(severity)) {
    case 'info':     return DarkTheme.text;         // white
    case 'warning':  return '#e0a020';            // amber
    case 'error':    return DarkTheme.negative;     // red
    case 'critical': return DarkTheme.negative;     // red
    case 'admin':    return DarkTheme.codeText;     // cyan
    default:         return DarkTheme.textMuted;    // gray
  }
}

export default function NotificationsScreen() {
  const router = useRouter();
  const connected = useAppSelector(selectTSConnected);
  const notifications = useAppSelector(
    (s: any) => s.tables.tables.NotificationsTable ?? EMPTY_ARRAY
  );

  const leftListRef = useRef<FlatList<any>>(null);
  const headerScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!connected) router.replace('/');
  }, [connected, router]);

  const onLogout = () => {
    handleLogout();
    router.replace('/');
  };

  const handleDataVerticalScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    leftListRef.current?.scrollToOffset({
      offset: e.nativeEvent.contentOffset.y,
      animated: false,
    });
  };

  const handleDataHorizontalScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    headerScrollRef.current?.scrollTo({
      x: e.nativeEvent.contentOffset.x,
      animated: false,
    });
  };

  // ----- Renderers -----
  const renderIdCell = ({ item, index }: { item: any; index: number }) => (
    <Pressable
      style={({ pressed }) => [
        styles.idCell,
        {
          backgroundColor: index % 2 === 1 ? DarkTheme.surfaceAlt : DarkTheme.surface,
          borderBottomColor: DarkTheme.cellBorder,
          borderRightColor: DarkTheme.codeColumnBorder,
        },
        pressed && { backgroundColor: DarkTheme.surfacePressed },
      ]}
      onPress={() => console.log('[notifications] tapped:', item.id)}
    >
      <Text style={[styles.idText, { color: DarkTheme.codeText }]} numberOfLines={1}>
        {item.id ?? ''}
      </Text>
    </Pressable>
  );

  const renderDataRow = ({ item, index }: { item: any; index: number }) => {
    const sevColor = severityColor(item.ser);

    return (
      <Pressable
        style={({ pressed }) => [
          styles.dataRow,
          {
            backgroundColor: index % 2 === 1 ? DarkTheme.surfaceAlt : DarkTheme.surface,
          },
          pressed && { backgroundColor: DarkTheme.surfacePressed },
        ]}
        onPress={() => console.log('[notifications] tapped:', item.id)}
      >
        {/* Time */}
        <Text
          style={[
            styles.dataCell,
            { width: 180, borderRightColor: DarkTheme.cellBorder, borderBottomColor: DarkTheme.cellBorder, color: DarkTheme.textMuted },
          ]}
          numberOfLines={1}
        >
          {item.time ?? ''}
        </Text>

        {/* Severity */}
        <Text
          style={[
            styles.dataCell,
            {
              width: 100,
              borderRightColor: DarkTheme.cellBorder,
              borderBottomColor: DarkTheme.cellBorder,
              color: sevColor,
              fontWeight: 'bold',
            },
          ]}
          numberOfLines={1}
        >
          {convertSeverity(item.ser)}
        </Text>

        {/* User */}
        <Text
          style={[
            styles.dataCell,
            { width: 100, borderRightColor: DarkTheme.cellBorder, borderBottomColor: DarkTheme.cellBorder, color: DarkTheme.text },
          ]}
          numberOfLines={1}
        >
          {item.user ?? ''}
        </Text>

        {/* Message — colored by severity */}
        <Text
          style={[
            styles.dataCell,
            {
              width: MESSAGE_WIDTH,
              borderRightColor: DarkTheme.cellBorder,
              borderBottomColor: DarkTheme.cellBorder,
              color: sevColor,
            },
          ]}
          numberOfLines={2}
        >
          {item.tx ?? ''}
        </Text>
      </Pressable>
    );
  };

  const TOTAL_DATA_WIDTH = 180 + 100 + 100 + MESSAGE_WIDTH;

  return (
    <View style={[styles.container, { backgroundColor: DarkTheme.background }]}>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: DarkTheme.codeText }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.toolbarTitle, { color: DarkTheme.text }]}>
          Notifications ({notifications.length})
        </Text>
        <View style={{ width: 60 }} />  
      </View>

      <View style={[styles.headerRow, { backgroundColor: DarkTheme.headerBg }]}>
        <View
          style={[
            styles.headerCell,
            styles.idHeaderCell,
            { borderRightColor: DarkTheme.codeColumnBorder },
          ]}
        >
          <Text style={[styles.headerText, { color: DarkTheme.headerText }]}>ID</Text>
        </View>

        <ScrollView
          ref={headerScrollRef}
          horizontal
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          style={styles.headerScroll}
          contentContainerStyle={{ width: TOTAL_DATA_WIDTH }}
        >
          {[
            { key: 'time', label: 'Time', width: 180 },
            { key: 'ser', label: 'Severity', width: 100 },
            { key: 'user', label: 'User', width: 100 },
            { key: 'tx', label: 'Message', width: MESSAGE_WIDTH },
          ].map((col) => (
            <View
              key={col.key}
              style={[
                styles.headerCell,
                { width: col.width, borderRightColor: DarkTheme.headerBorder },
              ]}
            >
              <Text style={[styles.headerText, { color: DarkTheme.headerText }]}>
                {col.label}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.body}>
        <FlatList
          ref={leftListRef}
          style={{ width: ID_WIDTH, flexGrow: 0 }}
          data={notifications}
          keyExtractor={(r: any) => String(r.id)}
          renderItem={renderIdCell}
          getItemLayout={(_, index) => ({
            length: ROW_HEIGHT,
            offset: ROW_HEIGHT * index,
            index,
          })}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator
          contentContainerStyle={{ width: TOTAL_DATA_WIDTH }}
          style={{ flex: 1 }}
          onScroll={handleDataHorizontalScroll}
          scrollEventThrottle={16}
        >
          <FlatList
            style={{ width: TOTAL_DATA_WIDTH }}
            data={notifications}
            keyExtractor={(r: any) => String(r.id)}
            renderItem={renderDataRow}
            getItemLayout={(_, index) => ({
              length: ROW_HEIGHT,
              offset: ROW_HEIGHT * index,
              index,
            })}
            onScroll={handleDataVerticalScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator
            ListEmptyComponent={
              <Text style={[styles.empty, { color: DarkTheme.textMuted }]}>
                No notifications
              </Text>
            }
          />
        </ScrollView>
      </View>
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
  logoutBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 6 },
  logoutText: { color: '#fff', fontWeight: 'bold' },

  headerRow: { flexDirection: 'row', height: ROW_HEIGHT },
  headerScroll: { flex: 1 },
  headerCell: {
    height: ROW_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderRightWidth: 1,
  },
  idHeaderCell: { width: ID_WIDTH, borderRightWidth: 2 },
  headerText: { fontWeight: 'bold', fontSize: 12 },

  body: { flex: 1, flexDirection: 'row' },

  idCell: {
    width: ID_WIDTH,
    height: ROW_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderRightWidth: 2,
  },
  idText: { fontSize: 13, fontWeight: '600' },

  dataRow: { flexDirection: 'row', height: ROW_HEIGHT },
  dataCell: {
    height: ROW_HEIGHT,
    textAlignVertical: 'center',
    paddingHorizontal: 8,
    fontSize: 12,
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },

  empty: { textAlign: 'center', marginTop: 40 },
});
