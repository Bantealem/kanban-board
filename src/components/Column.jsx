import { Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

const Column = ({ columnId, title, tasks, labels, onEditTask, onDeleteTask }) => (
  <div className="flex h-full min-h-[22rem] flex-1 flex-col rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
    <header className="mb-4 flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          {labels.columnTag}
        </p>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
      </div>
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
        {tasks.length}
      </span>
    </header>

    <Droppable droppableId={columnId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`flex flex-1 flex-col gap-3 overflow-y-auto rounded-2xl border border-dashed border-transparent p-1 transition-colors ${
            snapshot.isDraggingOver
              ? 'border-indigo-400/60 bg-indigo-50/60 dark:border-indigo-400/40 dark:bg-indigo-500/10'
              : ''
          }`}
        >
          {tasks.map((task, index) => (
            <Draggable key={task.id} draggableId={task.id} index={index}>
              {(dragProvided, dragSnapshot) => (
                <div
                  ref={dragProvided.innerRef}
                  {...dragProvided.draggableProps}
                  {...dragProvided.dragHandleProps}
                  className={`rounded-2xl border ${
                    dragSnapshot.isDragging
                      ? 'border-indigo-400 bg-white shadow-lg dark:border-indigo-400 dark:bg-slate-900'
                      : 'border-transparent'
                  }`}
                >
                  <TaskCard
                    task={task}
                    labels={labels.task}
                    onEdit={(title) => onEditTask(columnId, task.id, title)}
                    onDelete={() => onDeleteTask(columnId, task.id)}
                  />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </div>
);

export default Column;

