// define a header component for the header
import Link from "next/link";
import { Button } from "react-bootstrap";
import React from "react";

// add link style
const linkStyle = {
  marginRight: 15,
  color: "white",
  textDecoration: "none",
  fontSize: "large",
};

const Header = ({ userData, handleLogout }) => {
  // render the component
  return (
    <div
      className="m-3 bg-dark text-light p-3"
      style={{ display: "flex", alignItems: "center" }}
    >
      {/* only the admin can see the Admin tab */}
      {userData && userData.isAdmin && (
        <Link href="/admin" style={linkStyle}>
          Admin
        </Link>
      )}
      {/* only a logged in user can see the Home tab and Logout button */}
      {userData && (
        <>
          <Link href="/" style={linkStyle}>
            Home
          </Link>
          <Button
            variant="secondary"
            onClick={handleLogout}
            style={{ fontSize: "large" }}
          >
            Logout
          </Button>
        </>
      )}
      {/* app title is seen always */}
      <h1 className="AppTitle fs-1 mx-5">TaskSemaphor</h1>
    </div>
  );
};

export default Header;
