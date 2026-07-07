import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useData } from '../../context/DataContext';
import Card from '../../components/Card';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { getDifficultyColor, getDifficultyLabel } from '../../constants/data';

export default function ExerciseDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { getExerciseById, dispatch } = useData();
  
  const exercise = getExerciseById(id);

  if (!exercise) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Esercizio non trovato.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Elimina Esercizio",
      "Sei sicuro di voler eliminare questo esercizio?",
      [
        { text: "Annulla", style: "cancel" },
        { 
          text: "Elimina", 
          style: "destructive",
          onPress: () => {
            dispatch({ type: 'DELETE_EXERCISE', payload: id });
            navigation.goBack();
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.title}>{exercise.name}</Text>
          <View style={[styles.badge, { backgroundColor: getDifficultyColor(exercise.difficulty) + '30' }]}>
            <Text style={[styles.badgeText, { color: getDifficultyColor(exercise.difficulty) }]}>
              {getDifficultyLabel(exercise.difficulty)}
            </Text>
          </View>
        </View>

        <Card style={styles.section}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="arm-flex" size={24} color={Colors.primaryLight} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Muscolo Principale</Text>
              <Text style={styles.infoValue}>{exercise.primaryMuscle}</Text>
            </View>
          </View>

          {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="human" size={24} color={Colors.secondary} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Muscoli Secondari</Text>
                <Text style={styles.infoValue}>{exercise.secondaryMuscles.join(', ')}</Text>
              </View>
            </View>
          )}

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="weight" size={24} color={Colors.accent} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Attrezzatura</Text>
              <Text style={styles.infoValue}>{exercise.equipment}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="timer-outline" size={24} color={Colors.warning} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Ripetizioni Consigliate</Text>
              <Text style={styles.infoValue}>{exercise.suggestedReps}</Text>
            </View>
          </View>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Istruzioni</Text>
          <Card style={styles.textCard}>
            <Text style={styles.paragraph}>{exercise.description}</Text>
          </Card>
        </View>

        {exercise.notes ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Note Aggiuntive</Text>
            <Card style={styles.textCard}>
              <Text style={styles.paragraph}>{exercise.notes}</Text>
            </Card>
          </View>
        ) : null}

        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.btn, styles.btnEdit]}
            onPress={() => navigation.navigate('ExerciseForm', { item: exercise })}
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
  paragraph: {
    color: Colors.text,
    fontSize: FontSizes.md,
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
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
