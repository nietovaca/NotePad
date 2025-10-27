// src/components/NoteEditor.js

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

  if (loading) return <div className="loading">Loading note...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="note-editor-container">
      <h2>{isNew ? "Create New Note" : "Edit Note"}</h2>

      <form onSubmit={handleSubmit} className="note-form">
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
            rows="10"
            required
          />
        </div>

        <div className="form-buttons">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/notes")}
          >
            Cancel
          </button>
          <button type="submit" className="save-button" disabled={saving}>
            {saving ? "Saving..." : "Save Note"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteEditor;
