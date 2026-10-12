import { Alert, Platform } from 'react-native';
import uuid from 'react-native-uuid';
import { Colors } from '../theme';

/* ---------- Identificatori ---------- */
export const uid = () => String(uuid.v4());

/* ---------- Date (sempre in formato locale YYYY-MM-DD, senza conversioni UTC) ---------- */
const pad = (n) => String(n).padStart(2, '0');
export const toDateStr = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parseDate = (s) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
export const today = () => toDateStr(new Date());
export const isValidDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s || '') && toDateStr(parseDate(s)) === s;
export const addDays = (s, n) => {
  const d = parseDate(s);
  d.setDate(d.getDate() + n);
  return toDateStr(d);
};
export const formatDate = (s) =>
  s ? parseDate(s).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
export const MONTHS = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
export const MONTHS_FULL = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

/* ---------- Dialoghi compatibili web + mobile (Alert.alert su web non gestisce più pulsanti) ---------- */
export function showMessage(title, message) {
  if (Platform.OS === 'web') window.alert(`${title}\n${message}`);
  else Alert.alert(title, message);
}
export function confirmAction(title, message, onOk, okText = 'Elimina') {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n${message}`)) onOk();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Annulla', style: 'cancel' },
    { text: okText, style: 'destructive', onPress: onOk },
  ]);
}

/* ---------- Costanti di dominio ---------- */
export const STATUSES = [
  { value: 'reading', label: 'In lettura', color: Colors.accent, icon: 'book-open-page-variant' },
  { value: 'toRead', label: 'Da leggere', color: Colors.warning, icon: 'bookmark-outline' },
  { value: 'read', label: 'Letto', color: Colors.success, icon: 'check-circle-outline' },
  { value: 'wishlist', label: 'Wishlist', color: Colors.purple, icon: 'heart-outline' },
];
export const statusInfo = (v) => STATUSES.find((s) => s.value === v) || STATUSES[1];

export const BOOK_TYPES = ['Libro', 'Fumetto', 'Saggio', 'Manuale', 'Articolo'];

export const NOTE_TYPES = [
  { value: 'note', label: 'Nota', icon: 'note-text-outline', color: Colors.accent },
  { value: 'review', label: 'Recensione', icon: 'star-circle-outline', color: Colors.warning },
  { value: 'quote', label: 'Citazione', icon: 'format-quote-close', color: Colors.purple },
];
export const noteTypeInfo = (v) => NOTE_TYPES.find((t) => t.value === v) || NOTE_TYPES[0];

export const LIST_STATUSES = [
  { value: 'active', label: 'Attiva', color: Colors.accent },
  { value: 'archived', label: 'Archiviata', color: Colors.textMuted },
];

/* Configurazione condivisa per Autori e Categorie (stesse schermate, due collezioni) */
export const ENTITY = {
  author: {
    col: 'authors',
    plural: 'Autori',
    singular: 'Autore',
    icon: 'account-edit-outline',
    match: (book, id) => (book.authorIds || []).includes(id),
  },
  category: {
    col: 'categories',
    plural: 'Categorie',
    singular: 'Categoria',
    icon: 'shape-outline',
    match: (book, id) => book.categoryId === id,
  },
};

/* ---------- Funzioni di dominio ---------- */
export const sumPages = (sessions) => sessions.reduce((a, s) => a + (Number(s.pagesRead) || 0), 0);

export function booksProgress(book, sessions) {
  const read = sumPages(sessions.filter((s) => s.bookId === book.id));
  const total = Number(book.pages) || 0;
  const capped = total ? Math.min(read, total) : read;
  return { read: capped, total, percent: total ? Math.round((capped / total) * 100) : 0 };
}

/* Avanzamento di un obiettivo di lettura (annuale o mensile), in libri o pagine */
export function goalProgress(goal, state) {
  const inPeriod = (dateStr) => {
    if (!dateStr) return false;
    if (goal.period === 'year') return dateStr.startsWith(String(goal.year));
    return dateStr.startsWith(`${goal.year}-${pad(goal.month)}`);
  };
  let current = 0;
  if (goal.unit === 'books') current = state.books.filter((b) => b.status === 'read' && inPeriod(b.finishedAt)).length;
  else current = sumPages(state.sessions.filter((s) => inPeriod(s.date)));
  const percent = goal.target ? Math.min(100, Math.round((current / goal.target) * 100)) : 0;
  return { current, percent };
}
export const goalLabel = (g) =>
  g.period === 'year' ? `Obiettivo ${g.year}` : `Obiettivo ${MONTHS_FULL[g.month - 1]} ${g.year}`;

/* Suggerimenti locali: confronta i libri da leggere con i gusti dedotti dai libri letti e ben valutati */
export function recommendBooks(state, limit = 3) {
  const liked = state.books.filter((b) => b.status === 'read' && Number(b.rating) >= 4);
  const candidates = state.books.filter((b) => b.status === 'toRead' || b.status === 'wishlist');
  const scored = candidates.map((c) => {
    let score = c.favorite ? 1 : 0;
    let reason = null;
    let best = 0;
    liked.forEach((l) => {
      let s = 0;
      if (l.categoryId && l.categoryId === c.categoryId) s += 2;
      s += 2 * (l.authorIds || []).filter((a) => (c.authorIds || []).includes(a)).length;
      score += s;
      if (s > best) {
        best = s;
        reason = `Ti è piaciuto "${l.title}"`;
      }
    });
    return { book: c, score, reason: reason || 'Dalla tua lista di lettura' };
  });
  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}
