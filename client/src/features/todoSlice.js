
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = `${window.location.protocol}//${window.location.hostname}:3001/api`;

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await fetch(`${API_URL}/todos`);
  return response.json();
});

export const addTodoAsync = createAsyncThunk('todos/addTodo', async (todoData) => {
  try {
    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData)
    });
    if (!response.ok) {
      throw new Error('Failed to create todo');
    }
    return response.json();
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
});

export const toggleTodoAsync = createAsyncThunk('todos/toggleTodo', async (id) => {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'PATCH'
  });
  return response.json();
});

export const deleteTodoAsync = createAsyncThunk('todos/deleteTodo', async (id) => {
  await fetch(`${API_URL}/todos/${id}`, {
    method: 'DELETE'
  });
  return id;
});

export const addGroupAsync = createAsyncThunk(
  'todos/addGroup',
  async (groupName) => {
    const response = await fetch(`${API_URL}/groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: groupName })
    });
    const data = await response.json();
    return data;
  }
);

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    groups: ['Personal', 'Work', 'Shopping'],
    todos: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addTodoAsync.fulfilled, (state, action) => {
        state.todos.push(action.payload);
      })
      .addCase(toggleTodoAsync.fulfilled, (state, action) => {
        const todo = state.todos.find(todo => todo._id === action.payload._id);
        if (todo) {
          todo.completed = action.payload.completed;
        }
      })
      .addCase(deleteTodoAsync.fulfilled, (state, action) => {
        state.todos = state.todos.filter(todo => todo._id !== action.payload);
      })
      .addCase(addGroupAsync.fulfilled, (state, action) => {
        if (!state.groups.includes(action.payload)) {
          state.groups.push(action.payload);
        }
      });
  }
});

export const { addGroup } = todoSlice.actions;
export default todoSlice.reducer;
