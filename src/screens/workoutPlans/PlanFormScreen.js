import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import uuid from 'react-native-uuid';
import { useData } from '../../context/DataContext';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { DIFFICULTY_LEVELS, GOAL_CATEGORIES } from '../../constants/data';
import Card from '../../components/Card';

export default function PlanFormScreen({ route, navigation }) {
  const { item } = route.params || {};
  const { state, dispatch, getExerciseById } = useData();

  const [name, setName] = useState(item?.name || '');
  const [description, setDescription] = useState(item?.description || '');
  const [objective, setObjective] = useState(item?.objective || 'Ipertrofia');
  const [level, setLevel] = useState(item?.level || 'intermediate');
  const [estimatedDuration, setEstimatedDuration] = useState(item?.estimatedDuration?.toString() || '60');
  const [frequency, setFrequency] = useState(item?.frequency || '3x settimana');
  const [notes, setNotes] = useState(item?.notes || '');
  
  const [exercises, setExercises] = useState(item?.exercises || []);
  
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);
  const [exerciseSets, setExerciseSets] = useState('3');
  const [exerciseReps, setExerciseReps] = useState('10');
  const [exerciseRest, setExerciseRest] = useState('90');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Errore', 'Il nome della scheda è obbligatorio.');
      return;
    }

    const planData = {
      id: item?.id || uuid.v4(),
      name: name.trim(),
      description: description.trim(),
      objective,
      level,
      estimatedDuration: parseInt(estimatedDuration) || 60,
      frequency: frequency.trim(),
      exercises: exercises.map((e, idx) => ({ ...e, order: idx + 1 })),
      notes: notes.trim(),
    };

    if (item) {
      dispatch({ type: 'UPDATE_WORKOUT_PLAN', payload: planData });
    } else {
      dispatch({ type: 'ADD_WORKOUT_PLAN', payload: planData });
    }

    navigation.goBack();
  };

  const handleAddExercise = () => {
    if (!selectedExerciseId) {
      Alert.alert('Errore', 'Seleziona un esercizio.');
      return;
    }

    const newEx = {
      exerciseId: selectedExerciseId,
      sets: parseInt(exerciseSets) || 3,
      reps: exerciseReps,
      restSeconds: parseInt(exerciseRest) || 90,
      weight: '',
      notes: ''
    };

    setExercises([...exercises, newEx]);
    setShowExerciseModal(false);
    setSelectedExerciseId(null);
  };

  const handleRemoveExercise = (index) => {
    const newExs = [...exercises];
    newExs.splice(index, 1);
    setExercises(newExs);
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
          <Text style={styles.label}>Nome Scheda *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="es. Full Body A"
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        {renderSelectGroup('Obiettivo', GOAL_CATEGORIES, objective, setObjective)}
        {renderSelectGroup('Livello', DIFFICULTY_LEVELS, level, setLevel, true)}

        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1, marginRight: Spacing.sm }]}>
            <Text style={styles.label}>Durata (min)</Text>
            <TextInput
              style={styles.input}
              value={estimatedDuration}
              onChangeText={setEstimatedDuration}
              keyboardType="numeric"
              placeholder="es. 60"
              placeholderTextColor={Colors.textMuted}
            />
          </View>
          <View style={[styles.formGroup, { flex: 1, marginLeft: Spacing.sm }]}>
            <Text style={styles.label}>Frequenza</Text>
            <TextInput
              style={styles.input}
              value={frequency}
              onChangeText={setFrequency}
              placeholder="es. 3x settimana"
              placeholderTextColor={Colors.textMuted}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Descrizione</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Descrizione della scheda..."
            placeholderTextColor={Colors.textMuted}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Esercizi ({exercises.length})</Text>
            <TouchableOpacity onPress={() => setShowExerciseModal(true)}>
              <Text style={styles.linkText}>+ Aggiungi</Text>
            </TouchableOpacity>
          </View>

          {exercises.map((ex, index) => {
            const exerciseDef = getExerciseById(ex.exerciseId);
            if (!exerciseDef) return null;
            return (
              <Card key={index} style={styles.exerciseCard}>
                <View style={styles.exCardHeader}>
                  <Text style={styles.exName}>{index + 1}. {exerciseDef.name}</Text>
                  <TouchableOpacity onPress={() => handleRemoveExercise(index)}>
                    <MaterialCommunityIcons name="close" size={20} color={Colors.textMuted} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.exDetails}>
                  {ex.sets} serie x {ex.reps} reps | Recupero: {ex.restSeconds}s
                </Text>
              </Card>
            );
          })}
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <MaterialCommunityIcons name="content-save" size={24} color={Colors.text} style={styles.saveIcon} />
          <Text style={styles.saveBtnText}>Salva Scheda</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Modal Add Exercise */}
      <Modal visible={showExerciseModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Aggiungi Esercizio</Text>
            <TouchableOpacity onPress={() => setShowExerciseModal(false)}>
              <MaterialCommunityIcons name="close" size={28} color={Colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.label}>Seleziona Esercizio</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 20}}>
              {state.exercises.map(ex => (
                <TouchableOpacity
                  key={ex.id}
                  style={[styles.chip, selectedExerciseId === ex.id && styles.chipSelected]}
                  onPress={() => setSelectedExerciseId(ex.id)}
                >
                  <Text style={[styles.chipText, selectedExerciseId === ex.id && styles.chipTextSelected]}>{ex.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.row}>
              <View style={[styles.formGroup, { flex: 1, marginRight: Spacing.xs }]}>
                <Text style={styles.label}>Serie</Text>
                <TextInput style={styles.input} value={exerciseSets} onChangeText={setExerciseSets} keyboardType="numeric" />
              </View>
              <View style={[styles.formGroup, { flex: 1, marginHorizontal: Spacing.xs }]}>
                <Text style={styles.label}>Ripetizioni</Text>
                <TextInput style={styles.input} value={exerciseReps} onChangeText={setExerciseReps} />
              </View>
              <View style={[styles.formGroup, { flex: 1, marginLeft: Spacing.xs }]}>
                <Text style={styles.label}>Recupero (s)</Text>
                <TextInput style={styles.input} value={exerciseRest} onChangeText={setExerciseRest} keyboardType="numeric" />
              </View>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleAddExercise}>
              <Text style={styles.saveBtnText}>Aggiungi alla Scheda</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  row: {
    flexDirection: 'row',
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
    minHeight: 80,
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
  section: {
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
  },
  linkText: {
    color: Colors.primaryLight,
    fontWeight: 'bold',
    fontSize: FontSizes.md,
  },
  exerciseCard: {
    marginBottom: Spacing.sm,
    padding: Spacing.sm,
  },
  exCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exName: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: FontSizes.md,
  },
  exDetails: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    marginTop: 4,
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
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    color: Colors.text,
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
  },
  modalContent: {
    padding: Spacing.md,
  }
});
