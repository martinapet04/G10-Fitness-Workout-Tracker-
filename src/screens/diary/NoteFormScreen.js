import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLibrary } from '../../context/LibraryContext';
import { Button, common } from '../../components/Basics';
import { Field, ChipSelect, DateField, StarRating, ToggleRow } from '../../components/Inputs';
import { Colors, Spacing, Font } from '../../theme';
import { NOTE_TYPES, today, showMessage, isValidDate } from '../../utils/helpers';

export default function NoteFormScreen({ route, navigation }) {
  const { id, bookId: presetBookId } = route.params || {};
  const { state, getNote, add, update, remove } = useLibrary();
  const editing = id ? getNote(id) : null;

  const [bookId, setBookId] = useState(editing?.bookId || presetBookId || (state.books[0]?.id || ''));
  const [type, setType] = useState(editing?.type || 'note');
  const [text, setText] = useState(editing?.text || '');
  const [date, setDate] = useState(editing?.date || today());
  const [page, setPage] = useState(editing?.page ? String(editing.page) : '');
  const [rating, setRating] = useState(editing?.rating || 0);
  const [tags, setTags] = useState(editing?.tags?.join(', ') || '');
  const [favorite, setFavorite] = useState(editing?.favorite || false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!bookId) e.bookId = 'Seleziona un contenuto.';
    if (!text.trim()) e.text = 'Il testo è obbligatorio.';
    if (!isValidDate(date)) e.date = 'Data non valida (usa AAAA-MM-GG).';
    if (page && (isNaN(Number(page)) || Number(page) <= 0)) e.page = 'Numero pagina non valido.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = () => {
    if (!validate()) { showMessage('Controlla i dati', 'Alcuni campi non sono validi.'); return; }
    const data = {
      bookId, type, text: text.trim(), date, page: page ? Number(page) : null,
      rating, tags: tags.split(',').map((t) => t.trim()).filter(Boolean), favorite,
    };
    if (editing) update('notes', { ...editing, ...data });
    else add('notes', data);
    navigation.goBack();
  };

  const typeLabel = { note: 'nota', review: 'recensione', quote: 'citazione' }[type];

  return (
    <ScrollView style={common.screen} contentContainerStyle={common.scroll} keyboardShouldPersistTaps="handled">
      <ChipSelect
        label="Contenuto *"
        options={state.books.map((b) => ({ value: b.id, label: b.title }))}
        value={bookId}
        onChange={setBookId}
      />
      {errors.bookId ? <Text style={s.err}>{errors.bookId}</Text> : null}

      <ChipSelect label="Tipologia" options={NOTE_TYPES.map((t) => ({ value: t.value, label: t.label }))} value={type} onChange={setType} />

      <Field label={`Testo ${typeLabel} *`} value={text} onChangeText={setText}
        multiline placeholder={type === 'quote' ? 'Incolla qui la citazione...' : type === 'review' ? 'La tua recensione...' : 'La tua nota...'}
        error={errors.text} />

      <DateField label="Data" value={date} onChange={setDate} error={errors.date} />

      <View style={common.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Field label="Pagina" value={page} onChangeText={setPage} keyboardType="numeric" placeholder="es. 42" error={errors.page} />
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Field label="Tag (separati da virgola)" value={tags} onChangeText={setTags} placeholder="filosofia, vita..." />
        </View>
      </View>

      {type === 'review' ? (
        <View style={{ marginBottom: Spacing.md }}>
          <Text style={s.label}>Valutazione</Text>
          <StarRating value={rating} onChange={setRating} size={28} />
        </View>
      ) : null}

      <ToggleRow label="Aggiungi ai preferiti" icon="bookmark" value={favorite} onChange={setFavorite} />
      <Button icon="content-save-outline" title={editing ? 'Salva modifiche' : `Aggiungi ${typeLabel}`} onPress={save} />
      {editing ? (
        <Button variant="danger" icon="delete-outline" title="Elimina" style={{ marginTop: Spacing.md }}
          onPress={() => { remove('notes', id); navigation.goBack(); }} />
      ) : null}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  err: { color: Colors.danger, fontSize: Font.xs, marginTop: -8, marginBottom: Spacing.md },
  label: { fontSize: Font.xs, fontWeight: '700', color: Colors.textMuted, textTransform: 'uppercase', marginBottom: 8 },
});
