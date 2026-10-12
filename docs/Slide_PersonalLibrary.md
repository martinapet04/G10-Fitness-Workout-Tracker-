# Personal Library & Reading Journal
## Slide di Presentazione — Mobile Programming

---

# SLIDE 1 — Copertina

## 📚 Personal Library
### & Reading Journal

**Traccia #1 — Esame di Mobile Programming**
Università degli Studi di Salerno — A.A. 2025/2026
Corso di Laurea in Ingegneria Informatica

---

# SLIDE 2 — Il Problema

## Il problema che abbiamo risolto

> **"Dove ho messo quella lista di libri da leggere?"**

❌ Note cartacee che si perdono
❌ App cloud che richiedono registrazione
❌ Foglio Excel senza avanzamento in tempo reale
❌ Impossibile tenere traccia di note e impressioni

### La nostra soluzione ✅
Un'app mobile **offline-first**, **intuitiva** e **personalizzabile** che centralizza tutto in un unico posto.

---

# SLIDE 3 — Panoramica dell'App

## Cosa fa Personal Library

```
5 aree principali accessibili con 1 tocco:

🏠  Home          →  Dashboard con libri in corso e azioni rapide
📚  Libreria      →  Catalogo completo con ricerca e filtri
📋  Liste         →  Liste di lettura personalizzate
📓  Diario        →  Note, recensioni, citazioni e sessioni
📊  Statistiche   →  Grafici, obiettivi e suggerimenti
```

**Target:** lettori appassionati, studenti universitari, appassionati di fumetti e saggi

---

# SLIDE 4 — Libreria: Catalogo Completo

## Gestione contenuti di lettura

**Tipologie supportate:**
`Libro` `Fumetto` `Saggio` `Manuale` `Articolo`

**Campi per ogni contenuto:**
- Titolo, autori (multipli), categoria/genere, anno, pagine
- Stato: 📖 In lettura · 🔖 Da leggere · ✅ Letto · 💜 Wishlist
- Valutazione ⭐⭐⭐⭐⭐, note aggiuntive, data completamento

**Funzionalità chiave:**
- 🔍 Ricerca per titolo e autore
- 🎛️ Filtri combinabili: stato + categoria + preferiti
- 📊 Avanzamento in tempo reale (pagine lette / totale)
- 🔄 Aggiornamento automatico stato al completamento

---

# SLIDE 5 — Autori & Categorie

## Organizzazione avanzata

### Autori
- Scheda personale con descrizione e note
- Elenco di tutti i libri associati
- Flag preferito ⭐
- Contatore contenuti

### Categorie / Generi
- Fantascienza · Romanzo · Classici · Saggistica · Informatica
- Statistiche di distribuzione nella libreria
- Navigazione rapida: dal libro all'autore e viceversa

**Design pattern:** Stessa interfaccia per autori e categorie — parametrizzata via route params

---

# SLIDE 6 — Liste di Lettura

## Organizzazione personalizzata

**Esempi di liste create:**
- 📖 Da leggere quest'inverno
- ⭐ Preferiti di sempre
- 📚 Letture per l'esame

**Funzionalità:**
- Creazione con nome, descrizione, note e stato (Attiva / Archiviata)
- Aggiunta libri direttamente dal dettaglio del libro
- **Riordinamento** dei contenuti nella lista tramite frecce ↑↓
- Anteprima dei primi contenuti nella schermata elenco

---

# SLIDE 7 — Diario di Lettura

## Tracciamento completo delle letture

### Sessioni di lettura
```
Data: 12 Ott 2026
Libro: "Il nome della rosa"
Pagine lette: 45
Tempo: 62 minuti
Note: "Capitolo del labirinto, molto denso."
```

### Note, Recensioni, Citazioni
| Tipo | Uso |
|---|---|
| 📝 Nota | Appunti personali, commenti |
| ⭐ Recensione | Valutazione completa con stelle |
| 💬 Citazione | Frasi memorabili con numero di pagina |

**Con tag, numero di pagina e flag preferito**

---

# SLIDE 8 — Statistiche

## Panoramica completa delle abitudini di lettura

### Indicatori principali
```
📚 10 contenuti  |  ✅ 3 letti  |  📖 2 in lettura
📄 1.450 pagine  |  ⏱ 24 ore   |  💬 5 citazioni
```

### Visualizzazioni
- 📊 **Grafico a barre** pagine per mese (ultimi 6 mesi)
- 📈 **Distribuzione** per categoria (barre proporzionali)
- 👤 **Top 5 autori** più presenti in libreria
- 🎯 **Obiettivi** con barra di avanzamento

---

# SLIDE 9 — Feature Avanzata 1: Timer Focus

## ⏱ Modalità Focus Lettura

Ispirata alla tecnica **Pomodoro**: lettura concentrata senza distrazioni.

### Come funziona
1. Scegli un preset: **15 · 25 · 30 · 45 · 60 minuti**
2. Avvia il timer — cerchio visivo che si svuota
3. Al termine: **vibrazione** + schermata "FATTO!"
4. Inserisci le pagine lette → **sessione salvata automaticamente**

### Vantaggi rispetto a un timer esterno
- Il libro è già pre-selezionato se si apre dal dettaglio
- La sessione viene registrata nel diario con tutti i dati
- Il progresso del libro si aggiorna in automatico

---

# SLIDE 10 — Feature Avanzata 2: Obiettivi di Lettura

## 🎯 Obiettivi mensili e annuali

### Configurazione flessibile
- **Periodo:** Mensile o Annuale
- **Unità:** Numero di libri letti oppure Pagine lette
- **Preset rapidi:** 5, 10, 12, 24 libri · 100, 200, 500 pagine

### Esempio visivo
```
Obiettivo 2026 — Libri letti
[█████████░░░░░░░░░░░] 3/12 (25%)

Obiettivo Ottobre 2026 — Pagine lette
[██████████████░░░░░░] 420/600 (70%)
```

- ✅ Barra diventa verde al raggiungimento
- 📊 Visibili anche nella Home per monitoraggio rapido

---

# SLIDE 11 — Feature Avanzata 3: Suggerimenti Locali

## 💡 "Potrebbe piacerti..."

Un algoritmo offline analizza le preferenze personali e suggerisce contenuti dalla libreria.

### Come funziona l'algoritmo
```
Per ogni libro "Da leggere" o "Wishlist":
  score = 0
  Per ogni libro letto con valutazione ≥ 4★:
    + 2 punti se stessa categoria
    + 2 punti per ogni autore in comune
  Mostra top 3 con motivazione esplicita
```

### Esempio di output
```
📖 "Fondazione" — Isaac Asimov
   💡 Ti è piaciuto "Io, Robot" (stessa categoria + stesso autore)

📖 "Se una notte d'inverno..." — Calvino
   💡 Ti è piaciuto "Il barone rampante" (stesso autore)
```

**100% locale, nessuna API esterna**

---

# SLIDE 12 — Architettura Tecnica

## Scelte progettuali

### Stack tecnologico
```
React Native 0.81.5 + Expo SDK 54
React Navigation 7  (Bottom Tabs + Native Stack)
Context API + useReducer  (stato globale)
AsyncStorage  (persistenza locale)
react-native-uuid  (identificatori univoci)
@expo/vector-icons  (iconografia Material)
```

### Pattern architetturale
```
App.js
 └── LibraryProvider (Context + useReducer)
      └── AppNavigator (5 Tab + 5 Stack)
           └── Screens (15 schermate)
                └── Components (Basics, Inputs, Charts)
```

---

# SLIDE 13 — Gestione Stato e Dati

## Come funziona il cuore dell'app

### Reducer CRUD generico
```javascript
case 'ADD':    → aggiunge elemento alla collezione
case 'UPDATE': → aggiorna elemento per ID (immutabilità)
case 'DELETE': → rimuove elemento + cascata automatica
case 'SET_ALL':→ ripristina intero stato (caricamento/reset)
```

### Cascata automatica
Eliminando un **libro** → si eliminano automaticamente:
- Le sessioni di lettura associate
- Le note, recensioni e citazioni associate
- I riferimenti nelle liste

### Persistenza
```javascript
// Salvataggio automatico ad ogni modifica di stato
useEffect(() => { if (loaded) saveState(state); }, [state, loaded]);
```

---

# SLIDE 14 — Organizzazione del Codice

## Struttura modulare e riutilizzabile

```
src/
├── theme.js          — Design tokens (colori, spazi, font)
├── context/          — LibraryContext (stato globale)
├── navigation/       — AppNavigator (routing)
├── components/
│   ├── Basics.js     — Card, Button, Fab, Badge...
│   ├── Inputs.js     — Ricerca, campi, stelle, chip...
│   └── Charts.js     — Grafici, barre, indicatori
├── screens/          — 15 schermate
└── utils/
    ├── helpers.js    — Costanti, algoritmi, calcoli
    ├── storage.js    — AsyncStorage wrapper
    └── seed.js       — Dati di esempio (10 libri)
```

**Principio chiave:** Ogni componente ha una singola responsabilità.
**Riutilizzo:** EntityList/Detail/Form usa la stessa schermata per Autori e Categorie.

---

# SLIDE 15 — Demo dell'App

## Flusso dimostrato in sede

### Percorso 1 — Aggiungere e leggere un libro
1. Home → tocco "Aggiungi libro"
2. Compilazione form (titolo, autore, categoria, pagine)
3. Dettaglio libro → avvio Timer Focus (25 min)
4. Registrazione sessione → aggiornamento avanzamento automatico

### Percorso 2 — Consultare le statistiche
1. Statistiche → panoramica libreria
2. Grafico pagine ultimo mese
3. Obiettivo in corso con barra di progresso
4. Suggerimento personalizzato → apertura libro consigliato

### Dati disponibili per la demo
10 libri di Calvino, Orwell, Asimov, Eco, Herbert già caricati con sessioni, note e citazioni.

---

# SLIDE 16 — Difficoltà e Soluzioni

## Sfide affrontate durante lo sviluppo

### 1. Compatibilità Expo SDK 54
**Problema:** L'app Expo Go su iOS è bloccata alla versione SDK 54.
**Soluzione:** Downgrade forzato con `npm install expo@54.0.0 --legacy-peer-deps` e rimozione dei plugin non supportati da `app.json`.

### 2. Grafici senza librerie esterne
**Problema:** Le librerie come Victory Native causano conflitti con SDK 54.
**Soluzione:** Implementazione di `BarChart` e `HBars` con pure `View` React Native, proporzionali al valore massimo.

### 3. Timer preciso senza stale closure
**Problema:** `setInterval` con `useState` causa letture obsolete del tempo.
**Soluzione:** Uso di `useRef` per il contatore elapsed e funzione di aggiornamento funzionale (`setSecondsLeft(prev => prev - 1)`).

### 4. Navigazione cross-tab con parametri annidati
**Problema:** Passare parametri da Libreria a Diario.
**Soluzione:** `navigation.navigate('Diario', { screen: 'SessionForm', params: { bookId } })`.

---

# SLIDE 17 — Riepilogo e Valutazione

## Copertura della traccia

| Criterio di valutazione | Punteggio max | Stato |
|---|---|---|
| Funzionalità principali (contenuti, autori, liste, diario) | 5 | ✅ Completo |
| Ricerca, filtri, statistiche | 3 | ✅ Completo |
| Navigation, stato, passaggio dati, interazione | 3 | ✅ Completo |
| Persistenza locale e coerenza dati | 2 | ✅ Completo |
| Feature avanzate (Timer + Obiettivi + Suggerimenti) | 2 | ✅ 3/2 impl. |
| Relazione tecnica | 2 | ✅ Completo |
| Slide e presentazione | 1 | ✅ Questo doc |
| **TOTALE** | **18** | **🎯** |

---

# SLIDE 18 — Conclusione

## Personal Library & Reading Journal

### In sintesi
- **15 schermate** completamente funzionali
- **3 feature avanzate** integrate in modo organico
- **Architettura pulita** e facilmente estendibile
- **Offline-first**: funziona sempre, ovunque
- **Dati di esempio** pronti per la demo

### Repository GitHub
🔗 `https://github.com/martinapet04/G10-Fitness-Workout-Tracker-`

### Avvio rapido
```bash
cd PersonalLibrary
npm install --legacy-peer-deps
npm start
```

**Grazie per l'attenzione** 📚

---
*Personal Library & Reading Journal — Mobile Programming 2025/2026*
