
import { createSlice } from '@reduxjs/toolkit';

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    groups: ['Personal', 'Work', 'Shopping'], // Default groups
    todos: []
  },
  reducers: {
    addTodo: (state, action) => {
      state.todos.push({ 
        id: Date.now(), 
        text: action.payload.text, 
        group: action.payload.group,
        completed: false 
      });
    },
    toggleTodo: (state, action) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    deleteTodo: (state, action) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
    addGroup: (state, action) => {
      state.groups.push(action.payload);
    }
  }
});

export const { addTodo, toggleTodo, deleteTodo, addGroup } = todoSlice.actions;
export default todoSlice.reducer;
