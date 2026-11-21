import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  Layers, 
  Cpu, 
  Award, 
  ScanSearch, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  TrendingUp 
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import WorkflowDiagram from '../components/WorkflowDiagram';

const Dashboard = () => {
  const [recentPredictions, setRecentPredictions] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('agrivision_history');
      if (stored) {
        const historyList = JSON.parse(stored);
        setRecentPredictions(historyList.slice(0, 5));
      }
    } catch (e) {
      console.error('Failed to parse history:', e);
    }
  }, []);

  return (
    <div className="page-container">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-tag">
          <ShieldCheck size={14} />
          <span>Agricultural AI Research Framework</span>
        </div>
        <h1 className="hero-title">AgriVision AI</h1>
        <p className="hero-description">
          Intelligent Crop Disease and Pest Detection Using Hybrid Deep Feature Extraction and PCA-Based SVM. 
          Engineered for high-accuracy agronomic diagnostics across multiple cash crops.
        </p>

        <div className="hero-btn-group">
          <Link to="/detect" className="btn-primary">
            <ScanSearch size={18} />
            <span>Detect Crop Disease</span>
          </Link>
          <Link to="/performance" className="btn-secondary">
            <TrendingUp size={18} />
            <span>View Research Metrics</span>
          </Link>
        </div>
      </section>

      {/* 4 Summary Cards */}
      <section className="metrics-grid">
        <MetricCard
          label="Supported Crops"
          value="4"
          subtext="Cashew, Cassava, Maize & Tomato"
          icon={Sprout}
          iconColor="#15803d"
          iconBg="#dcfce7"
        />

        <MetricCard
          label="Disease & Pest Classes"
          value="22"
          subtext="Healthy, Fungal, Viral & Pest Infestations"
          icon={Layers}
          iconColor="#2563eb"
          iconBg="#dbeafe"
        />

        <MetricCard
          label="Selected ML Model"
          value="Hybrid + PCA + SVM"
          subtext="ResNet50 + EfficientNetB0 (3328 &rarr; 1649 dims)"
          icon={Cpu}
          iconColor="#7c3aed"
          iconBg="#ede9fe"
        />

        <MetricCard
          label="Reported Model Accuracy"
          value="91.21%"
          subtext="Selected highlighted result (90.89% experimental)"
          icon={Award}
          iconColor="#b45309"
          iconBg="#fef3c7"
          isAccentGold={true}
        />
      </section>

      {/* Workflow Diagram */}
      <WorkflowDiagram />

      {/* Recent Predictions & Model Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Recent Inferences */}
        <div className="card">
          <div className="card-header-clean">
            <h3 className="card-title">
              <Clock size={20} color="#15803d" />
              <span>Recent Diagnostic History</span>
            </h3>
            <Link to="/history" style={{ fontSize: '0.85rem', color: '#15803d', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {recentPredictions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 12px', color: '#64748b' }}>
              <p style={{ fontSize: '0.95rem', marginBottom: '14px' }}>No recent predictions found in this browser session.</p>
              <Link to="/detect" className="btn-primary" style={{ display: 'inline-flex', padding: '8px 16px', fontSize: '0.85rem' }}>
                <ScanSearch size={16} />
                <span>Upload First Image</span>
              </Link>
            </div>
          ) : (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Crop</th>
                    <th>Condition / Disease</th>
                    <th>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPredictions.map((rec) => (
                    <tr key={rec.id}>
                      <td style={{ fontWeight: '700', color: '#15803d' }}>{rec.crop}</td>
                      <td>{rec.disease_name}</td>
                      <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{rec.date} {rec.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Selected Configuration Highlights */}
        <div className="card">
          <div className="card-header-clean">
            <h3 className="card-title">
              <Award size={20} color="#b45309" />
              <span>Yellow-Highlighted Model Benchmark</span>
            </h3>
            <span className="dim-badge dim-badge-primary">91.21% Accuracy</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ padding: '12px 16px', backgroundColor: '#fefce8', border: '1px solid #fef08a', borderRadius: '10px' }}>
              <div style={{ fontWeight: '700', color: '#854d0e', fontSize: '0.92rem' }}>
                High-Performance Hybrid Architecture
              </div>
              <p style={{ fontSize: '0.82rem', color: '#713f12', marginTop: '4px', lineHeight: '1.5' }}>
                Concatenating ResNet50 (2048) and EfficientNetB0 (1280) captures complementary global context and fine local texture.
                StandardScaler and 95% variance PCA reduce dimensional space from 3328 to 1649, optimizing SVM hyperplane separation.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
              <div style={{ padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>PRECISION</div>
                <div style={{ fontWeight: '800', fontSize: '1.2rem', color: '#0f172a' }}>90.66%</div>
              </div>

              <div style={{ padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>RECALL</div>
                <div style={{ fontWeight: '800', fontSize: '1.2rem', color: '#0f172a' }}>89.81%</div>
              </div>

              <div style={{ padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>F1-SCORE</div>
                <div style={{ fontWeight: '800', fontSize: '1.2rem', color: '#0f172a' }}>90.12%</div>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic', marginTop: '4px' }}>
              Verified against original test evaluation output (Cell 52) across 22 classes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
