const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());

// Hostname to identify backend
const backendId = process.env.HOSTNAME || 'unknown';

const todoSchema = new mongoose.Schema({
  title: String,
  completed: Boolean,
});

const Todo = mongoose.model("Todo", todoSchema);

// Connect to MongoDB via root user
const MONGODB_URI = "mongodb://root:rootpassword@mongo:27017/todo-db?authSource=admin";
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// HTTP methods

app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
  console.log("This is backend id: " + backendId);
});

app.post("/todos", async (req, res) => {
  const todo = new Todo({
    title: req.body.title,
    completed: req.body.completed,
  });
  await todo.save();
  res.json(todo);
});

app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findById(id);
  todo.completed = !todo.completed;
  await todo.save();
  res.json(todo);
});


app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  await Todo.findByIdAndDelete(id);
  res.json({ message: "Todo deleted successfully" });
});

// Start the server on the provided port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
