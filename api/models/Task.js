// define the task schema

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  deadline: { type: String },
  description: { type: String },
  // link the user object id
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: { type: String },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
