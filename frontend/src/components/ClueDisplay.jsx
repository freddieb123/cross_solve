import React, { useState, useEffect } from 'react';
import { getRandomClue, checkAnswer, getHint, getLetterHint, recordAttempt, saveClueForLater } from '../utils/api';
import { addToHistory } from '../utils/storage';
import '../styles/ClueDisplay.css';

export default function ClueDisplay({ puzzleType, loadedClue, onClueChange }) {
  const [clue, setClue] = useState(null);
  const [userInput, setUserInput] = useState([]);
  const [revealedLetters, setRevealedLetters] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hint, setHint] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [lettersRevealedCount, setLettersRevealedCount] = useState(0);
  const [savedNotification, setSavedNotification] = useState(false);

  useEffect(() => {
    if (loadedClue) {
      setClue(loadedClue);
      setUserInput(new Array(loadedClue.answerLength).fill(''));
      setRevealedLetters({});
      setSubmitted(false);
      setResult(null);
      setShowHint(false);
      setHint(null);
      setLettersRevealedCount(0);
      setSavedNotification(false);
      setLoading(false);
      // Don't call onClueChange here - it would clear loadedClue
      // onClueChange is only called after loading the next clue
    } else {
      loadClue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzleType, loadedClue]);

  async function loadClue() {
    try {
      setLoading(true);
      setError(null);
      setUserInput([]);
      setRevealedLetters({});
      setSubmitted(false);
      setResult(null);
      setShowHint(false);
      setHint(null);
      setLettersRevealedCount(0);
      setSavedNotification(false);

      const clueData = await getRandomClue(puzzleType);
      setClue(clueData);
      // Initialize user input as empty array matching answer length
      setUserInput(new Array(clueData.answerLength).fill(''));
      onClueChange?.();
    } catch (err) {
      setError('Failed to load clue');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRevealLetter() {
    if (!clue) return;

    // Find unrevealed positions
    const unrevealedPositions = [];
    for (let i = 0; i < clue.answerLength; i++) {
      if (!revealedLetters[i] && userInput[i] === '') {
        unrevealedPositions.push(i);
      }
    }

    if (unrevealedPositions.length === 0) {
      return; // All letters already revealed
    }

    // Pick a random unrevealed position
    const randomPos = unrevealedPositions[Math.floor(Math.random() * unrevealedPositions.length)];

    try {
      const { letter } = await getLetterHint(clue.rowid, randomPos);
      setRevealedLetters((prev) => ({ ...prev, [randomPos]: letter }));
      setLettersRevealedCount((prev) => prev + 1);
    } catch (err) {
      console.error('Failed to get letter hint:', err);
    }
  }

  async function handleHint() {
    if (!hint) {
      try {
        const hintData = await getHint(clue.rowid);
        setHint(hintData);
      } catch (err) {
        console.error('Failed to load hint', err);
      }
    }
    setShowHint(!showHint);
  }

  function handleBoxClick(index) {
    // Focus on this position - can be enhanced for keyboard navigation
    const inputs = document.querySelectorAll('.answer-box input');
    if (inputs[index]) {
      inputs[index].focus();
    }
  }

  function handleInputChange(index, value) {
    // Only allow single letter
    const letter = value.toUpperCase().slice(-1);
    const newInput = [...userInput];
    newInput[index] = letter;
    setUserInput(newInput);

    // Auto-focus next box if letter entered
    if (letter && index < clue.answerLength - 1) {
      const inputs = document.querySelectorAll('.answer-box input');
      if (inputs[index + 1]) {
        inputs[index + 1].focus();
      }
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !userInput[index]) {
      // Move to previous box on backspace if current is empty
      if (index > 0) {
        const inputs = document.querySelectorAll('.answer-box input');
        if (inputs[index - 1]) {
          inputs[index - 1].focus();
        }
      }
    }
  }

  async function handleSubmit() {
    const answer = userInput.join('').toUpperCase();

    if (!answer.replace(/\s/g, '')) {
      setResult({ message: 'Please enter an answer', isCorrect: false });
      return;
    }

    try {
      const checkResult = await checkAnswer(clue.rowid, answer);
      const isCorrect = checkResult.correct;

      // Save to history (localStorage)
      addToHistory({ ...clue, answer: checkResult.answer }, isCorrect);

      // Record attempt in database
      try {
        await recordAttempt(
          clue.rowid,
          lettersRevealedCount,
          clue.answerLength,
          isCorrect,
          puzzleType
        );
      } catch (err) {
        console.error('Failed to record attempt:', err);
      }

      setSubmitted(true);
      setResult({
        message: isCorrect ? '✓ Correct!' : '✗ Incorrect',
        isCorrect,
        answer: checkResult.answer,
        sourceUrl: checkResult.source_url,
      });
    } catch (err) {
      setResult({ message: 'Error checking answer', isCorrect: false });
      console.error(err);
    }
  }

  async function handleSaveForLater() {
    if (!clue) return;

    try {
      await saveClueForLater(clue.rowid);
      setSavedNotification(true);
      setTimeout(() => setSavedNotification(false), 2000);

      // Load next clue after saving
      setTimeout(() => loadClue(), 800);
    } catch (err) {
      console.error('Failed to save clue:', err);
    }
  }

  if (loading) return <div className="clue-display">Loading clue...</div>;
  if (error) return <div className="clue-display error">{error}</div>;
  if (!clue) return null;

  return (
    <div className="clue-display">
      {/* Clue Section */}
      <div className="clue-section">
        <h3 className="clue-text">
          {showHint && hint ? (
            <>
              {clue.clue.substring(0, hint.definitionStart)}
              <span className="definition-highlight">
                {clue.clue.substring(hint.definitionStart, hint.definitionStart + hint.definitionLength)}
              </span>
              {clue.clue.substring(hint.definitionStart + hint.definitionLength)}
            </>
          ) : (
            clue.clue
          )}
        </h3>
        <div className="clue-footer">
          {clue.puzzle_name && (
            <div className="puzzle-title">{clue.puzzle_name}</div>
          )}
          {clue.source_url && (
            <a
              href={clue.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="explanation-button"
            >
              📖 Explanation
            </a>
          )}
        </div>
      </div>

      {/* Answer Grid with Navigation Arrows */}
      <div className="answer-grid-container">
        <button
          className="nav-arrow nav-arrow-left"
          onClick={loadClue}
          disabled={loading}
          title="Previous clue"
        >
          ←
        </button>

        <div className="answer-grid">
          {userInput.map((letter, index) => {
            const displayLetter = revealedLetters[index] || letter;

            return (
              <div key={index} className="answer-box">
                <input
                  type="text"
                  value={displayLetter}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onClick={() => handleBoxClick(index)}
                  maxLength="1"
                  disabled={submitted || !!revealedLetters[index]}
                  placeholder=""
                />
              </div>
            );
          })}
        </div>

        <button
          className="nav-arrow nav-arrow-right"
          onClick={loadClue}
          disabled={loading}
          title="Next clue"
        >
          →
        </button>
      </div>

      {/* Controls */}
      <div className="controls-section">
        <button className="hint-button" onClick={handleHint}>
          💡 {showHint ? 'Hide' : 'Show'} Hint
        </button>
        <button className="letter-button" onClick={handleRevealLetter} disabled={submitted}>
          🔤 Reveal Letter
        </button>
        <button
          className="save-button"
          onClick={handleSaveForLater}
          disabled={submitted}
          title="Save this clue for later"
        >
          🕐 Save
        </button>
        <button className="submit-button" onClick={handleSubmit} disabled={submitted}>
          {submitted ? 'Submitted' : '✓ Submit'}
        </button>
      </div>

      {savedNotification && (
        <div className="saved-notification">
          ✓ Clue saved for later!
        </div>
      )}

      {/* Result */}
      {result && (
        <div className={`result ${result.isCorrect ? 'correct' : 'incorrect'}`}>
          <p className="result-message">{result.message}</p>
          {result.isCorrect && result.sourceUrl && (
            <a href={result.sourceUrl} target="_blank" rel="noopener noreferrer" className="source-link">
              View Original Puzzle →
            </a>
          )}
          {result.answer && (
            <p className="correct-answer">Answer: {result.answer}</p>
          )}
          <button onClick={loadClue} className="next-button">
            Next Clue
          </button>
        </div>
      )}
    </div>
  );
}
