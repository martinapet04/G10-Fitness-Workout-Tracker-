import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useData } from '../../context/DataContext';
import Card from '../../components/Card';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { getToday, getSessionTypeInfo } from '../../utils/helpers';

export default function HomeScreen({ navigation }) {
  const { state, loading, getWorkoutPlanById } = useData();

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const today = getToday();
  const todaysSessions = state.sessions.filter(s => s.date === today);
  const activeGoals = state.goals.filter(g => g.status === 'in_progress');
  const recentLogs = [...state.workoutLogs].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header Greeting */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Bentornato! 👋</Text>
          <Text style={styles.subtitle}>Ecco il tuo riepilogo di oggi.</Text>
        </View>

        {/* Today's Sessions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sessioni di Oggi</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Piano', { screen: 'SessionCalendar' })}>
              <Text style={styles.linkText}>Vedi tutte</Text>
            </TouchableOpacity>
          </View>
          
          {todaysSessions.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>Nessuna sessione pianificata per oggi.</Text>
              <TouchableOpacity 
                style={styles.actionBtn}
                onPress={() => navigation.navigate('Piano', { screen: 'SessionForm' })}
              >
                <Text style={styles.actionBtnText}>Pianifica ora</Text>
              </TouchableOpacity>
            </Card>
          ) : (
            todaysSessions.map(session => {
              const plan = session.workoutPlanId ? getWorkoutPlanById(session.workoutPlanId) : null;
              const typeInfo = getSessionTypeInfo(session.type);
              
              return (
                <Card 
                  key={session.id} 
                  style={[styles.sessionCard, { borderLeftColor: typeInfo.color, borderLeftWidth: 4 }]}
                  onPress={() => navigation.navigate('Piano', { screen: 'GuidedWorkout', params: { session } })}
                >
                  <View style={styles.sessionHeader}>
                    <MaterialCommunityIcons name={typeInfo.icon} size={24} color={typeInfo.color} />
                    <View style={styles.sessionInfo}>
                      <Text style={styles.sessionPlanName}>{plan ? plan.name : 'Sessione Libera'}</Text>
                      <Text style={styles.sessionType}>{typeInfo.label}</Text>
                    </View>
                    <View style={styles.playBtn}>
                      <MaterialCommunityIcons name="play" size={24} color={Colors.surface} />
                    </View>
                  </View>
                </Card>
              );
            })
          )}
        </View>

        {/* Active Goals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Obiettivi in Corso</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Altro', { screen: 'GoalList' })}>
              <Text style={styles.linkText}>Vedi tutti</Text>
            </TouchableOpacity>
          </View>

          {activeGoals.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>Non hai obiettivi attivi.</Text>
            </Card>
          ) : (
            activeGoals.slice(0, 2).map(goal => {
              const progress = goal.targetValue > 0 ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100)) : 0;
              return (
                <Card key={goal.id} onPress={() => navigation.navigate('Altro', { screen: 'GoalDetail', params: { item: goal } })}>
                  <View style={styles.goalHeader}>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <Text style={styles.goalProgressText}>{progress}%</Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                  </View>
                  <Text style={styles.goalValues}>{goal.currentValue} / {goal.targetValue} {goal.unit}</Text>
                </Card>
              );
            })
          )}
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <Card style={styles.statBox}>
            <MaterialCommunityIcons name="dumbbell" size={28} color={Colors.primaryLight} />
            <Text style={styles.statValue}>{state.workoutLogs.length}</Text>
            <Text style={styles.statLabel}>Workout</Text>
          </Card>
          <Card style={styles.statBox}>
            <MaterialCommunityIcons name="clipboard-list" size={28} color={Colors.secondary} />
            <Text style={styles.statValue}>{state.workoutPlans.length}</Text>
            <Text style={styles.statLabel}>Schede</Text>
          </Card>
        </View>
        
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
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 100,
  },
  header: {
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  greeting: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text,
  },
  linkText: {
    color: Colors.primaryLight,
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
  },
  emptyCard: {
    alignItems: 'center',
    padding: Spacing.lg,
  },
  emptyText: {
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  actionBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
  },
  actionBtnText: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  sessionCard: {
    padding: Spacing.md,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  sessionPlanName: {
    color: Colors.text,
    fontSize: FontSizes.md,
    fontWeight: 'bold',
  },
  sessionType: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  playBtn: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  goalTitle: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: FontSizes.md,
  },
  goalProgressText: {
    color: Colors.primaryLight,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 4,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  goalValues: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    textAlign: 'right',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    marginHorizontal: Spacing.xs,
    alignItems: 'center',
    padding: Spacing.lg,
  },
  statValue: {
    color: Colors.text,
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    marginTop: Spacing.sm,
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
  },
});
