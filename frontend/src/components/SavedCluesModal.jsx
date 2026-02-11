import React, { useState, useEffect } from 'react';
import { getSavedClues, removeSavedClue, getClueByRowid } from '../utils/api';
import '../styles/SavedCluesModal.css';

export default function SavedCluesModal({ onClose, onLoadClue }) {
  const [savedClues, setSavedClues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedClues = async () => {
      try {
        setLoading(true);
        setError(null);

        const clues = await getSavedClues();
        setSavedClues(clues);
      } catch (err) {
        console.error('Error fetching saved clues:', err);
        setError('Failed to load saved clues');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedClues();
  }, []);

  const handleDeleteClue = async (clueRowid) => {
    try {
      await removeSavedClue(clueRowid);
      setSavedClues(savedClues.filter((clue) => clue.clue_rowid !== clueRowid));
    } catch (err) {
      console.error('Error deleting saved clue:', err);
      setError('Failed to delete saved clue');
    }
  };

  const handleLoadClue = async (clue) => {
    try {
      // Fetch the full clue data to ensure we have all fields
      const fullClue = await getClueByRowid(clue.clue_rowid);
      onLoadClue(fullClue);
      onClose();
    } catch (err) {
      console.error('Error loading clue:', err);
      setError('Failed to load clue');
    }
  };

  if (loading) {
    return (
      <div className="saved-clues-modal-overlay" onClick={onClose}>
        <div className="saved-clues-modal" onClick={(e) => e.stopPropagation()}>
          <div className="saved-clues-loading">Loading saved clues...</div>
          <button className="saved-clues-close-button" onClick={onClose}>✕</button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="saved-clues-modal-overlay" onClick={onClose}>
        <div className="saved-clues-modal" onClick={(e) => e.stopPropagation()}>
          <div className="saved-clues-error">{error}</div>
          <button className="saved-clues-close-button" onClick={onClose}>✕</button>
        </div>
      </div>
    );
  }

  if (savedClues.length === 0) {
    return (
      <div className="saved-clues-modal-overlay" onClick={onClose}>
        <div className="saved-clues-modal" onClick={(e) => e.stopPropagation()}>
          <h2>Saved for Later</h2>
          <div className="saved-clues-empty">
            No saved clues yet. Use the 🕐 button while solving to save clues!
          </div>
          <button className="saved-clues-close-button" onClick={onClose}>✕</button>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-clues-modal-overlay" onClick={onClose}>
      <div className="saved-clues-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Saved for Later</h2>
        <button className="saved-clues-close-button" onClick={onClose}>✕</button>

        <div className="saved-clues-list">
          {savedClues.map((clue) => (
            <div key={clue.clue_rowid} className="saved-clue-item">
              <div className="saved-clue-content">
                <div className="saved-clue-text">{clue.clue}</div>
                <div className="saved-clue-meta">
                  <span className="saved-clue-type">{clue.type}</span>
                  <span className="saved-clue-answer">Length: {clue.answerLength}</span>
                </div>
              </div>
              <div className="saved-clue-actions">
                <button
                  className="saved-clue-load-button"
                  onClick={() => handleLoadClue(clue)}
                  title="Load this clue"
                >
                  Load
                </button>
                <button
                  className="saved-clue-delete-button"
                  onClick={() => handleDeleteClue(clue.clue_rowid)}
                  title="Delete from saved"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
