import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';

// Import screens (will create these next)
import HomeScreen from '../screens/home/HomeScreen';
import ExerciseListScreen from '../screens/exercises/ExerciseListScreen';
import ExerciseDetailScreen from '../screens/exercises/ExerciseDetailScreen';
import ExerciseFormScreen from '../screens/exercises/ExerciseFormScreen';
import PlanListScreen from '../screens/workoutPlans/PlanListScreen';
import PlanDetailScreen from '../screens/workoutPlans/PlanDetailScreen';
import PlanFormScreen from '../screens/workoutPlans/PlanFormScreen';
import SessionCalendarScreen from '../screens/sessions/SessionCalendarScreen';
import SessionFormScreen from '../screens/sessions/SessionFormScreen';
import GuidedWorkoutScreen from '../screens/sessions/GuidedWorkoutScreen';
import HistoryListScreen from '../screens/history/HistoryListScreen';
import HistoryDetailScreen from '../screens/history/HistoryDetailScreen';
import GoalListScreen from '../screens/goals/GoalListScreen';
import GoalDetailScreen from '../screens/goals/GoalDetailScreen';
import GoalFormScreen from '../screens/goals/GoalFormScreen';
import StatsScreen from '../screens/stats/StatsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: Colors.surface },
  headerTintColor: Colors.text,
  headerTitleStyle: { fontWeight: 'bold' },
  contentStyle: { backgroundColor: Colors.background },
  headerShadowVisible: false,
};

// Stack Navigators for each tab
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Fitness Tracker' }} />
    </Stack.Navigator>
  );
}

function ExercisesStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="ExerciseList" component={ExerciseListScreen} options={{ title: 'Esercizi' }} />
      <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} options={{ title: 'Dettaglio Esercizio' }} />
      <Stack.Screen name="ExerciseForm" component={ExerciseFormScreen} options={({ route }) => ({ title: route.params?.item ? 'Modifica Esercizio' : 'Nuovo Esercizio' })} />
    </Stack.Navigator>
  );
}

function PlansStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="PlanList" component={PlanListScreen} options={{ title: 'Schede' }} />
      <Stack.Screen name="PlanDetail" component={PlanDetailScreen} options={{ title: 'Dettaglio Scheda' }} />
      <Stack.Screen name="PlanForm" component={PlanFormScreen} options={({ route }) => ({ title: route.params?.item ? 'Modifica Scheda' : 'Nuova Scheda' })} />
    </Stack.Navigator>
  );
}

function SessionsStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="SessionCalendar" component={SessionCalendarScreen} options={{ title: 'Pianificazione' }} />
      <Stack.Screen name="SessionForm" component={SessionFormScreen} options={({ route }) => ({ title: route.params?.item ? 'Modifica Sessione' : 'Nuova Sessione' })} />
      <Stack.Screen name="GuidedWorkout" component={GuidedWorkoutScreen} options={{ title: 'Allenamento', headerShown: false }} />
    </Stack.Navigator>
  );
}

function MoreStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Stats" component={StatsScreen} options={{ title: 'Statistiche e Altro' }} />
      <Stack.Screen name="HistoryList" component={HistoryListScreen} options={{ title: 'Storico Allenamenti' }} />
      <Stack.Screen name="HistoryDetail" component={HistoryDetailScreen} options={{ title: 'Dettaglio Allenamento' }} />
      <Stack.Screen name="GoalList" component={GoalListScreen} options={{ title: 'Obiettivi' }} />
      <Stack.Screen name="GoalDetail" component={GoalDetailScreen} options={{ title: 'Dettaglio Obiettivo' }} />
      <Stack.Screen name="GoalForm" component={GoalFormScreen} options={({ route }) => ({ title: route.params?.item ? 'Modifica Obiettivo' : 'Nuovo Obiettivo' })} />
    </Stack.Navigator>
  );
}

// Main Bottom Tab Navigator
export default function AppNavigator() {
  const MyTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: Colors.background,
      card: Colors.surface,
      text: Colors.text,
      border: Colors.border,
      primary: Colors.primary,
    },
  };

  return (
    <NavigationContainer theme={MyTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
            else if (route.name === 'Esercizi') iconName = 'dumbbell';
            else if (route.name === 'Schede') iconName = focused ? 'clipboard-text' : 'clipboard-text-outline';
            else if (route.name === 'Piano') iconName = focused ? 'calendar-month' : 'calendar-month-outline';
            else if (route.name === 'Altro') iconName = focused ? 'dots-horizontal-circle' : 'dots-horizontal-circle-outline';
            
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textMuted,
          tabBarStyle: {
            backgroundColor: Colors.surface,
            borderTopColor: Colors.border,
            paddingBottom: 5,
            paddingTop: 5,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Esercizi" component={ExercisesStack} />
        <Tab.Screen name="Schede" component={PlansStack} />
        <Tab.Screen name="Piano" component={SessionsStack} />
        <Tab.Screen name="Altro" component={MoreStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
