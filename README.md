# 📚 Personal Library & Reading Journal

App mobile sviluppata in **React Native + Expo SDK 54** per l'esame di Mobile Programming – Università degli Studi di Salerno.

## Funzionalità principali

| Area | Funzionalità |
|---|---|
| **Libreria** | Catalogo completo (libri, fumetti, saggi, manuali, articoli) con CRUD, ricerca e filtri |
| **Autori & Categorie** | Gestione autori e generi con conteggio contenuti associati |
| **Liste** | Liste di lettura personalizzate con riordinamento e stati |
| **Diario** | Note, recensioni e citazioni con tag, pagina e valutazione |
| **Sessioni** | Registrazione sessioni (pagine + minuti) con aggiornamento automatico avanzamento |
| **Statistiche** | Grafici, distribuzione, obiettivi di lettura mensili/annuali |
| **Feature avanzate** | ⏱ Timer focus lettura · 🎯 Obiettivi lettura · 💡 Suggerimenti locali personalizzati |

## Come avviare il progetto

### Prerequisiti
- [Node.js](https://nodejs.org/) v18 o superiore
- [Expo Go](https://expo.dev/go) installato sul telefono (SDK 54)

### Avvio rapido

```bash
# 1. Clona il repository
git clone https://github.com/martinapet04/G10-Fitness-Workout-Tracker-.git
cd PersonalLibrary

# 2. Installa le dipendenze
npm install --legacy-peer-deps

# 3. Avvia il server
npm start
```

Poi:
- **iPhone / Android**: scansiona il QR code con la fotocamera (iOS) o con Expo Go (Android)
- **Web**: premi `w` nel terminale dopo che il server è partito
- **Mac con Xcode**: premi `i` nel terminale per aprire il simulatore iOS

### Note
- Al primo avvio l'app carica automaticamente dati di esempio (10 libri, autori, liste, sessioni, note e obiettivi)
- Tutti i dati sono salvati localmente tramite AsyncStorage — nessuna connessione internet richiesta

## Struttura del progetto

```
PersonalLibrary/
├── App.js                        # Entry point
├── src/
│   ├── context/
│   │   └── LibraryContext.js     # Stato globale (Context API + useReducer)
│   ├── navigation/
│   │   └── AppNavigator.js       # Navigatore (5 tab + stack annidati)
│   ├── screens/
│   │   ├── home/                 # Dashboard
│   │   ├── library/              # Libri, autori, categorie
│   │   ├── lists/                # Liste di lettura
│   │   ├── diary/                # Diario, sessioni, timer focus
│   │   └── stats/                # Statistiche & obiettivi
│   ├── components/
│   │   ├── Basics.js             # Card, Button, Fab, Badge…
│   │   ├── Inputs.js             # SearchBar, Field, ChipSelect, StarRating…
│   │   └── Charts.js             # ProgressBar, BarChart, HBars, StatTile
│   ├── utils/
│   │   ├── helpers.js            # Costanti, calcoli, suggerimenti
│   │   ├── storage.js            # Persistenza AsyncStorage
│   │   └── seed.js               # Dati di esempio
│   └── theme.js                  # Design tokens (colori, spaziature, font)
```

## Tecnologie usate

- **React Native** – framework cross-platform
- **Expo SDK 54** – toolchain e gestione ambiente
- **React Navigation 7** – navigazione (bottom tabs + native stack)
- **Context API + useReducer** – gestione stato globale
- **AsyncStorage** – persistenza locale
- **react-native-uuid** – identificatori univoci
- **@expo/vector-icons** – icone Material Community

## Gruppo di progetto

Università degli Studi di Salerno – Corso di Laurea in Ingegneria Informatica  
Esame: Mobile Programming
