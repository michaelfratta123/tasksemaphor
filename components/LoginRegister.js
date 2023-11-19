// define a login/register component
import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";

const LoginRegister = ({ handleLogin, handleRegister }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // save the inputted form data to the state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // call the relevant function depending on the button that was clicked (login/register)
  const handleAction = (action) => {
    if (action === "login") {
      handleLogin(formData);
    } else if (action === "register") {
      handleRegister(formData);
    }
  };

  // render the component
  return (
    <div>
      <Card
        style={{ width: "20rem" }}
        className="m-auto text-light"
        bg="dark"
        border="light"
      >
        <Card.Body>
          <Card.Title className="mb-4 mt-2">Login or Register</Card.Title>
          <Form>
            <Form.Group className="mb-3 mx-4" controlId="formBasicUsername">
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3 mx-4" controlId="formBasicPassword">
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </Form.Group>
            <Button
              className="m-3"
              variant="secondary"
              type="button"
              onClick={() => handleAction("login")}
            >
              Login
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={() => handleAction("register")}
            >
              Register
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginRegister;
