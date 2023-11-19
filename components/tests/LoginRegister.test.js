// Snapshot test for LoginRegister component
import React from "react";
import renderer from "react-test-renderer";
import LoginRegister from "../LoginRegister";

describe("LoginRegister Component Snapshot", () => {
  test("should match the snapshot", () => {
    const mockHandleLogin = jest.fn();
    const mockHandleRegister = jest.fn();

    const component = renderer.create(
      <LoginRegister
        handleLogin={mockHandleLogin}
        handleRegister={mockHandleRegister}
      />
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
