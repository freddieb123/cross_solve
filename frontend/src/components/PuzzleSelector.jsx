import React, { useEffect, useState } from 'react';
import { getPuzzleTypes } from '../utils/api';
import '../styles/PuzzleSelector.css';

export default function PuzzleSelector({ onSelect, selectedType, onAbbrevQuiz }) {
  const [types, setTypes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTypes() {
      try {
        const data = await getPuzzleTypes();
        setTypes(data);
      } catch (err) {
        setError('Failed to load puzzle types');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTypes();
  }, []);

  if (loading) return <div className="puzzle-selector">Loading...</div>;
  if (error) return <div className="puzzle-selector error">{error}</div>;
  if (!types) return null;

  return (
    <div className="puzzle-selector">
      <h2>Choose a puzzle type</h2>
      <div className="button-group">
        {types.types.map((type) => (
          <button
            key={type}
            className={`puzzle-button ${selectedType === type ? 'active' : ''}`}
            onClick={() => onSelect(type)}
          >
            {types.labels[type]}
          </button>
        ))}
      </div>

      <div className="puzzle-selector__divider">
        <span>or</span>
      </div>

      <button className="puzzle-button puzzle-button--abbrev" onClick={onAbbrevQuiz}>
        Practice Abbreviations
      </button>
    </div>
  );
}
