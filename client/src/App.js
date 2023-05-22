import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

/**
 * Main application component.
 * @returns {JSX.Element} The rendered component.
 */
function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  /**
   * Fetches todos from the server.
   */
  useEffect(() => {
    async function fetchTodos() {
      const response = await axios.get("/todos").catch((err) => {
        console.error(err);
      });
      if (Array.isArray(response.data)) {
        setTodos(response.data);
      } else {
        setTodos([]);
      }
    }
    fetchTodos();
  }, []);

  /**
   * Adds a new todo.
   */
  async function addTodo() {
    const todo = { title: newTodo, completed: false, priority: 1 };
    const response = await axios.post("/todos", todo);
    setTodos([...todos, response.data]);
    setNewTodo("");
  }

  /**
   * Deletes a todo.
   * @param {string} todoId - The ID of the todo to delete.
   */
  async function deleteTodo(todoId) {
    await axios.delete(`/todos/${todoId}`);
    const newTodos = todos.filter((todo) => todo._id !== todoId);
    setTodos(newTodos);
  }

  /**
   * Toggles the completion status of a todo.
   * @param {string} todoId - The ID of the todo to toggle.
   */
  async function handleToggleTodo (todoId) {
    const todoToUpdate = todos.find((todo) => todo._id === todoId);
    const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };
    const response = await axios.put(`/todos/${todoId}`, updatedTodo);
    const updatedTodos = todos.map((todo) => (todo._id === todoId ? response.data : todo));
    setTodos(updatedTodos);
  };
  
  /**
   * Handles changes to the new todo input.
   * @param {Event} event - The change event.
   */
  function handleNewTodoChange(event) {
    setNewTodo(event.target.value);
  }

  return (
    <div>
      <h1>Todo List</h1>
      <Router>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/new">New Todo</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route
            path="/"
            element={<Home todos={todos} deleteTodo={deleteTodo} handleToggleTodo={handleToggleTodo} setTodos={setTodos} />}
          />
          <Route
            path="/new"
            element={
              <NewTodo
                newTodo={newTodo}
                handleNewTodoChange={handleNewTodoChange}
                addTodo={addTodo}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

/**
 * Renders the home page with the list of todos.
 * @param {Object[]} props.todos - The list of todos.
 * @param {Function} props.deleteTodo - The function to delete a todo.
 * @param {Function} props.handleToggleTodo - The function to toggle the completion status of a todo.
 * @param {Function} props.setTodos - The function to set the list of todos.
 * @returns {JSX.Element} The rendered component.
 */
function Home({ todos, deleteTodo, handleToggleTodo, setTodos }) {
  if (!Array.isArray(todos) || todos.length === 0) {
    return <div>Loading...</div>;
  }

  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed && !b.completed) {
      return 1;
    }
    if (!a.completed && b.completed) {
      return -1;
    }
    return 0;
  });

  return (
    <ul>
      {sortedTodos.map((todo) => {
        return (
          <li key={todo._id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleTodo(todo._id, setTodos)}
            />
            {todo.title}{" "}
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Renders the new todo form.
 * @param {string} props.newTodo - The value of the new todo input.
 * @param {Function} props.handleNewTodoChange - The function to handle changes to the new todo input.
 * @param {Function} props.addTodo - The function to add a new todo.
 * @returns {JSX.Element} The rendered component.
 */
function NewTodo({ newTodo, handleNewTodoChange, addTodo }) {
  const navigate = useNavigate();
  return (
    <div className="new-todo-container">
      <h2>Add New Todo</h2>
      <form>
        <label>
          Title:
          <input type="text" value={newTodo} onChange={handleNewTodoChange} />
        </label>
        <button className="add-todo-button" onClick={() => { addTodo(); navigate('/'); }}>Add Todo</button>
      </form>
    </div>
  );
}

export default App;
