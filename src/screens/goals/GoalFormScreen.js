import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import uuid from 'react-native-uuid';
import { useData } from '../../context/DataContext';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { GOAL_CATEGORIES } from '../../constants/data';
import { getToday } from '../../utils/helpers';

export default function GoalFormScreen({ route, navigation }) {
  const { item } = route.params || {};
  const { dispatch } = useData();

  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [category, setCategory] = useState(item?.category || GOAL_CATEGORIES[0]);
  const [targetValue, setTargetValue] = useState(item?.targetValue?.toString() || '');
  const [currentValue, setCurrentValue] = useState(item?.currentValue?.toString() || '0');
  const [unit, setUnit] = useState(item?.unit || 'kg');
  const [deadline, setDeadline] = useState(item?.deadline || '');
  
  const status = item?.status || 'in_progress';

  const handleSave = () => {
    if (!title.trim() || !targetValue.trim() || !unit.trim()) {
      Alert.alert('Errore', 'Titolo, Valore Obiettivo e Unità di misura sono obbligatori.');
      return;
    }

    const tVal = parseFloat(targetValue);
    const cVal = parseFloat(currentValue);

    if (isNaN(tVal) || isNaN(cVal)) {
      Alert.alert('Errore', 'I valori target e attuale devono essere numerici.');
      return;
    }

    const goalData = {
      id: item?.id || uuid.v4(),
      title: title.trim(),
      description: description.trim(),
      category,
      targetValue: tVal,
      currentValue: cVal,
      unit: unit.trim(),
      startDate: item?.startDate || getToday(),
      deadline: deadline.trim() || null,
      status: (cVal >= tVal && status === 'in_progress') ? 'completed' : status,
    };

    if (item) {
      dispatch({ type: 'UPDATE_GOAL', payload: goalData });
    } else {
      dispatch({ type: 'ADD_GOAL', payload: goalData });
    }

    navigation.goBack();
  };

  const renderSelectGroup = (label, options, selectedValue, onSelect) => (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollSelect}>
        {options.map((opt) => {
          const isSelected = selectedValue === opt;
          return (
            <TouchableOpacity
              key={opt}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onSelect(opt)}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{opt}</Text>
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
          <Text style={styles.label}>Titolo Obiettivo *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="es. Sollevare 100kg in Panca"
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        {renderSelectGroup('Categoria', GOAL_CATEGORIES, category, setCategory)}

        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1, marginRight: Spacing.xs }]}>
            <Text style={styles.label}>Valore Attuale</Text>
            <TextInput
              style={styles.input}
              value={currentValue}
              onChangeText={setCurrentValue}
              keyboardType="numeric"
              placeholder="es. 80"
              placeholderTextColor={Colors.textMuted}
            />
          </View>
          
          <View style={[styles.formGroup, { flex: 1, marginHorizontal: Spacing.xs }]}>
            <Text style={styles.label}>Target *</Text>
            <TextInput
              style={styles.input}
              value={targetValue}
              onChangeText={setTargetValue}
              keyboardType="numeric"
              placeholder="es. 100"
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          <View style={[styles.formGroup, { flex: 1, marginLeft: Spacing.xs }]}>
            <Text style={styles.label}>Unità *</Text>
            <TextInput
              style={styles.input}
              value={unit}
              onChangeText={setUnit}
              placeholder="es. kg"
              placeholderTextColor={Colors.textMuted}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Scadenza (Opzionale) YYYY-MM-DD</Text>
          <TextInput
            style={styles.input}
            value={deadline}
            onChangeText={setDeadline}
            placeholder="es. 2026-12-31"
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Descrizione (Opzionale)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Dettagli e motivazioni..."
            placeholderTextColor={Colors.textMuted}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <MaterialCommunityIcons name="content-save" size={24} color={Colors.text} style={styles.saveIcon} />
          <Text style={styles.saveBtnText}>Salva Obiettivo</Text>
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
