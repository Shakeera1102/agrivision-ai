import React from 'react';
import { 
  Cpu, 
  Layers, 
  Sliders, 
  Minimize2, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  ShieldCheck, 
  BookOpen 
} from 'lucide-react';
import WorkflowDiagram from '../components/WorkflowDiagram';

const AboutModel = () => {
  const stages = [
    {
      number: 1,
      title: 'ResNet50 Deep Feature Extraction',
      dim: '2048 Dimensions',
      icon: Cpu,
      color: '#15803d',
      bg: '#dcfce7',
      summary: 'Extracts deep visual patterns and high-level morphological semantic structures.',
      details: [
        'Architecture: 50-layer deep Residual Neural Network pretrained on ImageNet.',
        'Feature Representation: Uses Global Average Pooling (pooling="avg") after the residual blocks.',
        'Feature Output: 2048-dimensional dense feature representation.',
        'Role in Pipeline: Residual skip-connections resolve the vanishing gradient problem, allowing deep semantic feature representation of leaf venation, lesions, and chlorosis.'
      ]
    },
    {
      number: 2,
      title: 'EfficientNetB0 Multi-Scale Extraction',
      dim: '1280 Dimensions',
      icon: Layers,
      color: '#2563eb',
      bg: '#dbeafe',
      summary: 'Extracts fine-grained edge, texture, and multi-scale localized details.',
      details: [
        'Architecture: Compound scaling network balancing depth, width, and resolution.',
        'Feature Representation: Global Average Pooling extracted before the classification head.',
        'Feature Output: 1280-dimensional feature vector.',
        'Role in Pipeline: Captures micro-patterns such as tiny fungal fruiting pycnidia, insect chewing margins, and early viral mottling that complement ResNet50.'
      ]
    },
    {
      number: 3,
      title: 'Hybrid Feature Fusion & Concatenation',
      dim: '3328 Dimensions (2048 + 1280)',
      icon: Sparkles,
      color: '#7c3aed',
      bg: '#ede9fe',
      summary: 'Combines both feature representations horizontally into a unified descriptor.',
      details: [
        'Formula: 2048 (ResNet50) + 1280 (EfficientNetB0) = 3328 features per image.',
        'Alignment: All features are aligned with image indices matching the 80:20 stratified split.',
        'Advantage: Hybrid fusion consistently outperforms individual backbones by combining complementary macro and micro leaf features.'
      ]
    },
    {
      number: 4,
      title: 'StandardScaler Feature Normalization',
      dim: '3328 Standardized Dimensions',
      icon: Sliders,
      color: '#b45309',
      bg: '#fef3c7',
      summary: 'Normalizes the hybrid feature values to zero mean and unit variance.',
      details: [
        'Statistical Centering: Each feature is centered by subtracting the mean and scaled to unit variance.',
        'Training Isolation: Scaler is strictly fitted on training data only to prevent data leakage.',
        'Necessity: Essential prior to PCA and SVM, as both mathematical algorithms depend on Euclidean distances.'
      ]
    },
    {
      number: 5,
      title: 'PCA (Principal Component Analysis)',
      dim: '1649 Reduced Dimensions (95% Variance)',
      icon: Minimize2,
      color: '#0891b2',
      bg: '#cffafe',
      summary: 'Eliminates multicollinearity and noise while retaining 95% of cumulative variance.',
      details: [
        'Configuration: PCA with n_components=0.95, svd_solver="full", random_state=42.',
        'Dimension Reduction: Compresses 3328 features down to 1649 orthogonal components (50.45% compression).',
        'Noise Suppression: Removes redundant correlations between deep features, preventing SVM overfitting.'
      ]
    },
    {
      number: 6,
      title: 'Support Vector Machine (SVM) Classification',
      dim: '22 Output Classes',
      icon: CheckCircle2,
      color: '#15803d',
      bg: '#dcfce7',
      summary: 'Separates complex non-linear feature representations into 22 distinct diagnostic classes.',
      details: [
        'Kernel Function: Radial Basis Function (RBF kernel: exp(-gamma * ||u - v||^2)).',
        'Regularization: Penalty parameter C = 10, gamma = "scale", random_state = 42.',
        'Decision Boundary: Maximizes margin separation between 22 disease, pest, and healthy leaf classes.'
      ]
    }
  ];

  return (
    <div className="page-container">
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803d', fontWeight: '700', fontSize: '0.9rem', marginBottom: '4px' }}>
          <BookOpen size={18} />
          <span>RESEARCH METHODOLOGY & EXPLANATION</span>
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a' }}>
          About AgriVision AI Model
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          A detailed architectural walkthrough of the selected 
          <strong> Hybrid (ResNet50 + EfficientNetB0) + PCA (95% variance) + SVM</strong> framework.
        </p>
      </div>

      {/* Visual Workflow Diagram */}
      <WorkflowDiagram />

      {/* Stage-by-Stage Breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {stages.map((stage) => {
          const Icon = stage.icon;
          return (
            <div key={stage.number} className="card" style={{ position: 'relative' }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    backgroundColor: stage.bg,
                    color: stage.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>
                      Stage {stage.number}: {stage.title}
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
                      {stage.summary}
                    </p>
                  </div>
                </div>

                <span className="dim-badge dim-badge-primary" style={{ fontSize: '0.82rem' }}>
                  {stage.dim}
                </span>
              </div>

              <div style={{
                backgroundColor: '#f8fafc',
                borderRadius: '10px',
                padding: '16px 20px',
                border: '1px solid #e2e8f0'
              }}>
                <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {stage.details.map((detail, idx) => (
                    <li key={idx} style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.5' }}>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Strict Model Selection Compliance Note */}
      <div className="card" style={{ marginTop: '28px', backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <ShieldCheck size={22} color="#15803d" />
          <h4 style={{ fontWeight: '800', color: '#14532d', fontSize: '1.05rem' }}>
            Strict Research Model Integrity Guarantee
          </h4>
        </div>
        <p style={{ fontSize: '0.88rem', color: '#166534', lineHeight: '1.6' }}>
          AgriVision AI adheres strictly to the single yellow-highlighted research configuration. 
          No alternate classifiers (KNN, Random Forest, AdaBoost, GoogLeNet, VGG16) are active. 
          The backend loads your exact original trained Support Vector Machine file (<code>SVM_Hybrid_Res_Eff_PCA.joblib</code>) 
          and processes every upload through the exact 3328 &rarr; 1649 PCA transformation matrix.
        </p>
      </div>
    </div>
  );
};

export default AboutModel;
