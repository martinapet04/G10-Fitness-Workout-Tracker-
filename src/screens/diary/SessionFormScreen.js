import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLibrary } from '../../context/LibraryContext';
import { Button, common } from '../../components/Basics';
import { Field, ChipSelect, DateField } from '../../components/Inputs';
import { Colors, Spacing, Font } from '../../theme';
import { today, showMessage, isValidDate } from '../../utils/helpers';

export default function SessionFormScreen({ route, navigation }) {
  const { id, bookId: presetBookId } = route.params || {};
  const { state, getSession, add, update, remove } = useLibrary();
  const editing = id ? getSession(id) : null;

  const [bookId, setBookId] = useState(editing?.bookId || presetBookId || (state.books[0]?.id || ''));
  const [date, setDate] = useState(editing?.date || today());
  const [pagesRead, setPagesRead] = useState(editing?.pagesRead ? String(editing.pagesRead) : '');
  const [minutes, setMinutes] = useState(editing?.minutes ? String(editing.minutes) : '');
  const [notes, setNotes] = useState(editing?.notes || '');
  const [errors, setErrors] = useState({});

  const booksOptions = state.books
    .filter((b) => b.status === 'reading' || b.status === 'toRead' || b.id === bookId)
    .map((b) => ({ value: b.id, label: b.title }));

  const validate = () => {
    const e = {};
    if (!bookId) e.bookId = 'Seleziona un contenuto.';
    if (!isValidDate(date)) e.date = 'Data non valida (usa AAAA-MM-GG).';
    if (!pagesRead || isNaN(Number(pagesRead)) || Number(pagesRead) <= 0) e.pagesRead = 'Inserisci un numero di pagine valido.';
    if (minutes && (isNaN(Number(minutes)) || Number(minutes) < 0)) e.minutes = 'Minuti non validi.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = () => {
    if (!validate()) { showMessage('Controlla i dati', 'Alcuni campi non sono validi.'); return; }
    const data = { bookId, date, pagesRead: Number(pagesRead), minutes: Number(minutes) || 0, notes: notes.trim() };
    if (editing) update('sessions', { ...editing, ...data });
    else add('sessions', data);
    navigation.goBack();
  };

  return (
    <ScrollView style={common.screen} contentContainerStyle={common.scroll} keyboardShouldPersistTaps="handled">
      <ChipSelect
        label="Contenuto *"
        options={booksOptions.length ? booksOptions : state.books.map((b) => ({ value: b.id, label: b.title }))}
        value={bookId}
        onChange={setBookId}
      />
      {errors.bookId ? <Text style={s.err}>{errors.bookId}</Text> : null}

      <DateField label="Data lettura" value={date} onChange={setDate} error={errors.date} />

      <View style={common.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Field label="Pagine lette *" value={pagesRead} onChangeText={setPagesRead} keyboardType="numeric" placeholder="30" error={errors.pagesRead} />
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Field label="Minuti" value={minutes} onChangeText={setMinutes} keyboardType="numeric" placeholder="45" error={errors.minutes} />
        </View>
      </View>

      <Field label="Note di sessione" value={notes} onChangeText={setNotes} multiline placeholder="Come è andata, cosa hai capito..." />

      <Button icon="content-save-outline" title={editing ? 'Salva modifiche' : 'Registra sessione'} onPress={save} />
      {editing ? (
        <Button variant="danger" icon="delete-outline" title="Elimina sessione" style={{ marginTop: Spacing.md }}
          onPress={() => { remove('sessions', id); navigation.goBack(); }} />
      ) : null}
    </ScrollView>
  );
}

const s = StyleSheet.create({ err: { color: Colors.danger, fontSize: Font.xs, marginTop: -8, marginBottom: Spacing.md } });
