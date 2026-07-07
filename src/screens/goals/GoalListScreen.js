import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useData } from '../../context/DataContext';
import FilterBar from '../../components/FilterBar';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { GOAL_STATUSES, getGoalStatusInfo, calculateGoalProgress } from '../../utils/helpers';
import { formatDate } from '../../utils/helpers';

export default function GoalListScreen({ navigation }) {
  const { state } = useData();
  const [selectedStatus, setSelectedStatus] = useState('Tutti');

  const statusFilters = [
    { label: 'Tutti', value: 'Tutti' },
    { label: 'In Corso', value: 'in_progress' },
    { label: 'Raggiunti', value: 'completed' },
  ];

  const filteredGoals = useMemo(() => {
    return state.goals.filter(goal => {
      if (selectedStatus === 'Tutti') return true;
      return goal.status === selectedStatus;
    }).sort((a, b) => new Date(a.deadline || a.startDate) - new Date(b.deadline || b.startDate));
  }, [state.goals, selectedStatus]);

  const renderItem = ({ item }) => {
    const statusInfo = getGoalStatusInfo(item.status);
    const progress = calculateGoalProgress(item);

    return (
      <Card 
        style={styles.card} 
        onPress={() => navigation.navigate('GoalDetail', { item })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.goalTitle}>{item.title}</Text>
          <View style={[styles.badge, { backgroundColor: statusInfo.color + '20' }]}>
            <Text style={[styles.badgeText, { color: statusInfo.color }]}>
              {statusInfo.label}
            </Text>
          </View>
        </View>
        
        <Text style={styles.categoryText}>{item.category}</Text>
        
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>Progresso</Text>
            <Text style={styles.progressValue}>{progress}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: statusInfo.color }]} />
          </View>
          <Text style={styles.valuesText}>
            {item.currentValue} / {item.targetValue} {item.unit}
          </Text>
        </View>

        {item.deadline && (
          <View style={styles.deadlineRow}>
            <MaterialCommunityIcons name="calendar-clock" size={14} color={Colors.textSecondary} />
            <Text style={styles.deadlineText}>Scadenza: {formatDate(item.deadline)}</Text>
          </View>
        )}
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <View style={styles.header}>
        <FilterBar 
          filters={statusFilters}
          activeFilter={selectedStatus}
          onSelectFilter={setSelectedStatus}
        />
      </View>

      <FlatList
        data={filteredGoals}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState 
            icon="target" 
            title="Nessun obiettivo" 
            message="Non hai ancora definito obiettivi o nessuno corrisponde al filtro."
          />
        }
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('GoalForm')}
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
  header: {
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: 100,
  },
  card: {
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  goalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.sm,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    fontSize: FontSizes.xs,
    fontWeight: 'bold',
  },
  categoryText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    marginBottom: Spacing.md,
  },
  progressSection: {
    marginBottom: Spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  progressText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    textTransform: 'uppercase',
  },
  progressValue: {
    color: Colors.text,
    fontSize: FontSizes.xs,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 3,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  valuesText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    textAlign: 'right',
  },
  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  deadlineText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    marginLeft: 4,
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
