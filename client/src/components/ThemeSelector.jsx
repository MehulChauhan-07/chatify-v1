import React, { useState } from "react";
import { FaSun, FaMoon, FaPalette } from "react-icons/fa";

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
      <style jsx>{`
        .theme-selector {
          position: relative;
        }

        .theme-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 50%;
          background: transparent;
          color: #666;
          cursor: pointer;
          transition: all 0.2s;
        }

        .theme-button:hover {
          background: #f5f5f5;
          color: #2196f3;
        }

        .theme-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          min-width: 180px;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          overflow: hidden;
        }

        .theme-header {
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 600;
          color: #333;
          border-bottom: 1px solid #e0e0e0;
        }

        .theme-option {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          border: none;
          background: white;
          color: #333;
          cursor: pointer;
          transition: background 0.2s;
          font-size: 14px;
        }

        .theme-option:hover {
          background: #f5f5f5;
        }

        .theme-option.active {
          background: #e3f2fd;
          color: #2196f3;
        }
      `}</style>
    </div>
  );
};

export default ThemeSelector;
