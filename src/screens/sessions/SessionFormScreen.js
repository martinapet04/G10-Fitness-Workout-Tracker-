import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import uuid from 'react-native-uuid';
import { useData } from '../../context/DataContext';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { SESSION_TYPES } from '../../constants/data';
import { getToday } from '../../utils/helpers';

export default function SessionFormScreen({ route, navigation }) {
  const { item, selectedDate, prefillPlanId } = route.params || {};
  const { state, dispatch } = useData();

  const [date, setDate] = useState(item?.date || selectedDate || getToday());
  const [type, setType] = useState(item?.type || 'strength');
  const [workoutPlanId, setWorkoutPlanId] = useState(item?.workoutPlanId || prefillPlanId || null);

  const handleSave = () => {
    if (!date) {
      Alert.alert('Errore', 'La data è obbligatoria.');
      return;
    }

    const sessionData = {
      id: item?.id || uuid.v4(),
      date,
      type,
      workoutPlanId,
      status: item?.status || 'pending',
      notes: item?.notes || '',
    };

    if (item) {
      dispatch({ type: 'UPDATE_SESSION', payload: sessionData });
    } else {
      dispatch({ type: 'ADD_SESSION', payload: sessionData });
    }

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Data (YYYY-MM-DD) *</Text>
          <View style={styles.dateInputContainer}>
            <MaterialCommunityIcons name="calendar" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <Text style={styles.dateText}>{date}</Text>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Tipo Sessione</Text>
          <View style={styles.typeGrid}>
            {SESSION_TYPES.map(t => {
              const isSelected = type === t.value;
              return (
                <TouchableOpacity 
                  key={t.value} 
                  style={[styles.typeCard, isSelected && { borderColor: t.color, backgroundColor: t.color + '20' }]}
                  onPress={() => setType(t.value)}
                >
                  <MaterialCommunityIcons name={t.icon} size={28} color={isSelected ? t.color : Colors.textSecondary} />
                  <Text style={[styles.typeText, isSelected && { color: t.color }]}>{t.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Scheda Associata</Text>
          {state.workoutPlans.length === 0 ? (
            <Text style={styles.emptyText}>Non hai creato nessuna scheda.</Text>
          ) : (
            <View>
              <TouchableOpacity 
                style={[styles.planCard, workoutPlanId === null && styles.planCardSelected]}
                onPress={() => setWorkoutPlanId(null)}
              >
                <MaterialCommunityIcons 
                  name={workoutPlanId === null ? "radiobox-marked" : "radiobox-blank"} 
                  size={24} 
                  color={workoutPlanId === null ? Colors.primary : Colors.textSecondary} 
                />
                <Text style={styles.planText}>Sessione Libera (Nessuna scheda)</Text>
              </TouchableOpacity>
              
              {state.workoutPlans.map(plan => (
                <TouchableOpacity 
                  key={plan.id}
                  style={[styles.planCard, workoutPlanId === plan.id && styles.planCardSelected]}
                  onPress={() => setWorkoutPlanId(plan.id)}
                >
                  <MaterialCommunityIcons 
                    name={workoutPlanId === plan.id ? "radiobox-marked" : "radiobox-blank"} 
                    size={24} 
                    color={workoutPlanId === plan.id ? Colors.primary : Colors.textSecondary} 
                  />
                  <View style={{marginLeft: Spacing.sm}}>
                    <Text style={styles.planText}>{plan.name}</Text>
                    {plan.objective && <Text style={styles.planSub}>{plan.objective}</Text>}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <MaterialCommunityIcons name="content-save" size={24} color={Colors.text} style={styles.saveIcon} />
          <Text style={styles.saveBtnText}>Salva Sessione</Text>
        </TouchableOpacity>

        {item && item.status === 'pending' && (
          <TouchableOpacity 
            style={styles.startBtn} 
            onPress={() => {
              handleSave();
              navigation.navigate('GuidedWorkout', { session: item });
            }}
          >
            <MaterialCommunityIcons name="play" size={24} color={Colors.text} style={styles.saveIcon} />
            <Text style={styles.saveBtnText}>Salva e Inizia Allenamento</Text>
          </TouchableOpacity>
        )}

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
    marginBottom: Spacing.xl,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  dateText: {
    color: Colors.text,
    fontSize: FontSizes.md,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  typeCard: {
    width: '31%',
    margin: '1%',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  planCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  planText: {
    color: Colors.text,
    fontSize: FontSizes.md,
    fontWeight: 'bold',
  },
  planSub: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    marginTop: 2,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  startBtn: {
    backgroundColor: Colors.success,
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
