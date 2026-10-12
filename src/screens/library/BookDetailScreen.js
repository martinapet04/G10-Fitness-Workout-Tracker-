import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useLibrary } from '../../context/LibraryContext';
import { Card, Badge, Button, EmptyState, SectionTitle, InfoRow, common } from '../../components/Basics';
import { ChipSelect, StarRating } from '../../components/Inputs';
import { ProgressBar } from '../../components/Charts';
import { Colors, Spacing, Font } from '../../theme';
import { STATUSES, statusInfo, noteTypeInfo, booksProgress, confirmAction, formatDate, today } from '../../utils/helpers';

export default function BookDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { state, getBook, getCategory, authorNames, update, remove } = useLibrary();
  const book = getBook(id);
  if (!book) return <View style={common.screen} />;

  const st = statusInfo(book.status);
  const category = book.categoryId ? getCategory(book.categoryId) : null;
  const progress = booksProgress(book, state.sessions);
  const sessions = state.sessions.filter((x) => x.bookId === id).sort((a, b) => b.date.localeCompare(a.date));
  const notes = state.notes.filter((n) => n.bookId === id).sort((a, b) => b.date.localeCompare(a.date));

  const changeStatus = (value) => {
    const next = { ...book, status: value };
    if (value === 'read' && !book.finishedAt) next.finishedAt = today();
    if (value !== 'read') next.finishedAt = null;
    update('books', next);
  };
  const toggleList = (list) => {
    const inList = list.bookIds.includes(id);
    update('lists', { ...list, bookIds: inList ? list.bookIds.filter((b) => b !== id) : [...list.bookIds, id] });
  };
  const goDiary = (screen, params) => navigation.navigate('Diario', { screen, params });

  return (
    <ScrollView style={common.screen} contentContainerStyle={common.scroll}>
      <View style={common.rowBetween}>
        <View style={{ flex: 1, marginRight: Spacing.sm }}>
          <Text style={common.title}>{book.title}</Text>
          <Text style={common.subtitle}>{authorNames(book)}</Text>
        </View>
        <TouchableOpacity onPress={() => update('books', { ...book, favorite: !book.favorite })}>
          <Icon name={book.favorite ? 'heart' : 'heart-outline'} size={30} color={Colors.danger} />
        </TouchableOpacity>
      </View>

      <View style={s.badges}>
        <Badge label={st.label} color={st.color} icon={st.icon} />
        <Badge label={book.type} color={Colors.textMuted} />
        {category ? <Badge label={category.name} color={Colors.primary} /> : null}
      </View>

      <Card style={{ marginTop: Spacing.md }}>
        <Text style={s.cardLabel}>Valutazione personale</Text>
        <StarRating value={book.rating || 0} size={30} onChange={(v) => update('books', { ...book, rating: v })} />
        <View style={{ height: Spacing.md }} />
        <Text style={s.cardLabel}>Avanzamento</Text>
        <ProgressBar value={progress.read} max={progress.total || 1} height={10} />
        <Text style={[common.muted, { marginTop: 6 }]}>
          {progress.total ? `${progress.read}/${progress.total} pagine · ${progress.percent}%` : `${progress.read} pagine lette`}
        </Text>
        <View style={[common.row, { marginTop: Spacing.md, flexWrap: 'wrap', gap: 8 }]}>
          <Button small icon="plus" title="Registra lettura" onPress={() => goDiary('SessionForm', { bookId: id })} />
          <Button small variant="ghost" icon="timer-outline" title="Modalità focus" onPress={() => goDiary('FocusTimer', { bookId: id })} />
        </View>
      </Card>

      <ChipSelect label="Stato di lettura" options={STATUSES.map((x) => ({ value: x.value, label: x.label }))} value={book.status} onChange={changeStatus} />

      <Card>
        <InfoRow icon="calendar-blank-outline" label="Anno di pubblicazione" value={book.year ? String(book.year) : ''} />
        <InfoRow icon="file-document-outline" label="Pagine" value={book.pages ? String(book.pages) : ''} />
        <InfoRow icon="check-circle-outline" label="Terminato il" value={book.finishedAt ? formatDate(book.finishedAt) : ''} />
        <InfoRow icon="note-text-outline" label="Note aggiuntive" value={book.notes} />
      </Card>

      <SectionTitle title="Liste di lettura" />
      {state.lists.length === 0 ? (
        <Text style={common.muted}>Non hai ancora creato liste.</Text>
      ) : (
        <View style={s.listChips}>
          {state.lists.map((l) => {
            const active = l.bookIds.includes(id);
            return (
              <TouchableOpacity key={l.id} style={[s.chip, active && s.chipActive]} onPress={() => toggleList(l)}>
                <Icon name={active ? 'check' : 'plus'} size={14} color={active ? Colors.primaryDark : Colors.textMuted} />
                <Text style={[s.chipText, active && { color: Colors.primaryDark, fontWeight: '700' }]}> {l.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <SectionTitle title={`Note, recensioni e citazioni (${notes.length})`} action="+ Aggiungi" onAction={() => goDiary('NoteForm', { bookId: id })} />
      {notes.length === 0 ? <Text style={common.muted}>Nessun elemento associato.</Text> : null}
      {notes.map((n) => {
        const t = noteTypeInfo(n.type);
        return (
          <Card key={n.id} onPress={() => goDiary('NoteForm', { id: n.id })}>
            <View style={common.rowBetween}>
              <Badge label={t.label} color={t.color} icon={t.icon} />
              <Text style={common.muted}>{formatDate(n.date)}{n.page ? ` · p. ${n.page}` : ''}</Text>
            </View>
            <Text style={[s.noteText, n.type === 'quote' && { fontStyle: 'italic' }]}>{n.type === 'quote' ? `“${n.text}”` : n.text}</Text>
          </Card>
        );
      })}

      <SectionTitle title={`Sessioni di lettura (${sessions.length})`} />
      {sessions.length === 0 ? <Text style={common.muted}>Nessuna sessione registrata.</Text> : null}
      {sessions.slice(0, 6).map((x) => (
        <Card key={x.id} onPress={() => goDiary('SessionForm', { id: x.id })} style={{ paddingVertical: Spacing.sm }}>
          <View style={common.rowBetween}>
            <Text style={s.sessionDate}>{formatDate(x.date)}</Text>
            <Text style={common.muted}>{x.pagesRead} pag · {x.minutes} min</Text>
          </View>
        </Card>
      ))}

      <View style={[common.row, { marginTop: Spacing.lg }]}>
        <Button icon="pencil-outline" title="Modifica" style={{ flex: 1, marginRight: 8 }} onPress={() => navigation.navigate('BookForm', { id })} />
        <Button
          variant="danger"
          icon="delete-outline"
          title="Elimina"
          style={{ flex: 1, marginLeft: 8 }}
          onPress={() =>
            confirmAction('Elimina contenuto', 'Verranno eliminate anche le sessioni e le note associate. Continuare?', () => {
              remove('books', id);
              navigation.goBack();
            })
          }
        />
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: Spacing.sm },
  cardLabel: { fontSize: Font.xs, fontWeight: '700', color: Colors.textMuted, textTransform: 'uppercase', marginBottom: 6 },
  listChips: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface, marginRight: 8, marginBottom: 8 },
  chipActive: { backgroundColor: Colors.primarySoft, borderColor: Colors.primary },
  chipText: { fontSize: Font.sm, color: Colors.textMuted },
  noteText: { marginTop: Spacing.sm, fontSize: Font.md, color: Colors.text, lineHeight: 21 },
  sessionDate: { fontSize: Font.md, color: Colors.text, fontWeight: '600' },
});
