import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Login from "./components/Login";
import NoteList from "./components/NoteList";
import NoteEditor from "./components/NoteEditor";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthProvider from "./auth/AuthProvider";
import logo from "./logo.svg";
import "./App.css";

const AppContent = () => {
  const { isLoading, isAuthenticated, user } = useAuth0();
  
  console.log("AppContent - Auth state:", { isLoading, isAuthenticated, user });

  if (isLoading) {
    return (
      <div className="loading" style={{ padding: "20px", backgroundColor: "#f0f0f0", margin: "20px", borderRadius: "5px" }}>
        <h2>Authentication is loading...</h2>
        <p>Please wait while we authenticate you.</p>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-left">
          <img src={logo} alt="NotePad Logo" className="App-logo" />
          <h1>NotePad</h1>
        </div>
        <Login />
      </header>
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <div className="welcome">
                Welcome to NotePad. Please log in to view your notes.
              </div>
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
          <Route path="/callback" element={<div>Loading...</div>} />
        </Routes>
      </main>
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
