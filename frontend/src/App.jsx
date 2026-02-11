import React, { useState, useEffect } from 'react';
import PuzzleSelector from './components/PuzzleSelector';
import ClueDisplay from './components/ClueDisplay';
import BurgerMenu from './components/BurgerMenu';
import StatsModal from './components/StatsModal';
import SavedCluesModal from './components/SavedCluesModal';
import Login from './components/Login';
import Register from './components/Register';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [clueKey, setClueKey] = useState(0);
  const [showTypeSelector, setShowTypeSelector] = useState(true);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showSavedCluesModal, setShowSavedCluesModal] = useState(false);
  const [loadedClue, setLoadedClue] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('authToken');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
    }
    setAuthLoading(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowRegister(false);
  };

  const handleRegisterSuccess = (userData) => {
    setUser(userData);
    setShowRegister(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setSelectedType(null);
    setShowTypeSelector(true);
  };

  const handlePuzzleSelect = (type) => {
    setSelectedType(type);
    setShowTypeSelector(false);
    setClueKey(0);
  };

  const handleChangeType = () => {
    setShowTypeSelector(true);
    setSelectedType(null);
  };

  const handleLoadSavedClue = (clue) => {
    setLoadedClue(clue);
  };

  // Loading auth state
  if (authLoading) {
    return (
      <div className="app">
        <div className="auth-loading">Loading...</div>
      </div>
    );
  }

  // Screen 1: Login/Register
  if (!user) {
    if (showRegister) {
      return (
        <Register
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => setShowRegister(false)}
        />
      );
    }
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  // Screen 2: Type Selection
  if (showTypeSelector) {
    return (
      <div className="app">
        <header className="app-header">
          <BurgerMenu
            onSelectType={handleChangeType}
            onShowStats={() => setShowStatsModal(true)}
            onShowSavedClues={() => setShowSavedCluesModal(true)}
            onLogout={handleLogout}
            email={user.email}
          />
          <h1>Daily Cryptic Trainer</h1>
        </header>
        <main className="type-selector-screen">
          <PuzzleSelector onSelect={handlePuzzleSelect} selectedType={selectedType} />
        </main>
      </div>
    );
  }

  // Screen 3: Clue Solving
  return (
    <div className="app">
      <header className="app-header">
        <BurgerMenu
          onSelectType={handleChangeType}
          onShowStats={() => setShowStatsModal(true)}
          onShowSavedClues={() => setShowSavedCluesModal(true)}
          onLogout={handleLogout}
          email={user.email}
        />
        <h1>Daily Cryptic Trainer</h1>
      </header>

      <main className="main-content">
        <ClueDisplay
          key={clueKey}
          puzzleType={selectedType}
          loadedClue={loadedClue}
          onClueChange={() => setLoadedClue(null)}
        />
      </main>

      {showStatsModal && (
        <StatsModal onClose={() => setShowStatsModal(false)} />
      )}

      {showSavedCluesModal && (
        <SavedCluesModal
          onClose={() => setShowSavedCluesModal(false)}
          onLoadClue={handleLoadSavedClue}
        />
      )}
    </div>
  );
}

export default App;
