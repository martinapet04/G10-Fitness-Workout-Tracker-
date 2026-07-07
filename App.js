import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DataProvider } from './src/context/DataContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <DataProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </DataProvider>
    </SafeAreaProvider>
  );
}
