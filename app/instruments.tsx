// app/instruments.tsx
import { useRef, useEffect } from 'react';
import {
  View, Text, FlatList, ScrollView, TouchableOpacity, Pressable,
  StyleSheet, NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppSelector } from '../src/redux/hooks';
import { selectTableData, selectTSConnected } from '../src/redux/globalsSlice';
import { handleLogout } from '../src/services/logout';
import {
  INSTRUMENT_TYPE_CURRENCY,
  INSTRUMENT_TYPE_CRYPTO_CURRENCY,
} from '../src/common/common';
import { formatPrice, formatQty, formatStatus } from '../src/common/format';
import { DarkTheme } from '../src/common/theme';

const CODE_WIDTH = 90;
const ROW_HEIGHT = 36;

const COLUMNS = [
  { key: 'last',    label: 'Last',        width: 95,  format: 'price' as const },
  { key: 'prev',    label: 'Prev',        width: 95,  format: 'price' as const },
  { key: 'open',    label: 'Open',        width: 95,  format: 'price' as const },
  { key: 'high',    label: 'High',        width: 95,  format: 'price' as const },
  { key: 'low',     label: 'Low',         width: 95,  format: 'price' as const },
  { key: 'vwap',    label: 'VWAP',        width: 95,  format: 'price' as const },
  { key: 'close',   label: 'Close',       width: 95,  format: 'price' as const },
  { key: 'vol',     label: 'Volume',      width: 110, format: 'qty'   as const },
  { key: 'val',     label: 'Value',       width: 130, format: 'price' as const },
  { key: 'num_trd', label: 'Trades',      width: 80,  format: 'qty'   as const },
  { key: 'descr',   label: 'Description', width: 120, format: 'text'  as const },
  { key: 'market',  label: 'Market',      width: 95,  format: 'text'  as const },
  { key: 'issue',   label: 'Issue Qty',   width: 95,  format: 'price' as const },
  { key: 'ref',     label: 'Reference',   width: 95,  format: 'price' as const },
  { key: 'status',  label: 'Status',      width: 95,  format: 'status' as const },
];

type ColumnDef = typeof COLUMNS[number];

const TOTAL_DATA_WIDTH = COLUMNS.reduce((sum, c) => sum + c.width, 0);

export default function InstrumentsScreen() {
  const router = useRouter();
  const instrumentMap = useAppSelector(selectTableData);
  const rows = Object.values(instrumentMap).filter((r) => {
    const t = Number(r.i_type);
    return (
      t !== INSTRUMENT_TYPE_CURRENCY &&
      t !== INSTRUMENT_TYPE_CRYPTO_CURRENCY
    );
  });

  const connected = useAppSelector(selectTSConnected);
  const leftListRef = useRef<FlatList<any>>(null);
  const headerScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!connected) router.replace('/');
  }, [connected, router]);

  const onLogout = () => {
    handleLogout();
    router.replace('/');
  };

  const handleDataVerticalScroll = (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const y = e.nativeEvent.contentOffset.y;
    leftListRef.current?.scrollToOffset({ offset: y, animated: false });
  };

  const handleDataHorizontalScroll = (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const x = e.nativeEvent.contentOffset.x;
    headerScrollRef.current?.scrollTo({ x, animated: false });
  };

   // ---- Code column color (based on status) ----
   const codeColor = (item: any): string => {
      const status = String(item.status ?? '').trim().toUpperCase();
      switch (status) {
         case 'S': return DarkTheme.negative;
         case 'I':
         case 'D':
         case 'H':
            return DarkTheme.textMuted;
         case 'A':
         default:
            return DarkTheme.codeText;
      }
   };

   // ---- Cell text formatter ----
   const cellText = (item: any, col: ColumnDef): string => {
      const raw = item[col.key];
      if (raw === null || raw === undefined) return '';

      switch (col.format) {
         case 'price':  return formatPrice(raw, item.price_dec ?? 0);
         case 'qty':    return formatQty(raw, item.qty_dec ?? 0);
         case 'status': return formatStatus(raw);
         case 'text':
         default:       return String(raw);
      }
   };

   // ---- Cell color (for Last and Status columns) ----
   const cellColor = (item: any, col: ColumnDef): string => {
      if (col.key === 'status') {
         const s = String(item.status ?? '').trim().toUpperCase();
         switch (s) {
         case 'A': return DarkTheme.positive;
         case 'S': return DarkTheme.negative;
         default:  return DarkTheme.textMuted;
         }
      }

      if (col.key === 'last') {
         const last = Number(String(item.last ?? '').replace(/,/g, ''));
         const prev = Number(String(item.prev ?? '').replace(/,/g, ''));
         if (isNaN(last) || isNaN(prev)) return DarkTheme.text;
         if (last > prev) return DarkTheme.positive;
         if (last < prev) return DarkTheme.negative;
         return DarkTheme.neutral;
      }

      return DarkTheme.text;
   };

   const renderCodeCell = ({ item, index }: { item: any; index: number }) => (
      <Pressable
         style={({ pressed }) => [
         styles.codeCell,
         {
            backgroundColor: index % 2 === 1
               ? DarkTheme.surfaceAlt
               : DarkTheme.surface,
            borderBottomColor: DarkTheme.cellBorder,
            borderRightColor: DarkTheme.codeColumnBorder,
         },
         pressed && { backgroundColor: DarkTheme.surfacePressed },
         ]}
         onPress={() => console.log('[instruments] tapped:', item.code)}
      >
         <Text style={[styles.codeText, { color: codeColor(item) }]} numberOfLines={1}>
         {item.code ?? ''}
         </Text>
      </Pressable>
   );

   const renderDataRow = ({ item, index }: { item: any; index: number }) => {
      const isSuspended =
         String(item.status ?? '').trim().toUpperCase() === 'S';

      return (
         <Pressable
         style={({ pressed }) => [
            styles.dataRow,
            {
               backgroundColor: index % 2 === 1
               ? DarkTheme.surfaceAlt
               : DarkTheme.surface,
               opacity: isSuspended ? 0.6 : 1,
            },
            pressed && { backgroundColor: DarkTheme.surfacePressed },
         ]}
         onPress={() => console.log('[instruments] tapped:', item.code)}
         >
         {COLUMNS.map((col) => (
            <Text
               key={col.key}
               style={[
               styles.dataCell,
               {
                  width: col.width,
                  borderRightColor: DarkTheme.cellBorder,
                  borderBottomColor: DarkTheme.cellBorder,
                  color: cellColor(item, col),
               },
               (col.format === 'price' || col.format === 'qty') && styles.num,
               ]}
               numberOfLines={1}
            >
               {cellText(item, col)}
            </Text>
         ))}
         </Pressable>
      );
   };

   return (
      <View style={[styles.container, { backgroundColor: DarkTheme.background }]}>
         {/* Toolbar */}
         <View style={styles.toolbar}>
         <Text style={[styles.toolbarTitle, { color: DarkTheme.text }]}>
            Instruments ({rows.length})
         </Text>
         <TouchableOpacity
            style={[styles.logoutBtn, { backgroundColor: DarkTheme.danger }]}
            onPress={onLogout}
         >
            <Text style={styles.logoutText}>Logout</Text>
         </TouchableOpacity>
         </View>

         {/* Header row */}
         <View style={[styles.headerRow, { backgroundColor: DarkTheme.headerBg }]}>
         <View
            style={[
               styles.headerCell,
               styles.codeHeaderCell,
               { borderRightColor: DarkTheme.codeColumnBorder },
            ]}
         >
            <Text style={[styles.headerText, { color: DarkTheme.headerText }]}>
               Code
            </Text>
         </View>

         <ScrollView
            ref={headerScrollRef}
            horizontal
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            style={styles.headerScroll}
            contentContainerStyle={{ width: TOTAL_DATA_WIDTH }}
         >
            {COLUMNS.map((col) => (
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

         {/* Body */}
         <View style={styles.body}>
         <FlatList
            ref={leftListRef}
            style={{ width: CODE_WIDTH, flexGrow: 0 }}
            data={rows}
            keyExtractor={(r) => r.code}
            renderItem={renderCodeCell}
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
               data={rows}
               keyExtractor={(r) => r.code}
               renderItem={renderDataRow}
               getItemLayout={(_, index) => ({
               length: ROW_HEIGHT,
               offset: ROW_HEIGHT * index,
               index,
               })}
               onScroll={handleDataVerticalScroll}
               scrollEventThrottle={16}
               showsVerticalScrollIndicator
            />
         </ScrollView>
         </View>
      </View>
   );
   }

   const styles = StyleSheet.create({
   // Only layout, no colors — all colors come from theme inline
   container: { flex: 1, paddingTop: 40 },

   toolbar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
   },
   toolbarTitle: { fontSize: 18, fontWeight: 'bold' },
   logoutBtn: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 6,
   },
   logoutText: { color: '#fff', fontWeight: 'bold' },

   headerRow: {
      flexDirection: 'row',
      height: ROW_HEIGHT,
   },
   headerScroll: { flex: 1 },
   headerCell: {
      height: ROW_HEIGHT,
      justifyContent: 'center',
      paddingHorizontal: 8,
      borderRightWidth: 1,
   },
   codeHeaderCell: {
      width: CODE_WIDTH,
      borderRightWidth: 2,
   },
   headerText: { fontWeight: 'bold', fontSize: 12 },

   body: { flex: 1, flexDirection: 'row' },

   codeCell: {
      width: CODE_WIDTH,
      height: ROW_HEIGHT,
      justifyContent: 'center',
      paddingHorizontal: 8,
      borderBottomWidth: 1,
      borderRightWidth: 2,
   },
   codeText: { fontSize: 13, fontWeight: '600' },

   dataRow: {
      flexDirection: 'row',
      height: ROW_HEIGHT,
   },
   dataCell: {
      height: ROW_HEIGHT,
      textAlignVertical: 'center',
      paddingHorizontal: 8,
      fontSize: 12,
      borderRightWidth: 1,
      borderBottomWidth: 1,
   },
   num: { fontFamily: 'monospace', textAlign: 'right' },
   });