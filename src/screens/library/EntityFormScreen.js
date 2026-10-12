import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { useLibrary } from '../../context/LibraryContext';
import { Button, common } from '../../components/Basics';
import { Field, ToggleRow } from '../../components/Inputs';
import { Spacing } from '../../theme';
import { ENTITY, showMessage } from '../../utils/helpers';

export default function EntityFormScreen({ route, navigation }) {
  const { type, id } = route.params;
  const cfg = ENTITY[type];
  const { state, add, update } = useLibrary();
  const editing = id ? state[cfg.col].find((e) => e.id === id) : null;

  const [name, setName] = useState(editing?.name || '');
  const [description, setDescription] = useState(editing?.description || '');
  const [notes, setNotes] = useState(editing?.notes || '');
  const [favorite, setFavorite] = useState(editing?.favorite || false);
  const [error, setError] = useState('');

  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Il nome è obbligatorio.');
      return;
    }
    const duplicate = state[cfg.col].some((e) => e.id !== id && e.name.toLowerCase() === trimmed.toLowerCase());
    if (duplicate) {
      showMessage('Elemento già presente', `Esiste già ${cfg.singular.toLowerCase()} con questo nome.`);
      return;
    }
    const data = { name: trimmed, description: description.trim(), notes: notes.trim(), favorite };
    if (editing) update(cfg.col, { ...editing, ...data });
    else add(cfg.col, data);
    navigation.goBack();
  };

  return (
    <ScrollView style={common.screen} contentContainerStyle={common.scroll} keyboardShouldPersistTaps="handled">
      <Field label="Nome *" value={name} onChangeText={(t) => { setName(t); setError(''); }} placeholder={type === 'author' ? 'es. Italo Calvino' : 'es. Fantascienza'} error={error} />
      <Field label="Descrizione" value={description} onChangeText={setDescription} multiline placeholder="Breve descrizione..." />
      <Field label="Note" value={notes} onChangeText={setNotes} multiline placeholder="Appunti personali..." />
      <ToggleRow label="Segna come preferito" icon="star" value={favorite} onChange={setFavorite} />
      <Button icon="content-save-outline" title={editing ? 'Salva modifiche' : `Aggiungi ${cfg.singular.toLowerCase()}`} onPress={save} style={{ marginTop: Spacing.sm }} />
    </ScrollView>
  );
}
