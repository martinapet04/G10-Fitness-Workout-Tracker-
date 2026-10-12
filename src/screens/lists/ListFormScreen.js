import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { useLibrary } from '../../context/LibraryContext';
import { Button, common } from '../../components/Basics';
import { Field, ChipSelect, ToggleRow } from '../../components/Inputs';
import { Spacing } from '../../theme';
import { LIST_STATUSES, showMessage } from '../../utils/helpers';

export default function ListFormScreen({ route, navigation }) {
  const { id } = route.params || {};
  const { getList, add, update } = useLibrary();
  const editing = id ? getList(id) : null;

  const [name, setName] = useState(editing?.name || '');
  const [description, setDescription] = useState(editing?.description || '');
  const [notes, setNotes] = useState(editing?.notes || '');
  const [status, setStatus] = useState(editing?.status || 'active');
  const [error, setError] = useState('');

  const save = () => {
    if (!name.trim()) { setError('Il nome è obbligatorio.'); return; }
    const data = { name: name.trim(), description: description.trim(), notes: notes.trim(), status, bookIds: editing?.bookIds || [] };
    if (editing) update('lists', { ...editing, ...data });
    else add('lists', data);
    navigation.goBack();
  };

  return (
    <ScrollView style={common.screen} contentContainerStyle={common.scroll} keyboardShouldPersistTaps="handled">
      <Field label="Nome lista *" value={name} onChangeText={(t) => { setName(t); setError(''); }} placeholder="es. Da leggere quest'estate" error={error} />
      <Field label="Descrizione" value={description} onChangeText={setDescription} multiline placeholder="A cosa serve questa lista..." />
      <Field label="Note" value={notes} onChangeText={setNotes} multiline placeholder="Appunti personali..." />
      <ChipSelect label="Stato" options={LIST_STATUSES.map((s) => ({ value: s.value, label: s.label }))} value={status} onChange={setStatus} />
      <Button icon="content-save-outline" title={editing ? 'Salva modifiche' : 'Crea lista'} onPress={save} style={{ marginTop: Spacing.sm }} />
    </ScrollView>
  );
}
