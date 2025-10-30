import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import noteService from "../services/noteService";
import "./NoteList.css";

const NoteList = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        console.log("Fetching notes...");
        //Get the auth token
        const token = await getAccessTokenSilently({
          audience: "api://notepad",
        });
        console.log("Got token:", token ? "Token received" : "No token");

        // Set the token in the service
        noteService.setToken(token);

        //Fetch notes
        console.log("Calling API to get notes...");
        const fetchedNotes = await noteService.getAllNotes();
        console.log("Notes received:", fetchedNotes);
        setNotes(fetchedNotes);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notes:", error);
        setError(error.message || "An error occurred while fetching notes");
        setLoading(false);
      }
    };
    fetchNotes();
  }, [getAccessTokenSilently]);

  const handleDeleteNote = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await noteService.deleteNote(id);
        setNotes(notes.filter((note) => note.id !== id));
      } catch (error) {
        console.error("Error deleting note:", error);
        setError(
          `Failed to delete note. Please try again. ${error.message} ${
            error.response?.data?.error || "Unknown error"
          }`
        );
      }
    }
  };

  if (loading) {
    return (
      <div aria-live="polite" className="loading">
        <article>
          <progress></progress>
          <p>Loading your notes...</p>
        </article>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="error">
        <article>
          <header>
            <h2>Error</h2>
          </header>
          <p>{error}</p>
          <footer>
            <button onClick={() => window.location.reload()} className="secondary">
              Try Again
            </button>
          </footer>
        </article>
      </div>
    );
  }

  return (
    <div className="note-list-container">
      {/* Add a visually hidden heading for screen readers */}
      <h2 className="sr-only" id="notes-heading">Your Notes</h2>
      
      {notes.length === 0 ? (
        <article className="no-notes">
          <header>
            <h3>No Notes Yet</h3>
          </header>
          <p>You don't have any notes yet. Create a new note to get started.</p>
          <footer>
            <button 
              onClick={() => navigate("/notes/new")} 
              className="primary"
              aria-label="Create your first note"
            >
              Create Your First Note
            </button>
          </footer>
        </article>
      ) : (
        <div 
          className="notes-grid"
          aria-labelledby="notes-heading"
        >
          {notes.map((note) => (
            <article 
              key={note.id} 
              className="note-card"
              tabIndex="0"
            >
              <div className="note-card-content">
                <h3 id={`note-title-${note.id}`}>{note.title}</h3>
                <p className="note-preview">
                  {note.content.length > 100
                    ? `${note.content.substring(0, 100)}...`
                    : note.content}
                </p>
              </div>
              <div className="note-footer">
                <span 
                  className="note-date"
                  aria-label={`Created on ${new Date(note.createdAt).toLocaleDateString()}`}
                >
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
                <div className="note-actions">
                  <Link
                    to={`/notes/${note.id}`}
                    className="edit-button"
                    role="button"
                    aria-label={`Edit note: ${note.title}`}
                  >
                    Edit
                  </Link>
                  <button
                    className="delete-button outline"
                    onClick={() => handleDeleteNote(note.id)}
                    aria-label={`Delete note: ${note.title}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteList;
