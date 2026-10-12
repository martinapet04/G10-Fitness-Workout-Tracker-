import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useLibrary } from '../../context/LibraryContext';
import { Card, SectionTitle, Badge, Button, common } from '../../components/Basics';
import { StatTile, BarChart, HBars, ProgressBar } from '../../components/Charts';
import { Colors, Spacing, Font, Radius } from '../../theme';
import { STATUSES, MONTHS, sumPages, booksProgress, goalProgress, goalLabel, recommendBooks, formatDate, today, toDateStr, parseDate } from '../../utils/helpers';

export default function StatsScreen({ navigation }) {
  const { state, add, update, remove, getBook, authorNames, resetData, clearAll } = useLibrary();
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const t = today();
  const year = Number(t.slice(0, 4));
  const month = Number(t.slice(5, 7));

  /* ---- Aggregati ---- */
  const totals = useMemo(() => ({
    all: state.books.length,
    read: state.books.filter((b) => b.status === 'read').length,
    reading: state.books.filter((b) => b.status === 'reading').length,
    toRead: state.books.filter((b) => b.status === 'toRead').length,
    wishlist: state.books.filter((b) => b.status === 'wishlist').length,
    notes: state.notes.length,
    quotes: state.notes.filter((n) => n.type === 'quote').length,
    sessions: state.sessions.length,
    totalPages: sumPages(state.sessions),
    totalMinutes: state.sessions.reduce((a, s) => a + (s.minutes || 0), 0),
  }), [state]);

  /* Pagine per mese (ultimi 6 mesi) */
  const pagesByMonth = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(year, month - 1 - i, 1);
      const key = toDateStr(d).slice(0, 7);
      const pages = sumPages(state.sessions.filter((s) => s.date.startsWith(key)));
      months.push({ label: MONTHS[d.getMonth()], value: pages });
    }
    return months;
  }, [state.sessions, year, month]);

  /* Distribuzione per categoria */
  const catDist = useMemo(() => {
    return state.categories.map((c) => ({
      label: c.name,
      value: state.books.filter((b) => b.categoryId === c.id).length,
      color: Colors.accent,
    })).filter((x) => x.value > 0).sort((a, b) => b.value - a.value);
  }, [state]);

  /* Top autori */
  const topAuthors = useMemo(() => state.authors
    .map((a) => ({ label: a.name, value: state.books.filter((b) => (b.authorIds || []).includes(a.id)).length }))
    .filter((x) => x.value > 0).sort((a, b) => b.value - a.value).slice(0, 5), [state]);

  /* Suggerimenti locali */
  const recommendations = useMemo(() => recommendBooks(state), [state]);

  return (
    <ScrollView style={common.screen} contentContainerStyle={common.scroll}>

      {/* Panoramica */}
      <SectionTitle title="Panoramica libreria" />
      <View style={s.tilesRow}>
        <StatTile icon="bookshelf" label="Totale" value={totals.all} color={Colors.primary} />
        <StatTile icon="check-circle-outline" label="Letti" value={totals.read} color={Colors.success} />
        <StatTile icon="book-open-page-variant" label="In lettura" value={totals.reading} color={Colors.accent} />
      </View>
      <View style={s.tilesRow}>
        <StatTile icon="bookmark-outline" label="Da leggere" value={totals.toRead} color={Colors.warning} />
        <StatTile icon="heart-outline" label="Wishlist" value={totals.wishlist} color={Colors.purple} />
        <StatTile icon="text" label="Note" value={totals.notes} color={Colors.primary} />
      </View>
      <View style={s.tilesRow}>
        <StatTile icon="file-document-multiple" label="Pagine lette" value={totals.totalPages} color={Colors.accent} />
        <StatTile icon="timer-outline" label="Ore lettura" value={Math.round(totals.totalMinutes / 60)} color={Colors.warning} />
        <StatTile icon="format-quote-close" label="Citazioni" value={totals.quotes} color={Colors.purple} />
      </View>

      {/* Grafico pagine per mese */}
      <Card style={{ marginTop: Spacing.md }}>
        <Text style={common.h2}>Pagine per mese</Text>
        <Text style={[common.muted, { marginBottom: Spacing.md }]}>Ultimi 6 mesi</Text>
        <BarChart data={pagesByMonth} color={Colors.accent} height={120} />
      </Card>

      {/* Distribuzioni */}
      <Card>
        <Text style={common.h2}>Per categoria</Text>
        <HBars data={catDist} color={Colors.primary} emptyText="Nessuna categoria assegnata." />
      </Card>
      {topAuthors.length > 0 ? (
        <Card>
          <Text style={common.h2}>Autori più letti</Text>
          <HBars data={topAuthors} color={Colors.accent} />
        </Card>
      ) : null}

      {/* Obiettivi di lettura */}
      <SectionTitle title="Obiettivi di lettura" action="+ Nuovo" onAction={() => setShowGoalForm(true)} />
      {state.goals.map((g) => {
        const { current, percent } = goalProgress(g, state);
        const isOver = percent >= 100;
        return (
          <Card key={g.id}>
            <View style={common.rowBetween}>
              <Text style={s.goalLabel}>{goalLabel(g)}</Text>
              <TouchableOpacity onPress={() => remove('goals', g.id)}><Icon name="close" size={20} color={Colors.textMuted} /></TouchableOpacity>
            </View>
            <Text style={common.muted}>{g.unit === 'books' ? 'Libri letti' : 'Pagine lette'} · obiettivo: {g.target}</Text>
            <View style={{ marginTop: Spacing.sm }}>
              <ProgressBar value={current} max={g.target} color={isOver ? Colors.success : Colors.primary} height={10} />
              <Text style={[common.muted, { marginTop: 4 }]}>{current}/{g.target} ({percent}%){isOver ? ' ✅' : ''}</Text>
            </View>
          </Card>
        );
      })}
      {state.goals.length === 0 ? <Text style={common.muted}>Nessun obiettivo impostato.</Text> : null}
      {showGoalForm ? <GoalForm year={year} month={month} add={add} onDone={() => setShowGoalForm(false)} /> : null}

      {/* Suggerimenti locali */}
      {recommendations.length > 0 ? (
        <>
          <SectionTitle title="Consigliati per te" />
          {recommendations.map(({ book, reason }) => (
            <Card key={book.id} onPress={() => navigation.navigate('Library', { screen: 'BookDetail', params: { id: book.id } })}>
              <Text style={s.recTitle}>{book.title}</Text>
              <Text style={common.muted}>{authorNames(book)}</Text>
              <View style={[common.row, { marginTop: 6 }]}>
                <Icon name="lightbulb-outline" size={14} color={Colors.warning} />
                <Text style={[common.muted, { marginLeft: 4 }]}>{reason}</Text>
              </View>
            </Card>
          ))}
        </>
      ) : null}

      {/* Impostazioni dati */}
      <SectionTitle title="Dati & Impostazioni" />
      <View style={common.row}>
        <Button small variant="secondary" icon="database-refresh" title="Ripristina esempio" style={{ flex: 1, marginRight: 8 }} onPress={resetData} />
        <Button small variant="danger" icon="delete-sweep" title="Cancella tutto" style={{ flex: 1, marginLeft: 8 }} onPress={clearAll} />
      </View>
    </ScrollView>
  );
}

/* Form inline per aggiungere un obiettivo */
function GoalForm({ year, month, add, onDone }) {
  const [period, setPeriod] = useState('year');
  const [unit, setUnit] = useState('books');
  const [target, setTarget] = useState('');
  const save = () => {
    if (!target || isNaN(Number(target)) || Number(target) <= 0) return;
    add('goals', { period, year, month: period === 'month' ? month : null, target: Number(target), unit });
    onDone();
  };
  return (
    <Card style={{ borderColor: Colors.primary, borderWidth: 2 }}>
      <Text style={common.h2}>Nuovo obiettivo</Text>
      <View style={[common.row, { flexWrap: 'wrap', marginTop: 8 }]}>
        {[{ value: 'year', label: 'Annuale' }, { value: 'month', label: 'Mensile' }].map((o) => (
          <TouchableOpacity key={o.value} style={[s.optChip, period === o.value && s.optChipOn]} onPress={() => setPeriod(o.value)}>
            <Text style={[s.optText, period === o.value && { color: Colors.primaryDark, fontWeight: '700' }]}>{o.label}</Text>
          </TouchableOpacity>
        ))}
        {[{ value: 'books', label: 'Libri' }, { value: 'pages', label: 'Pagine' }].map((o) => (
          <TouchableOpacity key={o.value} style={[s.optChip, unit === o.value && s.optChipOn]} onPress={() => setUnit(o.value)}>
            <Text style={[s.optText, unit === o.value && { color: Colors.primaryDark, fontWeight: '700' }]}>{o.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={[common.row, { marginTop: Spacing.md }]}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={{ fontSize: Font.xs, color: Colors.textMuted, marginBottom: 6, fontWeight: '700', textTransform: 'uppercase' }}>Obiettivo ({unit})</Text>
          <View style={s.targetInput}>
            <Text style={s.targetInputText}>{target || '_'}</Text>
          </View>
          <View style={[common.row, { flexWrap: 'wrap', marginTop: 6 }]}>
            {['5', '10', '12', '24', '50', '100', '200', '500'].map((n) => (
              <TouchableOpacity key={n} style={s.numChip} onPress={() => setTarget(n)}>
                <Text style={{ fontSize: Font.sm, color: Colors.primary }}>{n}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={{ justifyContent: 'flex-end' }}>
          <Button small title="Salva" icon="check" onPress={save} />
          <Button small variant="ghost" title="Annulla" onPress={onDone} style={{ marginTop: 8 }} />
        </View>
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  tilesRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  goalLabel: { fontSize: Font.md, fontWeight: '700', color: Colors.text, flex: 1 },
  recTitle: { fontSize: Font.md, fontWeight: '700', color: Colors.text },
  optChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.round, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface, marginRight: 8, marginBottom: 8 },
  optChipOn: { backgroundColor: Colors.primarySoft, borderColor: Colors.primary },
  optText: { fontSize: Font.sm, color: Colors.textMuted },
  targetInput: { backgroundColor: Colors.primarySoft, borderRadius: Radius.md, paddingHorizontal: 12, paddingVertical: 10, minWidth: 60, alignItems: 'center' },
  targetInputText: { fontSize: Font.xl, fontWeight: '700', color: Colors.primaryDark },
  numChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radius.round, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, marginRight: 6, marginBottom: 6 },
});
