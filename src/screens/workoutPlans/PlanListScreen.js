import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useData } from '../../context/DataContext';
import SearchBar from '../../components/SearchBar';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { getDifficultyColor, getDifficultyLabel } from '../../constants/data';
import { formatDuration } from '../../utils/helpers';

export default function PlanListScreen({ navigation }) {
  const { state } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlans = useMemo(() => {
    return state.workoutPlans.filter(plan => 
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (plan.objective && plan.objective.toLowerCase().includes(searchQuery.toLowerCase()))
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [state.workoutPlans, searchQuery]);

  const renderItem = ({ item }) => (
    <Card 
      style={styles.card} 
      onPress={() => navigation.navigate('PlanDetail', { id: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.planName}>{item.name}</Text>
        <View style={[styles.badge, { backgroundColor: getDifficultyColor(item.level) + '30' }]}>
          <Text style={[styles.badgeText, { color: getDifficultyColor(item.level) }]}>
            {getDifficultyLabel(item.level)}
          </Text>
        </View>
      </View>
      
      {item.objective ? (
        <Text style={styles.objectiveText}>
          <MaterialCommunityIcons name="target" size={14} color={Colors.textSecondary} /> {item.objective}
        </Text>
      ) : null}
      
      <View style={styles.cardFooter}>
        <View style={styles.footerItem}>
          <MaterialCommunityIcons name="timer-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.footerText}>{formatDuration(item.estimatedDuration)}</Text>
        </View>
        <View style={styles.footerItem}>
          <MaterialCommunityIcons name="dumbbell" size={16} color={Colors.textSecondary} />
          <Text style={styles.footerText}>{item.exercises?.length || 0} esercizi</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <View style={styles.header}>
        <SearchBar 
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Cerca scheda o obiettivo..."
        />
      </View>

      <FlatList
        data={filteredPlans}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState 
            icon="clipboard-text-outline" 
            title="Nessuna scheda" 
            message="Non hai ancora creato schede di allenamento o nessuna corrisponde alla ricerca."
          />
        }
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('PlanForm')}
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
  planName: {
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
  objectiveText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    marginBottom: Spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  footerText: {
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
