export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('it-IT', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function formatDuration(minutes) {
  if (!minutes) return '0 min';
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

export function formatTimer(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function getDayName(dayIndex) {
  const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
  return days[dayIndex] || '';
}

export function getShortDayName(dayIndex) {
  const days = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
  return days[dayIndex] || '';
}

export function getWeekDates(baseDate = new Date()) {
  const curr = new Date(baseDate);
  const day = curr.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(curr);
  monday.setDate(curr.getDate() + diff);
  
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d);
  }
  return dates;
}

export function isSameDay(d1, d2) {
  const a = new Date(d1);
  const b = new Date(d2);
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

export function getToday() {
  return new Date().toISOString().split('T')[0];
}


export function getSessionTypeInfo(type) {
  const types = {
    strength: { label: 'Forza', icon: 'dumbbell', color: '#FF6B6B' },
    cardio: { label: 'Cardio', icon: 'run', color: '#4ECDC4' },
    stretching: { label: 'Stretching', icon: 'yoga', color: '#F39C12' },
    recovery: { label: 'Recupero', icon: 'meditation', color: '#6C63FF' },
    hiit: { label: 'HIIT', icon: 'flash', color: '#E74C3C' },
    mixed: { label: 'Misto', icon: 'shuffle-variant', color: '#B0B0C0' },
  };
  return types[type] || types.mixed;
}

export function getGoalStatusInfo(status) {
  const statuses = {
    in_progress: { label: 'In Corso', color: '#6C63FF' },
    completed: { label: 'Raggiunto', color: '#2ECC71' },
    paused: { label: 'In Pausa', color: '#F39C12' },
    abandoned: { label: 'Abbandonato', color: '#E74C3C' },
  };
  return statuses[status] || statuses.in_progress;
}

export function calculateGoalProgress(goal) {
}

export function calculateWorkoutStats(logs) {
  let totalWorkouts = 0;
  let totalDurationMinutes = 0;
  let totalVolume = 0;
  let totalSets = 0;

  if (logs && logs.length > 0) {
    totalWorkouts = logs.length;
    
    logs.forEach(log => {
      totalDurationMinutes += (log.duration || 0);
      
      if (log.exercises) {
        log.exercises.forEach(ex => {
          if (ex.sets) {
            ex.sets.forEach(set => {
              if (set.completed) {
                totalSets++;
                totalVolume += (set.reps * (set.weight || 0));
              }
            });
          }
        });
      }
    });
  }

  return {
    totalWorkouts,
    totalDurationMinutes,
    totalVolume,
    totalSets
  };
}
