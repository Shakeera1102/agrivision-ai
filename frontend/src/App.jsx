import React, { useState, useEffect, useRef } from 'react';
import { 
  Sprout, 
  UploadCloud, 
  Image as ImageIcon, 
  X, 
  Loader2, 
  CheckCircle2, 
  Award, 
  Target, 
  Activity, 
  TrendingUp, 
  History, 
  Trash2, 
  AlertCircle, 
  Stethoscope, 
  Sparkles 
} from 'lucide-react';
import { apiService } from './services/api';

const SAMPLES = [
  { name: 'Cashew', file: '/samples/cashew_sample.jpg', crop: 'Cashew' },
  { name: 'Cassava', file: '/samples/cassava_sample.jpg', crop: 'Cassava' },
  { name: 'Maize', file: '/samples/maize_sample.jpg', crop: 'Maize' },
  { name: 'Tomato', file: '/samples/tomato_sample.jpg', crop: 'Tomato' }
];

export default function App() {
  const [selectedCrop, setSelectedCrop] = useState('Auto-Detect from Image');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileDetails, setFileDetails] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [history, setHistory] = useState([]);

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem('agrivision_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  };

  const handleFileSelect = (file) => {
    setError(null);
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setError('Please upload a valid JPG, JPEG, or PNG image.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError('File exceeds maximum size limit of 15 MB.');
      return;
    }

    setSelectedFile(file);
    setFileDetails({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      type: file.type.replace('image/', '').toUpperCase()
    });

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSampleClick = async (sample) => {
    setError(null);
    try {
      const res = await fetch(sample.file);
      const blob = await res.blob();
      const file = new File([blob], `${sample.crop.toLowerCase()}_sample.jpg`, { type: 'image/jpeg' });
      handleFileSelect(file);
      setSelectedCrop(sample.crop);
    } catch (err) {
      setError('Failed to load sample image.');
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileDetails(null);
    setError(null);
    setPrediction(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      setError('Please select or upload a crop leaf image first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await apiService.predictImage(selectedFile);
      setPrediction(res.prediction);

      // Save to history
      const historyItem = {
        id: Date.now().toString(),
        filename: selectedFile.name,
        crop: res.prediction.crop,
        disease_name: res.prediction.disease_name,
        severity: res.prediction.severity,
        condition_type: res.prediction.condition_type,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString()
      };

      const updatedHistory = [historyItem, ...history.slice(0, 49)];
      setHistory(updatedHistory);
      localStorage.setItem('agrivision_history', JSON.stringify(updatedHistory));
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || 'Error occurred during prediction.';
      setError(detail);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteHistory = (id) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem('agrivision_history', JSON.stringify(updated));
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all prediction history?')) {
      setHistory([]);
      localStorage.removeItem('agrivision_history');
    }
  };

  return (
    <div className="single-page-wrapper">
      {/* Header */}
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-icon-large">
            <Sprout size={28} />
          </div>
          <div>
            <h1 className="app-title">AgriVision AI</h1>
            <p className="app-subtitle">
              Crop Disease and Pest Classification
            </p>
          </div>
        </div>

        <div className="badges-bar">
          <span className="clean-badge clean-badge-green">
            Hybrid (ResNet50 + EfficientNetB0) + PCA + SVM
          </span>
          <span className="clean-badge">
            4 Crops (Cashew, Cassava, Maize, Tomato) &bull; 22 Classes
          </span>
        </div>
      </header>

      {/* Main Predictor Card */}
      <div className="predictor-card">
        {/* Form Controls */}
        <div className="form-grid">
          <div className="form-field">
            <label className="field-label">Target Crop</label>
            <select 
              className="clean-select"
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
            >
              <option value="Auto-Detect from Image">Auto-Detect from Image</option>
              <option value="Cashew">Cashew</option>
              <option value="Cassava">Cassava</option>
              <option value="Maize">Maize</option>
              <option value="Tomato">Tomato</option>
            </select>
          </div>

          <div className="form-field">
            <label className="field-label">Model Pipeline</label>
            <div className="read-only-box">
              ResNet50 (2048) + EffNetB0 (1280) &rarr; PCA &rarr; SVM
            </div>
          </div>
        </div>

        {/* Upload Dropzone or Thumbnail Preview */}
        {!previewUrl ? (
          <div
            className={`clean-dropzone ${isDragOver ? 'active' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".jpg,.jpeg,.png"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
              }}
            />

            <div className="dropzone-inner-icon">
              <UploadCloud size={28} />
            </div>
            <div className="dropzone-main-text">Upload Crop Leaf Image</div>
            <div className="dropzone-sub-text">
              Click to browse or drag & drop (JPG, JPEG, PNG)
            </div>
          </div>
        ) : (
          <div className="preview-panel">
            <div className="preview-thumbnail">
              <img src={previewUrl} alt="Crop Leaf Preview" />
            </div>
            <div className="preview-info">
              <div className="preview-filename">{fileDetails?.name}</div>
              <div className="preview-filemeta">
                {fileDetails?.size} &bull; {fileDetails?.type}
              </div>
              <button className="btn-remove-thumb" onClick={handleClear} disabled={isLoading}>
                <X size={14} />
                <span>Remove Image</span>
              </button>
            </div>
          </div>
        )}

        {/* Sample Images */}
        <div className="sample-chips-bar">
          <span className="sample-chip-title">Sample Images:</span>
          {SAMPLES.map((sample) => (
            <button
              key={sample.name}
              type="button"
              className="sample-chip-btn"
              onClick={() => handleSampleClick(sample)}
              disabled={isLoading}
            >
              <span>{sample.name}</span>
            </button>
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '12px 16px',
            color: '#991b1b',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '18px'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Predict Button */}
        <button
          className="btn-predict"
          onClick={handlePredict}
          disabled={isLoading || !selectedFile}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
              <span>Analyzing Leaf Image...</span>
            </>
          ) : (
            <>
              <ImageIcon size={18} />
              <span>Predict Crop Disease</span>
            </>
          )}
        </button>

        {/* Prediction Result Display */}
        {prediction && (
          <div className="result-card">
            <div className="result-grid-summary">
              <div className="result-mini-card">
                <div className="result-mini-label">Detected Crop</div>
                <div className="result-mini-value" style={{ color: '#15803d' }}>
                  {prediction.crop}
                </div>
              </div>

              <div className="result-mini-card">
                <div className="result-mini-label">Detected Condition</div>
                <div className="result-mini-value">
                  {prediction.disease_name}
                </div>
              </div>

              <div className="result-mini-card">
                <div className="result-mini-label">Condition Type</div>
                <div className="result-mini-value" style={{ fontSize: '1rem', fontWeight: '700' }}>
                  {prediction.condition_type}
                </div>
              </div>

              <div className="result-mini-card">
                <div className="result-mini-label">Severity Level</div>
                <div className="result-mini-value" style={{ fontSize: '1rem', fontWeight: '700' }}>
                  {prediction.severity}
                </div>
              </div>
            </div>

            <div className="treatment-box">
              <div className="treatment-title">
                <Stethoscope size={16} />
                <span>Symptoms</span>
              </div>
              <div className="treatment-desc" style={{ marginBottom: '10px' }}>
                {prediction.symptoms}
              </div>

              <div className="treatment-title">
                <Sparkles size={16} />
                <span>Recommended Treatment</span>
              </div>
              <div className="treatment-desc">
                {prediction.treatment}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Model Performance Section */}
      <section className="secondary-panel">
        <div className="panel-title">
          <Award size={20} color="#15803d" />
          <span>Model Performance Metrics</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px',
          textAlign: 'center'
        }}>
          <div className="result-mini-card">
            <div className="result-mini-label">ACCURACY</div>
            <div className="result-mini-value" style={{ color: '#15803d', fontSize: '1.6rem' }}>
              91.21%
            </div>
          </div>

          <div className="result-mini-card">
            <div className="result-mini-label">PRECISION</div>
            <div className="result-mini-value" style={{ fontSize: '1.6rem' }}>
              90.66%
            </div>
          </div>

          <div className="result-mini-card">
            <div className="result-mini-label">RECALL</div>
            <div className="result-mini-value" style={{ fontSize: '1.6rem' }}>
              89.81%
            </div>
          </div>

          <div className="result-mini-card">
            <div className="result-mini-label">F1-SCORE</div>
            <div className="result-mini-value" style={{ fontSize: '1.6rem' }}>
              90.12%
            </div>
          </div>
        </div>
      </section>

      {/* Prediction History Section */}
      <section className="secondary-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div className="panel-title" style={{ margin: 0 }}>
            <History size={20} color="#15803d" />
            <span>Prediction History</span>
          </div>

          {history.length > 0 && (
            <button 
              onClick={handleClearHistory}
              style={{
                background: '#fee2e2',
                border: 'none',
                borderRadius: '6px',
                color: '#dc2626',
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Trash2 size={14} />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', fontSize: '0.9rem' }}>
            No predictions recorded yet. Upload an image above to see results logged here.
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Crop</th>
                  <th>Condition</th>
                  <th>Severity</th>
                  <th>Date & Time</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: '600' }}>{item.filename}</td>
                    <td style={{ fontWeight: '700', color: '#15803d' }}>{item.crop}</td>
                    <td>{item.disease_name}</td>
                    <td>
                      <span className="clean-badge" style={{ padding: '2px 8px', fontSize: '0.72rem' }}>
                        {item.severity}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.date} {item.time}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteHistory(item.id)}
                        style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '4px' }}
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
