import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import NoteList from "./components/NoteList";
import NoteEditor from "./components/NoteEditor";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthProvider from "./auth/AuthProvider";
import ThemeToggle from "./components/ThemeToggle";
import SideNav from "./components/SideNav";
import "./App.css";

const AppContent = () => {
  const { isLoading, isAuthenticated, user, loginWithRedirect } = useAuth0();
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we're on the notes page
  const isNotesPage = location.pathname === "/notes";

  console.log("AppContent - Auth state:", { isLoading, isAuthenticated, user });

  if (isLoading) {
    return (
      <div aria-live="polite" className="loading">
        <article>
          <header>
            <h2>Authentication in progress</h2>
          </header>
          <p>Please wait while we authenticate you.</p>
          <progress></progress>
        </article>
      </div>
    );
  }

  const handleLogin = async () => {
    try {
      await loginWithRedirect({
        appState: { returnTo: "/notes" },
        authorizationParams: {
          redirect_uri: window.location.origin + "/callback",
          scope: "openid profile email",
        },
      });
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="App">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      {isAuthenticated && <SideNav />}
      <div className={`app-container ${isAuthenticated ? "with-sidenav" : ""}`}>
        <div className="top-bar">
          {isAuthenticated && isNotesPage && (
            <div className="top-bar-content">
              <h2 className="page-title">My Notes</h2>
              <button
                className="primary new-note-button"
                onClick={() => navigate("/notes/new")}
                aria-label="Create a new note"
              >
                New Note
              </button>
            </div>
          )}
          {!isAuthenticated && (
            <button
              onClick={handleLogin}
              className="primary login-button"
              aria-label="Log in to your account"
            >
              Login
            </button>
          )}
        </div>
        <ThemeToggle />
        <main id="main-content">
          <div className="container">
            <Routes>
              <Route
                path="/"
                element={
                  <article className="welcome">
                    <header>
                      <h2>Welcome to NotePad</h2>
                    </header>
                    <p>
                      A professional note-taking application designed for
                      simplicity and accessibility.
                    </p>
                    <p>Please log in to view and manage your notes.</p>
                    <footer>
                      <button onClick={handleLogin} className="btn-primary">
                        Get Started
                      </button>
                    </footer>
                  </article>
                }
              />
              <Route
                path="/notes"
                element={
                  <ProtectedRoute>
                    <NoteList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notes/:id"
                element={
                  <ProtectedRoute>
                    <NoteEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notes/new"
                element={
                  <ProtectedRoute>
                    <NoteEditor isNew={true} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/callback"
                element={
                  <div aria-live="polite" className="loading">
                    Loading your account information...
                  </div>
                }
              />
            </Routes>
          </div>
        </main>
        <footer className="container text-center">
          <small>
            &copy; {new Date().getFullYear()} NotePad - All rights reserved
          </small>
        </footer>
      </div>
    </div>
  );
};
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
