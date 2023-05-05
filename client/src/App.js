import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    async function fetchTodos() {
      const response = await axios.get("/api/todos");
      setTodos(response.data);
    }
    fetchTodos();
  }, []);

  async function addTodo() {
    const todo = { title: newTodo, completed: false };
    const response = await axios.post("/api/todos", todo);
    setTodos([...todos, response.data]);
    setNewTodo("");
  }

  function handleNewTodoChange(event) {
    setNewTodo(event.target.value);
  }

  return (
    <div>
      <h1>My Todo List</h1>
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
          <Route path="/" element={<Home todos={todos} />} />
          <Route path="/new" element={<NewTodo newTodo={newTodo} handleNewTodoChange={handleNewTodoChange} addTodo={addTodo} />} />
        </Routes>
      </Router>
    </div>
  );
}

function Home({ todos }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo._id}>
          {todo.title} - {todo.completed ? "Completed" : "Incomplete"}
        </li>
      ))}
    </ul>
  );
}

function NewTodo({ newTodo, handleNewTodoChange, addTodo }) {
  return (
    <div>
      <input type="text" value={newTodo} onChange={handleNewTodoChange} />
      <button onClick={addTodo}>Add Todo</button>
    </div>
  );
}

export default App;

