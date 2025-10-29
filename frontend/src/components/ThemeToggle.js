import React, { useState, useEffect } from "react";
import "./ThemeToggle.css";

const ThemeToggle = () => {
  // Initialize theme from localStorage or system preference
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;

    // Check system preference
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className="theme-toggle">
      <button
        onClick={toggleTheme}
        className={`contrast theme-toggle-button ${
          theme === "light" ? "light-mode" : "dark-mode"
        }`}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
      </button>
    </div>
  );
};

export default ThemeToggle;
