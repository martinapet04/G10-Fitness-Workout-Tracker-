import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Font } from '../theme';

/** Contenitore a scheda; se riceve onPress diventa cliccabile. */
export function Card({ children, style, onPress }) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper style={[s.card, style]} onPress={onPress} activeOpacity={0.75}>
      {children}
    </Wrapper>
  );
}

/** Pulsante con varianti: primary, secondary, danger, ghost. */
export function Button({ title, onPress, icon, variant = 'primary', style, small }) {
  const palette = {
    primary: { bg: Colors.primary, fg: '#fff', border: Colors.primary },
    secondary: { bg: Colors.surface, fg: Colors.primary, border: Colors.primary },
    danger: { bg: Colors.surface, fg: Colors.danger, border: Colors.danger },
    ghost: { bg: Colors.primarySoft, fg: Colors.primaryDark, border: Colors.primarySoft },
  }[variant];
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[s.btn, small && s.btnSmall, { backgroundColor: palette.bg, borderColor: palette.border }, style]}
    >
      {icon ? <Icon name={icon} size={small ? 16 : 20} color={palette.fg} style={{ marginRight: 6 }} /> : null}
      <Text style={[s.btnText, small && { fontSize: Font.sm }, { color: palette.fg }]}>{title}</Text>
    </TouchableOpacity>
  );
}

/** Pulsante circolare flottante per le azioni di creazione. */
export function Fab({ icon = 'plus', onPress }) {
  return (
    <TouchableOpacity style={s.fab} onPress={onPress} activeOpacity={0.85}>
      <Icon name={icon} size={28} color="#fff" />
    </TouchableOpacity>
  );
}

export function EmptyState({ icon = 'book-open-blank-variant', title, message }) {
  return (
    <View style={s.empty}>
      <Icon name={icon} size={52} color={Colors.border} />
      <Text style={s.emptyTitle}>{title}</Text>
      {message ? <Text style={s.emptyMsg}>{message}</Text> : null}
    </View>
  );
}

export function Badge({ label, color = Colors.primary, icon }) {
  return (
    <View style={[s.badge, { backgroundColor: color + '22' }]}>
      {icon ? <Icon name={icon} size={12} color={color} style={{ marginRight: 4 }} /> : null}
      <Text style={[s.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

export function SectionTitle({ title, action, onAction }) {
  return (
    <View style={s.sectionRow}>
      <Text style={s.sectionTitle}>{title}</Text>
      {action ? (
        <TouchableOpacity onPress={onAction}>
          <Text style={s.sectionAction}>{action}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

/** Riga etichetta + icona usata nelle schermate di dettaglio. */
export function InfoRow({ icon, label, value }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <View style={s.infoRow}>
      <Icon name={icon} size={20} color={Colors.primary} />
      <View style={{ marginLeft: Spacing.md, flex: 1 }}>
        <Text style={s.infoLabel}>{label}</Text>
        <Text style={s.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

export const common = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.md, paddingBottom: 110 },
  title: { fontSize: Font.xxl, fontWeight: '700', color: Colors.text },
  subtitle: { fontSize: Font.md, color: Colors.textMuted, marginTop: 2 },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  muted: { color: Colors.textMuted, fontSize: Font.sm },
  h2: { fontSize: Font.lg, fontWeight: '700', color: Colors.text },
});

const s = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  btnSmall: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: Radius.round },
  btnText: { fontSize: Font.md, fontWeight: '700' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  empty: { alignItems: 'center', padding: Spacing.xl, marginTop: Spacing.lg },
  emptyTitle: { fontSize: Font.lg, fontWeight: '700', color: Colors.text, marginTop: Spacing.md },
  emptyMsg: { fontSize: Font.sm, color: Colors.textMuted, textAlign: 'center', marginTop: 4 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 9, paddingVertical: 3, borderRadius: Radius.round, alignSelf: 'flex-start' },
  badgeText: { fontSize: Font.xs, fontWeight: '700' },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm, marginTop: Spacing.sm },
  sectionTitle: { fontSize: Font.lg, fontWeight: '700', color: Colors.text },
  sectionAction: { color: Colors.primary, fontWeight: '700', fontSize: Font.sm },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  infoLabel: { fontSize: Font.xs, color: Colors.textMuted, textTransform: 'uppercase' },
  infoValue: { fontSize: Font.md, color: Colors.text, marginTop: 1 },
});
