import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { apiConfig } from "../auth/authConfig";
import { colors } from "../styles/colors";
import "./Login.css";

const Login = () => {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading, error } =
    useAuth0();

  const handleLogin = async () => {
    try {
      await loginWithRedirect({
        appState: { returnTo: "/notes" },
        authorizationParams: {
          audience: apiConfig.audience,
          redirect_uri: window.location.origin + "/callback",
          scope: "openid profile email",
        },
      });
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  if (isLoading) {
    return <span aria-busy="true">Loading authentication...</span>;
  }

  if (error) {
    return (
      <div role="alert" className="error">
        <strong>Authentication Error:</strong> {error.message}
        <button
          onClick={handleLogin}
          className="contrast outline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="auth-container">
      {isAuthenticated ? (
        <div className="user-info">
          <div className="user-greeting">
            <span>Welcome, <strong>{user?.name || "User"}</strong></span>
          </div>
          <div className="auth-actions">
            <a 
              href="/notes" 
              role="button" 
              className="outline notes-button"
              aria-label="Go to my notes"
            >
              My Notes
            </a>
            <button
              onClick={() =>
                logout({
                  logoutParams: {
                    returnTo: window.location.origin,
                  },
                })
              }
              className="contrast logout-button"
              aria-label="Log out of your account"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="primary"
          aria-label="Log in to your account"
        >
          Login
        </button>
      )}
    </div>
  );
};

export default Login;
