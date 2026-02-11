import React, { useState, useEffect } from 'react';
import { getStats, getSuccessRate, getHistory } from '../utils/storage';
import '../styles/Stats.css';

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    updateStats();
  }, []);

  function updateStats() {
    setStats(getStats());
    setHistory(getHistory());
  }

  if (!stats) return null;

  const successRate = getSuccessRate();

  return (
    <div className="stats-panel">
      <h3>Your Statistics</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Total Attempts</span>
          <span className="stat-value">{stats.totalAttempts}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Correct</span>
          <span className="stat-value">{stats.correctAnswers}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Success Rate</span>
          <span className="stat-value">{successRate}%</span>
        </div>
      </div>

      <button
        className="history-button"
        onClick={() => setShowHistory(!showHistory)}
      >
        {showHistory ? 'Hide' : 'Show'} History ({history.length})
      </button>

      {showHistory && (
        <div className="history-list">
          {history.length === 0 ? (
            <p>No clues completed yet.</p>
          ) : (
            <ul>
              {history.map((item, idx) => (
                <li key={idx} className={item.correct ? 'correct' : 'incorrect'}>
                  <span className="history-clue">{item.clue}</span>
                  <span className="history-result">
                    {item.correct ? '✓' : '✗'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
