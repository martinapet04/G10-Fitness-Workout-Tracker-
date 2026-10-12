import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet } from 'react-native';
import { useLibrary } from '../../context/LibraryContext';
import { Button, common } from '../../components/Basics';
import { Field, ChipSelect, StarRating, ToggleRow } from '../../components/Inputs';
import { Colors, Spacing, Font, Radius } from '../../theme';
import { STATUSES, BOOK_TYPES, showMessage, today } from '../../utils/helpers';

export default function BookFormScreen({ route, navigation }) {
  const { id, presetStatus } = route.params || {};
  const { state, getBook, add, update } = useLibrary();
  const editing = id ? getBook(id) : null;

  const [title, setTitle] = useState(editing?.title || '');
  const [authorIds, setAuthorIds] = useState(editing?.authorIds || []);
  const [type, setType] = useState(editing?.type || 'Libro');
  const [categoryId, setCategoryId] = useState(editing?.categoryId || null);
  const [year, setYear] = useState(editing?.year ? String(editing.year) : '');
  const [pages, setPages] = useState(editing?.pages ? String(editing.pages) : '');
  const [status, setStatus] = useState(editing?.status || presetStatus || 'toRead');
  const [rating, setRating] = useState(editing?.rating || 0);
  const [notes, setNotes] = useState(editing?.notes || '');
  const [favorite, setFavorite] = useState(editing?.favorite || false);
  const [newAuthor, setNewAuthor] = useState('');
  const [errors, setErrors] = useState({});

  const addAuthorInline = () => {
    const name = newAuthor.trim();
    if (!name) return;
    const existing = state.authors.find((a) => a.name.toLowerCase() === name.toLowerCase());
    const author = existing || add('authors', { name, description: '', notes: '', favorite: false });
    if (!authorIds.includes(author.id)) setAuthorIds([...authorIds, author.id]);
    setNewAuthor('');
  };

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = 'Il titolo è obbligatorio.';
    if (year && (!/^\d{3,4}$/.test(year) || Number(year) > new Date().getFullYear() + 1)) e.year = 'Anno non valido.';
    if (pages && (!/^\d+$/.test(pages) || Number(pages) <= 0)) e.pages = 'Inserisci un numero intero positivo.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = () => {
    if (!validate()) {
      showMessage('Controlla i dati', 'Alcuni campi non sono validi.');
      return;
    }
    let finishedAt = editing?.finishedAt || null;
    if (status === 'read' && !finishedAt) finishedAt = today();
    if (status !== 'read') finishedAt = null;

    const data = {
      title: title.trim(),
      authorIds,
      type,
      categoryId,
      year: year ? Number(year) : null,
      pages: pages ? Number(pages) : 0,
      status,
      rating,
      notes: notes.trim(),
      favorite,
      finishedAt,
    };
    if (editing) update('books', { ...editing, ...data });
    else add('books', data);
    navigation.goBack();
  };

  return (
    <ScrollView style={common.screen} contentContainerStyle={common.scroll} keyboardShouldPersistTaps="handled">
      <Field label="Titolo *" value={title} onChangeText={setTitle} placeholder="es. Il barone rampante" error={errors.title} />

      <ChipSelect
        label="Autore / Autori"
        multiple
        options={state.authors.map((a) => ({ value: a.id, label: a.name }))}
        value={authorIds}
        onChange={setAuthorIds}
      />
      <View style={s.inlineRow}>
        <TextInput
          style={s.inlineInput}
          value={newAuthor}
          onChangeText={setNewAuthor}
          placeholder="Nuovo autore..."
          placeholderTextColor={Colors.textMuted}
          onSubmitEditing={addAuthorInline}
        />
        <Button small title="Aggiungi" variant="ghost" onPress={addAuthorInline} />
      </View>

      <ChipSelect label="Tipologia" options={BOOK_TYPES.map((t) => ({ value: t, label: t }))} value={type} onChange={setType} />
      <ChipSelect
        label="Categoria / Genere"
        allowClear
        options={state.categories.map((c) => ({ value: c.id, label: c.name }))}
        value={categoryId}
        onChange={setCategoryId}
      />

      <View style={common.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Field label="Anno" value={year} onChangeText={setYear} keyboardType="numeric" placeholder="1957" maxLength={4} error={errors.year} />
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Field label="Pagine" value={pages} onChangeText={setPages} keyboardType="numeric" placeholder="288" error={errors.pages} />
        </View>
      </View>

      <ChipSelect label="Stato di lettura" options={STATUSES.map((x) => ({ value: x.value, label: x.label }))} value={status} onChange={setStatus} />

      <Text style={s.label}>Valutazione personale</Text>
      <View style={{ marginBottom: Spacing.md }}>
        <StarRating value={rating} onChange={setRating} size={32} />
      </View>

      <Field label="Note aggiuntive" value={notes} onChangeText={setNotes} multiline placeholder="Edizione, dove l'hai trovato, impressioni..." />
      <ToggleRow label="Segna come preferito" icon="heart" value={favorite} onChange={setFavorite} />

      <Button icon="content-save-outline" title={editing ? 'Salva modifiche' : 'Aggiungi alla libreria'} onPress={save} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  label: { fontSize: Font.xs, fontWeight: '700', color: Colors.textMuted, textTransform: 'uppercase', marginBottom: 6 },
  inlineRow: { flexDirection: 'row', alignItems: 'center', marginTop: -4, marginBottom: Spacing.md },
  inlineInput: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 9,
    marginRight: 8,
    fontSize: Font.md,
    color: Colors.text,
  },
});
