import React, { useState, useEffect } from 'react';
import { getStatsSummary, getStatsHistory } from '../utils/api';
import '../styles/StatsModal.css';

export default function StatsModal({ onClose }) {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const statsData = await getStatsSummary();
        setStats(statsData);

        const historyData = await getStatsHistory(10);
        setHistory(historyData);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="stats-modal-overlay" onClick={onClose}>
        <div className="stats-modal" onClick={(e) => e.stopPropagation()}>
          <div className="stats-loading">Loading stats...</div>
          <button className="stats-close-button" onClick={onClose}>✕</button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-modal-overlay" onClick={onClose}>
        <div className="stats-modal" onClick={(e) => e.stopPropagation()}>
          <div className="stats-error">{error}</div>
          <button className="stats-close-button" onClick={onClose}>✕</button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="stats-modal-overlay" onClick={onClose}>
        <div className="stats-modal" onClick={(e) => e.stopPropagation()}>
          <div className="stats-empty">No stats yet. Solve some clues to get started!</div>
          <button className="stats-close-button" onClick={onClose}>✕</button>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-modal-overlay" onClick={onClose}>
      <div className="stats-modal" onClick={(e) => e.stopPropagation()}>
        <button className="stats-close-button" onClick={onClose}>✕</button>

        <h2>Your Statistics</h2>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Attempts</div>
            <div className="stat-value">{stats.totalAttempts}</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Correct Answers</div>
            <div className="stat-value">{stats.correctAnswers}</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Success Rate</div>
            <div className="stat-value">{stats.successRate}%</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Avg % Letters (All Time)</div>
            <div className="stat-value">{stats.avgLettersRevealedPct}%</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Avg % Letters (Last 10)</div>
            <div className="stat-value">{stats.last10AvgLettersRevealedPct}%</div>
          </div>
        </div>

        {history.length > 0 && (
          <div className="stats-history">
            <h3>Recent Attempts</h3>
            <div className="history-list">
              {history.map((attempt) => (
                <div key={attempt.id} className="history-item">
                  <div className="history-clue">{attempt.clue}</div>
                  <div className="history-details">
                    <span className={`history-result ${attempt.correct ? 'correct' : 'incorrect'}`}>
                      {attempt.correct ? '✓' : '✗'}
                    </span>
                    <span className="history-letters">
                      {attempt.letters_revealed_pct}% letters
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
