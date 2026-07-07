import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useData } from '../../context/DataContext';
import Card from '../../components/Card';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { calculateWorkoutStats } from '../../utils/helpers';

export default function StatsScreen() {
  const { state } = useData();
  
  const stats = calculateWorkoutStats(state.workoutLogs);

  // Group workouts by day of week
  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
  const workoutCountsByDay = Array(7).fill(0);
  
  state.workoutLogs.forEach(log => {
    const day = new Date(log.date).getDay();
    workoutCountsByDay[day]++;
  });

  const maxCount = Math.max(...workoutCountsByDay, 1);

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Le Tue Statistiche</Text>
          <Text style={styles.subtitle}>Un riepilogo del tuo percorso fitness.</Text>
        </View>

        <View style={styles.statsGrid}>
          <Card style={styles.statBox}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="weight-lifter" size={28} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>{stats.totalWorkouts}</Text>
            <Text style={styles.statLabel}>Allenamenti Totali</Text>
          </Card>
          
          <Card style={styles.statBox}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="timer-sand" size={28} color={Colors.secondary} />
            </View>
            <Text style={styles.statValue}>{Math.round(stats.totalDurationMinutes / 60)}h {stats.totalDurationMinutes % 60}m</Text>
            <Text style={styles.statLabel}>Tempo Totale</Text>
          </Card>
          
          <Card style={styles.statBox}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="weight" size={28} color={Colors.accent} />
            </View>
            <Text style={styles.statValue}>{stats.totalVolume} kg</Text>
            <Text style={styles.statLabel}>Volume Sollevato</Text>
          </Card>
          
          <Card style={styles.statBox}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="dumbbell" size={28} color={Colors.warning} />
            </View>
            <Text style={styles.statValue}>{stats.totalSets}</Text>
            <Text style={styles.statLabel}>Serie Completate</Text>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequenza Settimanale</Text>
          <Card style={styles.chartCard}>
            <View style={styles.chartContainer}>
              {workoutCountsByDay.map((count, index) => {
                // Adjust index so Monday is first
                const displayIndex = (index + 6) % 7; 
                const height = (count / maxCount) * 100;
                
                return (
                  <View key={index} style={styles.barCol}>
                    <Text style={styles.barValue}>{count}</Text>
                    <View style={styles.barBg}>
                      <View style={[styles.barFill, { height: `${height}%` }]} />
                    </View>
                    <Text style={styles.barLabel}>{daysOfWeek[index]}</Text>
                  </View>
                );
              })}
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Obiettivi</Text>
          <Card style={styles.goalsCard}>
            <View style={styles.goalStatRow}>
              <View style={styles.goalStatCol}>
                <Text style={styles.goalStatValue}>{state.goals.filter(g => g.status === 'completed').length}</Text>
                <Text style={styles.goalStatLabel}>Raggiunti</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.goalStatCol}>
                <Text style={styles.goalStatValue}>{state.goals.filter(g => g.status === 'in_progress').length}</Text>
                <Text style={styles.goalStatLabel}>In Corso</Text>
              </View>
            </View>
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
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  header: {
    marginBottom: Spacing.xl,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  statBox: {
    width: '48%',
    alignItems: 'center',
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: {
    color: Colors.text,
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    textAlign: 'center',
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
  chartCard: {
    padding: Spacing.lg,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 150,
    alignItems: 'flex-end',
  },
  barCol: {
    alignItems: 'center',
    width: 30,
  },
  barValue: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    marginBottom: 4,
  },
  barBg: {
    height: 100,
    width: 20,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.round,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 8,
  },
  barFill: {
    backgroundColor: Colors.primary,
    width: '100%',
    borderRadius: BorderRadius.round,
  },
  barLabel: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
  },
  goalsCard: {
    padding: Spacing.lg,
  },
  goalStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  goalStatCol: {
    alignItems: 'center',
  },
  goalStatValue: {
    color: Colors.text,
    fontSize: 36,
    fontWeight: 'bold',
  },
  goalStatLabel: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    textTransform: 'uppercase',
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: Colors.border,
  }
});
