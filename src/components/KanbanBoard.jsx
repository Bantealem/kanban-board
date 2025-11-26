import { useEffect, useMemo, useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';
import { addTask, deleteTask, getTasks, updateTask } from '../api/tasks';
import { COLUMN_ORDER, COLUMN_SET, TRANSLATIONS } from '../constants';
import { useUi } from '../context/UiContext';

const createEmptyColumns = () =>
  COLUMN_ORDER.reduce((acc, id) => {
    acc[id] = [];
    return acc;
  }, {});

const cloneColumns = (columns) =>
  typeof structuredClone === 'function' ? structuredClone(columns) : JSON.parse(JSON.stringify(columns));

const TaskComposer = ({ labels, buttons, columns, onAdd, isSubmitting }) => {
  const [title, setTitle] = useState('');
  const [selectedColumn, setSelectedColumn] = useState(columns[0]?.id ?? 'todo');

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd({ title: trimmed, status: selectedColumn });
    setTitle('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60 md:flex-row md:items-end"
    >
      <div className="flex-1">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
          {labels.titleLabel}
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={labels.placeholder}
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
      </div>
      <div className="md:w-48">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
          {labels.columnLabel}
        </label>
        <select
          value={selectedColumn}
          onChange={(e) => setSelectedColumn(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          {columns.map((column) => (
            <option key={column.id} value={column.id}>
              {column.label}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-11 rounded-xl bg-indigo-500 px-6 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-400 dark:text-slate-900 dark:hover:bg-indigo-300"
      >
        {isSubmitting ? buttons.saving : buttons.addTask}
      </button>
    </form>
  );
};

const KanbanBoard = ({ activeColumn }) => {
  const { language } = useUi();
  const dictionary = TRANSLATIONS[language];
  const [columns, setColumns] = useState(createEmptyColumns());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const flatTasks = useMemo(() => Object.values(columns).flat(), [columns]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasks = await getTasks();
        const next = createEmptyColumns();
        tasks.forEach((task) => {
          const bucket = COLUMN_SET.has(task.status) ? task.status : 'todo';
          next[bucket].push(task);
        });
        setColumns(next);
      } catch (err) {
        setError(err.message || 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const syncColumns = (updater) => {
    setColumns((prev) => {
      const draft = cloneColumns(prev);
      updater(draft);
      return draft;
    });
  };

  const handleAddTask = async ({ title, status }) => {
    try {
      setIsAdding(true);
      const created = await addTask({ title, status, completed: status === 'done' });
      syncColumns((draft) => {
        const bucket = COLUMN_SET.has(created.status) ? created.status : 'todo';
        draft[bucket].unshift(created);
      });
    } catch (err) {
      setError(err.message || 'Failed to add task');
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditTask = async (columnId, taskId, nextTitle) => {
    const trimmed = nextTitle.trim();
    if (!trimmed) return;

    const previous = cloneColumns(columns);
    syncColumns((draft) => {
      const target = draft[columnId]?.find((task) => task.id === taskId);
      if (target) target.title = trimmed;
    });

    try {
      await updateTask(taskId, { title: trimmed });
    } catch (err) {
      setError(err.message || 'Failed to update task');
      setColumns(previous);
    }
  };

  const handleDeleteTask = async (columnId, taskId) => {
    const previous = cloneColumns(columns);
    syncColumns((draft) => {
      draft[columnId] = draft[columnId]?.filter((task) => task.id !== taskId) || [];
    });

    try {
      await deleteTask(taskId);
    } catch (err) {
      setError(err.message || 'Failed to delete task');
      setColumns(previous);
    }
  };

  const handleDragStart = () => setIsDragging(true);

  const handleDragEnd = async ({ source, destination }) => {
    setIsDragging(false);
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const movedTask = columns[source.droppableId][source.index];
    if (!movedTask) return;

    const previousColumns = cloneColumns(columns);
    const updatedTask = {
      ...movedTask,
      status: destination.droppableId,
      completed: destination.droppableId === 'done',
    };

    syncColumns((draft) => {
      draft[source.droppableId].splice(source.index, 1);
      draft[destination.droppableId].splice(destination.index, 0, updatedTask);
    });

    try {
      await updateTask(movedTask.id, {
        status: updatedTask.status,
        completed: updatedTask.completed,
      });
    } catch (err) {
      setError(err.message || 'Failed to move task');
      setColumns(previousColumns);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-3xl border border-slate-200 bg-white/80 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-500 dark:border-slate-700 dark:border-t-indigo-400" />
      </div>
    );
  }

  const columnOptions = COLUMN_ORDER.map((id) => ({
    id,
    label: dictionary.columns[id],
  }));
  const visibleColumnOptions =
    isDragging || !activeColumn || !COLUMN_SET.has(activeColumn)
      ? columnOptions
      : columnOptions.filter((column) => column.id === activeColumn);

  const columnLabels = {
    columnTag: dictionary.labels.columnTag,
    task: {
      edit: dictionary.buttons.edit,
      delete: dictionary.buttons.delete,
      save: dictionary.buttons.save,
      cancel: dictionary.buttons.cancel,
    },
  };

  return (
    <>
      {error && (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-200">
          {error}
        </div>
      )}

      <TaskComposer
        labels={dictionary.composer}
        buttons={dictionary.buttons}
        columns={columnOptions}
        onAdd={handleAddTask}
        isSubmitting={isAdding}
      />

      <div className="text-sm text-slate-500 dark:text-slate-400">
        {dictionary.stats.total}:{' '}
        <span className="font-semibold text-slate-900 dark:text-white">{flatTasks.length}</span>
      </div>

      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleColumnOptions.map((column) => (
            <Column
              key={column.id}
              columnId={column.id}
              title={column.label}
              tasks={columns[column.id]}
              labels={columnLabels}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </section>
      </DragDropContext>
    </>
  );
};

export default KanbanBoard;

