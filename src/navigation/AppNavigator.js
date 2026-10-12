import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

// Schermate
import HomeScreen from '../screens/home/HomeScreen';
import BookListScreen from '../screens/library/BookListScreen';
import BookDetailScreen from '../screens/library/BookDetailScreen';
import BookFormScreen from '../screens/library/BookFormScreen';
import EntityListScreen from '../screens/library/EntityListScreen';
import EntityDetailScreen from '../screens/library/EntityDetailScreen';
import EntityFormScreen from '../screens/library/EntityFormScreen';
import ListsScreen from '../screens/lists/ListsScreen';
import ListDetailScreen from '../screens/lists/ListDetailScreen';
import ListFormScreen from '../screens/lists/ListFormScreen';
import DiaryScreen from '../screens/diary/DiaryScreen';
import SessionFormScreen from '../screens/diary/SessionFormScreen';
import NoteFormScreen from '../screens/diary/NoteFormScreen';
import FocusTimerScreen from '../screens/diary/FocusTimerScreen';
import StatsScreen from '../screens/stats/StatsScreen';

import { Colors, Font } from '../theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const screenOpts = (title) => ({ title, headerStyle: { backgroundColor: Colors.surface }, headerTintColor: Colors.primary, headerTitleStyle: { fontWeight: '700', fontSize: Font.lg } });

function LibraryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BookList" component={BookListScreen} options={screenOpts('La mia libreria')} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen} options={screenOpts('Dettaglio')} />
      <Stack.Screen name="BookForm" component={BookFormScreen} options={({ route }) => screenOpts(route.params?.id ? 'Modifica contenuto' : 'Nuovo contenuto')} />
      <Stack.Screen name="EntityList" component={EntityListScreen} options={({ route }) => screenOpts(route.params?.type === 'author' ? 'Autori' : 'Categorie')} />
      <Stack.Screen name="EntityDetail" component={EntityDetailScreen} options={screenOpts('Dettaglio')} />
      <Stack.Screen name="EntityForm" component={EntityFormScreen} options={({ route }) => screenOpts(route.params?.id ? 'Modifica' : (route.params?.type === 'author' ? 'Nuovo autore' : 'Nuova categoria'))} />
    </Stack.Navigator>
  );
}

function ListsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Lists" component={ListsScreen} options={screenOpts('Liste di lettura')} />
      <Stack.Screen name="ListDetail" component={ListDetailScreen} options={screenOpts('Dettaglio lista')} />
      <Stack.Screen name="ListForm" component={ListFormScreen} options={({ route }) => screenOpts(route.params?.id ? 'Modifica lista' : 'Nuova lista')} />
    </Stack.Navigator>
  );
}

function DiaryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Diary" component={DiaryScreen} options={screenOpts('Diario di lettura')} />
      <Stack.Screen name="SessionForm" component={SessionFormScreen} options={({ route }) => screenOpts(route.params?.id ? 'Modifica sessione' : 'Registra sessione')} />
      <Stack.Screen name="NoteForm" component={NoteFormScreen} options={({ route }) => screenOpts(route.params?.id ? 'Modifica elemento' : 'Aggiungi al diario')} />
      <Stack.Screen name="FocusTimer" component={FocusTimerScreen} options={screenOpts('Timer focus lettura')} />
    </Stack.Navigator>
  );
}

function StatsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Stats" component={StatsScreen} options={screenOpts('Statistiche')} />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={screenOpts('Home')} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: { backgroundColor: Colors.surface, borderTopColor: Colors.border, paddingBottom: 6, height: 62 },
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textMuted,
          tabBarLabelStyle: { fontSize: Font.xs, fontWeight: '700', marginTop: -2 },
          tabBarIcon: ({ color, size }) => {
            const icons = { Home: 'home-outline', Library: 'bookshelf', Liste: 'format-list-bulleted', Diario: 'notebook-outline', Statistiche: 'chart-bar' };
            return <Icon name={icons[route.name] || 'help'} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Library" component={LibraryStack} options={{ title: 'Libreria' }} />
        <Tab.Screen name="Liste" component={ListsStack} />
        <Tab.Screen name="Diario" component={DiaryStack} />
        <Tab.Screen name="Statistiche" component={StatsStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
