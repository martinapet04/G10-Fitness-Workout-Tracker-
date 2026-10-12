import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useLibrary } from '../../context/LibraryContext';
import { Card, SectionTitle, Badge, Button, common } from '../../components/Basics';
import { ProgressBar } from '../../components/Charts';
import { StarRating } from '../../components/Inputs';
import { Colors, Spacing, Font, Radius } from '../../theme';
import { STATUSES, statusInfo, booksProgress, goalProgress, goalLabel, sumPages, formatDate, today } from '../../utils/helpers';

export default function HomeScreen({ navigation }) {
  const { state, authorNames, getCategory } = useLibrary();
  const t = today();

  const currentlyReading = useMemo(() => state.books.filter((b) => b.status === 'reading'), [state.books]);
  const recentlyRead = useMemo(() =>
    state.books.filter((b) => b.status === 'read' && b.finishedAt).sort((a, b) => b.finishedAt.localeCompare(a.finishedAt)).slice(0, 3),
    [state.books]);
  const recentSessions = useMemo(() =>
    [...state.sessions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3),
    [state.sessions]);
  const totalPagesThisMonth = useMemo(() => {
    const key = t.slice(0, 7);
    return sumPages(state.sessions.filter((s) => s.date.startsWith(key)));
  }, [state.sessions, t]);
  const goals = state.goals;

  const goBook = (id) => navigation.navigate('Library', { screen: 'BookDetail', params: { id } });
  const goDiary = (screen, params) => navigation.navigate('Diario', { screen, params });

  return (
    <ScrollView style={common.screen} contentContainerStyle={common.scroll}>
      {/* Hero */}
      <View style={s.hero}>
        <Text style={s.heroTitle}>📚 La mia libreria</Text>
        <Text style={s.heroSub}>{t.slice(8, 10)}/{t.slice(5, 7)}/{t.slice(0, 4)} · {totalPagesThisMonth} pagine questo mese</Text>
      </View>

      {/* In lettura */}
      {currentlyReading.length > 0 ? (
        <>
          <SectionTitle title="In lettura ora" />
          {currentlyReading.map((b) => {
            const prog = booksProgress(b, state.sessions);
            return (
              <Card key={b.id} onPress={() => goBook(b.id)}>
                <Text style={s.bookTitle} numberOfLines={2}>{b.title}</Text>
                <Text style={common.muted}>{authorNames(b)}</Text>
                <View style={{ marginTop: Spacing.sm }}>
                  <ProgressBar value={prog.read} max={prog.total || 1} height={8} />
                  <View style={common.rowBetween}>
                    <Text style={[common.muted, { marginTop: 4 }]}>{prog.read}/{prog.total} pag · {prog.percent}%</Text>
                    <Button small icon="timer-outline" title="Focus" variant="ghost"
                      onPress={() => goDiary('FocusTimer', { bookId: b.id })} />
                  </View>
                </View>
              </Card>
            );
          })}
        </>
      ) : (
        <Card>
          <Text style={s.noReadTitle}>Nessun libro in corso</Text>
          <Text style={common.muted}>Cosa stai aspettando? Inizia a leggere! 📖</Text>
          <Button small icon="plus" title="Aggiungi libro" style={{ marginTop: Spacing.md }}
            onPress={() => navigation.navigate('Library', { screen: 'BookForm', params: { presetStatus: 'reading' } })} />
        </Card>
      )}

      {/* Obiettivi */}
      {goals.length > 0 ? (
        <>
          <SectionTitle title="Obiettivi" action="Vedi statistiche" onAction={() => navigation.navigate('Statistiche')} />
          {goals.slice(0, 2).map((g) => {
            const { current, percent } = goalProgress(g, state);
            return (
              <Card key={g.id} style={{ paddingVertical: Spacing.sm }}>
                <View style={common.rowBetween}>
                  <Text style={[common.muted, { fontWeight: '700' }]}>{goalLabel(g)}</Text>
                  <Text style={[common.muted, { color: percent >= 100 ? Colors.success : Colors.primary }]}>{percent}%</Text>
                </View>
                <ProgressBar value={current} max={g.target} color={percent >= 100 ? Colors.success : Colors.primary} height={8} style={{ marginTop: 6 }} />
                <Text style={[common.muted, { marginTop: 4 }]}>{current} di {g.target} {g.unit === 'books' ? 'libri' : 'pagine'}</Text>
              </Card>
            );
          })}
        </>
      ) : null}

      {/* Ultime sessioni */}
      {recentSessions.length > 0 ? (
        <>
          <SectionTitle title="Ultime sessioni" action="Aggiungi" onAction={() => goDiary('SessionForm', {})} />
          {recentSessions.map((sess) => {
            const book = state.books.find((b) => b.id === sess.bookId);
            return (
              <Card key={sess.id} onPress={() => goDiary('SessionForm', { id: sess.id })} style={{ paddingVertical: Spacing.sm }}>
                <View style={common.rowBetween}>
                  <Text style={s.sessionBook} numberOfLines={1}>{book?.title || 'Libro eliminato'}</Text>
                  <Text style={common.muted}>{formatDate(sess.date)}</Text>
                </View>
                <Text style={common.muted}>{sess.pagesRead} pagine · {sess.minutes} minuti</Text>
              </Card>
            );
          })}
        </>
      ) : null}

      {/* Letti di recente */}
      {recentlyRead.length > 0 ? (
        <>
          <SectionTitle title="Letti di recente" />
          {recentlyRead.map((b) => (
            <Card key={b.id} onPress={() => goBook(b.id)} style={{ paddingVertical: Spacing.sm }}>
              <View style={common.rowBetween}>
                <View style={{ flex: 1, marginRight: Spacing.sm }}>
                  <Text style={s.bookTitle} numberOfLines={1}>{b.title}</Text>
                  <Text style={common.muted}>{authorNames(b)}</Text>
                </View>
                <StarRating value={b.rating || 0} size={16} />
              </View>
            </Card>
          ))}
        </>
      ) : null}

      {/* Quick actions */}
      <SectionTitle title="Azioni rapide" />
      <View style={s.quickRow}>
        <TouchableOpacity style={s.quickBtn} onPress={() => navigation.navigate('Library', { screen: 'BookForm' })}>
          <Icon name="plus-circle" size={28} color={Colors.primary} />
          <Text style={s.quickText}>Aggiungi libro</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.quickBtn} onPress={() => goDiary('SessionForm', {})}>
          <Icon name="pencil-plus" size={28} color={Colors.accent} />
          <Text style={s.quickText}>Sessione</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.quickBtn} onPress={() => goDiary('FocusTimer', {})}>
          <Icon name="timer-outline" size={28} color={Colors.warning} />
          <Text style={s.quickText}>Timer focus</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.quickBtn} onPress={() => navigation.navigate('Liste', { screen: 'Lists' })}>
          <Icon name="format-list-bulleted" size={28} color={Colors.purple} />
          <Text style={s.quickText}>Liste</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  hero: { backgroundColor: Colors.primary, borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.lg },
  heroTitle: { fontSize: Font.xl, fontWeight: '700', color: '#fff' },
  heroSub: { fontSize: Font.sm, color: '#ffffff99', marginTop: 4 },
  bookTitle: { fontSize: Font.md, fontWeight: '700', color: Colors.text },
  noReadTitle: { fontSize: Font.lg, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  sessionBook: { fontSize: Font.md, fontWeight: '600', color: Colors.text, flex: 1, marginRight: 8 },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  quickBtn: { width: '48%', backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, padding: Spacing.md, alignItems: 'center', marginBottom: Spacing.sm },
  quickText: { marginTop: 6, fontSize: Font.sm, color: Colors.text, fontWeight: '600', textAlign: 'center' },
});
