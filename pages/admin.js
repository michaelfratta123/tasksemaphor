// create a page for the admin tab
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Table, Button } from "react-bootstrap";

// define an Admin component
const Admin = (userData) => {
  // set an empty array of users to state
  const [users, setUsers] = useState([]);

  const PREFIX = process.env.NEXT_PUBLIC_APP_API_URL;

  // define a function to fetch all users from the db
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${PREFIX}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userList = await response.json();
        setUsers(userList);
      } else {
        console.error("Error fetching users:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // define a function to allow an admin to grant/revoke admin status to other users
  const handleAdminStatusChange = async (userId, newAdminStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${PREFIX}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isAdmin: newAdminStatus }),
      });

      if (response.ok) {
        // update the local state to reflect the change in admin status
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isAdmin: newAdminStatus } : user
          )
        );
      } else {
        console.error("Error updating admin status:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating admin status:", error);
    }
  };

  // render the component
  return (
    <Layout userData={userData}>
      <div className="m-3">
        <h2 className="mb-3">Users:</h2>
        <Table striped bordered hover variant="dark">
          <thead className="fs-5">
            <tr>
              <th>Username</th>
              <th>is Admin?</th>
              <th>Make Admin?</th>
            </tr>
          </thead>
          <tbody>
            {/* render all users in a table, and display their current admin
                status, as well as a Revoke/Allow button depending on the
                action that can be performed */}
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.isAdmin ? "Yes" : "No"}</td>
                <td>
                  <Button
                    variant={user.isAdmin ? "danger" : "success"}
                    onClick={() =>
                      handleAdminStatusChange(user._id, !user.isAdmin)
                    }
                  >
                    {user.isAdmin ? "Revoke" : "Allow"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Layout>
  );
};

export default Admin;
