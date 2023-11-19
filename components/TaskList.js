// define a tasklist component to render all tasks
import React, { useEffect, useState } from "react";
import Task from "./Task";

const TaskList = ({
  tasks,
  filter,
  userId,
  isAdmin,
  handleEditTask,
  handleRemoveTask,
  userData,
}) => {
  // initiate an empty array of filtered tasks (tasks a user can see)
  const [filteredTasks, setFilteredTasks] = useState([]);

  // define a function to handle task filtering
  const filterTasks = (tasks, filter, userId, isAdmin) => {
    if (tasks) {
      switch (filter) {
        case "otherTasks":
          return isAdmin ? tasks : tasks; // Return all tasks for admin
        // otherwise just show the user's tasks
        default:
          return tasks.filter((task) => task.creator === userId);
      }
    }
  };

  // call the filterTasks function and pass the updated tasks to the
  // setFilteredTasks state, whenever there is a change in the tasks,
  // filter, userId, or isAdmin
  useEffect(() => {
    const updatedTasks = filterTasks(tasks, filter, userId, isAdmin);
    setFilteredTasks(updatedTasks);
  }, [tasks, filter, userId, isAdmin]);

  // render the component
  return (
    <div className="d-flex justify-content-center flex-wrap">
      {/* render all the tasks if there are any */}
      {filteredTasks && filteredTasks.length > 0 ? (
        filteredTasks.map((task) => (
          <Task
            key={task._id}
            task={task}
            handleEditTask={(taskId, updatedTask) =>
              handleEditTask(taskId, updatedTask)
            }
            handleRemoveTask={handleRemoveTask}
            userData={userData}
          />
        ))
      ) : (
        // otherwise inform the user there are no tasks yet
        <p className="fs-5 fw-bold m-auto">No tasks yet!</p>
      )}
    </div>
  );
};

export default TaskList;
