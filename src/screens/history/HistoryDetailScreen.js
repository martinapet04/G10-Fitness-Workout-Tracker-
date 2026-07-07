import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useData } from '../../context/DataContext';
import Card from '../../components/Card';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { formatDateTime, formatDuration, getSessionTypeInfo } from '../../utils/helpers';
import { EFFORT_LEVELS } from '../../constants/data';

export default function HistoryDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { state, getWorkoutPlanById, getExerciseById, dispatch } = useData();
  
  const log = state.workoutLogs.find(l => l.id === id);

  if (!log) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Allenamento non trovato.</Text>
      </View>
    );
  }

  const plan = log.workoutPlanId ? getWorkoutPlanById(log.workoutPlanId) : null;
  const session = state.sessions.find(s => s.id === log.sessionId);
  const typeInfo = getSessionTypeInfo(session?.type || 'mixed');
  const effortInfo = EFFORT_LEVELS.find(l => l.value === log.perceivedEffort);

  const handleDelete = () => {
    Alert.alert(
      "Elimina Allenamento",
      "Sei sicuro di voler eliminare questo allenamento dallo storico?",
      [
        { text: "Annulla", style: "cancel" },
        { 
          text: "Elimina", 
          style: "destructive",
          onPress: () => {
            dispatch({ type: 'DELETE_WORKOUT_LOG', payload: id });
            navigation.goBack();
          }
        }
      ]
    );
  };

  let totalSets = 0;
  let totalReps = 0;
  let totalVolume = 0;

  log.exercises.forEach(ex => {
    ex.sets.forEach(set => {
      if (set.completed) {
        totalSets++;
        totalReps += set.reps;
        totalVolume += (set.reps * set.weight);
      }
    });
  });

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{plan ? plan.name : 'Sessione Libera'}</Text>
            <Text style={styles.subtitle}>{formatDateTime(log.date)}</Text>
          </View>
          <View style={[styles.typeBadge, { backgroundColor: typeInfo.color + '20' }]}>
            <MaterialCommunityIcons name={typeInfo.icon} size={24} color={typeInfo.color} />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <MaterialCommunityIcons name="timer-outline" size={24} color={Colors.primaryLight} />
            <Text style={styles.statValue}>{formatDuration(log.duration * 60)}</Text>
            <Text style={styles.statLabel}>Durata</Text>
          </View>
          <View style={styles.statBox}>
            <MaterialCommunityIcons name="weight-lifter" size={24} color={Colors.secondary} />
            <Text style={styles.statValue}>{totalVolume} kg</Text>
            <Text style={styles.statLabel}>Volume Totale</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.emojiText}>{effortInfo?.emoji || '😐'}</Text>
            <Text style={styles.statValue}>{log.perceivedEffort}/5</Text>
            <Text style={styles.statLabel}>Fatica</Text>
          </View>
        </View>

        {log.notes ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Note</Text>
            <Card style={styles.textCard}>
              <Text style={styles.description}>{log.notes}</Text>
            </Card>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dettaglio Esercizi</Text>
          
          {log.exercises.map((logEx, index) => {
            const exerciseDef = getExerciseById(logEx.exerciseId);
            if (!exerciseDef) return null;
            
            return (
              <Card key={`${logEx.exerciseId}-${index}`} style={styles.exerciseCard}>
                <Text style={styles.exerciseName}>{index + 1}. {exerciseDef.name}</Text>
                
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableCell, styles.tableCellHeader]}>Serie</Text>
                  <Text style={[styles.tableCell, styles.tableCellHeader]}>Reps</Text>
                  <Text style={[styles.tableCell, styles.tableCellHeader]}>Carico (kg)</Text>
                  <Text style={[styles.tableCell, styles.tableCellHeader, styles.cellSmall]}>Fatto</Text>
                </View>

                {logEx.sets.map((set, setIndex) => (
                  <View key={setIndex} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{setIndex + 1}</Text>
                    <Text style={styles.tableCell}>{set.reps}</Text>
                    <Text style={styles.tableCell}>{set.weight > 0 ? set.weight : '-'}</Text>
                    <View style={[styles.tableCell, styles.cellSmall]}>
                      <MaterialCommunityIcons 
                        name={set.completed ? "check-circle" : "close-circle"} 
                        size={20} 
                        color={set.completed ? Colors.success : Colors.danger} 
                      />
                    </View>
                  </View>
                ))}
              </Card>
            );
          })}
        </View>

        <TouchableOpacity 
          style={styles.btnDelete}
          onPress={handleDelete}
        >
          <MaterialCommunityIcons name="trash-can" size={20} color={Colors.danger} style={styles.btnIcon} />
          <Text style={styles.btnDeleteText}>Elimina Allenamento</Text>
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.danger,
    fontSize: FontSizes.md,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  titleContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  typeBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: Colors.text,
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    marginTop: Spacing.xs,
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    marginTop: 2,
  },
  emojiText: {
    fontSize: 20,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  description: {
    color: Colors.text,
    fontSize: FontSizes.md,
    lineHeight: 22,
  },
  textCard: {
    backgroundColor: Colors.surfaceLight,
  },
  exerciseCard: {
    marginBottom: Spacing.md,
    padding: Spacing.sm,
  },
  exerciseName: {
    color: Colors.text,
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tableHeader: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  tableCell: {
    flex: 1,
    color: Colors.text,
    fontSize: FontSizes.md,
    textAlign: 'center',
  },
  tableCellHeader: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  cellSmall: {
    flex: 0.5,
  },
  btnDelete: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.danger + '20',
    borderWidth: 1,
    borderColor: Colors.danger,
    marginTop: Spacing.lg,
  },
  btnIcon: {
    marginRight: Spacing.sm,
  },
  btnDeleteText: {
    color: Colors.danger,
    fontWeight: 'bold',
    fontSize: FontSizes.md,
  },
});
