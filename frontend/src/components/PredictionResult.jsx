import React from 'react';
import { 
  CheckCircle2, 
  Cpu, 
  Layers, 
  Clock, 
  Activity, 
  RefreshCw, 
  Stethoscope, 
  ShieldAlert, 
  Sparkles 
} from 'lucide-react';

const SEVERITY_COLORS = {
  None: { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' },
  Low: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  Moderate: { bg: '#fef3c7', text: '#b45309', border: '#fde68a' },
  High: { bg: '#ffedd5', text: '#c2410c', border: '#fed7aa' },
  Critical: { bg: '#fee2e2', text: '#b91c1c', border: '#fecaca' },
};

const PredictionResult = ({ result, previewUrl, onReset }) => {
  if (!result || !result.prediction) return null;

  const { prediction, pipeline } = result;
  const severityStyle = SEVERITY_COLORS[prediction.severity] || SEVERITY_COLORS.Moderate;
  const isHealthy = prediction.condition_type?.toLowerCase().includes('healthy');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner Result Card */}
      <div className="card" style={{
        background: isHealthy 
          ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' 
          : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderColor: isHealthy ? '#86efac' : '#cbd5e1'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(0,0,0,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: isHealthy ? '#22c55e' : '#15803d',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>
                Prediction Completed
              </h2>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Pipeline: {pipeline.model_name}
              </div>
            </div>
          </div>

          <button
            onClick={onReset}
            className="btn-secondary"
            style={{
              backgroundColor: '#ffffff',
              color: '#15803d',
              borderColor: '#86efac',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            <RefreshCw size={16} />
            <span>Analyze Another Crop Image</span>
          </button>
        </div>

        {/* Core Detection Details Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          alignItems: 'center'
        }}>
          {/* Uploaded Leaf Preview */}
          <div style={{
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            height: '280px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <img
              src={previewUrl}
              alt="Analyzed Crop Leaf"
              style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
            />
          </div>

          {/* Diagnostic Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>
                Target Crop
              </span>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#15803d' }}>
                {prediction.crop}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>
                Detected Condition / Disease
              </span>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>
                {prediction.disease_name}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#475569', fontWeight: '500', marginTop: '2px' }}>
                Class Label: <code>{prediction.class_name}</code> (Index: {prediction.class_index})
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge-tag" style={{
                backgroundColor: severityStyle.bg,
                color: severityStyle.text,
                border: `1px solid ${severityStyle.border}`,
                fontWeight: '700'
              }}>
                <ShieldAlert size={14} />
                <span>Severity: {prediction.severity}</span>
              </span>

              <span className="badge-tag" style={{
                backgroundColor: '#f1f5f9',
                color: '#334155',
                border: '1px solid #cbd5e1'
              }}>
                <Activity size={14} />
                <span>Type: {prediction.condition_type}</span>
              </span>

              <span className="badge-tag badge-tag-green">
                <Clock size={14} />
                <span>Inference Time: {pipeline.processing_time_ms} ms</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Symptoms and Agronomic Recommendations */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        <div className="card">
          <div className="card-header-clean">
            <h3 className="card-title" style={{ color: '#0f172a' }}>
              <Stethoscope size={20} color="#15803d" />
              <span>Diagnostic Symptoms</span>
            </h3>
          </div>
          <p style={{ color: '#334155', fontSize: '0.92rem', lineHeight: '1.6' }}>
            {prediction.symptoms}
          </p>
        </div>

        <div className="card">
          <div className="card-header-clean">
            <h3 className="card-title" style={{ color: '#0f172a' }}>
              <Sparkles size={20} color="#15803d" />
              <span>Recommended Agricultural Action</span>
            </h3>
          </div>
          <p style={{ color: '#334155', fontSize: '0.92rem', lineHeight: '1.6' }}>
            {prediction.treatment}
          </p>
        </div>
      </div>

      {/* Technical Pipeline Execution Verification Card */}
      <div className="card">
        <div className="card-header-clean">
          <h3 className="card-title">
            <Cpu size={20} color="#15803d" />
            <span>Technical Pipeline Execution Verification</span>
          </h3>
          <span className="dim-badge dim-badge-primary">Exact Model Pipeline Verified</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>FEATURE EXTRACTORS</div>
            <div style={{ fontWeight: '700', color: '#0f172a', marginTop: '4px', fontSize: '0.9rem' }}>
              ResNet50 (2048) + EfficientNetB0 (1280)
            </div>
          </div>

          <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>HYBRID CONCATENATION</div>
            <div style={{ fontWeight: '700', color: '#0f172a', marginTop: '4px', fontSize: '0.95rem' }}>
              <span className="dim-badge">{pipeline.original_dimensions} Dimensions</span>
            </div>
          </div>

          <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>PCA DIMENSIONALITY (95%)</div>
            <div style={{ fontWeight: '700', color: '#0f172a', marginTop: '4px', fontSize: '0.95rem' }}>
              <span className="dim-badge dim-badge-primary">{pipeline.reduced_dimensions} Dimensions</span>
            </div>
          </div>

          <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>FINAL CLASSIFIER</div>
            <div style={{ fontWeight: '700', color: '#0f172a', marginTop: '4px', fontSize: '0.9rem' }}>
              SVM (RBF Kernel, C=10)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;
