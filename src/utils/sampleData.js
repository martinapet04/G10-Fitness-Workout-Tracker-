import uuid from 'react-native-uuid';

export const SAMPLE_EXERCISES = [
  {
    id: uuid.v4(),
    name: 'Panca Piana',
    description: 'Esercizio fondamentale per il petto. Sdraiarsi sulla panca, impugnare il bilanciere, abbassarlo al petto e spingere verso l\'alto.',
    primaryMuscle: 'Petto',
    secondaryMuscles: ['Tricipiti', 'Spalle'],
    difficulty: 'intermediate',
    equipment: 'Bilanciere',
    estimatedDuration: 15,
    suggestedReps: '8-12',
    notes: 'Mantenere le scapole addotte e i piedi ben piantati.',
  },
  {
    id: uuid.v4(),
    name: 'Squat con Bilanciere',
    description: 'Il re degli esercizi per le gambe. Posizionare il bilanciere sulle spalle, scendere piegando le ginocchia mantenendo la schiena dritta.',
    primaryMuscle: 'Quadricipiti',
    secondaryMuscles: ['Glutei', 'Femorali', 'Addominali'],
    difficulty: 'intermediate',
    equipment: 'Bilanciere',
    estimatedDuration: 15,
    suggestedReps: '6-10',
    notes: 'Scendere almeno fino al parallelo.',
  },
  {
    id: uuid.v4(),
    name: 'Stacco da Terra',
    description: 'Esercizio composto per schiena e gambe. Sollevare il bilanciere dal pavimento mantenendo la schiena neutra.',
    primaryMuscle: 'Schiena',
    secondaryMuscles: ['Femorali', 'Glutei', 'Trapezio', 'Avambracci'],
    difficulty: 'advanced',
    equipment: 'Bilanciere',
    estimatedDuration: 15,
    suggestedReps: '5-8',
    notes: 'Iniziare con carichi leggeri per apprendere la tecnica.',
  },
  {
    id: uuid.v4(),
    name: 'Trazioni alla Sbarra',
    description: 'Esercizio a corpo libero per la schiena. Appendersi alla sbarra e tirare il corpo verso l\'alto fino a portare il mento sopra la sbarra.',
    primaryMuscle: 'Dorsali',
    secondaryMuscles: ['Bicipiti', 'Avambracci'],
    difficulty: 'intermediate',
    equipment: 'Sbarra',
    estimatedDuration: 10,
    suggestedReps: '6-12',
    notes: 'Usare una banda elastica per assistenza se necessario.',
  },
  {
    id: uuid.v4(),
    name: 'Military Press',
    description: 'Distensioni sopra la testa con bilanciere per le spalle.',
    primaryMuscle: 'Spalle',
    secondaryMuscles: ['Tricipiti', 'Trapezio'],
    difficulty: 'intermediate',
    equipment: 'Bilanciere',
    estimatedDuration: 12,
    suggestedReps: '8-10',
    notes: 'Non inarcare eccessivamente la schiena.',
  },
  {
    id: uuid.v4(),
    name: 'Curl con Manubri',
    description: 'Flessione del braccio per allenare i bicipiti con manubri.',
    primaryMuscle: 'Bicipiti',
    secondaryMuscles: ['Avambracci'],
    difficulty: 'beginner',
    equipment: 'Manubri',
    estimatedDuration: 8,
    suggestedReps: '10-15',
    notes: 'Evitare di oscillare il corpo.',
  },
  {
    id: uuid.v4(),
    name: 'Crunch',
    description: 'Esercizio per gli addominali. Sdraiarsi a terra, piegare le ginocchia e sollevare le spalle.',
    primaryMuscle: 'Addominali',
    secondaryMuscles: [],
    difficulty: 'beginner',
    equipment: 'Nessuna',
    estimatedDuration: 5,
    suggestedReps: '15-25',
    notes: 'Eseguire il movimento lentamente e in modo controllato.',
  },
  {
    id: uuid.v4(),
    name: 'Affondi con Manubri',
    description: 'Esercizio unilaterale per le gambe. Fare un passo avanti e piegare entrambe le ginocchia.',
    primaryMuscle: 'Quadricipiti',
    secondaryMuscles: ['Glutei', 'Femorali'],
    difficulty: 'beginner',
    equipment: 'Manubri',
    estimatedDuration: 10,
    suggestedReps: '10-12 per gamba',
    notes: 'Il ginocchio non deve superare la punta del piede.',
  },
  {
    id: uuid.v4(),
    name: 'Dip alle Parallele',
    description: 'Esercizio a corpo libero per petto e tricipiti. Sostenersi sulle parallele e piegare le braccia.',
    primaryMuscle: 'Tricipiti',
    secondaryMuscles: ['Petto', 'Spalle'],
    difficulty: 'intermediate',
    equipment: 'Sbarra',
    estimatedDuration: 10,
    suggestedReps: '8-12',
    notes: 'Inclinare il busto per maggiore attivazione del petto.',
  },
  {
    id: uuid.v4(),
    name: 'Plank',
    description: 'Esercizio isometrico per il core. Mantenere il corpo in posizione orizzontale appoggiandosi su avambracci e punte dei piedi.',
    primaryMuscle: 'Addominali',
    secondaryMuscles: ['Schiena', 'Spalle'],
    difficulty: 'beginner',
    equipment: 'Nessuna',
    estimatedDuration: 5,
    suggestedReps: '30-60 sec',
    notes: 'Non far cadere i fianchi.',
  },
  {
    id: uuid.v4(),
    name: 'Corsa su Tapis Roulant',
    description: 'Attività cardio. Correre sul tapis roulant a ritmo moderato o intenso.',
    primaryMuscle: 'Cardio',
    secondaryMuscles: ['Quadricipiti', 'Polpacci'],
    difficulty: 'beginner',
    equipment: 'Tapis Roulant',
    estimatedDuration: 30,
    suggestedReps: '20-40 min',
    notes: 'Variare velocità e inclinazione.',
  },
  {
    id: uuid.v4(),
    name: 'Rematore con Bilanciere',
    description: 'Esercizio per la schiena. Piegarsi in avanti e tirare il bilanciere verso l\'addome.',
    primaryMuscle: 'Dorsali',
    secondaryMuscles: ['Bicipiti', 'Trapezio', 'Schiena'],
    difficulty: 'intermediate',
    equipment: 'Bilanciere',
    estimatedDuration: 12,
    suggestedReps: '8-12',
    notes: 'Mantenere la schiena in posizione neutra.',
  },
];

export function generateSampleWorkoutPlans(exercises) {
  const findExercise = (name) => exercises.find(e => e.name === name);

  return [
    {
      id: uuid.v4(),
      name: 'Push Day',
      description: 'Giornata dedicata ai muscoli di spinta: petto, spalle e tricipiti.',
      objective: 'Ipertrofia',
      level: 'intermediate',
      estimatedDuration: 60,
      frequency: '2x settimana',
      exercises: [
        { exerciseId: findExercise('Panca Piana')?.id, sets: 4, reps: '8-10', restSeconds: 90, weight: '70', order: 1, notes: '' },
        { exerciseId: findExercise('Military Press')?.id, sets: 3, reps: '8-10', restSeconds: 90, weight: '40', order: 2, notes: '' },
        { exerciseId: findExercise('Dip alle Parallele')?.id, sets: 3, reps: '10-12', restSeconds: 60, weight: 'corpo', order: 3, notes: '' },
      ].filter(e => e.exerciseId),
      notes: 'Riscaldamento: 5 min di attività aerobica leggera.',
    },
    {
      id: uuid.v4(),
      name: 'Pull Day',
      description: 'Giornata dedicata ai muscoli di trazione: schiena e bicipiti.',
      objective: 'Ipertrofia',
      level: 'intermediate',
      estimatedDuration: 55,
      frequency: '2x settimana',
      exercises: [
        { exerciseId: findExercise('Stacco da Terra')?.id, sets: 4, reps: '5-6', restSeconds: 120, weight: '100', order: 1, notes: '' },
        { exerciseId: findExercise('Trazioni alla Sbarra')?.id, sets: 4, reps: '6-10', restSeconds: 90, weight: 'corpo', order: 2, notes: '' },
        { exerciseId: findExercise('Rematore con Bilanciere')?.id, sets: 3, reps: '8-10', restSeconds: 90, weight: '60', order: 3, notes: '' },
        { exerciseId: findExercise('Curl con Manubri')?.id, sets: 3, reps: '10-12', restSeconds: 60, weight: '14', order: 4, notes: '' },
      ].filter(e => e.exerciseId),
      notes: '',
    },
    {
      id: uuid.v4(),
      name: 'Leg Day',
      description: 'Giornata gambe completa con esercizi composti e isolamento.',
      objective: 'Forza',
      level: 'intermediate',
      estimatedDuration: 65,
      frequency: '1-2x settimana',
      exercises: [
        { exerciseId: findExercise('Squat con Bilanciere')?.id, sets: 5, reps: '5-8', restSeconds: 120, weight: '80', order: 1, notes: '' },
        { exerciseId: findExercise('Affondi con Manubri')?.id, sets: 3, reps: '10-12', restSeconds: 90, weight: '16', order: 2, notes: 'Per gamba' },
      ].filter(e => e.exerciseId),
      notes: 'Chiudere con 5 min di stretching.',
    },
  ];
}

export function generateSampleSessions(workoutPlans) {
  const today = new Date();
  const sessions = [];
  
  // Crea sessioni per la settimana corrente
  if (workoutPlans.length >= 3) {
    const days = [1, 3, 5]; // Lun, Mer, Ven
    workoutPlans.slice(0, 3).forEach((plan, idx) => {
      const date = new Date(today);
      const currentDay = today.getDay();
      const targetDay = days[idx];
      const diff = targetDay - (currentDay === 0 ? 7 : currentDay);
      date.setDate(today.getDate() + diff);
      
      sessions.push({
        id: uuid.v4(),
        date: date.toISOString().split('T')[0],
        type: 'strength',
        workoutPlanId: plan.id,
        status: diff < 0 ? 'completed' : diff === 0 ? 'pending' : 'pending',
        notes: '',
      });
    });
  }
  return sessions;
}

export function generateSampleWorkoutLogs(exercises, workoutPlans, sessions) {
  const logs = [];
  const completedSessions = sessions.filter(s => s.status === 'completed');
  
  completedSessions.forEach(session => {
    const plan = workoutPlans.find(p => p.id === session.workoutPlanId);
    if (!plan) return;
    
    logs.push({
      id: uuid.v4(),
      date: session.date + 'T10:30:00',
      sessionId: session.id,
      workoutPlanId: plan.id,
      duration: plan.estimatedDuration - 5 + Math.floor(Math.random() * 10),
      exercises: plan.exercises.map(pe => ({
        exerciseId: pe.exerciseId,
        sets: Array.from({ length: pe.sets }, (_, i) => ({
          reps: parseInt(pe.reps) || 10,
          weight: parseInt(pe.weight) || 0,
          completed: true,
        })),
        restSeconds: pe.restSeconds,
      })),
      perceivedEffort: 3 + Math.floor(Math.random() * 2),
      notes: '',
    });
  });
  
  return logs;
}

export function generateSampleGoals(exercises) {
  return [
    {
      id: uuid.v4(),
      title: 'Panca 100kg',
      description: 'Raggiungere 100kg di massimale sulla panca piana',
      category: 'Forza',
      targetValue: 100,
      currentValue: 75,
      unit: 'kg',
      startDate: '2026-06-01',
      deadline: '2026-12-31',
      status: 'in_progress',
      linkedExerciseId: exercises.find(e => e.name === 'Panca Piana')?.id || null,
      notes: '',
    },
    {
      id: uuid.v4(),
      title: '4 allenamenti a settimana',
      description: 'Allenarsi almeno 4 volte a settimana per un mese',
      category: 'Frequenza Allenamento',
      targetValue: 16,
      currentValue: 6,
      unit: 'sessioni',
      startDate: '2026-07-01',
      deadline: '2026-07-31',
      status: 'in_progress',
      linkedExerciseId: null,
      notes: '',
    },
    {
      id: uuid.v4(),
      title: '10 trazioni consecutive',
      description: 'Riuscire a fare 10 trazioni di fila senza assistenza',
      category: 'Prestazione',
      targetValue: 10,
      currentValue: 7,
      unit: 'ripetizioni',
      startDate: '2026-06-15',
      deadline: '2026-09-30',
      status: 'in_progress',
      linkedExerciseId: exercises.find(e => e.name === 'Trazioni alla Sbarra')?.id || null,
      notes: '',
    },
  ];
}
