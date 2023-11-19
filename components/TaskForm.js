// define a task form component to add a task
import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const TaskForm = ({ handleAddTask }) => {
  // set task data to state
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  // set the inputted task data to the state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({
      ...taskData,
      [name]: value,
    });
  };

  // once a task is added, clear the task data from state,
  // and call the handleAddTask function - passing in the task data
  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddTask(taskData);
    setTaskData({
      title: "",
      description: "",
      deadline: "",
    });
  };

  // render the component
  return (
    <div>
      <h3 className="mb-3 mt-2">Add a task</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3 mx-5" controlId="formBasicTitle">
          <Form.Label className="fw-bold fs-5 m-auto mb-1">Title:</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={taskData.title}
            onChange={handleChange}
            required
            placeholder="Task title (required)"
            className="m-auto w-50"
          />
        </Form.Group>

        <Form.Group className="mb-3 mx-5" controlId="formBasicDescription">
          <Form.Label className="fw-bold fs-5 m-auto mb-1">
            Description:
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={taskData.description}
            onChange={handleChange}
            placeholder="Task description (required)"
            className="m-auto w-50"
          />
        </Form.Group>

        <Form.Group className="mb-3 mx-5" controlId="formBasicDeadline">
          <Form.Label className="fw-bold fs-5 m-auto mb-1">
            Deadline:
          </Form.Label>
          <Form.Control
            type="text"
            name="deadline"
            value={taskData.deadline}
            onChange={handleChange}
            placeholder="Task deadline (optional)"
            className="m-auto w-50"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicButton">
          <Button variant="dark" type="submit">
            Add Task
          </Button>
        </Form.Group>
      </Form>
      <hr className="mx-5 mt-5" />
    </div>
  );
};

export default TaskForm;
