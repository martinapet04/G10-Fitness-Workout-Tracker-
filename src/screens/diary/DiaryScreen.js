import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useLibrary } from '../../context/LibraryContext';
import { Card, Fab, EmptyState, Badge, common } from '../../components/Basics';
import { SearchBar, FilterChips } from '../../components/Inputs';
import { Colors, Spacing, Font } from '../../theme';
import { NOTE_TYPES, noteTypeInfo, formatDate } from '../../utils/helpers';

export default function DiaryScreen({ navigation }) {
  const { state, getBook } = useLibrary();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const typeOptions = [{ value: 'all', label: 'Tutto' }, ...NOTE_TYPES.map((t) => ({ value: t.value, label: t.label }))];

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...state.notes]
      .filter((n) => {
        if (typeFilter !== 'all' && n.type !== typeFilter) return false;
        if (q && !n.text.toLowerCase().includes(q) && !(getBook(n.bookId)?.title || '').toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [state.notes, query, typeFilter]);

  const sessions = useMemo(() =>
    [...state.sessions].sort((a, b) => b.date.localeCompare(a.date)),
    [state.sessions]
  );

  return (
    <View style={common.screen}>
      <View style={s.header}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Cerca nel diario..." />
        <FilterChips options={typeOptions} value={typeFilter} onChange={setTypeFilter} />
      </View>
      <FlatList
        data={typeFilter === 'all' && !query ? [...items, ...sessions.map((x) => ({ ...x, _kind: 'session' }))] : items}
        keyExtractor={(x) => x.id}
        contentContainerStyle={common.scroll}
        renderItem={({ item }) => {
          if (item._kind === 'session') {
            const book = getBook(item.bookId);
            return (
              <Card onPress={() => navigation.navigate('SessionForm', { id: item.id })} style={{ borderLeftWidth: 4, borderLeftColor: Colors.accent }}>
                <Text style={s.sessionBook} numberOfLines={1}>{book?.title || 'Libro eliminato'}</Text>
                <View style={common.rowBetween}>
                  <Text style={common.muted}>{formatDate(item.date)}</Text>
                  <Text style={common.muted}>{item.pagesRead} pag · {item.minutes} min</Text>
                </View>
                {item.notes ? <Text style={[common.muted, { marginTop: 4 }]} numberOfLines={1}>{item.notes}</Text> : null}
              </Card>
            );
          }
          const t = noteTypeInfo(item.type);
          const book = getBook(item.bookId);
          return (
            <Card onPress={() => navigation.navigate('NoteForm', { id: item.id })} style={{ borderLeftWidth: 4, borderLeftColor: t.color }}>
              <View style={common.rowBetween}>
                <Badge label={t.label} color={t.color} icon={t.icon} />
                <Text style={common.muted}>{formatDate(item.date)}{item.page ? ` · p. ${item.page}` : ''}</Text>
              </View>
              <Text style={s.bookRef} numberOfLines={1}>{book?.title || 'Libro eliminato'}</Text>
              <Text style={[s.noteText, item.type === 'quote' && { fontStyle: 'italic' }]} numberOfLines={3}>
                {item.type === 'quote' ? `"${item.text}"` : item.text}
              </Text>
            </Card>
          );
        }}
        ListEmptyComponent={<EmptyState icon="notebook-outline" title="Diario vuoto" message="Aggiungi la prima nota o sessione di lettura." />}
      />
      <Fab onPress={() => navigation.navigate('NoteForm')} />
    </View>
  );
}

const s = StyleSheet.create({
  header: { padding: Spacing.md, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  sessionBook: { fontSize: Font.md, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  bookRef: { fontSize: Font.sm, color: Colors.primary, fontWeight: '600', marginTop: 6 },
  noteText: { fontSize: Font.md, color: Colors.text, marginTop: 4, lineHeight: 20 },
});
