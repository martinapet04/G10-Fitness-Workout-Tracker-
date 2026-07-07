import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useData } from '../../context/DataContext';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { formatDateTime, formatDuration, getSessionTypeInfo } from '../../utils/helpers';

export default function HistoryListScreen({ navigation }) {
  const { state, getWorkoutPlanById } = useData();

  const sortedLogs = [...state.workoutLogs].sort((a, b) => new Date(b.date) - new Date(a.date));

  const renderItem = ({ item }) => {
    const plan = item.workoutPlanId ? getWorkoutPlanById(item.workoutPlanId) : null;
    const session = state.sessions.find(s => s.id === item.sessionId);
    const typeInfo = getSessionTypeInfo(session?.type || 'mixed');

    return (
      <Card 
        style={styles.card} 
        onPress={() => navigation.navigate('HistoryDetail', { id: item.id })}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: typeInfo.color + '20' }]}>
            <MaterialCommunityIcons name={typeInfo.icon} size={24} color={typeInfo.color} />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.planName}>{plan ? plan.name : 'Sessione Libera'}</Text>
            <Text style={styles.dateText}>{formatDateTime(item.date)}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="timer-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.statText}>{formatDuration(item.duration * 60)}</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="dumbbell" size={16} color={Colors.textSecondary} />
            <Text style={styles.statText}>{item.exercises?.length || 0} esercizi</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="emoticon-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.statText}>Fatica: {item.perceivedEffort}/5</Text>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <FlatList
        data={sortedLogs}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState 
            icon="history" 
            title="Nessuno storico" 
            message="Non hai ancora registrato alcun allenamento. Inizia una sessione dalla tab Piano!"
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  card: {
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  infoContainer: {
    flex: 1,
  },
  planName: {
    color: Colors.text,
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
  },
  dateText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    marginLeft: 4,
  }
});
