import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTodoAsync,
  toggleTodoAsync,
  deleteTodoAsync,
  addGroupAsync,
  fetchTodos,
} from "./features/todoSlice";
import { setUser } from "./features/authSlice";
import Auth from "./components/Auth";
import "./App.css";

function TodoApp() {
  const [input, setInput] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("Personal");
  const [newGroup, setNewGroup] = useState("");
  const { todos, groups } = useSelector((state) => state.todos);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      dispatch(addTodoAsync({ text: input.trim(), group: selectedGroup }));
      setInput("");
    }
  };

  const handleAddGroup = (e) => {
    e.preventDefault();
    if (newGroup.trim() && !groups.includes(newGroup.trim())) {
      dispatch(addGroupAsync(newGroup.trim()));
      setNewGroup("");
    }
  };

  return (
    <main className="app-container">
      <form onSubmit={handleSubmit} className="add-todo-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new todo"
        />
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          {groups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
        <button type="submit" className="add-button">
          Add Todo
        </button>
      </form>

      <form onSubmit={handleAddGroup} className="add-group-form">
        <input
          type="text"
          value={newGroup}
          onChange={(e) => setNewGroup(e.target.value)}
          placeholder="Add a new group"
        />
        <button type="submit" className="add-button">
          Add Group
        </button>
      </form>

      {groups.map((group) => (
        <div key={group} className="group-section">
          <h2>{group}</h2>
          <ul className="todo-list">
            {todos
              .filter((todo) => todo.group === group)
              .map((todo) => (
                <li key={todo._id} className="todo-item">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => dispatch(toggleTodoAsync(todo._id))}
                  />
                  <span
                    style={{
                      textDecoration: todo.completed ? "line-through" : "none",
                    }}
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => dispatch(deleteTodoAsync(todo._id))}
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

export default function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("https://auth.util.repl.co/verify", {
          credentials: "include",
        });
        const userData = await response.json();
        if (userData.status === "error") {
          return;
        }
        dispatch(setUser(userData));
      } catch (error) {
        console.error("Auth error:", error);
      }
    };

    checkAuth();
  }, [dispatch]);

  return isAuthenticated ? <TodoApp /> : <Auth />;
}