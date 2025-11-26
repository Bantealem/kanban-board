import { useEffect, useState } from 'react';

const TaskCard = ({ task, labels, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.title);

  useEffect(() => {
    setValue(task.title);
  }, [task.title]);

  const handleSave = () => {
    const trimmed = value.trim();
    if (!trimmed || trimmed === task.title) {
      setIsEditing(false);
      setValue(task.title);
      return;
    }
    onEdit(trimmed);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValue(task.title);
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition-colors hover:border-indigo-500/50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
      {isEditing ? (
        <input
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
        />
      ) : (
        <p className="text-sm font-semibold">{task.title}</p>
      )}

      <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>ID #{task.id}</span>
        <div className="flex flex-wrap gap-2">
          {isEditing ? (
            <>
              <button
                type="button"
                className="rounded-full bg-indigo-500/15 px-3 py-1 font-medium text-indigo-600 transition hover:bg-indigo-500/25 dark:bg-indigo-500/20 dark:text-indigo-200 dark:hover:bg-indigo-500/30"
                onClick={handleSave}
              >
                {labels.save}
              </button>
              <button
                type="button"
                className="rounded-full bg-slate-200 px-3 py-1 font-medium text-slate-700 transition hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                onClick={handleCancel}
              >
                {labels.cancel}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="rounded-full bg-slate-200 px-3 py-1 font-medium text-slate-700 transition hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                onClick={() => setIsEditing(true)}
              >
                {labels.edit}
              </button>
              <button
                type="button"
                className="rounded-full bg-rose-100 px-3 py-1 font-semibold text-rose-600 transition hover:bg-rose-200 dark:bg-rose-500/20 dark:text-rose-200 dark:hover:bg-rose-500/30"
                onClick={onDelete}
              >
                {labels.delete}
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default TaskCard;

