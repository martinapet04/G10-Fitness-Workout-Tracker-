import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useLibrary } from '../../context/LibraryContext';
import { Card, Fab, EmptyState, common } from '../../components/Basics';
import { SearchBar } from '../../components/Inputs';
import { Colors, Spacing, Font } from '../../theme';
import { ENTITY } from '../../utils/helpers';

// Schermata unica per Autori e Categorie: il tipo arriva come parametro di navigazione.
export default function EntityListScreen({ route, navigation }) {
  const { type } = route.params;
  const cfg = ENTITY[type];
  const { state } = useLibrary();
  const [query, setQuery] = useState('');

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state[cfg.col]
      .filter((e) => !q || e.name.toLowerCase().includes(q) || (e.description || '').toLowerCase().includes(q))
      .map((e) => ({ ...e, count: state.books.filter((b) => cfg.match(b, e.id)).length }))
      .sort((a, b) => Number(b.favorite) - Number(a.favorite) || a.name.localeCompare(b.name));
  }, [state, query, type]);

  return (
    <View style={common.screen}>
      <View style={s.header}>
        <SearchBar value={query} onChangeText={setQuery} placeholder={`Cerca ${cfg.plural.toLowerCase()}...`} />
      </View>
      <FlatList
        data={items}
        keyExtractor={(e) => e.id}
        contentContainerStyle={common.scroll}
        renderItem={({ item }) => (
          <Card onPress={() => navigation.navigate('EntityDetail', { type, id: item.id })}>
            <View style={common.rowBetween}>
              <View style={{ flex: 1, marginRight: Spacing.sm }}>
                <Text style={s.name}>{item.name}</Text>
                {item.description ? <Text style={common.muted} numberOfLines={2}>{item.description}</Text> : null}
                <Text style={[common.muted, { marginTop: 4, color: Colors.primary }]}>
                  {item.count} {item.count === 1 ? 'contenuto' : 'contenuti'}
                </Text>
              </View>
              {item.favorite ? <Icon name="star" size={22} color={Colors.star} /> : null}
              <Icon name="chevron-right" size={22} color={Colors.textMuted} />
            </View>
          </Card>
        )}
        ListEmptyComponent={<EmptyState icon={cfg.icon} title={`Nessun elemento`} message={`Aggiungi ${cfg.plural.toLowerCase()} con il pulsante +.`} />}
      />
      <Fab onPress={() => navigation.navigate('EntityForm', { type })} />
    </View>
  );
}

const s = StyleSheet.create({
  header: { padding: Spacing.md, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  name: { fontSize: Font.lg, fontWeight: '700', color: Colors.text },
});
