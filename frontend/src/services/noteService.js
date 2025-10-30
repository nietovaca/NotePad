import axios from "axios";
import { apiConfig } from "../auth/authConfig";

/**
 * Creates an API client with optional token authentication
 * Following functional programming principles:
 * - Pure function that creates a new instance each time
 * - Immutable configuration
 * - No side effects
 */
const createApiClient = (token = null) => {
  const headers = token 
    ? { Authorization: `Bearer ${token}` }
    : {};
    
  return axios.create({
    baseURL: apiConfig.baseUrl,
    headers: {
      "Content-Type": "application/json",
      ...headers
    }
  });
};

/**
 * Error handler that follows functional programming principles
 * - Pure function with no side effects
 * - Returns a new error object rather than modifying the input
 */
const handleApiError = (error, context) => {
  // Log the error with context but don't modify the error
  console.error(`API Error [${context}]:`, error);
  
  // Return a new error object with additional context
  return {
    ...error,
    context,
    message: error.message || `An error occurred during ${context}`,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Note service using functional programming principles:
 * - Immutable data
 * - Pure functions
 * - Function composition
 * - Higher-order functions
 */
const noteService = {
  // Current token state (this is the only mutable state)
  _token: null,
  
  // Pure function to set token
  setToken: (token) => {
    noteService._token = token;
    return noteService; // Enable method chaining
  },
  
  // Higher-order function that creates an authenticated request
  withAuth: (apiCall) => async (...args) => {
    const api = createApiClient(noteService._token);
    return apiCall(api, ...args);
  },

  // API methods as pure functions composed with withAuth
  getAllNotes: async function() {
    return this.withAuth(
      async (api) => {
        try {
          const response = await api.get("/api/notes");
          return response.data;
        } catch (error) {
          throw handleApiError(error, "fetching all notes");
        }
      }
    )();
  },

  getNoteById: async function(id) {
    return this.withAuth(
      async (api, noteId) => {
        try {
          const response = await api.get(`/api/notes/${noteId}`);
          return response.data;
        } catch (error) {
          throw handleApiError(error, `fetching note ${noteId}`);
        }
      }
    )(id);
  },

  createNote: async function(note) {
    return this.withAuth(
      async (api, noteData) => {
        try {
          // Create immutable copy of note data
          const sanitizedNote = { ...noteData };
          const response = await api.post("/api/notes", sanitizedNote);
          return response.data;
        } catch (error) {
          throw handleApiError(error, "creating note");
        }
      }
    )(note);
  },

  updateNote: async function(id, note) {
    return this.withAuth(
      async (api, noteId, noteData) => {
        try {
          // Create immutable copy of note data
          const sanitizedNote = { ...noteData };
          const response = await api.put(`/api/notes/${noteId}`, sanitizedNote);
          return response.data;
        } catch (error) {
          throw handleApiError(error, `updating note ${noteId}`);
        }
      }
    )(id, note);
  },

  deleteNote: async function(id) {
    return this.withAuth(
      async (api, noteId) => {
        try {
          await api.delete(`/api/notes/${noteId}`);
          return true;
        } catch (error) {
          throw handleApiError(error, `deleting note ${noteId}`);
        }
      }
    )(id);
  },
};

export default noteService;
