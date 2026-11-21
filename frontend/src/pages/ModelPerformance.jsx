import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Award, 
  Target, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  BarChart3, 
  Cpu, 
  PieChart as PieIcon 
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { apiService } from '../services/api';

const CROP_COLORS = ['#15803d', '#22c55e', '#3b82f6', '#f59e0b'];

const ModelPerformance = () => {
  const [metricsData, setMetricsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const data = await apiService.getModelMetrics();
      setMetricsData(data);
    } catch (err) {
      console.error('Failed to load metrics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const comparisonChartData = metricsData?.comparative_experiments_with_pca?.map((item) => ({
    name: item.feature_extractor.replace('Hybrid (', '').replace(')', ''),
    Accuracy: item.accuracy,
    Precision: item.precision,
    Recall: item.recall,
    F1Score: item.f1_score,
    isSelected: item.selected
  })) || [];

  const dimensionChartData = [
    { name: 'VGG16', Original: 512, Reduced: 366 },
    { name: 'ResNet50', Original: 2048, Reduced: 1099 },
    { name: 'EfficientNetB0', Original: 1280, Reduced: 717 },
    { name: 'Hybrid (Selected)', Original: 3328, Reduced: 1649 },
    { name: 'Triple Hybrid', Original: 3840, Reduced: 2015 },
  ];

  return (
    <div className="page-container">
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803d', fontWeight: '700', fontSize: '0.9rem', marginBottom: '4px' }}>
          <BarChart3 size={18} />
          <span>RESEARCH EVALUATION & BENCHMARKS</span>
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a' }}>
          Model Performance & Analysis
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Empirical evaluation results for the yellow-highlighted configuration: 
          <strong> Hybrid (ResNet50 + EfficientNetB0) + PCA (95% variance) + SVM</strong>.
        </p>
      </div>

      {/* 4 Metric Cards */}
      <section className="metrics-grid">
        <MetricCard
          label="Reported Accuracy"
          value="91.21%"
          subtext="Highlighted row in research paper (90.89% experimental)"
          icon={Award}
          iconColor="#b45309"
          iconBg="#fef3c7"
          isAccentGold={true}
        />

        <MetricCard
          label="Macro Precision"
          value="90.66%"
          subtext="Unweighted average across all 22 classes"
          icon={Target}
          iconColor="#15803d"
          iconBg="#dcfce7"
        />

        <MetricCard
          label="Macro Recall"
          value="89.81%"
          subtext="Class sensitivity across diverse symptoms"
          icon={Activity}
          iconColor="#2563eb"
          iconBg="#dbeafe"
        />

        <MetricCard
          label="Macro F1-Score"
          value="90.12%"
          subtext="Harmonic mean of precision & recall"
          icon={CheckCircle2}
          iconColor="#7c3aed"
          iconBg="#ede9fe"
        />
      </section>

      {/* Accuracy Discrepancy Transparency Alert */}
      <div style={{
        backgroundColor: '#fefce8',
        border: '1px solid #fef08a',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px'
      }}>
        <AlertCircle size={22} color="#854d0e" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h4 style={{ fontWeight: '700', color: '#854d0e', fontSize: '0.95rem', marginBottom: '4px' }}>
            Experimental Evaluation Consistency Note
          </h4>
          <p style={{ fontSize: '0.88rem', color: '#713f12', lineHeight: '1.5' }}>
            In the research paper summary table, the yellow-highlighted row reports <strong>91.21% accuracy</strong> with 
            <strong> 90.66% precision, 89.81% recall, and 90.12% F1-score</strong>. The paper's discussion section and 
            the original saved Colab execution log (Cell 52) record <strong>90.89% test accuracy</strong> on the 5,026-image test split. 
            Both figures represent the exact same experimental run and are preserved transparently without silent modification.
          </p>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* Comparative Architecture Bar Chart */}
        <div className="card">
          <div className="card-header-clean">
            <h3 className="card-title">
              <BarChart3 size={20} color="#15803d" />
              <span>Comparative Model Accuracy & Metrics</span>
            </h3>
            <span className="dim-badge dim-badge-primary">PCA (95% Var) + SVM</span>
          </div>

          <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '16px' }}>
            Comparing individual backbone extractors versus hybrid configurations on the 22-class crop dataset.
          </p>

          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={comparisonChartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis domain={[80, 95]} tick={{ fontSize: 11 }} />
                <Tooltip 
                  formatter={(value) => [`${value}%`]}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
                <Legend wrapperStyle={{ paddingTop: 10, fontSize: 12 }} />
                <Bar dataKey="Accuracy" fill="#15803d" radius={[4, 4, 0, 0]} />
                <Bar dataKey="F1Score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Dimensionality Reduction Chart */}
        <div className="card">
          <div className="card-header-clean">
            <h3 className="card-title">
              <Cpu size={20} color="#15803d" />
              <span>Dimensionality Reduction (PCA 95% Variance)</span>
            </h3>
            <span className="dim-badge">3328 &rarr; 1649 Dims</span>
          </div>

          <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '16px' }}>
            Number of feature dimensions before and after PCA transformation preserving 95% variance.
          </p>

          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={dimensionChartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  formatter={(value) => [`${value} features`]}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
                <Legend wrapperStyle={{ paddingTop: 10, fontSize: 12 }} />
                <Bar dataKey="Original" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Reduced" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Experimental Evaluation Matrix Table */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div className="card-header-clean">
          <h3 className="card-title">
            <Award size={20} color="#b45309" />
            <span>Research Paper Experimental Evaluation Results (Cell 52)</span>
          </h3>
          <span className="dim-badge dim-badge-primary">Verified Saved Logs</span>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Model Architecture</th>
                <th>Feature Extractor</th>
                <th>PCA Dimensions</th>
                <th>Accuracy (%)</th>
                <th>Precision (%)</th>
                <th>Recall (%)</th>
                <th>F1-Score (%)</th>
                <th>Training Time (s)</th>
              </tr>
            </thead>
            <tbody>
              {metricsData?.comparative_experiments_with_pca?.map((row, idx) => (
                <tr key={idx} className={row.selected ? 'highlighted-row' : ''}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {row.selected && <CheckCircle2 size={16} color="#15803d" />}
                      <span style={{ fontWeight: row.selected ? '700' : '500' }}>{row.model}</span>
                    </div>
                  </td>
                  <td>{row.feature_extractor}</td>
                  <td><span className="dim-badge">{row.dimensions}</span></td>
                  <td><strong>{row.accuracy}%</strong></td>
                  <td>{row.precision}%</td>
                  <td>{row.recall}%</td>
                  <td>{row.f1_score}%</td>
                  <td>{row.training_time}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dataset & Class Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        <div className="card">
          <div className="card-header-clean">
            <h3 className="card-title">
              <PieIcon size={20} color="#15803d" />
              <span>Crop Class Distribution</span>
            </h3>
            <span className="dim-badge">22 Total Classes</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ width: 200, height: 200 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={metricsData?.crop_class_distribution || []}
                    dataKey="class_count"
                    nameKey="crop"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={50}
                  >
                    {metricsData?.crop_class_distribution?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CROP_COLORS[index % CROP_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {metricsData?.crop_class_distribution?.map((item, index) => (
                <div key={item.crop} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: CROP_COLORS[index] }}></div>
                  <span style={{ fontWeight: '600' }}>{item.crop}:</span>
                  <span style={{ color: '#64748b' }}>{item.class_count} classes ({item.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header-clean">
            <h3 className="card-title">
              <Cpu size={20} color="#15803d" />
              <span>Dataset & Partition Specifications</span>
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b', fontSize: '0.88rem' }}>Total Evaluated Images</span>
              <span style={{ fontWeight: '700' }}>25,126 images</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b', fontSize: '0.88rem' }}>Training Split (80%)</span>
              <span style={{ fontWeight: '700' }}>20,100 samples</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b', fontSize: '0.88rem' }}>Testing Split (20%)</span>
              <span style={{ fontWeight: '700' }}>5,026 samples</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
              <span style={{ color: '#64748b', fontSize: '0.88rem' }}>Stratification Seed</span>
              <span className="dim-badge">Random State: 42</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelPerformance;
