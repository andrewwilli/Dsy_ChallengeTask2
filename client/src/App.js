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

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

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

  async function addTodo() {
    const todo = { title: newTodo, completed: false, priority: 1 };
    const response = await axios.post("/todos", todo);
    setTodos([...todos, response.data]);
    setNewTodo("");
  }

  async function deleteTodo(todoId) {
    await axios.delete(`/todos/${todoId}`);
    const newTodos = todos.filter((todo) => todo._id !== todoId);
    setTodos(newTodos);
  }

  async function handleToggleTodo (todoId) {
    const todoToUpdate = todos.find((todo) => todo._id === todoId);
    const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };
    const response = await axios.put(`/todos/${todoId}`, updatedTodo);
    const updatedTodos = todos.map((todo) => (todo._id === todoId ? response.data : todo));
    setTodos(updatedTodos);
  };
  
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
