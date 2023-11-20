// create a custom Express server for the relevant endpoints

const express = require("express");
const jwt = require("jsonwebtoken");
const connectDB = require("./db");
const User = require("../models/User");
const Task = require("../models/Task");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

connectDB();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());

app.use(helmet());

// Middleware to check JWT token
const checkJWTToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (error, data) => {
      if (error) {
        return res.status(401).json({ msg: "Invalid token" });
      }
      req.user = data;
      next();
    });
  } else {
    res.status(401).json({ msg: "No token attached to the request" });
  }
};

// Routes

// REGISTER ENDPOINT
app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const newUser = new User({
      username,
      password,
    });

    await newUser.save({ collection: "users" });

    const token = jwt.sign(
      { userId: newUser._id, username },
      process.env.JWT_SECRET,
      {
        expiresIn: "90d",
      }
    );

    res.json({ token });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error (e.g. duplicate username)
      res.status(400).json({ msg: "Username is already taken" });
    } else {
      res.status(500).json({ msg: "Internal server error" });
    }
  }
});

// LOGIN ENDPOINT
app.post("/api/login", async (req, res) => {
  // set username and password from request body
  const { username, password } = req.body;

  // check if user exists and credentials are valid
  const user = await User.findOne({ username });
  // if the user does not exist, return 401 error message
  if (!user) {
    return res.status(401).json({ msg: "user does not exist" });
  }

  if (user.username === username && user.password === password) {
    // create token with additional properties, e.g., isAdmin
    const token = jwt.sign(
      { userId: user._id, username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "90d" }
    );

    // send token as response
    res.json({ token });
  } else {
    return res.status(401).json({ msg: "incorrect password" });
  }
});

// GET TASKS BASED ON FILTER
app.get("/api/tasks", checkJWTToken, async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;
    const filter = req.query.filter || "myTasks";

    let tasks;

    if (isAdmin && filter === "otherTasks") {
      // If the user is an admin and the filter is 'otherTasks', fetch all tasks
      tasks = await Task.find();
    } else if (filter === "myTasks") {
      // If the filter is 'myTasks', fetch tasks created by the user
      tasks = await Task.find({ creator: userId });
    } else {
      // If the filter is neither 'myTasks' nor 'otherTasks', return an empty array or handle as needed
      tasks = [];
    }

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// GET ALL USERS
app.get("/api/users", checkJWTToken, async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password field
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

// GET A SPECIFIC USER BY USER ID
app.get("/api/users/:userId", checkJWTToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (user) {
      res.json({ userId: user._id, isAdmin: user.isAdmin || false });
    } else {
      res.status(404).json({ msg: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

// UPDATE A SPECIFIC USER'S ADMIN STATUS
app.put("/api/users/:userId", checkJWTToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const { isAdmin } = req.body;

    // Check if isAdmin is a boolean
    if (typeof isAdmin !== "boolean") {
      return res.status(400).json({ msg: "isAdmin must be a boolean" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isAdmin },
      { new: true } // Return the updated user
    );

    if (user) {
      res.json({ userId: user._id, isAdmin: user.isAdmin });
    } else {
      res.status(404).json({ msg: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

// ADD A NEW TASK
app.post("/api/tasks", checkJWTToken, async (req, res) => {
  try {
    const { title, deadline, description } = req.body;

    const newTask = new Task({
      title,
      deadline,
      description,
      creator: req.user.userId,
      username: req.user.username,
    });

    await newTask.save();

    res.json({ msg: "Task successfully added", task: newTask });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

// UPDATE A TASK
app.put("/api/tasks/:id", checkJWTToken, async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, deadline, description } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        title,
        deadline,
        description,
      },
      { new: true }
    );

    if (updatedTask) {
      res.json({ msg: "Task successfully updated", updatedTask });
    } else {
      res.status(404).json({ msg: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

// DELETE A TASK
app.delete("/api/tasks/:id", checkJWTToken, async (req, res) => {
  try {
    const taskId = req.params.id;

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (deletedTask) {
      res.json({ msg: "Task successfully removed", removedTask: deletedTask });
    } else {
      res.status(404).json({ msg: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

const PORT = process.env.API_PORT;

let server;

if (PORT) {
  server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = { app, server };
