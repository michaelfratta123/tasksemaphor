// DEFINE A FILTER COMPONENT
import React, { useState } from "react";
import { Form, Dropdown } from "react-bootstrap";

const Filter = ({ setFilter, fetchTasks }) => {
  const [selectedFilter, setSelectedFilter] = useState("myTasks");

  // define a function to set filters based on the Dropdown selected
  const handleSelectFilter = (filter) => {
    setSelectedFilter(filter);
    setFilter(filter);
    fetchTasks(); // Call fetchTasks directly when a filter is selected
  };

  // render the component
  return (
    <Form>
      <Dropdown>
        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
          {selectedFilter === "myTasks" ? "My Tasks" : "Other Tasks"}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => handleSelectFilter("myTasks")}>
            My Tasks
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleSelectFilter("otherTasks")}>
            Other Tasks
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Form>
  );
};

export default Filter;
