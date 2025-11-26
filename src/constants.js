export const COLUMN_ORDER = ['todo', 'in-progress', 'done'];

export const COLUMN_SET = new Set(COLUMN_ORDER);

export const COLUMNS = COLUMN_ORDER.reduce((acc, id) => {
  acc[id] = true;
  return acc;
}, {});

export const TRANSLATIONS = {
  en: {
    header: {
      eyebrow: 'Productivity',
      title: 'Kanban Board',
      subtitle: 'Drag cards to update task status across the workflow.',
    },
    columns: {
      todo: 'To Do',
      'in-progress': 'In Progress',
      done: 'Done',
    },
    composer: {
      titleLabel: 'Task title',
      columnLabel: 'Column',
      placeholder: 'Add a new task...',
    },
    labels: {
      columnTag: 'Column',
    },
    stats: {
      total: 'Total tasks',
    },
    buttons: {
      addTask: 'Add Task',
      saving: 'Saving...',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      languageToggle: 'Italiano',
      themeDark: 'Dark Theme',
      themeLight: 'Light Theme',
      menu: 'Menu',
    },
  },
  it: {
    header: {
      eyebrow: 'Produttività',
      title: 'Bacheca Kanban',
      subtitle: 'Trascina le card per aggiornare lo stato delle attività.',
    },
    columns: {
      todo: 'Da fare',
      'in-progress': 'In corso',
      done: 'Completate',
    },
    composer: {
      titleLabel: 'Titolo attività',
      columnLabel: 'Colonna',
      placeholder: 'Aggiungi una nuova attività...',
    },
    labels: {
      columnTag: 'Colonna',
    },
    stats: {
      total: 'Attività totali',
    },
    buttons: {
      addTask: 'Aggiungi task',
      saving: 'Salvataggio...',
      edit: 'Modifica',
      delete: 'Elimina',
      save: 'Salva',
      cancel: 'Annulla',
      languageToggle: 'English',
      themeDark: 'Tema scuro',
      themeLight: 'Tema chiaro',
      menu: 'Menu',
    },
  },
};

export const DEFAULT_LANGUAGE = 'en';
export const DEFAULT_THEME = 'dark';

