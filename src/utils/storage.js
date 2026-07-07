import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  exercises: '@fitness_exercises',
  workoutPlans: '@fitness_workoutPlans',
  sessions: '@fitness_sessions',
  workoutLogs: '@fitness_workoutLogs',
  goals: '@fitness_goals',
  initialized: '@fitness_initialized',
};

export async function loadData(key) {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS[key]);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error(`Error loading ${key}:`, e);
    return [];
  }
}

export async function saveData(key, data) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key}:`, e);
  }
}

export async function isInitialized() {
  try {
    const val = await AsyncStorage.getItem(STORAGE_KEYS.initialized);
    return val === 'true';
  } catch {
    return false;
  }
}

export async function setInitialized() {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.initialized, 'true');
  } catch (e) {
    console.error('Error setting initialized:', e);
  }
}

export async function clearAll() {
  try {
    const keys = Object.values(STORAGE_KEYS);
    await AsyncStorage.multiRemove(keys);
  } catch (e) {
    console.error('Error clearing storage:', e);
  }
}

export async function loadAllData() {
  const [exercises, workoutPlans, sessions, workoutLogs, goals] = await Promise.all([
    loadData('exercises'),
    loadData('workoutPlans'),
    loadData('sessions'),
    loadData('workoutLogs'),
    loadData('goals'),
  ]);
  return { exercises, workoutPlans, sessions, workoutLogs, goals };
}

export async function saveAllData(state) {
  await Promise.all([
    saveData('exercises', state.exercises),
    saveData('workoutPlans', state.workoutPlans),
    saveData('sessions', state.sessions),
    saveData('workoutLogs', state.workoutLogs),
    saveData('goals', state.goals),
  ]);
}
