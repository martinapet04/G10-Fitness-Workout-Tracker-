import React, { createContext, useContext, useEffect, useReducer, useState, useCallback, useMemo } from 'react';
import { loadState, saveState } from '../utils/storage';
import { buildSeed } from '../utils/seed';
import { uid, sumPages } from '../utils/helpers';

const LibraryContext = createContext(null);

const initialState = { authors: [], categories: [], books: [], lists: [], sessions: [], notes: [], goals: [] };

/* Dopo ogni sessione di lettura aggiorna automaticamente lo stato del libro:
   "da leggere" -> "in lettura", e "letto" quando si raggiungono tutte le pagine. */
function syncBookStatus(state, bookId) {
  const book = state.books.find((b) => b.id === bookId);
  if (!book) return state;
  const sessions = state.sessions.filter((s) => s.bookId === bookId);
  const total = sumPages(sessions);
  if (!total) return state;
  const updated = { ...book };
  if (book.pages && total >= book.pages) {
    updated.status = 'read';
    if (!updated.finishedAt) updated.finishedAt = sessions.map((s) => s.date).sort().pop();
  } else if (book.status === 'toRead' || book.status === 'wishlist') {
    updated.status = 'reading';
  }
  return { ...state, books: state.books.map((b) => (b.id === bookId ? updated : b)) };
}

/* Reducer generico CRUD sulle collezioni + eliminazione a cascata per mantenere coerenti i riferimenti. */
function reducer(state, action) {
  switch (action.type) {
    case 'SET_ALL':
      return { ...initialState, ...action.payload };

    case 'ADD': {
      const next = { ...state, [action.col]: [...state[action.col], action.item] };
      return action.col === 'sessions' ? syncBookStatus(next, action.item.bookId) : next;
    }

    case 'UPDATE': {
      const next = {
        ...state,
        [action.col]: state[action.col].map((x) => (x.id === action.item.id ? action.item : x)),
      };
      return action.col === 'sessions' ? syncBookStatus(next, action.item.bookId) : next;
    }

    case 'DELETE': {
      const { col, id } = action;
      const next = { ...state, [col]: state[col].filter((x) => x.id !== id) };
      if (col === 'books') {
        next.lists = next.lists.map((l) => ({ ...l, bookIds: l.bookIds.filter((b) => b !== id) }));
        next.sessions = next.sessions.filter((s) => s.bookId !== id);
        next.notes = next.notes.filter((n) => n.bookId !== id);
      }
      if (col === 'authors') {
        next.books = next.books.map((b) => ({ ...b, authorIds: (b.authorIds || []).filter((a) => a !== id) }));
      }
      if (col === 'categories') {
        next.books = next.books.map((b) => (b.categoryId === id ? { ...b, categoryId: null } : b));
      }
      return next;
    }

    default:
      return state;
  }
}

export function LibraryProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loaded, setLoaded] = useState(false);

  // Caricamento iniziale: dati salvati oppure dati di esempio al primo avvio.
  useEffect(() => {
    (async () => {
      const saved = await loadState();
      dispatch({ type: 'SET_ALL', payload: saved || buildSeed() });
      setLoaded(true);
    })();
  }, []);

  // Salvataggio automatico ad ogni modifica dello stato.
  useEffect(() => {
    if (loaded) saveState(state);
  }, [state, loaded]);

  const add = useCallback((col, data) => {
    const item = { ...data, id: data.id || uid() };
    dispatch({ type: 'ADD', col, item });
    return item;
  }, []);
  const update = useCallback((col, item) => dispatch({ type: 'UPDATE', col, item }), []);
  const remove = useCallback((col, id) => dispatch({ type: 'DELETE', col, id }), []);
  const resetData = useCallback(() => dispatch({ type: 'SET_ALL', payload: buildSeed() }), []);
  const clearAll = useCallback(() => dispatch({ type: 'SET_ALL', payload: initialState }), []);

  const value = useMemo(() => {
    const byId = (col, id) => state[col].find((x) => x.id === id);
    return {
      state, loaded, add, update, remove, resetData, clearAll,
      getBook: (id) => byId('books', id),
      getAuthor: (id) => byId('authors', id),
      getCategory: (id) => byId('categories', id),
      getList: (id) => byId('lists', id),
      getSession: (id) => byId('sessions', id),
      getNote: (id) => byId('notes', id),
      getGoal: (id) => byId('goals', id),
      authorNames: (book) => (book.authorIds || []).map((a) => byId('authors', a)?.name).filter(Boolean).join(', ') || 'Autore sconosciuto',
    };
  }, [state, loaded, add, update, remove, resetData, clearAll]);

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export const useLibrary = () => {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary deve essere usato dentro LibraryProvider');
  return ctx;
};
