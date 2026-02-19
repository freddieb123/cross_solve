import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getAbbreviations } from '../utils/api';
import '../styles/AbbreviationQuiz.css';

const HISTORY_KEY = 'abbrevQuizHistory';
const MAX_HISTORY = 100;
const MAX_INPUTS = 6; // cap inputs shown for meanings with many abbreviations

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

function saveHistory(h) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(-MAX_HISTORY)));
}

export default function AbbreviationQuiz({ onBack }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [current, setCurrent] = useState(null);
  const [displayCount, setDisplayCount] = useState(1);
  const [inputs, setInputs] = useState(['']);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [history, setHistory] = useState(loadHistory);
  const inputRefs = useRef([]);
  const lastMeaning = useRef(null);

  useEffect(() => {
    getAbbreviations()
      .then(data => {
        setEntries(data.entries);
        showQuestion(data.entries, null);
      })
      .catch(() => setError('Failed to load abbreviations'))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const showQuestion = useCallback((pool, skipMeaning) => {
    if (!pool || pool.length === 0) return;
    // Avoid repeating last question
    let candidates = pool.length > 1 && skipMeaning
      ? pool.filter(e => e.meaning !== skipMeaning)
      : pool;
    const entry = candidates[Math.floor(Math.random() * candidates.length)];
    const n = Math.min(entry.abbreviations.length, MAX_INPUTS);
    setCurrent(entry);
    setDisplayCount(n);
    setInputs(Array(n).fill(''));
    setSubmitted(false);
    setIsCorrect(false);
    setWrongInputs([]);
    lastMeaning.current = entry.meaning;
    // Focus first input after render
    setTimeout(() => inputRefs.current[0]?.focus(), 50);
  }, []);

  const handleNext = useCallback(() => {
    showQuestion(entries, lastMeaning.current);
  }, [entries, showQuestion]);

  function handleChange(idx, value) {
    const next = [...inputs];
    next[idx] = value;
    setInputs(next);
  }

  function handleKeyDown(e, idx) {
    if (e.key === 'Enter') {
      if (idx < displayCount - 1) {
        inputRefs.current[idx + 1]?.focus();
      } else {
        submit();
      }
    }
  }

  function submit() {
    if (submitted || !current) return;

    const valid = current.abbreviations;
    const given = inputs.map(s => s.trim().toLowerCase());

    // Each entered value must be a valid abbreviation, no duplicates
    const uniqueGiven = [...new Set(given.filter(s => s.length > 0))];
    const wrong = uniqueGiven.filter(g => !valid.includes(g));
    const correct = uniqueGiven.length === displayCount && wrong.length === 0;

    setIsCorrect(correct);
    setWrongInputs(wrong);
    setSubmitted(true);

    const newHistory = [...history, correct].slice(-MAX_HISTORY);
    setHistory(newHistory);
    saveHistory(newHistory);
  }

  const allFilled = inputs.every(s => s.trim().length > 0);
  const totalCorrect = history.filter(Boolean).length;
  const totalAnswered = history.length;
  const hasManyAnswers = current && current.abbreviations.length > MAX_INPUTS;

  if (loading) {
    return <div className="abbrev-quiz"><p className="abbrev-loading">Loading…</p></div>;
  }
  if (error) {
    return (
      <div className="abbrev-quiz">
        <p className="abbrev-error">{error}</p>
        <button className="abbrev-back" onClick={onBack}>← Back</button>
      </div>
    );
  }
  if (!current) return null;

  return (
    <div className="abbrev-quiz">

      {/* Top row: back + score */}
      <div className="abbrev-toprow">
        <button className="abbrev-back" onClick={onBack}>← Back</button>
        <div className="abbrev-score">
          {totalAnswered > 0 ? (
            <>
              <span className="abbrev-score-num">{totalCorrect}/{totalAnswered}</span>
              <span className="abbrev-score-label">last {Math.min(totalAnswered, 100)}</span>
            </>
          ) : (
            <span className="abbrev-score-label">score will appear here</span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="abbrev-divider" />

      {/* The word to identify */}
      <div className="abbrev-question">
        <p className="abbrev-prompt">What abbreviation means:</p>
        <div className="abbrev-word">{current.meaning}</div>
        {current.abbreviations.length > 1 && (
          <p className="abbrev-count">
            {hasManyAnswers
              ? `${current.abbreviations.length} possible — enter any ${MAX_INPUTS}`
              : `${current.abbreviations.length} possible abbreviation${current.abbreviations.length !== 1 ? 's' : ''}`}
          </p>
        )}
      </div>

      {/* Input fields */}
      {!submitted && (
        <div className="abbrev-inputs">
          {inputs.map((val, idx) => (
            <input
              key={idx}
              ref={el => inputRefs.current[idx] = el}
              type="text"
              value={val}
              onChange={e => handleChange(idx, e.target.value)}
              onKeyDown={e => handleKeyDown(e, idx)}
              placeholder={displayCount > 1 ? `Abbreviation ${idx + 1}` : 'Type abbreviation…'}
              className="abbrev-input"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
            />
          ))}
          <button
            className="abbrev-submit"
            onClick={submit}
            disabled={!allFilled}
          >
            Submit
          </button>
        </div>
      )}

      {/* Result */}
      {submitted && (
        <div className={`abbrev-result ${isCorrect ? 'abbrev-result--correct' : 'abbrev-result--wrong'}`}>
          {isCorrect ? (
            <p className="abbrev-verdict">✓ Well done!</p>
          ) : (
            <>
              <p className="abbrev-verdict">✗ Not quite.</p>
              {wrongInputs.length > 0 && (
                <p className="abbrev-detail">
                  Incorrect: <strong>{wrongInputs.join(', ')}</strong>
                </p>
              )}
              <p className="abbrev-detail abbrev-answer">
                {hasManyAnswers ? 'Possible answers include' : 'Answer'}:{' '}
                <strong>
                  {hasManyAnswers
                    ? current.abbreviations.slice(0, 8).join(', ') + '…'
                    : current.abbreviations.join(', ')}
                </strong>
              </p>
            </>
          )}
          <button className="abbrev-next" onClick={handleNext}>
            Next →
          </button>
        </div>
      )}

    </div>
  );
}
