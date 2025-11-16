import React, { useState } from "react";
import { FaSun, FaMoon, FaPalette } from "react-icons/fa";
import "./ThemeSelector.css";

const ThemeSelector = ({ currentTheme, onThemeChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { value: "light", label: "Light", icon: FaSun },
    { value: "dark", label: "Dark", icon: FaMoon },
    { value: "custom", label: "Custom", icon: FaPalette },
  ];

  const handleThemeSelect = (themeValue) => {
    onThemeChange(themeValue);
    setIsOpen(false);
  };

  return (
    <div className="theme-selector">
      <button
        className="theme-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Change theme"
      >
        {React.createElement(
          themes.find((t) => t.value === currentTheme)?.icon || FaSun
        )}
      </button>
      {isOpen && (
        <div className="theme-dropdown">
          <div className="theme-header">Select Theme</div>
          {themes.map((theme) => (
            <button
              key={theme.value}
              className={`theme-option ${
                currentTheme === theme.value ? "active" : ""
              }`}
              onClick={() => handleThemeSelect(theme.value)}
            >
              {React.createElement(theme.icon)}
              <span>{theme.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
