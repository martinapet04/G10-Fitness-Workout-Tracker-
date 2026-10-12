import AsyncStorage from '@react-native-async-storage/async-storage';

// Tutto lo stato dell'app viene serializzato in JSON sotto un'unica chiave.
const STORAGE_KEY = '@personal_library_state_v1';

export async function loadState() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('Errore nel caricamento dei dati', e);
    return null;
  }
}

export async function saveState(state) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Errore nel salvataggio dei dati', e);
  }
}

export async function clearState() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Errore nella cancellazione dei dati', e);
  }
}
