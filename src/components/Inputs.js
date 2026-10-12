import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Font } from '../theme';
import { today, isValidDate } from '../utils/helpers';

export function SearchBar({ value, onChangeText, placeholder = 'Cerca...' }) {
  return (
    <View style={s.search}>
      <Icon name="magnify" size={20} color={Colors.textMuted} />
      <TextInput
        style={s.searchInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
      />
      {value ? (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <Icon name="close-circle" size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

/** Campo di testo con etichetta ed eventuale messaggio d'errore. */
export function Field({ label, error, multiline, style, ...props }) {
  return (
    <View style={s.group}>
      {label ? <Text style={s.label}>{label}</Text> : null}
      <TextInput
        style={[s.input, multiline && s.textArea, error && { borderColor: Colors.danger }, style]}
        placeholderTextColor={Colors.textMuted}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        {...props}
      />
      {error ? <Text style={s.error}>{error}</Text> : null}
    </View>
  );
}

/** Campo data (YYYY-MM-DD) con scorciatoia "Oggi". */
export function DateField({ label = 'Data', value, onChange, error }) {
  return (
    <View style={s.group}>
      <View style={s.dateHeader}>
        <Text style={s.label}>{label} (AAAA-MM-GG)</Text>
        <TouchableOpacity onPress={() => onChange(today())}>
          <Text style={s.todayLink}>Oggi</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={[s.input, (error || (value && !isValidDate(value))) && { borderColor: Colors.danger }]}
        value={value}
        onChangeText={onChange}
        placeholder="2026-10-12"
        placeholderTextColor={Colors.textMuted}
        autoCapitalize="none"
        maxLength={10}
      />
      {error ? <Text style={s.error}>{error}</Text> : null}
    </View>
  );
}

/** Selettore a chip: selezione singola o multipla. options = [{value,label}] */
export function ChipSelect({ label, options, value, onChange, multiple = false, allowClear = false }) {
  const isActive = (v) => (multiple ? (value || []).includes(v) : value === v);
  const toggle = (v) => {
    if (multiple) {
      const cur = value || [];
      onChange(cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]);
    } else {
      onChange(allowClear && value === v ? null : v);
    }
  };
  return (
    <View style={s.group}>
      {label ? <Text style={s.label}>{label}</Text> : null}
      <View style={s.chipWrap}>
        {options.map((o) => (
          <TouchableOpacity key={String(o.value)} style={[s.chip, isActive(o.value) && s.chipActive]} onPress={() => toggle(o.value)}>
            <Text style={[s.chipText, isActive(o.value) && s.chipTextActive]}>{o.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

/** Riga di filtri orizzontale scorrevole (usata nelle liste). */
export function FilterChips({ options, value, onChange }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 4 }}>
      {options.map((o) => (
        <TouchableOpacity key={String(o.value)} style={[s.chip, value === o.value && s.chipActive]} onPress={() => onChange(o.value)}>
          <Text style={[s.chipText, value === o.value && s.chipTextActive]}>{o.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

/** Valutazione a stelle (1-5). Se onChange è assente è di sola lettura. */
export function StarRating({ value = 0, onChange, size = 22 }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const star = <Icon name={n <= value ? 'star' : 'star-outline'} size={size} color={n <= value ? Colors.star : Colors.border} />;
        return onChange ? (
          <TouchableOpacity key={n} onPress={() => onChange(value === n ? 0 : n)} hitSlop={{ top: 6, bottom: 6, left: 2, right: 2 }}>
            {star}
          </TouchableOpacity>
        ) : (
          <View key={n}>{star}</View>
        );
      })}
    </View>
  );
}

/** Interruttore on/off stilizzato (es. "Preferito"). */
export function ToggleRow({ label, icon, value, onChange }) {
  return (
    <TouchableOpacity style={[s.toggle, value && s.toggleOn]} onPress={() => onChange(!value)}>
      <Icon name={value ? icon : icon + '-outline'} size={20} color={value ? Colors.primary : Colors.textMuted} />
      <Text style={[s.toggleText, value && { color: Colors.primaryDark }]}>{label}</Text>
      <Icon name={value ? 'checkbox-marked' : 'checkbox-blank-outline'} size={22} color={value ? Colors.primary : Colors.textMuted} />
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.round,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 44,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: Font.md, color: Colors.text },
  group: { marginBottom: Spacing.md },
  label: { fontSize: Font.xs, fontWeight: '700', color: Colors.textMuted, textTransform: 'uppercase', marginBottom: 6 },
  input: {
    backgroundColor: Colors.surface,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: Font.md,
  },
  textArea: { minHeight: 90 },
  error: { color: Colors.danger, fontSize: Font.xs, marginTop: 4 },
  dateHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  todayLink: { color: Colors.primary, fontWeight: '700', fontSize: Font.sm, marginBottom: 6 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.round,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: { backgroundColor: Colors.primarySoft, borderColor: Colors.primary },
  chipText: { fontSize: Font.sm, color: Colors.textMuted },
  chipTextActive: { color: Colors.primaryDark, fontWeight: '700' },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  toggleOn: { borderColor: Colors.primary, backgroundColor: Colors.primarySoft },
  toggleText: { flex: 1, marginLeft: 10, fontSize: Font.md, color: Colors.text },
});
