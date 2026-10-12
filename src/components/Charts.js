import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Font } from '../theme';

/** Barra di avanzamento orizzontale. */
export function ProgressBar({ value, max = 100, color = Colors.accent, height = 8 }) {
  const pct = max ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  return (
    <View style={[s.track, { height, borderRadius: height / 2 }]}>
      <View style={{ width: `${pct}%`, height: '100%', backgroundColor: color, borderRadius: height / 2 }} />
    </View>
  );
}

/** Riquadro numerico per i riepiloghi. */
export function StatTile({ icon, label, value, color = Colors.primary }) {
  return (
    <View style={s.tile}>
      <View style={[s.tileIcon, { backgroundColor: color + '22' }]}>
        <Icon name={icon} size={20} color={color} />
      </View>
      <Text style={s.tileValue}>{value}</Text>
      <Text style={s.tileLabel}>{label}</Text>
    </View>
  );
}

/** Grafico a barre verticali costruito con View (nessuna libreria esterna). data = [{label, value}] */
export function BarChart({ data, color = Colors.primary, height = 120, unit = '' }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <View style={[s.chart, { height: height + 40 }]}>
      {data.map((d, i) => (
        <View key={`${d.label}-${i}`} style={s.barCol}>
          <Text style={s.barValue}>{d.value > 0 ? d.value : ''}</Text>
          <View style={[s.barTrack, { height }]}>
            <View style={{ height: `${(d.value / max) * 100}%`, backgroundColor: color, borderRadius: 6, minHeight: d.value > 0 ? 4 : 0 }} />
          </View>
          <Text style={s.barLabel}>{d.label}</Text>
        </View>
      ))}
    </View>
  );
}

/** Elenco di barre orizzontali per distribuzioni (generi, autori, stati). data = [{label, value, color?}] */
export function HBars({ data, color = Colors.accent, emptyText = 'Nessun dato disponibile.' }) {
  if (!data.length) return <Text style={s.empty}>{emptyText}</Text>;
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <View>
      {data.map((d) => (
        <View key={d.label} style={{ marginBottom: 10 }}>
          <View style={s.hRow}>
            <Text style={s.hLabel} numberOfLines={1}>{d.label}</Text>
            <Text style={s.hValue}>{d.value}</Text>
          </View>
          <ProgressBar value={d.value} max={max} color={d.color || color} height={8} />
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  track: { backgroundColor: Colors.surfaceAlt, overflow: 'hidden', width: '100%' },
  tile: {
    width: '31.5%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  tileIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  tileValue: { fontSize: Font.xl, fontWeight: '700', color: Colors.text },
  tileLabel: { fontSize: Font.xs, color: Colors.textMuted, textAlign: 'center', marginTop: 2 },
  chart: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' },
  barCol: { alignItems: 'center', flex: 1 },
  barTrack: { width: 22, justifyContent: 'flex-end', backgroundColor: Colors.surfaceAlt, borderRadius: 6, overflow: 'hidden' },
  barValue: { fontSize: Font.xs, color: Colors.textMuted, marginBottom: 3, height: 14 },
  barLabel: { fontSize: Font.xs, color: Colors.textMuted, marginTop: 5 },
  hRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  hLabel: { fontSize: Font.sm, color: Colors.text, flex: 1, marginRight: 8 },
  hValue: { fontSize: Font.sm, color: Colors.textMuted, fontWeight: '700' },
  empty: { color: Colors.textMuted, fontSize: Font.sm },
});
