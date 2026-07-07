import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { loadAllData, saveData, isInitialized, setInitialized } from '../utils/storage';
import {
  SAMPLE_EXERCISES,
  generateSampleWorkoutPlans,
  generateSampleSessions,
  generateSampleWorkoutLogs,
  generateSampleGoals,
} from '../utils/sampleData';

const DataContext = createContext();

const initialState = {
  exercises: [],
  workoutPlans: [],
  sessions: [],
  workoutLogs: [],
  goals: [],
};

function dataReducer(state, action) {
  switch (action.type) {
    // Exercises
    case 'SET_ALL':
      return { ...state, ...action.payload };
    case 'ADD_EXERCISE':
      return { ...state, exercises: [...state.exercises, action.payload] };
    case 'UPDATE_EXERCISE':
      return { ...state, exercises: state.exercises.map(e => e.id === action.payload.id ? action.payload : e) };
    case 'DELETE_EXERCISE':
      return { ...state, exercises: state.exercises.filter(e => e.id !== action.payload) };

    // Workout Plans
    case 'ADD_WORKOUT_PLAN':
      return { ...state, workoutPlans: [...state.workoutPlans, action.payload] };
    case 'UPDATE_WORKOUT_PLAN':
      return { ...state, workoutPlans: state.workoutPlans.map(p => p.id === action.payload.id ? action.payload : p) };
    case 'DELETE_WORKOUT_PLAN':
      return { ...state, workoutPlans: state.workoutPlans.filter(p => p.id !== action.payload) };

    // Sessions
    case 'ADD_SESSION':
      return { ...state, sessions: [...state.sessions, action.payload] };
    case 'UPDATE_SESSION':
      return { ...state, sessions: state.sessions.map(s => s.id === action.payload.id ? action.payload : s) };
    case 'DELETE_SESSION':
      return { ...state, sessions: state.sessions.filter(s => s.id !== action.payload) };

    // Workout Logs
    case 'ADD_WORKOUT_LOG':
      return { ...state, workoutLogs: [...state.workoutLogs, action.payload] };
    case 'UPDATE_WORKOUT_LOG':
      return { ...state, workoutLogs: state.workoutLogs.map(l => l.id === action.payload.id ? action.payload : l) };
    case 'DELETE_WORKOUT_LOG':
      return { ...state, workoutLogs: state.workoutLogs.filter(l => l.id !== action.payload) };

    // Goals
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };
    case 'UPDATE_GOAL':
      return { ...state, goals: state.goals.map(g => g.id === action.payload.id ? action.payload : g) };
    case 'DELETE_GOAL':
      return { ...state, goals: state.goals.filter(g => g.id !== action.payload) };

    default:
      return state;
  }
}

export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(dataReducer, initialState);
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    async function init() {
      try {
        const alreadyInit = await isInitialized();
        if (alreadyInit) {
          const data = await loadAllData();
          dispatch({ type: 'SET_ALL', payload: data });
        } else {
          // First launch: populate with sample data
          const exercises = SAMPLE_EXERCISES;
          const workoutPlans = generateSampleWorkoutPlans(exercises);
          const sessions = generateSampleSessions(workoutPlans);
          const workoutLogs = generateSampleWorkoutLogs(exercises, workoutPlans, sessions);
          const goals = generateSampleGoals(exercises);

          const data = { exercises, workoutPlans, sessions, workoutLogs, goals };
          dispatch({ type: 'SET_ALL', payload: data });

          // Save all
          await Promise.all([
            saveData('exercises', exercises),
            saveData('workoutPlans', workoutPlans),
            saveData('sessions', sessions),
            saveData('workoutLogs', workoutLogs),
            saveData('goals', goals),
          ]);
          await setInitialized();
        }
      } catch (e) {
        console.error('Error initializing data:', e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Persist on every state change (after initial load)
  useEffect(() => {
    if (!loading) {
      saveData('exercises', state.exercises);
      saveData('workoutPlans', state.workoutPlans);
      saveData('sessions', state.sessions);
      saveData('workoutLogs', state.workoutLogs);
      saveData('goals', state.goals);
    }
  }, [state, loading]);

  const getExerciseById = (id) => state.exercises.find(e => e.id === id);
  const getWorkoutPlanById = (id) => state.workoutPlans.find(p => p.id === id);

  return (
    <DataContext.Provider value={{ state, dispatch, loading, getExerciseById, getWorkoutPlanById }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
