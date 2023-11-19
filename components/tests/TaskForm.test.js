// DEFINE FRONTEND UNIT TESTS
import React from "react";
import { shallow } from "enzyme"; // use enzyme for frontend unit tests
import Enzyme from "enzyme";
import Adapter from "@cfaester/enzyme-adapter-react-18";

Enzyme.configure({ adapter: new Adapter() });

import TaskForm from "../TaskForm";

// Mocking the handleAddTask function for testing purposes
const mockHandleAddTask = jest.fn();

describe("TaskForm component", () => {
  it("renders without crashing", () => {
    shallow(<TaskForm handleAddTask={mockHandleAddTask} />);
  });

  it("handles form submission and clears input fields", () => {
    const wrapper = shallow(<TaskForm handleAddTask={mockHandleAddTask} />);

    // Fill out the form
    wrapper
      .find('[name="title"]')
      .simulate("change", { target: { name: "title", value: "Test Task" } });
    wrapper.find('[name="description"]').simulate("change", {
      target: { name: "description", value: "Test description" },
    });
    wrapper.find('[name="deadline"]').simulate("change", {
      target: { name: "deadline", value: "Test deadline" },
    });

    // Submit the form
    wrapper.find("Form").simulate("submit", { preventDefault: jest.fn() });

    // Assert that the handleAddTask function is called with the correct data
    expect(mockHandleAddTask).toHaveBeenCalledWith({
      title: "Test Task",
      description: "Test description",
      deadline: "Test deadline",
    });

    // Assert that the input fields are cleared after submission
    expect(wrapper.find('[name="title"]').prop("value")).toBe("");
    expect(wrapper.find('[name="description"]').prop("value")).toBe("");
    expect(wrapper.find('[name="deadline"]').prop("value")).toBe("");
  });
});
