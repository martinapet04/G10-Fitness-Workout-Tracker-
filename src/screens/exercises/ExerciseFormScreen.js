import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import uuid from 'react-native-uuid';
import { useData } from '../../context/DataContext';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { MUSCLE_GROUPS, EQUIPMENT, DIFFICULTY_LEVELS } from '../../constants/data';

export default function ExerciseFormScreen({ route, navigation }) {
  const { item } = route.params || {};
  const { dispatch } = useData();

  const [name, setName] = useState(item?.name || '');
  const [description, setDescription] = useState(item?.description || '');
  const [primaryMuscle, setPrimaryMuscle] = useState(item?.primaryMuscle || MUSCLE_GROUPS[0]);
  const [difficulty, setDifficulty] = useState(item?.difficulty || 'beginner');
  const [equipment, setEquipment] = useState(item?.equipment || 'Nessuna');
  const [suggestedReps, setSuggestedReps] = useState(item?.suggestedReps || '');
  const [notes, setNotes] = useState(item?.notes || '');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Errore', 'Il nome dell\'esercizio è obbligatorio.');
      return;
    }

    const exerciseData = {
      id: item?.id || uuid.v4(),
      name: name.trim(),
      description: description.trim(),
      primaryMuscle,
      secondaryMuscles: item?.secondaryMuscles || [],
      difficulty,
      equipment,
      suggestedReps: suggestedReps.trim(),
      notes: notes.trim(),
      estimatedDuration: item?.estimatedDuration || 10,
    };

    if (item) {
      dispatch({ type: 'UPDATE_EXERCISE', payload: exerciseData });
    } else {
      dispatch({ type: 'ADD_EXERCISE', payload: exerciseData });
    }

    navigation.goBack();
  };

  const renderSelectGroup = (label, options, selectedValue, onSelect, isComplex = false) => (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollSelect}>
        {options.map((opt) => {
          const val = isComplex ? opt.value : opt;
          const lbl = isComplex ? opt.label : opt;
          const isSelected = selectedValue === val;
          return (
            <TouchableOpacity
              key={val}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onSelect(val)}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{lbl}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome Esercizio *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="es. Panca Piana"
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        {renderSelectGroup('Gruppo Muscolare Principale', MUSCLE_GROUPS, primaryMuscle, setPrimaryMuscle)}
        {renderSelectGroup('Livello di Difficoltà', DIFFICULTY_LEVELS, difficulty, setDifficulty, true)}
        {renderSelectGroup('Attrezzatura', EQUIPMENT, equipment, setEquipment)}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Ripetizioni Consigliate</Text>
          <TextInput
            style={styles.input}
            value={suggestedReps}
            onChangeText={setSuggestedReps}
            placeholder="es. 8-12 oppure 30 sec"
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Istruzioni</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Descrivi come eseguire l'esercizio..."
            placeholderTextColor={Colors.textMuted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Note (Opzionale)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Suggerimenti o dettagli..."
            placeholderTextColor={Colors.textMuted}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <MaterialCommunityIcons name="content-save" size={24} color={Colors.text} style={styles.saveIcon} />
          <Text style={styles.saveBtnText}>Salva Esercizio</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  formGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: Colors.surface,
    color: Colors.text,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    fontSize: FontSizes.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    minHeight: 100,
  },
  scrollSelect: {
    paddingVertical: Spacing.xs,
  },
  chip: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipSelected: {
    backgroundColor: Colors.primary + '30',
    borderColor: Colors.primary,
  },
  chipText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
  },
  chipTextSelected: {
    color: Colors.primaryLight,
    fontWeight: 'bold',
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
  },
  saveIcon: {
    marginRight: Spacing.sm,
  },
  saveBtnText: {
    color: Colors.text,
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
  }
});
