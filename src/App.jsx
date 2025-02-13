
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, toggleTodo, deleteTodo, addGroup } from './features/todoSlice';
import './App.css';

export default function App() {
  const [input, setInput] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('Personal');
  const [newGroup, setNewGroup] = useState('');
  const { todos, groups } = useSelector(state => state.todos);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      dispatch(addTodo({ text: input.trim(), group: selectedGroup }));
      setInput('');
    }
  };

  const handleAddGroup = (e) => {
    e.preventDefault();
    if (newGroup.trim() && !groups.includes(newGroup.trim())) {
      dispatch(addGroup(newGroup.trim()));
      setNewGroup('');
    }
  };

  return (
    <main className="container">
      <h1>Todo List</h1>
      
      <form onSubmit={handleAddGroup} className="add-group-form">
        <input
          type="text"
          value={newGroup}
          onChange={(e) => setNewGroup(e.target.value)}
          placeholder="Add new group"
          className="group-input"
        />
        <button type="submit" className="add-button">Add Group</button>
      </form>

      <form onSubmit={handleSubmit} className="add-todo-form">
        <select 
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="group-select"
        >
          {groups.map(group => (
            <option key={group} value={group}>{group}</option>
          ))}
        </select>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new todo"
          className="todo-input"
        />
        <button type="submit" className="add-button">Add</button>
      </form>

      {groups.map(group => (
        <div key={group} className="group-section">
          <h2>{group}</h2>
          <ul className="todo-list">
            {todos
              .filter(todo => todo.group === group)
              .map(todo => (
                <li key={todo.id} className="todo-item">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => dispatch(toggleTodo(todo.id))}
                  />
                  <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                    {todo.text}
                  </span>
                  <button 
                    onClick={() => dispatch(deleteTodo(todo.id))}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </main>
  );
}
