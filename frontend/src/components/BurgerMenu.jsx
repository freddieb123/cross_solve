import React, { useState } from 'react';
import '../styles/BurgerMenu.css';

export default function BurgerMenu({
  onSelectType,
  onShowStats,
  onShowSavedClues,
  onLogout,
  email,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuClick = (callback) => {
    callback();
    setIsOpen(false);
  };

  return (
    <div className="burger-menu">
      <button
        className="burger-menu-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu"
      >
        ☰
      </button>

      {isOpen && (
        <div className="burger-menu-overlay" onClick={() => setIsOpen(false)}>
          <div className="burger-menu-content" onClick={(e) => e.stopPropagation()}>
            {email && (
              <div className="burger-menu-user">
                <strong>{email}</strong>
              </div>
            )}
            <button
              className="burger-menu-item"
              onClick={() => handleMenuClick(onSelectType)}
            >
              Select Type
            </button>
            <button
              className="burger-menu-item"
              onClick={() => handleMenuClick(onShowStats)}
            >
              Your Stats
            </button>
            <button
              className="burger-menu-item"
              onClick={() => handleMenuClick(onShowSavedClues)}
            >
              Saved for Later
            </button>
            <div className="burger-menu-divider"></div>
            <button
              className="burger-menu-item burger-menu-logout"
              onClick={() => handleMenuClick(onLogout)}
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
