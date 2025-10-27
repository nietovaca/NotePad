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

  if (loading) return <div className="loading">Loading notes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="note-list-container">
      <div className="note-list-header">
        <h2> My Notes </h2>
        <button
          className="new-note-button"
          onClick={() => navigate("/notes/new")}
        >
          New Note
        </button>
      </div>
      {notes.length === 0 ? (
        <div className="no-notes">
          <p>You don't have any notes yet. Create a new note to get started.</p>
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <div key={note.id} className="note-card">
              <h3>{note.title}</h3>
              <p className="note-preview">
                {note.content.length > 100
                  ? `${note.content.substring(0, 100)}...`
                  : note.content}
              </p>
              <div className="note-footer">
                <span className="note-date">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
                <div className="note-actions">
                  <Link to={`/notes/${note.id}`} className="edit-button">
                    Edit
                  </Link>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteList;
