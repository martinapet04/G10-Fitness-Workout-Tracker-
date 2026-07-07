import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import uuid from 'react-native-uuid';
import { useData } from '../../context/DataContext';
import RestTimer from '../../components/RestTimer';
import Card from '../../components/Card';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { EFFORT_LEVELS } from '../../constants/data';

export default function GuidedWorkoutScreen({ route, navigation }) {
  const { session } = route.params;
  const { getWorkoutPlanById, getExerciseById, dispatch } = useData();
  
  const plan = session.workoutPlanId ? getWorkoutPlanById(session.workoutPlanId) : null;
  const exercises = plan ? (plan.exercises || []).sort((a, b) => a.order - b.order) : [];

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  
  // State for the current input
  const [repsInput, setRepsInput] = useState('');
  const [weightInput, setWeightInput] = useState('');
  
  // Logged data: Array of objects { exerciseId, sets: [{ reps, weight, completed }] }
  const [workoutLog, setWorkoutLog] = useState([]);
  
  // Timer state
  const [showRestTimer, setShowRestTimer] = useState(false);
  
  // Workout timer
  const [startTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState(0);

  // Finish modal
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [effortLevel, setEffortLevel] = useState(3);
  const [workoutNotes, setWorkoutNotes] = useState('');

  // Initialize inputs when exercise/set changes
  useEffect(() => {
    if (exercises.length > 0 && currentExerciseIndex < exercises.length) {
      const currentEx = exercises[currentExerciseIndex];
      setRepsInput(currentEx.reps.toString().replace(/[^0-9]/g, '') || '10');
      setWeightInput(currentEx.weight?.toString() || '');
    }
  }, [currentExerciseIndex, currentSetIndex, exercises]);

  // Global timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((new Date() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  if (!plan || exercises.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Nessuna scheda o esercizi associati.</Text>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
            <Text style={styles.btnText}>Torna indietro</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const formatElapsedTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCompleteSet = () => {
    const currentEx = exercises[currentExerciseIndex];
    
    // Create copy of log
    const newLog = [...workoutLog];
    let exLogIndex = newLog.findIndex(l => l.exerciseId === currentEx.exerciseId);
    
    if (exLogIndex === -1) {
      newLog.push({
        exerciseId: currentEx.exerciseId,
        sets: [],
        restSeconds: currentEx.restSeconds,
      });
      exLogIndex = newLog.length - 1;
    }

    newLog[exLogIndex].sets.push({
      reps: parseInt(repsInput) || 0,
      weight: parseFloat(weightInput) || 0,
      completed: true,
    });
    
    setWorkoutLog(newLog);

    // Check if more sets for this exercise
    if (currentSetIndex + 1 < currentEx.sets) {
      // Show rest timer before next set
      setShowRestTimer(true);
    } else {
      // Move to next exercise or finish
      if (currentExerciseIndex + 1 < exercises.length) {
        setShowRestTimer(true); // Rest between exercises
      } else {
        // Workout complete!
        setShowFinishModal(true);
      }
    }
  };

  const handleRestComplete = () => {
    setShowRestTimer(false);
    
    const currentEx = exercises[currentExerciseIndex];
    if (currentSetIndex + 1 < currentEx.sets) {
      setCurrentSetIndex(currentSetIndex + 1);
    } else if (currentExerciseIndex + 1 < exercises.length) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSetIndex(0);
    }
  };

  const handleSkipExercise = () => {
    const doSkip = () => {
      if (currentExerciseIndex + 1 < exercises.length) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCurrentSetIndex(0);
        setShowRestTimer(false);
      } else {
        setShowFinishModal(true);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Vuoi saltare il resto di questo esercizio?")) {
        doSkip();
      }
      return;
    }

    Alert.alert(
      "Salta Esercizio",
      "Vuoi saltare il resto di questo esercizio?",
      [
        { text: "Annulla", style: "cancel" },
        { 
          text: "Salta", 
          onPress: doSkip
        }
      ]
    );
  };

  const handleFinishWorkout = () => {
    const durationMinutes = Math.floor(elapsedTime / 60) || 1;

    // Save to workout logs
    const logData = {
      id: uuid.v4(),
      date: new Date().toISOString(),
      sessionId: session.id,
      workoutPlanId: plan.id,
      duration: durationMinutes,
      exercises: workoutLog,
      perceivedEffort: effortLevel,
      notes: workoutNotes,
    };
    
    dispatch({ type: 'ADD_WORKOUT_LOG', payload: logData });

    // Update session status to completed
    const updatedSession = { ...session, status: 'completed' };
    dispatch({ type: 'UPDATE_SESSION', payload: updatedSession });

    setShowFinishModal(false);
    navigation.navigate('Home');
  };

  const currentPlanEx = exercises[currentExerciseIndex];
  const currentExDef = getExerciseById(currentPlanEx?.exerciseId);
  
  if (!currentPlanEx || !currentExDef) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          if (Platform.OS === 'web') {
            if (window.confirm("Vuoi uscire? I dati non salvati andranno persi.")) {
              navigation.goBack();
            }
            return;
          }

          Alert.alert("Interrompi", "Vuoi uscire? I dati non salvati andranno persi.", [
            { text: "Annulla", style: "cancel" },
            { text: "Esci", style: "destructive", onPress: () => navigation.goBack() }
          ]);
        }}>
          <MaterialCommunityIcons name="close" size={28} color={Colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.timerText}>{formatElapsedTime(elapsedTime)}</Text>
        </View>

        <TouchableOpacity onPress={() => setShowFinishModal(true)}>
          <Text style={styles.finishText}>Fine</Text>
        </TouchableOpacity>
      </View>

      {showRestTimer ? (
        <View style={styles.restContainer}>
          <Text style={styles.restTitle}>Recupero</Text>
          <Text style={styles.restSubtitle}>Preparati per la prossima serie</Text>
          
          <RestTimer 
            initialSeconds={currentPlanEx.restSeconds || 90} 
            onComplete={handleRestComplete} 
          />
          
          <TouchableOpacity style={styles.skipBtn} onPress={handleRestComplete}>
            <Text style={styles.skipBtnText}>Salta Recupero</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Progress indicators */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Esercizio {currentExerciseIndex + 1} di {exercises.length}
            </Text>
            <View style={styles.progressBarBg}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${((currentExerciseIndex) / exercises.length) * 100}%` }
                ]} 
              />
            </View>
          </View>

          {/* Current Exercise */}
          <View style={styles.exerciseHeader}>
            <Text style={styles.exerciseName}>{currentExDef.name}</Text>
            <TouchableOpacity style={styles.infoBtn} onPress={() => {
              Alert.alert("Istruzioni", currentExDef.description);
            }}>
              <MaterialCommunityIcons name="information-outline" size={24} color={Colors.primaryLight} />
            </TouchableOpacity>
          </View>

          <Text style={styles.targetText}>
            Obiettivo: {currentPlanEx.sets} serie x {currentPlanEx.reps} reps
          </Text>

          {/* Current Set Input */}
          <Card style={styles.inputCard}>
            <Text style={styles.setCurrentText}>Serie {currentSetIndex + 1} di {currentPlanEx.sets}</Text>
            
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Reps</Text>
                <TextInput
                  style={styles.input}
                  value={repsInput}
                  onChangeText={setRepsInput}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
              
              <Text style={styles.inputDivider}>X</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Kg</Text>
                <TextInput
                  style={styles.input}
                  value={weightInput}
                  onChangeText={setWeightInput}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.completeBtn} onPress={handleCompleteSet}>
              <MaterialCommunityIcons name="check" size={24} color={Colors.text} style={{marginRight: 8}} />
              <Text style={styles.completeBtnText}>Fatto</Text>
            </TouchableOpacity>
          </Card>

          <TouchableOpacity style={styles.skipExerciseBtn} onPress={handleSkipExercise}>
            <Text style={styles.skipExerciseText}>Salta questo esercizio</Text>
          </TouchableOpacity>

        </ScrollView>
      )}

      {/* Finish Workout Modal */}
      <Modal visible={showFinishModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.modalHeader}>
              <MaterialCommunityIcons name="trophy" size={64} color={Colors.warning} />
              <Text style={styles.modalTitle}>Allenamento Completato!</Text>
              <Text style={styles.modalSubtitle}>Ottimo lavoro. Rivedi i dettagli prima di salvare.</Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{formatElapsedTime(elapsedTime)}</Text>
                <Text style={styles.statLabel}>Durata</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{workoutLog.length}</Text>
                <Text style={styles.statLabel}>Esercizi svolti</Text>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Come ti sei sentito? (Livello di fatica)</Text>
              <View style={styles.effortContainer}>
                {EFFORT_LEVELS.map(level => (
                  <TouchableOpacity
                    key={level.value}
                    style={[
                      styles.effortBtn,
                      effortLevel === level.value && styles.effortBtnSelected
                    ]}
                    onPress={() => setEffortLevel(level.value)}
                  >
                    <Text style={styles.effortEmoji}>{level.emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.effortLabelText}>
                {EFFORT_LEVELS.find(l => l.value === effortLevel)?.label}
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Note sull'allenamento</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={workoutNotes}
                onChangeText={setWorkoutNotes}
                placeholder="Scrivi le tue impressioni..."
                placeholderTextColor={Colors.textMuted}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.btn, { backgroundColor: Colors.surfaceLight, marginRight: Spacing.sm }]} 
                onPress={() => setShowFinishModal(false)}
              >
                <Text style={styles.btnText}>Annulla</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.btn, { backgroundColor: Colors.success, marginLeft: Spacing.sm }]} 
                onPress={handleFinishWorkout}
              >
                <Text style={styles.btnText}>Salva Allenamento</Text>
              </TouchableOpacity>
            </View>
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.lg,
    marginBottom: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerCenter: {
    alignItems: 'center',
  },
  planName: {
    color: Colors.text,
    fontSize: FontSizes.md,
    fontWeight: 'bold',
  },
  timerText: {
    color: Colors.primaryLight,
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  finishText: {
    color: Colors.success,
    fontSize: FontSizes.md,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: Spacing.md,
  },
  progressContainer: {
    marginBottom: Spacing.lg,
  },
  progressText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    marginBottom: Spacing.xs,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.surface,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  exerciseName: {
    color: Colors.text,
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    flex: 1,
  },
  infoBtn: {
    padding: Spacing.xs,
  },
  targetText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    marginBottom: Spacing.xl,
  },
  inputCard: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  setCurrentText: {
    color: Colors.primaryLight,
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    marginBottom: Spacing.lg,
    textTransform: 'uppercase',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  inputGroup: {
    alignItems: 'center',
  },
  inputLabel: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    marginBottom: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.surfaceLight,
    color: Colors.text,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 100,
    height: 80,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputDivider: {
    color: Colors.textMuted,
    fontSize: 24,
    marginHorizontal: Spacing.lg,
    marginTop: 20,
  },
  completeBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.round,
  },
  completeBtnText: {
    color: Colors.text,
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
  },
  skipExerciseBtn: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
  skipExerciseText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
  },
  restContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  restTitle: {
    color: Colors.text,
    fontSize: FontSizes.xxxl,
    fontWeight: 'bold',
  },
  restSubtitle: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    marginBottom: Spacing.xl,
  },
  skipBtn: {
    marginTop: Spacing.xl,
    padding: Spacing.md,
  },
  skipBtnText: {
    color: Colors.primaryLight,
    fontSize: FontSizes.md,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalContent: {
    padding: Spacing.lg,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    marginTop: Spacing.xl,
  },
  modalTitle: {
    color: Colors.text,
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    marginTop: Spacing.md,
  },
  modalSubtitle: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    color: Colors.text,
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
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
  effortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  effortBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  effortBtnSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '20',
  },
  effortEmoji: {
    fontSize: 24,
  },
  effortLabelText: {
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.sm,
    fontWeight: 'bold',
  },
  textArea: {
    fontSize: FontSizes.md,
    width: '100%',
    height: 'auto',
    minHeight: 80,
    textAlign: 'left',
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: Spacing.lg,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
});
