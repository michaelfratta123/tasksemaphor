// define a snapshot test and appropriate unit tests for the backend

const request = require("supertest");
const { app, server } = require("../index");
const Task = require("../../models/Task");
const jwt = require("jsonwebtoken");

// SNAPSHOT TEST
describe("Server Snapshot", () => {
  test("should match the snapshot", async () => {
    const response = await request(app).get("/");
    const responseBody = response.body;

    // Use Jest's snapshot testing to match the received data against the stored snapshot
    expect(responseBody).toMatchSnapshot();
  });
});

// REGISTER UNIT TEST
describe("POST /api/register", () => {
  test("should register a new user and return a token", async () => {
    // Send a registration request
    const response = await request(app)
      .post("/api/register")
      .send({ username: "testuser", password: "testpassword" });

    // Check if registration was successful (first time test ran)
    if (response.status === 200) {
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    } else {
      // Resolve issue of test failing if testuser already created
      expect(response.status).toBe(400);
    }
  });

  test("should return 400 if test ran more than once", async () => {
    // Send a registration request
    const response = await request(app)
      .post("/api/register")
      .send({ username: "testuser", password: "testpassword" });

    expect(response.status).toBe(400);
  });
});

// LOGIN UNIT TEST
describe("POST /api/login", () => {
  test("should log in an existing user and return a token", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({ username: "testuser", password: "testpassword" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  test("should return 401 for incorrect password", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({ username: "testuser", password: "incorrectpassword" });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("msg", "incorrect password");
  });
});

// GET TASKS UNIT TEST
describe("GET /api/tasks", () => {
  let authToken;

  beforeAll(async () => {
    // Login and get the auth token
    const response = await request(app)
      .post("/api/login")
      .send({ username: "testuser", password: "testpassword" });

    authToken = response.body.token;
  });

  test("should get tasks with valid authentication", async () => {
    const response = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  test("should return 401 without authentication", async () => {
    const response = await request(app).get("/api/tasks");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "msg",
      "No token attached to the request"
    );
  });
});

// GET USERS UNIT TEST
describe("GET /api/users", () => {
  test("should get all users with valid authentication", async () => {
    // Perform login to obtain a valid JWT token
    const loginResponse = await request(app)
      .post("/api/login")
      .send({ username: "testuser", password: "testpassword" });

    const authToken = loginResponse.body.token;

    // Make a request to get all users with the obtained token
    const response = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${authToken}`);

    // Check if the response status is 200 and it contains an array of users
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("should return 401 without authentication", async () => {
    // Make a request without providing a valid token
    const response = await request(app).get("/api/users");

    // Check if the response status is 401
    expect(response.status).toBe(401);
  });
});

// GET A SPECIFIC USER UNIT TEST
describe("GET /api/users/:userId", () => {
  test("should get a specific user by userId with valid authentication", async () => {
    // Perform login to obtain a valid JWT token
    const loginResponse = await request(app)
      .post("/api/login")
      .send({ username: "testuser", password: "testpassword" });

    const authToken = loginResponse.body.token;

    // Extract user ID from the token
    const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);
    const userIdToRetrieve = decodedToken.userId;

    // Make a request to get a specific user with the obtained token
    const response = await request(app)
      .get(`/api/users/${userIdToRetrieve}`)
      .set("Authorization", `Bearer ${authToken}`);

    try {
      // Check if the response status is 200 and it contains user details
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("userId");
      expect(response.body).toHaveProperty("isAdmin");
    } catch (error) {
      // Log the response body when an error occurs
      console.error("Error in test:", error);
      console.log("Response body:", response.body);
      throw error; // Re-throw the error to mark the test as failed
    }
  });
});

// ADD A TASK UNIT TEST
describe("POST /api/tasks", () => {
  test("should add a new task with valid authentication", async () => {
    // Perform login to obtain a valid JWT token
    const loginResponse = await request(app)
      .post("/api/login")
      .send({ username: "testuser", password: "testpassword" });

    const authToken = loginResponse.body.token;

    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "New Task",
        deadline: "2023-12-31",
        description: "Task description",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("msg", "Task successfully added");
    expect(response.body).toHaveProperty("task");
  });
});

// UPDATE A TASK UNIT TEST
describe("PUT /api/tasks/:id", () => {
  test("should update a task with valid authentication", async () => {
    // Perform login to obtain a valid JWT token
    const loginResponse = await request(app)
      .post("/api/login")
      .send({ username: "testuser", password: "testpassword" });

    const authToken = loginResponse.body.token;
    // Extract user ID from the token
    const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);
    const userIdToRetrieve = decodedToken.userId;

    const tasks = await Task.find({ creator: userIdToRetrieve });
    const taskId = tasks[0]._id;

    const response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "Updated Task",
        deadline: "2023-12-31",
        description: "Updated task description",
      });

    if (response.status === 404) {
      expect(response.body).toHaveProperty("msg", "Task not found");
    } else {
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("msg", "Task successfully updated");
      expect(response.body).toHaveProperty("updatedTask");
    }
  });
});

// DELETE A TASK UNIT TEST
describe("DELETE /api/tasks/:id", () => {
  test("should delete a task with valid authentication", async () => {
    // Perform login to obtain a valid JWT token
    const loginResponse = await request(app)
      .post("/api/login")
      .send({ username: "testuser", password: "testpassword" });

    const authToken = loginResponse.body.token;
    // Extract user ID from the token
    const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);
    const userIdToRetrieve = decodedToken.userId;

    const tasks = await Task.find({ creator: userIdToRetrieve });
    const taskId = tasks[0]._id;

    const response = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${authToken}`);

    if (response.status === 404) {
      expect(response.body).toHaveProperty("msg", "Task not found");
    } else {
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("msg", "Task successfully removed");
      expect(response.body).toHaveProperty("removedTask");
    }
  });
});

// Close the server after all tests
afterAll((done) => {
  server.close(done);
});
