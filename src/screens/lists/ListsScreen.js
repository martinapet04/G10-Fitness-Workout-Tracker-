import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useLibrary } from '../../context/LibraryContext';
import { Card, Fab, EmptyState, Badge, common } from '../../components/Basics';
import { SearchBar } from '../../components/Inputs';
import { Colors, Spacing, Font } from '../../theme';
import { LIST_STATUSES } from '../../utils/helpers';

export default function ListsScreen({ navigation }) {
  const { state, authorNames } = useLibrary();
  const [query, setQuery] = useState('');

  const lists = state.lists.filter((l) =>
    !query || l.name.toLowerCase().includes(query.toLowerCase()) || (l.description || '').toLowerCase().includes(query.toLowerCase())
  );

  const renderItem = ({ item }) => {
    const books = item.bookIds.map((id) => state.books.find((b) => b.id === id)).filter(Boolean);
    const st = LIST_STATUSES.find((s) => s.value === item.status) || LIST_STATUSES[0];
    return (
      <Card onPress={() => navigation.navigate('ListDetail', { id: item.id })}>
        <View style={common.rowBetween}>
          <Text style={s.listName} numberOfLines={1}>{item.name}</Text>
          <Badge label={st.label} color={st.color} />
        </View>
        {item.description ? <Text style={[common.muted, { marginTop: 4 }]} numberOfLines={2}>{item.description}</Text> : null}
        <View style={s.bookPreviews}>
          <Icon name="book-multiple-outline" size={16} color={Colors.primary} />
          <Text style={[common.muted, { marginLeft: 6 }]}>
            {books.length} {books.length === 1 ? 'contenuto' : 'contenuti'}
          </Text>
        </View>
        {books.slice(0, 3).map((b) => (
          <Text key={b.id} style={s.bookHint} numberOfLines={1}>· {b.title}</Text>
        ))}
        {books.length > 3 ? <Text style={common.muted}>+{books.length - 3} altri...</Text> : null}
      </Card>
    );
  };

  return (
    <View style={common.screen}>
      <View style={s.header}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Cerca liste..." />
      </View>
      <FlatList
        data={lists}
        keyExtractor={(l) => l.id}
        renderItem={renderItem}
        contentContainerStyle={common.scroll}
        ListEmptyComponent={<EmptyState icon="format-list-bulleted" title="Nessuna lista" message="Crea la tua prima lista con il pulsante +." />}
      />
      <Fab onPress={() => navigation.navigate('ListForm')} />
    </View>
  );
}

const s = StyleSheet.create({
  header: { padding: Spacing.md, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  listName: { fontSize: Font.lg, fontWeight: '700', color: Colors.text, flex: 1, marginRight: 8 },
  bookPreviews: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.sm },
  bookHint: { fontSize: Font.sm, color: Colors.textMuted, marginTop: 2, marginLeft: 22 },
});
