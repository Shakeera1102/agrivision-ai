import React, { useState, useEffect } from 'react';
import { History, Trash2, RotateCcw, AlertCircle, FileText, Calendar, Tag } from 'lucide-react';

const PredictionHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem('agrivision_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      } else {
        setHistory([]);
      }
    } catch (e) {
      console.error('Failed to load history:', e);
      setHistory([]);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all prediction history records?')) {
      localStorage.removeItem('agrivision_history');
      setHistory([]);
    }
  };

  const handleDeleteItem = (id) => {
    const updated = history.filter((item) => item.id !== id);
    localStorage.setItem('agrivision_history', JSON.stringify(updated));
    setHistory(updated);
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803d', fontWeight: '700', fontSize: '0.9rem', marginBottom: '4px' }}>
            <History size={18} />
            <span>SESSION INFERENCE LOGS</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a' }}>
            Prediction History
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Review past diagnostic inferences performed during your current browser sessions.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="btn-secondary"
            style={{
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              borderColor: '#fca5a5'
            }}
          >
            <Trash2 size={16} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* History Table Card */}
      <div className="card">
        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: '#94a3b8'
            }}>
              <FileText size={28} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
              No Prediction Records Found
            </h3>
            <p style={{ fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
              When you upload and analyze crop leaf images in the Detect Disease tab, your results will appear here.
            </p>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Filename</th>
                  <th>Target Crop</th>
                  <th>Predicted Condition</th>
                  <th>Severity</th>
                  <th>Model Used</th>
                  <th>Timestamp</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: '600', color: '#0f172a' }}>
                      {item.filename}
                    </td>
                    <td style={{ fontWeight: '700', color: '#15803d' }}>
                      {item.crop}
                    </td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{item.disease_name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.class_name}</div>
                    </td>
                    <td>
                      <span className="badge-tag" style={{
                        backgroundColor: item.severity === 'None' ? '#dcfce7' : '#fee2e2',
                        color: item.severity === 'None' ? '#15803d' : '#991b1b',
                        padding: '2px 8px',
                        fontSize: '0.75rem'
                      }}>
                        {item.severity}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {item.model_name}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                      {item.date} {item.time}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#dc2626',
                          cursor: 'pointer',
                          padding: '6px',
                          borderRadius: '6px',
                          transition: 'background-color 0.15s ease'
                        }}
                        title="Delete this record"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionHistory;
