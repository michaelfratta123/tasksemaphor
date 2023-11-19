// define a task component
import React, { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";

const Task = ({ task, handleEditTask, handleRemoveTask, userData }) => {
  // keep track of the editing state
  const [isEditing, setIsEditing] = useState(false);
  // set the updated task to the state
  const [updatedTask, setUpdatedTask] = useState(task);

  // set is editing to true when edit button clicked
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // pass the task id and updated task to handleEditTask,
  // and set isEditing back to false, after save button clicked
  const handleSaveClick = () => {
    handleEditTask(task._id, updatedTask);
    setIsEditing(false);
  };

  // set is editing to false if cancel button clicked
  const handleCancelClick = () => {
    setIsEditing(false);
  };

  // render the component
  return (
    <Card
      key={task._id}
      style={{ width: "18rem" }}
      className="m-3 text-light"
      bg="dark"
      border="light"
    >
      <Card.Body>
        {/* allow in-place editing of a given task card */}
        {isEditing ? (
          <div>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={updatedTask.title}
                onChange={(e) =>
                  setUpdatedTask({
                    ...updatedTask,
                    title: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={updatedTask.description}
                onChange={(e) =>
                  setUpdatedTask({
                    ...updatedTask,
                    description: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Deadline</Form.Label>
              <Form.Control
                type="text"
                value={updatedTask.deadline}
                onChange={(e) =>
                  setUpdatedTask({
                    ...updatedTask,
                    deadline: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Button
              onClick={handleSaveClick}
              variant="secondary"
              className="mt-4"
            >
              Save
            </Button>
            <Button
              variant="outline-secondary"
              className="mt-4 ms-1 text-light"
              onClick={handleCancelClick}
            >
              Cancel
            </Button>
          </div>
        ) : (
          // render the card alone if not editing
          <div>
            <Card.Title className="mb-3">{task.title}</Card.Title>
            <hr />
            {/* show the username attribute on task card only to admin user */}
            {userData.isAdmin && userData.username !== task.username && (
              <Card.Text style={{ whiteSpace: "pre-line" }}>
                Created by:{"\n"}
                {task.username}
              </Card.Text>
            )}
            <Card.Text style={{ whiteSpace: "pre-line" }}>
              Task description:{"\n"}
              {task.description}
            </Card.Text>
            <Card.Text style={{ whiteSpace: "pre-line" }}>
              Due by:{"\n"}
              {task.deadline}
            </Card.Text>
            <Button
              variant="secondary"
              className="m-1"
              onClick={handleEditClick}
            >
              Edit
            </Button>
            {/* pass the task id to handleRemoveTask if Delete is clicked */}
            <Button variant="danger" onClick={() => handleRemoveTask(task._id)}>
              Delete
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default Task;
