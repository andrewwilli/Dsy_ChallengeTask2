const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());

const todoSchema = new mongoose.Schema({
  title: String,
  completed: Boolean,
});

const Todo = mongoose.model("Todo", todoSchema);


const MONGODB_URI = "mongodb://mongo:27017/my-todo-app-db";
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/todos", async (req, res) => {
  const todobaby = new Todo({
    title: "Walk the dog",
    completed: false,
  });
  await todobaby.save((err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log(result);
    }
  });
  //const todos = await Todo.find();
  res.json(todobaby);
});

app.post("/todos", async (req, res) => {
  const todo = new Todo({
    title: req.body.title,
    completed: req.body.completed,
  });
  await todo.save();
  res.json(todo);
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
