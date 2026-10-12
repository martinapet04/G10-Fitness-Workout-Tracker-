import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useLibrary } from '../../context/LibraryContext';
import { Card, Button, Badge, SectionTitle, InfoRow, common } from '../../components/Basics';
import { Colors, Spacing, Font } from '../../theme';
import { ENTITY, statusInfo, confirmAction } from '../../utils/helpers';

export default function EntityDetailScreen({ route, navigation }) {
  const { type, id } = route.params;
  const cfg = ENTITY[type];
  const { state, authorNames, update, remove } = useLibrary();
  const entity = state[cfg.col].find((e) => e.id === id);
  if (!entity) return <View style={common.screen} />;

  const books = state.books.filter((b) => cfg.match(b, id));

  return (
    <ScrollView style={common.screen} contentContainerStyle={common.scroll}>
      <View style={common.rowBetween}>
        <View style={{ flex: 1 }}>
          <Text style={s.kind}>{cfg.singular}</Text>
          <Text style={common.title}>{entity.name}</Text>
        </View>
        <TouchableOpacity onPress={() => update(cfg.col, { ...entity, favorite: !entity.favorite })}>
          <Icon name={entity.favorite ? 'star' : 'star-outline'} size={32} color={Colors.star} />
        </TouchableOpacity>
      </View>

      <Card style={{ marginTop: Spacing.md }}>
        <InfoRow icon="text" label="Descrizione" value={entity.description} />
        <InfoRow icon="note-text-outline" label="Note" value={entity.notes} />
        <InfoRow icon="book-multiple" label="Contenuti associati" value={String(books.length)} />
        <InfoRow icon="star-outline" label="Preferenza personale" value={entity.favorite ? 'Preferito' : 'Normale'} />
      </Card>

      <SectionTitle title="Contenuti associati" />
      {books.length === 0 ? <Text style={common.muted}>Nessun contenuto associato.</Text> : null}
      {books.map((b) => {
        const st = statusInfo(b.status);
        return (
          <Card key={b.id} onPress={() => navigation.navigate('BookDetail', { id: b.id })}>
            <Text style={s.bookTitle}>{b.title}</Text>
            <Text style={common.muted}>{authorNames(b)}</Text>
            <View style={{ marginTop: 6 }}><Badge label={st.label} color={st.color} icon={st.icon} /></View>
          </Card>
        );
      })}

      <View style={[common.row, { marginTop: Spacing.lg }]}>
        <Button icon="pencil-outline" title="Modifica" style={{ flex: 1, marginRight: 8 }} onPress={() => navigation.navigate('EntityForm', { type, id })} />
        <Button
          variant="danger"
          icon="delete-outline"
          title="Elimina"
          style={{ flex: 1, marginLeft: 8 }}
          onPress={() =>
            confirmAction(`Elimina ${cfg.singular.toLowerCase()}`, 'I contenuti collegati non verranno eliminati, ma perderanno questo collegamento.', () => {
              remove(cfg.col, id);
              navigation.goBack();
            })
          }
        />
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  kind: { fontSize: Font.xs, color: Colors.primary, fontWeight: '700', textTransform: 'uppercase' },
  bookTitle: { fontSize: Font.md, fontWeight: '700', color: Colors.text },
});
