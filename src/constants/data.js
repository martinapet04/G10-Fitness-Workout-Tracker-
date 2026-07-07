export const MUSCLE_GROUPS = [
  'Petto', 'Schiena', 'Spalle', 'Bicipiti', 'Tricipiti',
  'Quadricipiti', 'Femorali', 'Glutei', 'Polpacci',
  'Addominali', 'Avambracci', 'Trapezio', 'Dorsali',
  'Full Body', 'Cardio',
];

export const DIFFICULTY_LEVELS = [
  { label: 'Principiante', value: 'beginner', color: '#2ECC71' },
  { label: 'Intermedio', value: 'intermediate', color: '#F39C12' },
  { label: 'Avanzato', value: 'advanced', color: '#E74C3C' },
];

export const EQUIPMENT = [
  'Nessuna', 'Bilanciere', 'Manubri', 'Kettlebell',
  'Macchina', 'Cavi', 'Banda Elastica', 'Panca',
  'Sbarra', 'TRX', 'Palla Medica', 'Tapis Roulant',
  'Cyclette', 'Vogatore',
];

export const SESSION_TYPES = [
  { label: 'Forza', value: 'strength', icon: 'dumbbell', color: '#FF6B6B' },
  { label: 'Cardio', value: 'cardio', icon: 'run', color: '#4ECDC4' },
  { label: 'Stretching', value: 'stretching', icon: 'yoga', color: '#F39C12' },
  { label: 'Recupero', value: 'recovery', icon: 'meditation', color: '#6C63FF' },
  { label: 'HIIT', value: 'hiit', icon: 'flash', color: '#E74C3C' },
  { label: 'Misto', value: 'mixed', icon: 'shuffle-variant', color: '#B0B0C0' },
];

export const GOAL_CATEGORIES = [
  'Forza', 'Resistenza', 'Flessibilità', 'Peso Corporeo',
  'Composizione Corporea', 'Frequenza Allenamento', 'Prestazione',
];

export const GOAL_STATUSES = [
  { label: 'In Corso', value: 'in_progress', color: '#6C63FF' },
  { label: 'Raggiunto', value: 'completed', color: '#2ECC71' },
  { label: 'In Pausa', value: 'paused', color: '#F39C12' },
  { label: 'Abbandonato', value: 'abandoned', color: '#E74C3C' },
];

export const DAYS_OF_WEEK = [
  { label: 'Lun', full: 'Lunedì', value: 1 },
  { label: 'Mar', full: 'Martedì', value: 2 },
  { label: 'Mer', full: 'Mercoledì', value: 3 },
  { label: 'Gio', full: 'Giovedì', value: 4 },
  { label: 'Ven', full: 'Venerdì', value: 5 },
  { label: 'Sab', full: 'Sabato', value: 6 },
  { label: 'Dom', full: 'Domenica', value: 0 },
];

export const EFFORT_LEVELS = [
  { value: 1, label: 'Molto facile', emoji: '😴' },
  { value: 2, label: 'Facile', emoji: '😊' },
  { value: 3, label: 'Moderato', emoji: '💪' },
  { value: 4, label: 'Intenso', emoji: '🔥' },
  { value: 5, label: 'Massimo', emoji: '💀' },
];

export const getDifficultyColor = (value) => {
  const level = DIFFICULTY_LEVELS.find(l => l.value === value);
  return level ? level.color : '#B0B0C0';
};

export const getDifficultyLabel = (value) => {
  const level = DIFFICULTY_LEVELS.find(l => l.value === value);
  return level ? level.label : 'Sconosciuto';
};
