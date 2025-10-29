import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../logo.svg";
import "./SideNav.css";

const SideNav = () => {
  const { logout, isAuthenticated, user } = useAuth0();
  const location = useLocation();
  
  // Check if current path is the notes page
  const isNotesPage = location.pathname === "/notes";

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <nav className="side-nav">
      <div className="side-nav-top">
        <div className="side-nav-logo">
          <img src={logo} alt="NotePad Logo" className="nav-logo" />
          <h1>NotePad</h1>
        </div>
        {isNotesPage ? (
          <span className="side-nav-link active" aria-current="page">
            My Notes
          </span>
        ) : (
          <Link to="/notes" className="side-nav-link" aria-label="Go to my notes">
            My Notes
          </Link>
        )}
      </div>
      
      {isAuthenticated && (
        <div className="side-nav-bottom">
          <div className="user-email">
            <span>{user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="logout-button"
            aria-label="Log out of your account"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default SideNav;
