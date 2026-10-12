# Relazione Tecnica di Progettazione e Sviluppo

## Personal Library & Reading Journal

---

**Università degli Studi di Salerno**
Dipartimento di Ingegneria dell'Informazione ed Elettrica e Matematica (DIEM)
Corso di Laurea in Ingegneria Informatica

**Esame:** Mobile Programming
**Anno Accademico:** 2025/2026
**Traccia:** #1 – Personal Library + Reading Journal App

---

## Indice

1. Descrizione dell'Applicazione
2. Analisi dei Requisiti
3. Progettazione dell'Applicazione
4. Scelte Tecnologiche
5. Implementazione del Sistema
6. Feature Avanzate
7. Testing e Avvio
8. Conclusioni e Sviluppi Futuri

---

## 1. Descrizione dell'Applicazione

### 1.1 Obiettivo

**Personal Library & Reading Journal** è un'applicazione mobile progettata per aiutare l'utente a organizzare la propria libreria personale, tenere traccia delle letture e annotare impressioni, recensioni e citazioni. L'app nasce dalla consapevolezza che la gestione dei libri — catalogare cosa si è letto, cosa si sta leggendo e cosa si vuole leggere — è spesso frammentata tra note cartacee, applicazioni generiche e la memoria. L'obiettivo è centralizzare tutto in uno strumento digitale intuitivo, offline-first e sempre disponibile.

### 1.2 Tipologia di utenti

L'applicazione si rivolge a un pubblico variegato:

- **Lettori appassionati** che vogliono tenere traccia di decine o centinaia di libri letti nel tempo.
- **Studenti universitari** che gestiscono testi di studio, appunti e riferimenti bibliografici.
- **Lettori casuali** che vogliono semplicemente sapere cosa hanno già letto e cosa vogliono leggere in futuro.
- **Appassionati di fumetti e saggi**, dato che l'app supporta multiple tipologie di contenuto.

Non è richiesta alcuna competenza tecnica: l'interfaccia è progettata per essere immediata e accessibile a tutti i livelli di dimestichezza con le app mobile.

### 1.3 Problema che l'app intende risolvere

Il problema principale è la **dispersione delle informazioni di lettura**: i libri letti vengono dimenticati, le impressioni annotate su carta vanno perse, le liste di "da leggere" si accumulano senza organizzazione. Esistono soluzioni come Goodreads, ma richiedono un account online, non funzionano offline e non permettono la personalizzazione profonda. La nostra app è **100% offline**, installabile su qualsiasi dispositivo iOS o Android, e non richiede registrazioni.

### 1.4 Principali scenari d'uso

**Scenario 1 – Catalogazione rapida dopo l'acquisto**
L'utente acquista un libro e lo aggiunge immediatamente alla libreria con titolo, autore, anno e stato "Da leggere". L'operazione richiede meno di 30 secondi.

**Scenario 2 – Sessione di lettura serale**
L'utente apre l'app, attiva il **timer focus** impostato a 30 minuti, legge senza distrazioni e al termine registra le pagine lette. L'avanzamento del libro si aggiorna automaticamente.

**Scenario 3 – Annotazione di una citazione**
Durante la lettura, l'utente trova una frase significativa. Apre il diario e aggiunge una citazione associata al libro, con numero di pagina e tag tematici.

**Scenario 4 – Consultazione delle statistiche mensili**
A fine mese, l'utente apre la sezione Statistiche per vedere quante pagine ha letto, se ha raggiunto l'obiettivo mensile e quali generi ha frequentato di più.

**Scenario 5 – Pianificazione letture future**
L'utente crea una lista "Da leggere quest'inverno" e vi aggiunge 5 libri presi dalla wishlist, riordinandoli in base alla priorità.

---

## 2. Analisi dei Requisiti

### 2.1 Funzionalità implementate

#### Gestione contenuti di lettura
- Aggiunta, modifica, visualizzazione ed eliminazione di contenuti di lettura (libri, fumetti, saggi, manuali, articoli).
- Campi supportati: titolo, autori (multipli), tipologia, categoria/genere, anno di pubblicazione, numero di pagine, stato di lettura, valutazione (stelle 1–5), note aggiuntive, data di completamento, preferito.
- Ricerca full-text per titolo e autore.
- Filtri per stato di lettura (In lettura, Da leggere, Letto, Wishlist), per categoria e per preferiti.
- Ordinamento per data aggiunta, titolo A-Z, valutazione e anno di pubblicazione.
- Visualizzazione dell'avanzamento in lettura (pagine lette / totale con percentuale).
- Aggiornamento automatico dello stato: quando le pagine lette raggiungono il totale, il libro passa automaticamente a "Letto".

#### Gestione autori e categorie
- CRUD completo per autori e categorie/generi.
- Per ogni autore: nome, descrizione, note, flag preferito, conteggio contenuti associati.
- Per ogni categoria: nome, descrizione, note, flag preferito, conteggio contenuti associati.
- Ricerca autori e categorie per nome e descrizione.
- Ordinamento per rilevanza (preferiti prima) e poi alfabetico.
- La rimozione di un autore o categoria non elimina i contenuti: i link vengono semplicemente rimossi.

#### Liste di lettura
- Creazione e gestione di liste personalizzate con nome, descrizione, note e stato (Attiva / Archiviata).
- Aggiunta e rimozione di contenuti da una lista direttamente dal dettaglio del libro.
- Riordinamento dei libri in lista tramite frecce su/giù.
- Visualizzazione anteprima dei primi 3 contenuti nella schermata elenco liste.

#### Diario di lettura e avanzamento
- Registrazione sessioni di lettura: libro associato, data, pagine lette, minuti impiegati, note.
- Visualizzazione mista nel diario: sessioni e annotazioni ordinate cronologicamente.
- Modifica ed eliminazione di qualsiasi sessione.
- Calcolo automatico dell'avanzamento: le pagine lette nelle sessioni vengono sommate e confrontate con il totale del libro.

#### Recensioni, note e citazioni
- Aggiunta di elementi distinti per tipologia: Nota, Recensione, Citazione.
- Campi per ogni elemento: testo, data, numero di pagina, valutazione (per le recensioni), tag (parole chiave separate da virgola), flag preferito.
- Ricerca nel diario per testo e titolo del libro associato.
- Filtro per tipologia (nota / recensione / citazione).

#### Ricerca, filtri e organizzazione
- Barra di ricerca nella libreria (titolo, autore).
- Filtri combinabili: stato di lettura + categoria + preferiti.
- Ordinamento per più criteri.
- Ricerca nel diario (testo note + titolo libro).
- Ricerca in autori e categorie.
- Indicatori visivi delle sessioni associate a ogni libro (count e ultime sessioni).

#### Riepiloghi e statistiche
- Totale contenuti per stato (Letti, In lettura, Da leggere, Wishlist).
- Totale note, citazioni e sessioni di lettura.
- Totale pagine lette e ore di lettura complessive.
- Grafico a barre delle pagine lette negli ultimi 6 mesi.
- Distribuzione dei contenuti per categoria (barre orizzontali proporzionali).
- Classifica dei 5 autori più presenti in libreria.
- Libri letti di recente con valutazione.

### 2.2 Funzionalità considerate ma non implementate

- **Sincronizzazione cloud**: si è preferito un approccio offline-first per garantire la piena funzionalità senza connessione internet. Un'integrazione con Firebase potrebbe essere valutata in versioni future.
- **Import/Export dati** (CSV, JSON): la struttura dello stato globale è serializzabile e già pronta per essere esportata, ma l'interfaccia utente per farlo è stata posticipata.
- **Foto copertine**: l'integrazione di immagini tramite fotocamera o URL avrebbe richiesto dipendenze aggiuntive (expo-image-picker) non strettamente necessarie per la funzionalità base.
- **Notifiche di promemoria**: Expo Notifications avrebbe richiesto un account Expo e configurazioni native non compatibili con l'approccio Expo Go.
- **Condivisione social dei progressi**: esulava dagli obiettivi di un diario personale e avrebbe richiesto un backend.

### 2.3 Feature avanzate scelte

Il gruppo ha scelto di implementare tre feature avanzate:

1. **⏱ Modalità Focus Lettura con Timer**: un timer con preset configurabili (15, 25, 30, 45, 60 minuti), funzionalità avvio/pausa/reset, feedback visivo tramite cerchio animato e salvataggio automatico della sessione al termine.

2. **🎯 Obiettivi di lettura mensili e annuali**: l'utente può impostare obiettivi espressi in numero di libri o in pagine lette, con periodo mensile o annuale. Un indicatore visivo mostra il progresso in tempo reale.

3. **💡 Suggerimenti locali personalizzati**: un algoritmo locale analizza i libri letti con valutazione ≥ 4 stelle e suggerisce contenuti dalla libreria ("Da leggere" o "Wishlist") che condividono autori o categorie preferiti. Nessuna API esterna: tutto calcolato in locale.

### 2.4 Limitazioni note

- **Persistenza locale**: i dati risiedono esclusivamente sul dispositivo. La reinstallazione dell'app o la pulizia della cache di AsyncStorage comporta la perdita dei dati. Non esiste attualmente un meccanismo di backup.
- **Edizioni multiple**: l'app non distingue tra diverse edizioni dello stesso titolo. Se l'utente possiede sia la versione italiana che quella inglese di un libro, dovrà creare due voci separate.
- **Formato fumetti**: i fumetti tipicamente si misurano in volumi, non in pagine. L'app adatta il concetto di "pagine" per semplicità, ma la granularità potrebbe non essere ideale per tutti i formati.

---

## 3. Progettazione dell'Applicazione

### 3.1 Struttura generale

L'applicazione è organizzata in **5 aree tematiche principali**, accessibili tramite una barra di navigazione inferiore (bottom tab bar). Ogni area è gestita da uno stack navigatore annidato che permette di entrare nel dettaglio senza perdere il contesto.

```
App
├── Home          → Dashboard con panoramica e azioni rapide
├── Libreria      → Catalogo contenuti + Autori + Categorie
├── Liste         → Liste di lettura personalizzate
├── Diario        → Note, recensioni, citazioni, sessioni, timer focus
└── Statistiche   → Grafici, obiettivi, suggerimenti
```

La struttura garantisce che ogni funzionalità sia raggiungibile con **al massimo 2-3 tocchi** dalla schermata principale.

### 3.2 Schermate principali

| Schermata | Descrizione |
|---|---|
| **HomeScreen** | Dashboard: libri in corso con avanzamento, obiettivi, ultime sessioni, azioni rapide |
| **BookListScreen** | Elenco libreria con ricerca, filtri combinabili, ordinamento e badge stato |
| **BookDetailScreen** | Dettaglio completo: valutazione a stelle, avanzamento, gestione liste, note e sessioni collegate |
| **BookFormScreen** | Form inserimento/modifica con creazione rapida inline di nuovi autori |
| **EntityListScreen** | Elenco autori o categorie (schermata condivisa parametrizzata) |
| **EntityDetailScreen** | Dettaglio autore/categoria con elenco contenuti collegati |
| **EntityFormScreen** | Form inserimento/modifica autore o categoria |
| **ListsScreen** | Elenco liste con anteprima contenuti |
| **ListDetailScreen** | Dettaglio lista con riordinamento contenuti tramite frecce |
| **ListFormScreen** | Form creazione/modifica lista |
| **DiaryScreen** | Flusso cronologico misto di note e sessioni con filtri |
| **SessionFormScreen** | Registrazione/modifica sessione di lettura |
| **NoteFormScreen** | Aggiunta/modifica nota, recensione o citazione |
| **FocusTimerScreen** | Timer focus con preset, avvio/pausa/reset e salvataggio sessione |
| **StatsScreen** | Statistiche, grafici, obiettivi e suggerimenti personalizzati |

### 3.3 Flusso di navigazione

```
Home
 ├── [tocco libro in corso] → Library/BookDetail
 ├── [tocco sessione]       → Diary/SessionForm
 ├── [bottone Focus]        → Diary/FocusTimer
 └── [bottone + Aggiungi]   → Library/BookForm

Libreria
 ├── [tap card libro]       → BookDetail
 │     ├── [Modifica]       → BookForm
 │     ├── [+ Registra]     → Diary/SessionForm
 │     ├── [Focus]          → Diary/FocusTimer
 │     └── [Nota/Recensione]→ Diary/NoteForm
 ├── [FAB +]                → BookForm
 ├── [bottone Autori]       → EntityList (author)
 │     └── [tap autore]     → EntityDetail → EntityForm
 └── [bottone Categorie]    → EntityList (category)

Liste
 ├── [tap lista]            → ListDetail
 │     ├── [Modifica]       → ListForm
 │     └── [tap libro]      → Library/BookDetail
 └── [FAB +]                → ListForm

Diario
 ├── [tap nota/sessione]    → NoteForm / SessionForm
 └── [FAB +]                → NoteForm

Statistiche
 └── [tap libro suggerito]  → Library/BookDetail
```

### 3.4 Organizzazione dei dati

Il modello dati segue un approccio **relazionale semplificato** basato su identificatori univoci (UUID v4). Ogni collezione è un array JavaScript memorizzato nello stato globale e persistito in AsyncStorage.

**Modello concettuale:**

```
books [id, title, authorIds[], categoryId, type, year, pages,
       status, rating, notes, favorite, finishedAt]
        │              │
        │      categories [id, name, description, notes, favorite]
        │
   authors [id, name, description, notes, favorite]

sessions [id, bookId→, date, pagesRead, minutes, notes]

notes    [id, bookId→, type, text, date, page, rating, tags[], favorite]

lists    [id, name, description, status, notes, bookIds→[]]

goals    [id, period, year, month, target, unit]
```

**Relazioni e integrità referenziale:**
- Un libro può avere **più autori** (relazione N:M tramite array di ID).
- Un libro appartiene a **una categoria** (relazione N:1).
- Le sessioni e le note sono **collegate a un libro** tramite `bookId`.
- Le liste contengono un **array ordinato** di ID libro.
- **Eliminazione a cascata** implementata nel reducer: eliminando un libro si eliminano automaticamente le sue sessioni e note; eliminando un autore si rimuove il suo ID da tutti i libri.

### 3.5 Design dell'interfaccia

Il tema visivo dell'app è ispirato all'estetica delle **librerie fisiche**: toni caldi (cuoio, carta, legno) con accenti in verde petrolio per i dati di avanzamento. Il design system è centralizzato nel file `theme.js` con token espliciti per colori, spaziature, raggi di bordo e dimensioni del testo.

**Scelte stilistiche principali:**
- Bottom tab bar fissa, sempre visibile, con icone Material Community.
- Schede (card) con bordo sottile e ombra leggera come unità base dell'interfaccia.
- Chip selezionabili per filtri e selezioni rapide (più naturali dei menu a tendina su mobile).
- Barra di avanzamento colorata per rendere immediato il progresso di lettura.
- Pulsante flottante (FAB) per le azioni di creazione nelle schermate lista.

---

## 4. Scelte Tecnologiche

### 4.1 Framework: React Native con Expo SDK 54

La scelta di **React Native** è motivata dalla possibilità di sviluppare un'unica codebase JavaScript compatibile sia con iOS che con Android, riducendo significativamente i tempi di sviluppo rispetto alle soluzioni native separate.

**Expo** è stato scelto come toolchain perché:
- Semplifica la configurazione dell'ambiente di sviluppo (nessun Xcode/Android Studio obbligatorio per i test).
- Permette il test in tempo reale su dispositivo fisico tramite **Expo Go**.
- Fornisce accesso ad API native (Haptics, AsyncStorage, Vector Icons) tramite pacchetti pre-configurati.
- La versione **SDK 54** è stata scelta per garantire compatibilità con l'app Expo Go disponibile sull'App Store al momento dello sviluppo.

### 4.2 Librerie principali

| Libreria | Versione | Uso |
|---|---|---|
| `expo` | ~54.0.36 | Toolchain e runtime |
| `react` | 19.1.0 | Framework UI |
| `react-native` | 0.81.5 | Componenti nativi |
| `@react-navigation/native` | ^7.5.0 | Navigazione base |
| `@react-navigation/bottom-tabs` | ^7.20.0 | Tab bar inferiore |
| `@react-navigation/native-stack` | ^7.20.0 | Stack navigatori annidati |
| `react-native-screens` | ~4.16.0 | Ottimizzazione schermate native |
| `react-native-safe-area-context` | ~5.6.0 | Gestione notch e aree sicure |
| `@react-native-async-storage/async-storage` | 2.2.0 | Persistenza locale |
| `react-native-uuid` | ^2.0.4 | Generazione UUID v4 |
| `@expo/vector-icons` | ^15.0.3 | Set di icone Material Community |
| `expo-haptics` | ~15.0.8 | Feedback tattile |
| `expo-status-bar` | ~3.0.9 | Gestione barra di stato |

### 4.3 Motivazione delle scelte

**Perché Context API + useReducer invece di Redux?**
Redux avrebbe introdotto una complessità non giustificata per la dimensione del progetto (boilerplate elevato, middleware, selector). Context API con useReducer offre gli stessi vantaggi architetturali (stato centralizzato, azioni esplicite, aggiornamenti prevedibili) con molto meno codice. La struttura è facilmente migrabile a Redux Toolkit in futuro se necessario.

**Perché AsyncStorage invece di SQLite?**
AsyncStorage è sufficiente per la quantità di dati gestita (decine/centinaia di libri) e non richiede dipendenze native aggiuntive complesse. La serializzazione JSON dell'intero stato in un'unica chiave è semplice, veloce e garantisce atomicità delle scritture. SQLite sarebbe preferibile solo con migliaia di record e query complesse.

**Perché non usare librerie per i grafici (Victory Native, Recharts)?**
I grafici sono stati implementati con componenti `View` nativi. Questa scelta elimina dipendenze pesanti che spesso causano conflitti di versione con Expo, garantisce compatibilità con qualsiasi versione dell'SDK e permette un controllo preciso dello stile.

**Perché react-native-uuid?**
Gli UUID v4 garantiscono unicità degli identificatori senza necessità di un contatore centralizzato o di un backend. Ogni entità creata offline ha un ID globalmente unico, che semplifica l'eventuale futura sincronizzazione cloud.

### 4.4 Gestione della persistenza

La persistenza è implementata nel modulo `src/utils/storage.js` tramite tre funzioni asincrone:

```javascript
// Carica l'intero stato dell'app da AsyncStorage
export async function loadState() {
  const raw = await AsyncStorage.getItem('@personal_library_state_v1');
  return raw ? JSON.parse(raw) : null;
}

// Salva l'intero stato serializzato come JSON
export async function saveState(state) {
  await AsyncStorage.setItem('@personal_library_state_v1', JSON.stringify(state));
}
```

Il salvataggio avviene automaticamente grazie a un `useEffect` nel `LibraryProvider` che si attiva ad ogni cambiamento dello stato:

```javascript
useEffect(() => {
  if (loaded) saveState(state);
}, [state, loaded]);
```

Al primo avvio, se non esistono dati salvati, viene caricato automaticamente un set di dati di esempio (10 libri, 6 autori, 5 categorie, sessioni, note, liste e obiettivi) dal modulo `seed.js`.

---

## 5. Implementazione del Sistema

### 5.1 Organizzazione del codice

```
PersonalLibrary/
├── App.js                          # Root: LibraryProvider + AppNavigator
├── index.js                        # Entry point Expo
├── app.json                        # Configurazione Expo
├── package.json                    # Dipendenze
└── src/
    ├── theme.js                    # Design tokens centralizzati
    ├── context/
    │   └── LibraryContext.js       # Stato globale + Provider + hook useLibrary
    ├── navigation/
    │   └── AppNavigator.js         # 5 Tab + 5 Stack annidati
    ├── components/
    │   ├── Basics.js               # Card, Button, Fab, Badge, EmptyState, InfoRow
    │   ├── Inputs.js               # SearchBar, Field, DateField, ChipSelect, StarRating, ToggleRow
    │   └── Charts.js               # ProgressBar, StatTile, BarChart, HBars
    ├── screens/
    │   ├── home/HomeScreen.js
    │   ├── library/
    │   │   ├── BookListScreen.js
    │   │   ├── BookDetailScreen.js
    │   │   ├── BookFormScreen.js
    │   │   ├── EntityListScreen.js
    │   │   ├── EntityDetailScreen.js
    │   │   └── EntityFormScreen.js
    │   ├── lists/
    │   │   ├── ListsScreen.js
    │   │   ├── ListDetailScreen.js
    │   │   └── ListFormScreen.js
    │   ├── diary/
    │   │   ├── DiaryScreen.js
    │   │   ├── SessionFormScreen.js
    │   │   ├── NoteFormScreen.js
    │   │   └── FocusTimerScreen.js
    │   └── stats/StatsScreen.js
    └── utils/
        ├── helpers.js              # Costanti, calcoli, algoritmi
        ├── storage.js              # AsyncStorage wrapper
        └── seed.js                 # Dati di esempio
```

### 5.2 Componenti/widget principali

**`LibraryContext.js` — Cervello dell'applicazione**

Implementa il pattern Provider/Consumer con `createContext`, `useReducer` e un hook custom `useLibrary`. Espone:
- Lo stato completo (`books`, `authors`, `categories`, `lists`, `sessions`, `notes`, `goals`).
- Funzioni CRUD generiche (`add`, `update`, `remove`) che accettano il nome della collezione come parametro.
- Funzioni di accesso rapido (`getBook`, `getAuthor`, `authorNames`, ecc.).
- Funzioni di reset (`resetData`, `clearAll`).

**`Basics.js` — Libreria di componenti base**

- `Card`: contenitore con bordo e ombra; se riceve `onPress` diventa `TouchableOpacity`.
- `Button`: pulsante con 4 varianti stilistiche (primary, secondary, danger, ghost) e supporto icona.
- `Fab`: pulsante flottante circolare per le azioni di creazione.
- `EmptyState`: placeholder visivo per le liste vuote, con icona e messaggio.
- `Badge`: etichetta colorata con icona opzionale, usata per stato di lettura e tipologia.
- `InfoRow`: riga con icona, etichetta e valore per le schermate di dettaglio.

**`Inputs.js` — Componenti di input**

- `SearchBar`: barra di ricerca con icona, campo testo e bottone di reset.
- `Field`: campo di testo con etichetta, gestione errori e supporto multiline.
- `DateField`: campo data con validazione formato AAAA-MM-GG e scorciatoia "Oggi".
- `ChipSelect`: selettore a chip con modalità singola e multipla.
- `FilterChips`: riga orizzontale scorrevole di chip per i filtri.
- `StarRating`: valutazione a 5 stelle; in modalità sola lettura o interattiva.
- `ToggleRow`: interruttore on/off stilizzato per flag booleani.

**`Charts.js` — Visualizzazioni dati**

- `ProgressBar`: barra di avanzamento orizzontale con colore e altezza configurabili.
- `StatTile`: riquadro numerico con icona e colore per i riepiloghi.
- `BarChart`: grafico a barre verticali costruito con View (senza librerie esterne).
- `HBars`: distribuzione con barre orizzontali proporzionali.

### 5.3 Gestione dello stato

Lo stato è gestito da un unico `useReducer` con le seguenti azioni:

```javascript
// SET_ALL: ripristina l'intero stato (usato al caricamento iniziale e al reset)
case 'SET_ALL':
  return { ...initialState, ...action.payload };

// ADD: aggiunge un elemento a una collezione; se si tratta di una sessione,
//      aggiorna automaticamente lo stato del libro associato
case 'ADD': {
  const next = { ...state, [action.col]: [...state[action.col], action.item] };
  return action.col === 'sessions' ? syncBookStatus(next, action.item.bookId) : next;
}

// UPDATE: aggiorna un elemento per ID (immutabilità garantita con map)
case 'UPDATE': {
  const next = {
    ...state,
    [action.col]: state[action.col].map(x => x.id === action.item.id ? action.item : x),
  };
  return action.col === 'sessions' ? syncBookStatus(next, action.item.bookId) : next;
}

// DELETE: rimuove un elemento e applica la cascata se necessario
case 'DELETE': {
  const next = { ...state, [col]: state[col].filter(x => x.id !== id) };
  if (col === 'books') {
    next.lists = next.lists.map(l => ({ ...l, bookIds: l.bookIds.filter(b => b !== id) }));
    next.sessions = next.sessions.filter(s => s.bookId !== id);
    next.notes = next.notes.filter(n => n.bookId !== id);
  }
  // ... altri casi di cascata
  return next;
}
```

La funzione `syncBookStatus` aggiorna automaticamente lo stato di lettura di un libro dopo ogni modifica alle sessioni:

```javascript
function syncBookStatus(state, bookId) {
  const book = state.books.find(b => b.id === bookId);
  const sessions = state.sessions.filter(s => s.bookId === bookId);
  const totalRead = sumPages(sessions);
  const updated = { ...book };
  if (book.pages && totalRead >= book.pages) {
    updated.status = 'read';
    if (!updated.finishedAt) updated.finishedAt = /* data più recente */;
  } else if (book.status === 'toRead' || book.status === 'wishlist') {
    updated.status = 'reading'; // transizione automatica alla prima sessione
  }
  return { ...state, books: state.books.map(b => b.id === bookId ? updated : b) };
}
```

### 5.4 Gestione della navigazione

La navigazione è strutturata con **React Navigation 7** usando due tipi di navigatori:

- **Bottom Tab Navigator**: gestisce le 5 aree principali (Home, Libreria, Liste, Diario, Statistiche).
- **Native Stack Navigator**: gestisce la navigazione "in profondità" all'interno di ogni area, preservando lo stack di schermate precedenti.

Il passaggio di dati tra schermate avviene tramite i **parametri di navigazione** (route.params):

```javascript
// Navigazione con parametro dall'elenco al dettaglio
navigation.navigate('BookDetail', { id: book.id });

// Navigazione cross-tab dal dettaglio al diario (pre-compilazione del form)
navigation.navigate('Diario', { screen: 'SessionForm', params: { bookId: id } });

// Navigazione cross-tab dalle statistiche alla libreria
navigation.navigate('Library', { screen: 'BookDetail', params: { id: book.id } });
```

La navigazione cross-tab (da una tab all'altra con parametri annidati) è particolarmente significativa: dal dettaglio di un libro si può aprire direttamente il form di aggiunta sessione nella tab Diario, con il libro già pre-selezionato.

### 5.5 Parti particolarmente significative o complesse

**Algoritmo di suggerimento locale (`helpers.js` → `recommendBooks`)**

L'algoritmo analizza i libri letti con valutazione ≥ 4 stelle e assegna un punteggio a ogni libro non ancora letto in base alla sovrapposizione di categoria (peso 2) e autori (peso 2 per ogni autore in comune). I libri vengono poi ordinati per punteggio e viene restituita la motivazione del suggerimento:

```javascript
export function recommendBooks(state, limit = 3) {
  const liked = state.books.filter(b => b.status === 'read' && Number(b.rating) >= 4);
  const candidates = state.books.filter(b => b.status === 'toRead' || b.status === 'wishlist');
  const scored = candidates.map(c => {
    let score = c.favorite ? 1 : 0;
    let reason = null;
    liked.forEach(l => {
      let s = 0;
      if (l.categoryId && l.categoryId === c.categoryId) s += 2;
      s += 2 * (l.authorIds || []).filter(a => (c.authorIds || []).includes(a)).length;
      score += s;
      if (s > 0) reason = `Ti è piaciuto "${l.title}"`;
    });
    return { book: c, score, reason: reason || 'Dalla tua lista di lettura' };
  });
  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}
```

**Timer focus con gestione ciclo di vita (`FocusTimerScreen.js`)**

Il timer è implementato con `setInterval` gestito tramite `useRef` per evitare chiusure obsolete (stale closure). Il tempo elapsed viene accumulato in un ref separato per garantire la precisione anche in caso di re-render:

```javascript
useEffect(() => {
  if (running) {
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          setDone(true);
          Vibration.vibrate([0, 300, 200, 300]); // feedback tattile
          return 0;
        }
        elapsed.current += 1;
        return prev - 1;
      });
    }, 1000);
  } else {
    clearInterval(intervalRef.current);
  }
  return () => clearInterval(intervalRef.current); // cleanup alla smontatura
}, [running]);
```

**Schema EntityList/EntityDetail/EntityForm parametrizzato**

Autori e categorie condividono le stesse tre schermate, differenziate solo da un parametro `type` passato in navigazione. La configurazione per ogni tipo è definita nell'oggetto `ENTITY` in `helpers.js`:

```javascript
export const ENTITY = {
  author: { col: 'authors', plural: 'Autori', singular: 'Autore',
            icon: 'account-edit-outline', match: (book, id) => (book.authorIds || []).includes(id) },
  category: { col: 'categories', plural: 'Categorie', singular: 'Categoria',
               icon: 'shape-outline', match: (book, id) => book.categoryId === id },
};
```

Questo pattern riduce il codice duplicato di circa il 70% e garantisce coerenza dell'interfaccia tra le due entità.

---

## 6. Feature Avanzate

### 6.1 Timer Focus Lettura

La modalità focus si ispira alla tecnica Pomodoro: sessioni di lettura concentrata con durata predefinita, senza distrazioni. Funzionalità implementate:
- **5 preset di durata**: 15, 25, 30, 45 e 60 minuti, selezionabili tramite chip.
- **Visualizzazione timer**: cerchio con il tempo rimanente in formato MM:SS. Quando la sessione termina, il colore cambia al verde e compare la scritta "FATTO!".
- **Controlli**: avvio/pausa e reset. Il timer non può essere avviato dopo il completamento (solo reset).
- **Feedback multimodale**: vibrazione del dispositivo al termine (pattern doppio).
- **Salvataggio sessione**: al termine (o con tempo parziale) appare un form pre-compilato per registrare le pagine lette e salvare la sessione nel diario.
- **Pre-selezione libro**: se la schermata viene aperta dal dettaglio di un libro, quel libro è già selezionato nel form di salvataggio.

### 6.2 Obiettivi di Lettura

L'utente può impostare obiettivi di lettura con massima flessibilità:
- **Tipo di periodo**: mensile (mese corrente) o annuale (anno corrente).
- **Unità di misura**: numero di libri completati oppure numero di pagine lette.
- **Preset numerici rapidi**: bottoni con valori comuni (5, 10, 12, 24 libri; 100, 200, 500 pagine) per inserimento veloce.
- **Calcolo in tempo reale**: il progresso viene ricalcolato ad ogni accesso alla schermata Statistiche in base alle sessioni e ai libri letti registrati nel periodo.
- **Gestione multipla**: è possibile avere più obiettivi attivi contemporaneamente (es. annuale in libri + mensile in pagine).
- **Indicatore di completamento**: quando l'obiettivo viene raggiunto, la barra diventa verde e compare un'emoji ✅.

### 6.3 Suggerimenti Locali Personalizzati

L'algoritmo di suggerimento analizza le preferenze personali dell'utente in modo completamente offline:
1. Identifica i libri letti con valutazione ≥ 4 stelle ("libri piaciuti").
2. Per ogni libro non letto (stato "Da leggere" o "Wishlist"), calcola uno score basato su:
   - Stessa categoria dei libri piaciuti: +2 punti.
   - Autori in comune con i libri piaciuti: +2 punti per autore condiviso.
   - Flag preferito: +1 punto bonus.
3. Ordina i candidati per score decrescente e mostra i top 3 con motivazione esplicita ("Ti è piaciuto 'Il barone rampante'").
4. Se non ci sono abbastanza dati per generare suggerimenti (nessun libro letto o valutato), la sezione viene nascosta.

---

## 7. Testing e Avvio

### 7.1 Requisiti di sistema

- **Node.js** v18 o superiore
- **npm** v9 o superiore
- **Expo Go** v54 installato su dispositivo iOS o Android

### 7.2 Istruzioni per l'avvio

```bash
# Clona il repository
git clone https://github.com/martinapet04/G10-Fitness-Workout-Tracker-.git
cd PersonalLibrary

# Installa le dipendenze (--legacy-peer-deps per compatibilità SDK 54)
npm install --legacy-peer-deps

# Avvia il server Expo
npm start
```

**Opzioni di avvio:**
- **Dispositivo fisico iOS**: scansiona il QR code con l'app Fotocamera nativa.
- **Dispositivo fisico Android**: scansiona il QR code con l'app Expo Go.
- **Simulatore iOS (Mac)**: premi `i` nel terminale dopo l'avvio del server.
- **Browser web**: premi `w` nel terminale (funzionalità limitate per le API native).
- **Con cache pulita**: `npm start -- -c` (consigliato dopo aggiornamenti di dipendenze).

### 7.3 Dati di esempio

Al primo avvio, l'app carica automaticamente un dataset di esempio che include:
- **10 libri** di autori italiani e internazionali, in stati diversi (letti, in lettura, da leggere, wishlist).
- **6 autori** (Calvino, Orwell, Asimov, Eco, Herbert, Martin).
- **5 categorie** (Romanzo, Fantascienza, Classici, Saggistica, Informatica).
- **Sessioni di lettura** distribuite sugli ultimi 2 mesi per popolare i grafici.
- **5 note, recensioni e citazioni** associate ai libri letti.
- **3 liste** di lettura con libri associati.
- **2 obiettivi** (annuale in libri, mensile in pagine) con progresso parziale.

---

## 8. Conclusioni e Sviluppi Futuri

### 8.1 Risultati raggiunti

Il progetto ha implementato tutte le funzionalità richieste dalla traccia, coprendo l'intero ciclo di vita della gestione delle letture: dalla catalogazione iniziale, alla pianificazione, all'esecuzione e alla riflessione tramite note e statistiche. Sono state implementate tre feature avanzate (timer focus, obiettivi di lettura, suggerimenti locali) che aggiungono valore concreto all'esperienza utente.

L'architettura adottata — Context API + useReducer + AsyncStorage — garantisce una base solida, manutenibile e pronta per essere estesa. Il codice è organizzato in moduli riutilizzabili con una chiara separazione di responsabilità.

### 8.2 Possibili evoluzioni future

- **Sincronizzazione cloud** tramite Firebase Firestore, mantenendo la modalità offline come fallback.
- **Backup e ripristino** con export/import in formato JSON.
- **Foto copertine** tramite expo-image-picker o integrazione con l'API di Open Library.
- **Notifiche di promemoria** per le sessioni di lettura pianificate.
- **Widget iOS/Android** per mostrare il libro in corso e il progresso direttamente nella schermata home del dispositivo.
- **Modalità dark** con supporto al sistema operativo (useColorScheme).
- **Integrazione con Goodreads API** per importare la propria libreria esistente.

---

*Documento generato per la consegna del progetto di Mobile Programming.*
*Università degli Studi di Salerno – Anno Accademico 2025/2026*
