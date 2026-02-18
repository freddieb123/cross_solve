import React, { useState, useEffect } from 'react';
import PuzzleSelector from './components/PuzzleSelector';
import ClueDisplay from './components/ClueDisplay';
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
  const [activeTab, setActiveTab] = useState('edition');

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
    setActiveTab('edition');
  };

  const handlePuzzleSelect = (type) => {
    setSelectedType(type);
    setShowTypeSelector(false);
    setClueKey(0);
    setActiveTab('edition');
  };

  const handleLoadSavedClue = (clue) => {
    setLoadedClue(clue);
    setShowTypeSelector(false);
    setSelectedType(clue.puzzle_name ? clue.puzzle_name.split(' ')[0].toLowerCase() : 'cryptic');
  };

  // Loading auth state
  if (authLoading) {
    return (
      <div className="app">
        <div className="auth-loading text-stone">Loading...</div>
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
        {/* Masthead */}
        <header className="pt-8 px-6 pb-4 text-center border-double-b mb-8">
          <h1 className="font-display italic font-bold text-4xl mb-3 tracking-tight leading-none text-ink">
            The Sunday Edition
          </h1>
          <div className="flex items-center justify-center gap-4 text-xs font-sans font-semibold tracking-[0.2em] text-stone uppercase border-t border-ink pt-3 mt-1">
            <span>Vol. No. 1</span>
            <span className="text-crimson text-[10px]">•</span>
            <span>Daily</span>
            <span className="text-crimson text-[10px]">•</span>
            <span>Est. 2023</span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-5 pb-24 flex flex-col gap-8">
          <PuzzleSelector onSelect={handlePuzzleSelect} selectedType={selectedType} />
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 w-full max-w-md bg-newsprint border-t border-ink z-40 pb-safe">
          <div className="flex justify-between items-end px-6 pt-3 pb-5">
            <button
              onClick={() => setActiveTab('edition')}
              className={`flex flex-col items-center gap-1 group flex-1 ${
                activeTab === 'edition' ? 'text-ink' : 'text-stone hover:text-ink transition-colors'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: activeTab === 'edition' ? "'FILL' 1, 'wght' 500" : "'FILL' 0, 'wght' 400" }}>
                newspaper
              </span>
              <span className={`font-sans text-[9px] font-bold tracking-widest uppercase mt-1 ${activeTab === 'edition' ? 'border-b border-ink pb-0.5' : ''}`}>Edition</span>
            </button>
            <button
              onClick={() => setShowStatsModal(true)}
              className="flex flex-col items-center gap-1 text-stone hover:text-ink transition-colors group flex-1"
            >
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>
                trending_up
              </span>
              <span className="font-sans text-[9px] font-medium tracking-widest uppercase mt-1 group-hover:border-b group-hover:border-stone pb-0.5">Stats</span>
            </button>
            <button
              onClick={() => setShowSavedCluesModal(true)}
              className="flex flex-col items-center gap-1 text-stone hover:text-ink transition-colors group flex-1"
            >
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>
                bookmark
              </span>
              <span className="font-sans text-[9px] font-medium tracking-widest uppercase mt-1 group-hover:border-b group-hover:border-stone pb-0.5">Saved</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex flex-col items-center gap-1 text-stone hover:text-crimson transition-colors group flex-1"
            >
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>
                logout
              </span>
              <span className="font-sans text-[9px] font-medium tracking-widest uppercase mt-1 group-hover:border-b group-hover:border-stone pb-0.5">Logout</span>
            </button>
          </div>
        </nav>

        {/* Safe area spacer for bottom nav */}
        <div className="h-20"></div>

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

  // Screen 3: Clue Solving
  return (
    <div className="app">
      {/* Masthead */}
      <header className="pt-8 px-6 pb-4 text-center border-double-b mb-8">
        <h1 className="font-display italic font-bold text-4xl mb-3 tracking-tight leading-none text-ink">
          The Sunday Edition
        </h1>
        <div className="flex items-center justify-center gap-4 text-xs font-sans font-semibold tracking-[0.2em] text-stone uppercase border-t border-ink pt-3 mt-1">
          <span>Vol. No. 1</span>
          <span className="text-crimson text-[10px]">•</span>
          <span>{selectedType?.toUpperCase() || 'DAILY'}</span>
          <span className="text-crimson text-[10px]">•</span>
          <span>Est. 2023</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 pb-24 flex flex-col gap-8 overflow-y-auto">
        <ClueDisplay
          key={clueKey}
          puzzleType={selectedType}
          loadedClue={loadedClue}
          onClueChange={() => setLoadedClue(null)}
        />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full max-w-md bg-newsprint border-t border-ink z-40 pb-safe">
        <div className="flex justify-between items-end px-6 pt-3 pb-5">
          <button
            onClick={() => setActiveTab('edition')}
            className={`flex flex-col items-center gap-1 group flex-1 ${
              activeTab === 'edition' ? 'text-ink' : 'text-stone hover:text-ink transition-colors'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: activeTab === 'edition' ? "'FILL' 1, 'wght' 500" : "'FILL' 0, 'wght' 400" }}>
              newspaper
            </span>
            <span className={`font-sans text-[9px] font-bold tracking-widest uppercase mt-1 ${activeTab === 'edition' ? 'border-b border-ink pb-0.5' : ''}`}>Edition</span>
          </button>
          <button
            onClick={() => setShowStatsModal(true)}
            className="flex flex-col items-center gap-1 text-stone hover:text-ink transition-colors group flex-1"
          >
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>
              trending_up
            </span>
            <span className="font-sans text-[9px] font-medium tracking-widest uppercase mt-1 group-hover:border-b group-hover:border-stone pb-0.5">Stats</span>
          </button>
          <button
            onClick={() => setShowSavedCluesModal(true)}
            className="flex flex-col items-center gap-1 text-stone hover:text-ink transition-colors group flex-1"
          >
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>
              bookmark
            </span>
            <span className="font-sans text-[9px] font-medium tracking-widest uppercase mt-1 group-hover:border-b group-hover:border-stone pb-0.5">Saved</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 text-stone hover:text-crimson transition-colors group flex-1"
          >
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>
              logout
            </span>
            <span className="font-sans text-[9px] font-medium tracking-widest uppercase mt-1 group-hover:border-b group-hover:border-stone pb-0.5">Logout</span>
          </button>
        </div>
      </nav>

      {/* Safe area spacer for bottom nav */}
      <div className="h-20"></div>

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
