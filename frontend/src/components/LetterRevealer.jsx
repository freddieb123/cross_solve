import React, { useState, useEffect } from 'react';
import { getLetterHint } from '../utils/api';
import '../styles/LetterRevealer.css';

export default function LetterRevealer({ answerLength, rowid, revealedLetters, onReveal }) {
  const [availableLetters, setAvailableLetters] = useState([]);
  const [revealedMap, setRevealedMap] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Generate a randomized list of letter positions
    const positions = Array.from({ length: answerLength }, (_, i) => i);
    const shuffled = [...positions].sort(() => Math.random() - 0.5);
    setAvailableLetters(shuffled);
    setRevealedMap({});
  }, [answerLength, rowid]);

  const handleReveal = async (position) => {
    if (revealedMap[position]) return;

    setLoading(true);
    try {
      const { letter } = await getLetterHint(rowid, position);
      setRevealedMap((prev) => ({ ...prev, [position]: letter }));
      onReveal?.(position, letter);
    } catch (err) {
      console.error('Failed to get letter hint:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="letter-revealer">
      <h4>Reveal letters (randomized):</h4>
      <div className="letter-buttons">
        {availableLetters.map((position, idx) => (
          <button
            key={idx}
            className={`letter-button ${revealedMap[position] ? 'revealed' : ''}`}
            onClick={() => handleReveal(position)}
            disabled={!!revealedMap[position] || loading}
            title={`Position ${position + 1}`}
          >
            {revealedMap[position] ? revealedMap[position] : `${position + 1}`}
          </button>
        ))}
      </div>
    </div>
  );
}
