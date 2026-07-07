import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useData } from '../../context/DataContext';
import Card from '../../components/Card';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { getGoalStatusInfo, calculateGoalProgress, formatDate } from '../../utils/helpers';

export default function GoalDetailScreen({ route, navigation }) {
  const { item } = route.params;
  const { state, dispatch } = useData();
  
  // Need to find it from state to ensure it's up to date
  const goal = state.goals.find(g => g.id === item.id) || item;

  const [updateValue, setUpdateValue] = useState('');
  const [showUpdate, setShowUpdate] = useState(false);

  const statusInfo = getGoalStatusInfo(goal.status);
  const progress = calculateGoalProgress(goal);

  const handleDelete = () => {
    Alert.alert(
      "Elimina Obiettivo",
      "Sei sicuro di voler eliminare questo obiettivo?",
      [
        { text: "Annulla", style: "cancel" },
        { 
          text: "Elimina", 
          style: "destructive",
          onPress: () => {
            dispatch({ type: 'DELETE_GOAL', payload: goal.id });
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleUpdateProgress = () => {
    const val = parseFloat(updateValue);
    if (isNaN(val)) {
      Alert.alert('Errore', 'Inserisci un valore numerico valido.');
      return;
    }

    const updatedGoal = { ...goal, currentValue: val };
    
    // Auto-complete if target reached
    if (val >= goal.targetValue && goal.status === 'in_progress') {
      updatedGoal.status = 'completed';
      Alert.alert('Complimenti!', 'Hai raggiunto il tuo obiettivo! 🎉');
    }

    dispatch({ type: 'UPDATE_GOAL', payload: updatedGoal });
    setUpdateValue('');
    setShowUpdate(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.title}>{goal.title}</Text>
          <View style={[styles.badge, { backgroundColor: statusInfo.color + '20' }]}>
            <Text style={[styles.badgeText, { color: statusInfo.color }]}>
              {statusInfo.label}
            </Text>
          </View>
        </View>

        <Card style={styles.progressCard}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressPercent}>{progress}%</Text>
          </View>
          
          <View style={styles.valuesRow}>
            <View style={styles.valCol}>
              <Text style={styles.valLabel}>Attuale</Text>
              <Text style={styles.valNumber}>{goal.currentValue} {goal.unit}</Text>
            </View>
            <View style={styles.valCol}>
              <Text style={styles.valLabel}>Target</Text>
              <Text style={styles.valNumber}>{goal.targetValue} {goal.unit}</Text>
            </View>
          </View>

          {!showUpdate ? (
            <TouchableOpacity 
              style={styles.updateBtn}
              onPress={() => setShowUpdate(true)}
            >
              <Text style={styles.updateBtnText}>Aggiorna Progresso</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.updateContainer}>
              <TextInput
                style={styles.input}
                value={updateValue}
                onChangeText={setUpdateValue}
                keyboardType="numeric"
                placeholder={`Nuovo valore (es. ${goal.currentValue + 1})`}
                placeholderTextColor={Colors.textMuted}
              />
              <View style={styles.updateActions}>
                <TouchableOpacity 
                  style={[styles.btnSmall, { backgroundColor: Colors.surfaceLight }]}
                  onPress={() => setShowUpdate(false)}
                >
                  <Text style={styles.btnTextSmall}>Annulla</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.btnSmall, { backgroundColor: Colors.primary }]}
                  onPress={handleUpdateProgress}
                >
                  <Text style={[styles.btnTextSmall, { color: Colors.text }]}>Salva</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Card>

        <View style={styles.section}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="tag-outline" size={24} color={Colors.primaryLight} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Categoria</Text>
              <Text style={styles.infoValue}>{goal.category}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar-start" size={24} color={Colors.secondary} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Data Inizio</Text>
              <Text style={styles.infoValue}>{formatDate(goal.startDate)}</Text>
            </View>
          </View>

          {goal.deadline && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="calendar-check" size={24} color={Colors.warning} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Scadenza</Text>
                <Text style={styles.infoValue}>{formatDate(goal.deadline)}</Text>
              </View>
            </View>
          )}
        </View>

        {goal.description ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descrizione</Text>
            <Card style={styles.textCard}>
              <Text style={styles.description}>{goal.description}</Text>
            </Card>
          </View>
        ) : null}

        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.btn, styles.btnEdit]}
            onPress={() => navigation.navigate('GoalForm', { item: goal })}
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
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.md,
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
  progressCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  progressPercent: {
    fontSize: FontSizes.xxxl,
    fontWeight: 'bold',
    color: Colors.text,
  },
  valuesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: Spacing.lg,
  },
  valCol: {
    alignItems: 'center',
  },
  valLabel: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    marginBottom: 4,
  },
  valNumber: {
    color: Colors.text,
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
  },
  updateBtn: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.round,
    width: '100%',
    alignItems: 'center',
  },
  updateBtnText: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: FontSizes.md,
  },
  updateContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: Colors.surface,
    color: Colors.text,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    fontSize: FontSizes.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  updateActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnSmall: {
    flex: 1,
    padding: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.xs,
  },
  btnTextSmall: {
    color: Colors.text,
    fontWeight: 'bold',
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  infoTextContainer: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  infoLabel: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    textTransform: 'uppercase',
  },
  infoValue: {
    color: Colors.text,
    fontSize: FontSizes.md,
    fontWeight: '500',
    marginTop: 2,
  },
  textCard: {
    backgroundColor: Colors.surfaceLight,
  },
  description: {
    color: Colors.text,
    fontSize: FontSizes.md,
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
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
    backgroundColor: Colors.primary,
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
  }
});
