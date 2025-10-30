// src/components/NoteEditor.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import noteService from "../services/noteService";
import "./NoteEditor.css"; // Create this file for styling

const NoteEditor = ({ isNew }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  const [note, setNote] = useState({
    title: "",
    content: "",
    updatedAt: new Date().toISOString(), // Add updatedAt field
  });
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      if (isNew) return;

      try {
        // Get the auth token
        const token = await getAccessTokenSilently({
          audience: "api://notepad",
        });

        // Set the token in the service
        noteService.setToken(token);

        // Fetch note if not new
        if (id) {
          const fetchedNote = await noteService.getNoteById(id);
          setNote(fetchedNote);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching note:", error);
        setError("Failed to load note. Please try again later.");
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, isNew, getAccessTokenSilently]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Get the auth token
      const token = await getAccessTokenSilently({
        audience: "api://notepad",
      });

      // Set the token in the service
      noteService.setToken(token);

      if (isNew) {
        await noteService.createNote(note);
      } else {
        await noteService.updateNote(id, note);
      }

      navigate("/notes");
    } catch (error) {
      console.error("Error saving note:", error);
      setError("Failed to save note. Please try again.");
      setSaving(false);
    }
  };

  if (loading) return (
    <div aria-live="polite" className="loading">
      <article>
        <progress></progress>
        <p>Loading note...</p>
      </article>
    </div>
  );
  
  if (error) return (
    <div role="alert" className="error">
      <article>
        <header>
          <h2>Error</h2>
        </header>
        <p>{error}</p>
        <footer>
          <button onClick={() => navigate("/notes")} className="secondary">Back to Notes</button>
        </footer>
      </article>
    </div>
  );

  return (
    <div className="note-editor-container">
      <article>
        <header>
          <h2 id="form-heading">{isNew ? "Create New Note" : "Edit Note"}</h2>
        </header>

        <form 
          onSubmit={handleSubmit} 
          className="note-form"
          aria-labelledby="form-heading"
        >
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={note.title}
              onChange={handleChange}
              placeholder="Note title"
              required
              aria-required="true"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={note.content}
              onChange={handleChange}
              placeholder="Write your note here..."
              rows="8"
              required
              aria-required="true"
            />
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="cancel-button secondary outline"
              onClick={() => navigate("/notes")}
              aria-label="Cancel and return to notes"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-button primary" 
              disabled={saving}
              aria-busy={saving}
              aria-label={saving ? "Saving note..." : "Save note"}
            >
              {saving ? "Saving..." : "Save Note"}
            </button>
          </div>
        </form>
      </article>
    </div>
  );
};

export default NoteEditor;
