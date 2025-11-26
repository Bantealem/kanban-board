import api from './api';

const normalizeTask = (task) => ({
  id: String(task.id),
  title: task.todo ?? task.title ?? 'Untitled task',
  completed: Boolean(task.completed),
  status: task.status ?? (task.completed ? 'done' : 'todo'),
});

export const getTasks = async (limit = 30) => {
  const { data } = await api.get(`/todos?limit=${limit}`);
  return data.todos.map(normalizeTask);
};

export const addTask = async (task) => {
  const payload = {
    todo: task.title || task.todo,
    completed: Boolean(task.completed),
    status: task.status ?? 'todo',
    userId: task.userId ?? 1,
  };
  const { data } = await api.post('/todos/add', payload);
  return normalizeTask({ ...data, status: payload.status });
};

export const updateTask = async (id, updates) => {
  const payload = {};
  if (updates.title || updates.todo) {
    payload.todo = updates.title || updates.todo;
  }
  if (updates.completed !== undefined) {
    payload.completed = Boolean(updates.completed);
  }

  const { data } = await api.put(`/todos/${id}`, payload);
  return normalizeTask({
    ...data,
    status: updates.status ?? data.status,
  });
};

export const deleteTask = async (id) => {
  await api.delete(`/todos/${id}`);
  return id;
};

