import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useData } from '../../context/DataContext';
import Card from '../../components/Card';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { getDifficultyColor, getDifficultyLabel } from '../../constants/data';
import { formatDuration } from '../../utils/helpers';

export default function PlanDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { state, getWorkoutPlanById, getExerciseById, dispatch } = useData();
  
  const plan = getWorkoutPlanById(id);

  if (!plan) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Scheda non trovata.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Elimina Scheda",
      "Sei sicuro di voler eliminare questa scheda di allenamento?",
      [
        { text: "Annulla", style: "cancel" },
        { 
          text: "Elimina", 
          style: "destructive",
          onPress: () => {
            dispatch({ type: 'DELETE_WORKOUT_PLAN', payload: id });
            navigation.goBack();
          }
        }
      ]
    );
  };

  const planExercises = (plan.exercises || []).sort((a, b) => a.order - b.order);

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{plan.name}</Text>
            {plan.objective && (
              <Text style={styles.subtitle}>{plan.objective}</Text>
            )}
          </View>
          <View style={[styles.badge, { backgroundColor: getDifficultyColor(plan.level) + '30' }]}>
            <Text style={[styles.badgeText, { color: getDifficultyColor(plan.level) }]}>
              {getDifficultyLabel(plan.level)}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <MaterialCommunityIcons name="timer-outline" size={24} color={Colors.primaryLight} />
            <Text style={styles.statValue}>{formatDuration(plan.estimatedDuration)}</Text>
            <Text style={styles.statLabel}>Durata</Text>
          </View>
          <View style={styles.statBox}>
            <MaterialCommunityIcons name="calendar-sync" size={24} color={Colors.secondary} />
            <Text style={styles.statValue}>{plan.frequency || 'N/D'}</Text>
            <Text style={styles.statLabel}>Frequenza</Text>
          </View>
          <View style={styles.statBox}>
            <MaterialCommunityIcons name="dumbbell" size={24} color={Colors.accent} />
            <Text style={styles.statValue}>{planExercises.length}</Text>
            <Text style={styles.statLabel}>Esercizi</Text>
          </View>
        </View>

        {plan.description ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descrizione</Text>
            <Text style={styles.description}>{plan.description}</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Esercizi</Text>
          
          {planExercises.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>Nessun esercizio aggiunto a questa scheda.</Text>
            </Card>
          ) : (
            planExercises.map((planEx, index) => {
              const exercise = getExerciseById(planEx.exerciseId);
              if (!exercise) return null;
              
              return (
                <Card key={`${planEx.exerciseId}-${index}`} style={styles.exerciseCard}>
                  <View style={styles.exerciseHeader}>
                    <View style={styles.orderBadge}>
                      <Text style={styles.orderText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                  </View>
                  
                  <View style={styles.exerciseDetails}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Serie</Text>
                      <Text style={styles.detailValue}>{planEx.sets}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Reps</Text>
                      <Text style={styles.detailValue}>{planEx.reps}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Carico</Text>
                      <Text style={styles.detailValue}>{planEx.weight ? `${planEx.weight}kg` : '-'}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Recupero</Text>
                      <Text style={styles.detailValue}>{planEx.restSeconds}s</Text>
                    </View>
                  </View>
                  
                  {planEx.notes ? (
                    <Text style={styles.exerciseNotes}>Note: {planEx.notes}</Text>
                  ) : null}
                </Card>
              );
            })
          )}
        </View>

        {plan.notes ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Note Generali</Text>
            <Card style={styles.textCard}>
              <Text style={styles.description}>{plan.notes}</Text>
            </Card>
          </View>
        ) : null}

        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.btn, styles.btnEdit]}
            onPress={() => navigation.navigate('PlanForm', { item: plan })}
          >
            <MaterialCommunityIcons name="pencil" size={20} color={Colors.text} style={styles.btnIcon} />
            <Text style={styles.btnText}>Modifica</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.btn, styles.btnDelete]}
            onPress={handleDelete}
          >
            <MaterialCommunityIcons name="trash-can" size={20} color={Colors.text} style={styles.btnIcon} />
            <Text style={styles.btnText}>Elimina</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.startWorkoutBtn}
          onPress={() => {
            // Seleziona la data di oggi e crea una sessione "al volo" oppure apri il form per pianificare
            navigation.navigate('Piano', { 
              screen: 'SessionForm', 
              params: { prefillPlanId: plan.id } 
            });
          }}
        >
          <MaterialCommunityIcons name="calendar-plus" size={24} color={Colors.text} style={styles.btnIcon} />
          <Text style={styles.startWorkoutText}>Pianifica Sessione</Text>
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
    color: Colors.primaryLight,
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
    marginTop: 4,
  },
  badgeText: {
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
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
  emptyCard: {
    alignItems: 'center',
    padding: Spacing.lg,
  },
  emptyText: {
    color: Colors.textSecondary,
  },
  exerciseCard: {
    marginBottom: Spacing.sm,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: Spacing.sm,
  },
  orderBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  orderText: {
    color: Colors.text,
    fontSize: FontSizes.xs,
    fontWeight: 'bold',
  },
  exerciseName: {
    color: Colors.text,
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    flex: 1,
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    marginBottom: 2,
  },
  detailValue: {
    color: Colors.text,
    fontSize: FontSizes.md,
    fontWeight: 'bold',
  },
  exerciseNotes: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    fontStyle: 'italic',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceLight,
  },
  textCard: {
    backgroundColor: Colors.surfaceLight,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  btnEdit: {
    backgroundColor: Colors.surfaceLight,
    marginRight: Spacing.sm,
  },
  btnDelete: {
    backgroundColor: Colors.danger + '30',
    borderWidth: 1,
    borderColor: Colors.danger,
    marginLeft: Spacing.sm,
  },
  btnIcon: {
    marginRight: Spacing.sm,
  },
  btnText: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: FontSizes.md,
  },
  startWorkoutBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  startWorkoutText: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: FontSizes.lg,
  }
});
