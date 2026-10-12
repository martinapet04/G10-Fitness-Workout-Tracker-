import { uid, today, addDays } from './helpers';

// Dati di esempio caricati al primo avvio (e al ripristino dalla schermata Statistiche).
export function buildSeed() {
  const t = today();
  const year = Number(t.slice(0, 4));
  const month = Number(t.slice(5, 7));

  const authors = [
    { id: uid(), name: 'Italo Calvino', description: 'Scrittore italiano, maestro della narrativa fantastica e combinatoria.', notes: 'Da rileggere "Le città invisibili".', favorite: true },
    { id: uid(), name: 'George Orwell', description: 'Autore britannico, noto per le sue distopie politiche.', notes: '', favorite: true },
    { id: uid(), name: 'Isaac Asimov', description: 'Biochimico e scrittore, padre della fantascienza classica.', notes: 'Ciclo della Fondazione.', favorite: false },
    { id: uid(), name: 'Umberto Eco', description: 'Semiologo e romanziere italiano.', notes: '', favorite: false },
    { id: uid(), name: 'Frank Herbert', description: 'Autore del ciclo di Dune.', notes: '', favorite: false },
    { id: uid(), name: 'Robert C. Martin', description: 'Ingegnere del software, autore di "Clean Code".', notes: 'Utile per il corso.', favorite: false },
  ];
  const [calvino, orwell, asimov, eco, herbert, martin] = authors;

  const categories = [
    { id: uid(), name: 'Romanzo', description: 'Narrativa di finzione contemporanea e moderna.', notes: '', favorite: false },
    { id: uid(), name: 'Fantascienza', description: 'Letteratura speculativa e futuristica.', notes: 'Genere preferito.', favorite: true },
    { id: uid(), name: 'Classici', description: 'Opere fondamentali della letteratura.', notes: '', favorite: false },
    { id: uid(), name: 'Saggistica', description: 'Saggi e divulgazione.', notes: '', favorite: false },
    { id: uid(), name: 'Informatica', description: 'Manuali tecnici e programmazione.', notes: '', favorite: false },
  ];
  const [romanzo, scifi, classici, saggi, info] = categories;

  const mk = (title, authorIds, type, categoryId, year_, pages, status, rating, extra = {}) => ({
    id: uid(), title, authorIds, type, categoryId, year: year_, pages, status, rating, notes: '', favorite: false, finishedAt: null, ...extra,
  });

  const books = [
    mk('Il barone rampante', [calvino.id], 'Libro', romanzo.id, 1957, 288, 'read', 5, { favorite: true, notes: 'Bellissimo, ironico e malinconico.' }),
    mk('1984', [orwell.id], 'Libro', classici.id, 1949, 328, 'read', 5, { favorite: true }),
    mk('Io, robot', [asimov.id], 'Libro', scifi.id, 1950, 253, 'read', 4),
    mk('Il nome della rosa', [eco.id], 'Libro', romanzo.id, 1980, 503, 'reading', 0),
    mk('Dune', [herbert.id], 'Libro', scifi.id, 1965, 612, 'reading', 0, { notes: 'Edizione tascabile.' }),
    mk('Fondazione', [asimov.id], 'Libro', scifi.id, 1951, 255, 'toRead', 0),
    mk('La fattoria degli animali', [orwell.id], 'Libro', classici.id, 1945, 144, 'toRead', 0),
    mk('Clean Code', [martin.id], 'Manuale', info.id, 2008, 464, 'toRead', 0, { notes: 'Per il corso di Ingegneria del Software.' }),
    mk('Se una notte d’inverno un viaggiatore', [calvino.id], 'Libro', romanzo.id, 1979, 270, 'wishlist', 0),
    mk('Apocalittici e integrati', [eco.id], 'Saggio', saggi.id, 1964, 400, 'wishlist', 0),
  ];
  const [barone, orwell1984, iorobot, nome, dune] = books;

  // Genera sessioni di lettura distribuite sui giorni indicati (offset in giorni dal presente).
  const sessions = [];
  const spread = (book, totalPages, offsets) => {
    const per = Math.ceil(totalPages / offsets.length);
    let left = totalPages;
    offsets.forEach((off, i) => {
      const p = Math.min(per, left);
      left -= p;
      sessions.push({
        id: uid(), bookId: book.id, date: addDays(t, -off), pagesRead: p,
        minutes: Math.round(p * 1.7) + 5 + i, notes: i === 0 ? 'Prima sessione.' : '',
      });
    });
  };
  spread(barone, barone.pages, [58, 55, 51, 47, 44, 40, 38]);
  barone.finishedAt = addDays(t, -38);
  spread(orwell1984, orwell1984.pages, [34, 31, 28, 25, 21, 19]);
  orwell1984.finishedAt = addDays(t, -19);
  spread(iorobot, iorobot.pages, [16, 13, 10, 8]);
  iorobot.finishedAt = addDays(t, -8);
  spread(nome, 210, [6, 4, 2, 1]);
  spread(dune, 130, [5, 3, 0]);

  const notes = [
    { id: uid(), bookId: barone.id, type: 'quote', text: 'Chi vuole guardare bene la terra deve tenersi alla distanza necessaria.', date: addDays(t, -40), page: 262, rating: 0, tags: ['filosofia', 'vita'], favorite: true },
    { id: uid(), bookId: barone.id, type: 'review', text: 'Un romanzo di formazione fuori dal comune: l’idea di vivere sugli alberi diventa una metafora potentissima della libertà.', date: addDays(t, -38), page: null, rating: 5, tags: ['romanzo'], favorite: false },
    { id: uid(), bookId: orwell1984.id, type: 'quote', text: 'Chi controlla il passato controlla il futuro; chi controlla il presente controlla il passato.', date: addDays(t, -25), page: 44, rating: 0, tags: ['potere', 'distopia'], favorite: true },
    { id: uid(), bookId: iorobot.id, type: 'note', text: 'Le tre leggi della robotica sono il filo conduttore di tutti i racconti.', date: addDays(t, -10), page: 90, rating: 0, tags: ['robot'], favorite: false },
    { id: uid(), bookId: nome.id, type: 'note', text: 'Atmosfera da giallo medievale, molto ricca di riferimenti.', date: addDays(t, -2), page: 120, rating: 0, tags: ['giallo'], favorite: false },
  ];

  const lists = [
    { id: uid(), name: 'Da leggere quest’inverno', description: 'Le letture che voglio affrontare nei prossimi mesi.', status: 'active', notes: '', bookIds: [books[5].id, books[6].id, books[7].id] },
    { id: uid(), name: 'Preferiti di sempre', description: 'I libri che consiglierei a chiunque.', status: 'active', notes: '', bookIds: [barone.id, orwell1984.id] },
    { id: uid(), name: 'Letture per l’esame', description: 'Testi di studio.', status: 'archived', notes: '', bookIds: [books[7].id] },
  ];

  const goals = [
    { id: uid(), period: 'year', year, month: null, target: 12, unit: 'books' },
    { id: uid(), period: 'month', year, month, target: 300, unit: 'pages' },
  ];

  return { authors, categories, books, lists, sessions, notes, goals };
}
