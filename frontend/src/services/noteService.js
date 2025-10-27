import axios from "axios";
import { apiConfig } from "../auth/authConfig";

// Create axios instance with base URL
const api = axios.create({
  baseURL: apiConfig.baseUrl,
});

// Add auth token to API requests
const setAuthHeader = (token) => {
  if (token) {
    console.log("Setting auth token in headers:", token.substring(0, 15) + "...");
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    console.log("No token provided, removing Authorization header");
    delete api.defaults.headers.common["Authorization"];
  }
};

const noteService = {
  setToken: (token) => {
    setAuthHeader(token);
  },

  getAllNotes: async () => {
    try {
      const response = await api.get("/api/notes");
      return response.data;
    } catch (error) {
      console.error("Error fetching notes:", error);
      throw error;
    }
  },

  getNoteById: async (id) => {
    try {
      const response = await api.get(`/api/notes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching note: ${id}`, error);
      throw error;
    }
  },

  createNote: async (note) => {
    try {
      console.log("Creating note with data:", note);
      const response = await api.post("/api/notes", note);
      console.log("Create note response:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error creating note:`, error);
      console.log("Request payload:", note);
      console.log("Error response:", error.response?.data);
      throw error;
    }
  },

  updateNote: async (id, note) => {
    try {
      const response = await api.put(`/api/notes/${id}`, note);
      return response.data;
    } catch (error) {
      console.error(`Error updating note: ${id}`, error);
      throw error;
    }
  },

  deleteNote: async (id) => {
    try {
      await api.delete(`/api/notes/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting note: ${id}`, error);
      throw error;
    }
  },
};

export default noteService;
