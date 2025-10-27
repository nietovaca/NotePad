import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { apiConfig } from "../auth/authConfig";
import { colors } from "../styles/colors";

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
    return <div>Loading authentication status...</div>;
  }

  if (error) {
    return (
      <div
        style={{
          padding: "10px",
          border: `1px solid ${colors.error}`,
          borderRadius: "5px",
          margin: "10px 0",
          backgroundColor: "#fff8f8",
        }}
      >
        <p>Authentication Error: {error.message}</p>
        <button
          onClick={handleLogin}
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "10px",
        border: "1px solid var(--pale-green)",
        borderRadius: "5px",
        margin: "10px 0",
        backgroundColor: "rgba(139, 195, 74, 0.05)"
      }}
    >
      {isAuthenticated ? (
        <div>
          <p style={{ fontWeight: "bold" }}>Welcome, {user?.name || "User"}</p>
          <button
            onClick={() =>
              logout({
                logoutParams: {
                  returnTo: window.location.origin,
                },
              })
            }
            className="btn btn-danger"
          >
            Logout
          </button>
          <p>
            <a
              href="/notes"
              style={{ display: "block", marginTop: "10px", color: "var(--light-green)" }}
            >
              Go to My Notes
            </a>
          </p>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="btn btn-primary"
        >
          Login
        </button>
      )}
    </div>
  );
};

export default Login;
