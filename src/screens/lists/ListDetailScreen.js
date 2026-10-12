import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useLibrary } from '../../context/LibraryContext';
import { Card, Button, Badge, SectionTitle, InfoRow, common } from '../../components/Basics';
import { Colors, Spacing, Font } from '../../theme';
import { LIST_STATUSES, statusInfo, confirmAction } from '../../utils/helpers';

export default function ListDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { state, getList, authorNames, update, remove } = useLibrary();
  const list = getList(id);
  if (!list) return <View style={common.screen} />;

  const books = list.bookIds.map((bid) => state.books.find((b) => b.id === bid)).filter(Boolean);
  const st = LIST_STATUSES.find((s) => s.value === list.status) || LIST_STATUSES[0];

  const moveBook = (index, dir) => {
    const ids = [...list.bookIds];
    const target = index + dir;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    update('lists', { ...list, bookIds: ids });
  };
  const removeBook = (bid) => update('lists', { ...list, bookIds: list.bookIds.filter((x) => x !== bid) });

  return (
    <ScrollView style={common.screen} contentContainerStyle={common.scroll}>
      <View style={common.rowBetween}>
        <View style={{ flex: 1 }}>
          <Text style={common.title}>{list.name}</Text>
          {list.description ? <Text style={common.subtitle}>{list.description}</Text> : null}
        </View>
        <Badge label={st.label} color={st.color} />
      </View>

      {list.notes ? <Card style={{ marginTop: Spacing.md }}><InfoRow icon="note-text-outline" label="Note" value={list.notes} /></Card> : null}

      <SectionTitle title={`Contenuti (${books.length})`} action="+ Aggiungi libro" onAction={() => navigation.navigate('Library', { screen: 'BookList' })} />
      {books.length === 0 ? <Text style={common.muted}>La lista è vuota. Apri un libro e aggiungilo da lì.</Text> : null}
      {books.map((b, i) => {
        const bst = statusInfo(b.status);
        return (
          <Card key={b.id}>
            <View style={common.rowBetween}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate('Library', { screen: 'BookDetail', params: { id: b.id } })}>
                <Text style={s.bookTitle} numberOfLines={2}>{b.title}</Text>
                <Text style={common.muted}>{authorNames(b)}</Text>
                <View style={{ marginTop: 4 }}><Badge label={bst.label} color={bst.color} /></View>
              </TouchableOpacity>
              <View style={s.reorder}>
                <TouchableOpacity onPress={() => moveBook(i, -1)} disabled={i === 0}><Icon name="chevron-up" size={22} color={i === 0 ? Colors.border : Colors.textMuted} /></TouchableOpacity>
                <TouchableOpacity onPress={() => moveBook(i, 1)} disabled={i === books.length - 1}><Icon name="chevron-down" size={22} color={i === books.length - 1 ? Colors.border : Colors.textMuted} /></TouchableOpacity>
                <TouchableOpacity onPress={() => removeBook(b.id)}><Icon name="close-circle-outline" size={22} color={Colors.danger} /></TouchableOpacity>
              </View>
            </View>
          </Card>
        );
      })}

      <View style={[common.row, { marginTop: Spacing.lg }]}>
        <Button icon="pencil-outline" title="Modifica" style={{ flex: 1, marginRight: 8 }} onPress={() => navigation.navigate('ListForm', { id })} />
        <Button variant="danger" icon="delete-outline" title="Elimina" style={{ flex: 1, marginLeft: 8 }}
          onPress={() => confirmAction('Elimina lista', 'I contenuti non verranno eliminati.', () => { remove('lists', id); navigation.goBack(); })} />
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  bookTitle: { fontSize: Font.md, fontWeight: '700', color: Colors.text },
  reorder: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
