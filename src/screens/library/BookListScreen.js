import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useLibrary } from '../../context/LibraryContext';
import { Card, Badge, Fab, EmptyState, Button, common } from '../../components/Basics';
import { SearchBar, FilterChips, StarRating } from '../../components/Inputs';
import { ProgressBar } from '../../components/Charts';
import { Colors, Spacing, Font } from '../../theme';
import { STATUSES, statusInfo, booksProgress } from '../../utils/helpers';

const SORTS = [
  { value: 'recent', label: 'Più recenti' },
  { value: 'title', label: 'Titolo A-Z' },
  { value: 'rating', label: 'Valutazione' },
  { value: 'year', label: 'Anno' },
];

export default function BookListScreen({ navigation }) {
  const { state, authorNames, getCategory } = useLibrary();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [categoryId, setCategoryId] = useState('all');
  const [sort, setSort] = useState('recent');
  const [onlyFav, setOnlyFav] = useState(false);

  const statusOptions = [{ value: 'all', label: 'Tutti' }, ...STATUSES.map((s) => ({ value: s.value, label: s.label }))];
  const categoryOptions = [{ value: 'all', label: 'Ogni categoria' }, ...state.categories.map((c) => ({ value: c.id, label: c.name }))];

  const books = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = [...state.books].reverse().filter((b) => {
      if (status !== 'all' && b.status !== status) return false;
      if (categoryId !== 'all' && b.categoryId !== categoryId) return false;
      if (onlyFav && !b.favorite) return false;
      if (q && !(b.title.toLowerCase().includes(q) || authorNames(b).toLowerCase().includes(q))) return false;
      return true;
    });
    if (sort === 'title') list.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === 'rating') list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sort === 'year') list.sort((a, b) => (b.year || 0) - (a.year || 0));
    return list;
  }, [state.books, state.authors, query, status, categoryId, sort, onlyFav]);

  const renderItem = ({ item }) => {
    const st = statusInfo(item.status);
    const cat = item.categoryId ? getCategory(item.categoryId) : null;
    const progress = booksProgress(item, state.sessions);
    return (
      <Card onPress={() => navigation.navigate('BookDetail', { id: item.id })}>
        <View style={common.rowBetween}>
          <View style={{ flex: 1, marginRight: Spacing.sm }}>
            <Text style={s.title} numberOfLines={2}>{item.title}</Text>
            <Text style={common.muted} numberOfLines={1}>{authorNames(item)}</Text>
          </View>
          {item.favorite ? <Icon name="heart" size={20} color={Colors.danger} /> : null}
        </View>
        <View style={s.badges}>
          <Badge label={st.label} color={st.color} icon={st.icon} />
          <Badge label={item.type} color={Colors.textMuted} />
          {cat ? <Badge label={cat.name} color={Colors.primary} /> : null}
        </View>
        {item.status === 'reading' && progress.total > 0 ? (
          <View style={{ marginTop: Spacing.sm }}>
            <ProgressBar value={progress.read} max={progress.total} />
            <Text style={[common.muted, { marginTop: 4 }]}>{progress.read}/{progress.total} pagine · {progress.percent}%</Text>
          </View>
        ) : null}
        {item.rating > 0 ? <View style={{ marginTop: Spacing.sm }}><StarRating value={item.rating} size={16} /></View> : null}
      </Card>
    );
  };

  return (
    <View style={common.screen}>
      <View style={s.header}>
        <View style={[common.row, { marginBottom: Spacing.sm }]}>
          <Button small variant="ghost" icon="account-edit-outline" title={`Autori (${state.authors.length})`} onPress={() => navigation.navigate('EntityList', { type: 'author' })} style={{ marginRight: 8 }} />
          <Button small variant="ghost" icon="shape-outline" title={`Categorie (${state.categories.length})`} onPress={() => navigation.navigate('EntityList', { type: 'category' })} />
        </View>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Cerca per titolo o autore..." />
        <FilterChips options={statusOptions} value={status} onChange={setStatus} />
        <FilterChips options={categoryOptions} value={categoryId} onChange={setCategoryId} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={[s.favChip, onlyFav && s.favChipOn]} onPress={() => setOnlyFav(!onlyFav)}>
            <Icon name={onlyFav ? 'heart' : 'heart-outline'} size={14} color={onlyFav ? Colors.danger : Colors.textMuted} />
            <Text style={[s.favText, onlyFav && { color: Colors.danger }]}> Preferiti</Text>
          </TouchableOpacity>
          <FilterChips options={SORTS} value={sort} onChange={setSort} />
        </ScrollView>
      </View>

      <FlatList
        data={books}
        keyExtractor={(b) => b.id}
        renderItem={renderItem}
        contentContainerStyle={common.scroll}
        ListEmptyComponent={<EmptyState icon="book-search-outline" title="Nessun contenuto trovato" message="Modifica i filtri oppure aggiungi un nuovo libro con il pulsante +." />}
      />
      <Fab onPress={() => navigation.navigate('BookForm')} />
    </View>
  );
}

const s = StyleSheet.create({
  header: { padding: Spacing.md, paddingBottom: Spacing.sm, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { fontSize: Font.lg, fontWeight: '700', color: Colors.text },
  badges: { flexDirection: 'row', flexWrap: 'wrap', marginTop: Spacing.sm, gap: 6 },
  favChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface, marginRight: 8, alignSelf: 'center' },
  favChipOn: { borderColor: Colors.danger, backgroundColor: Colors.danger + '15' },
  favText: { fontSize: Font.sm, color: Colors.textMuted },
});
