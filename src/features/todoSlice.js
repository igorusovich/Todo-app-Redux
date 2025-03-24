
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = '/api';

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await fetch(`${API_URL}/todos`);
  return response.json();
});

export const addTodoAsync = createAsyncThunk('todos/addTodo', async (todoData) => {
  const response = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todoData)
  });
  return response.json();
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

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    groups: ['Personal', 'Work', 'Shopping'],
    todos: [],
    status: 'idle',
    error: null
  },
  reducers: {
    addGroup: (state, action) => {
      state.groups.push(action.payload);
    }
  },
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
      });
  }
});

export const { addGroup } = todoSlice.actions;
export default todoSlice.reducer;
