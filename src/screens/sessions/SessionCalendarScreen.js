import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useData } from '../../context/DataContext';
import Card from '../../components/Card';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { getWeekDates, getShortDayName, getSessionTypeInfo, isSameDay } from '../../utils/helpers';

export default function SessionCalendarScreen({ navigation }) {
  const { state, getWorkoutPlanById } = useData();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);

  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  
  const dailySessions = state.sessions.filter(s => s.date === selectedDateStr);

  const prevWeek = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 7);
    setSelectedDate(d);
  };

  const nextWeek = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 7);
    setSelectedDate(d);
  };

  const getStatusColor = (status) => {
    if (status === 'completed') return Colors.success;
    if (status === 'skipped') return Colors.danger;
    return Colors.warning;
  };

  const getStatusIcon = (status) => {
    if (status === 'completed') return 'check-circle';
    if (status === 'skipped') return 'close-circle';
    return 'clock-outline';
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      
      {/* Calendar Header */}
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={prevWeek} style={styles.navBtn}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.text} />
        </TouchableOpacity>
        
        <Text style={styles.monthText}>
          {selectedDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
        </Text>
        
        <TouchableOpacity onPress={nextWeek} style={styles.navBtn}>
          <MaterialCommunityIcons name="chevron-right" size={28} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Week Days Selector */}
      <View style={styles.weekContainer}>
        {weekDates.map((date, index) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, new Date());
          const hasSession = state.sessions.some(s => s.date === date.toISOString().split('T')[0]);
          
          return (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.dayCol, 
                isSelected && styles.dayColSelected,
                isToday && !isSelected && styles.dayColToday
              ]}
              onPress={() => setSelectedDate(date)}
            >
              <Text style={[styles.dayName, isSelected && styles.textSelected]}>
                {getShortDayName(date.getDay())}
              </Text>
              <Text style={[styles.dayNumber, isSelected && styles.textSelected]}>
                {date.getDate()}
              </Text>
              {hasSession && (
                <View style={[styles.dot, isSelected && { backgroundColor: Colors.text }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Sessioni {isSameDay(selectedDate, new Date()) ? 'di Oggi' : `del ${selectedDate.getDate()}`}
          </Text>
        </View>

        {dailySessions.length === 0 ? (
          <Card style={styles.emptyCard}>
            <MaterialCommunityIcons name="calendar-blank" size={48} color={Colors.textMuted} style={{marginBottom: 10}} />
            <Text style={styles.emptyText}>Nessuna sessione pianificata.</Text>
          </Card>
        ) : (
          dailySessions.map(session => {
            const plan = session.workoutPlanId ? getWorkoutPlanById(session.workoutPlanId) : null;
            const typeInfo = getSessionTypeInfo(session.type);
            const statusColor = getStatusColor(session.status);
            
            return (
              <Card 
                key={session.id} 
                style={[styles.sessionCard, { borderLeftColor: typeInfo.color, borderLeftWidth: 4 }]}
              >
                <View style={styles.sessionHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: typeInfo.color + '20' }]}>
                    <MaterialCommunityIcons name={typeInfo.icon} size={24} color={typeInfo.color} />
                  </View>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionPlanName}>{plan ? plan.name : 'Sessione Libera'}</Text>
                    <Text style={styles.sessionType}>{typeInfo.label}</Text>
                  </View>
                  
                  <View style={styles.statusContainer}>
                    <MaterialCommunityIcons name={getStatusIcon(session.status)} size={20} color={statusColor} />
                  </View>
                </View>

                {session.status === 'pending' && (
                  <View style={styles.actionRow}>
                    <TouchableOpacity 
                      style={[styles.actionBtn, styles.btnEdit]}
                      onPress={() => navigation.navigate('SessionForm', { item: session })}
                    >
                      <Text style={styles.btnText}>Modifica</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.actionBtn, styles.btnStart]}
                      onPress={() => navigation.navigate('GuidedWorkout', { session })}
                    >
                      <MaterialCommunityIcons name="play" size={16} color={Colors.text} style={{marginRight: 4}} />
                      <Text style={styles.btnText}>Inizia</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Card>
            );
          })
        )}
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('SessionForm', { selectedDate: selectedDateStr })}
      >
        <MaterialCommunityIcons name="plus" size={30} color={Colors.text} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
  },
  navBtn: {
    padding: Spacing.xs,
  },
  monthText: {
    color: Colors.text,
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.surface,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dayCol: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    width: 45,
    height: 65,
    borderRadius: BorderRadius.md,
  },
  dayColSelected: {
    backgroundColor: Colors.primary,
  },
  dayColToday: {
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  dayName: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    marginBottom: 4,
  },
  dayNumber: {
    color: Colors.text,
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
  },
  textSelected: {
    color: Colors.text,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginTop: 4,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 100,
  },
  sectionHeader: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
  },
  emptyCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
  },
  sessionCard: {
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
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
  statusContainer: {
    padding: Spacing.xs,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  btnEdit: {
    backgroundColor: Colors.surfaceLight,
  },
  btnStart: {
    backgroundColor: Colors.primary,
  },
  btnText: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: FontSizes.sm,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
