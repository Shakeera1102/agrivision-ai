import React, { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import PredictionResult from '../components/PredictionResult';
import { apiService } from '../services/api';
import { ScanSearch, ShieldCheck } from 'lucide-react';

const DetectDisease = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [currentPreviewUrl, setCurrentPreviewUrl] = useState(null);

  const handleAnalyze = async (file, previewUrl) => {
    setIsLoading(true);
    setError(null);
    setCurrentPreviewUrl(previewUrl);

    try {
      const response = await apiService.predictImage(file);
      setPredictionData(response);

      // Save record to localStorage
      try {
        const historyRecord = {
          id: Date.now().toString(),
          filename: file.name,
          crop: response.prediction.crop,
          disease_name: response.prediction.disease_name,
          class_name: response.prediction.class_name,
          severity: response.prediction.severity,
          condition_type: response.prediction.condition_type,
          model_name: response.pipeline.model_name,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        const existing = JSON.parse(localStorage.getItem('agrivision_history') || '[]');
        const updated = [historyRecord, ...existing.slice(0, 49)]; // Keep latest 50
        localStorage.setItem('agrivision_history', JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to save to localStorage:', err);
      }
    } catch (err) {
      console.error('Inference error:', err);
      const detail = err.response?.data?.detail || err.message || 'Error occurred while analyzing image.';
      setError(detail);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPredictionData(null);
    setCurrentPreviewUrl(null);
    setError(null);
  };

  return (
    <div className="page-container">
      {/* Header Info */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803d', fontWeight: '700', fontSize: '0.9rem', marginBottom: '4px' }}>
          <ScanSearch size={18} />
          <span>REAL-TIME INFERENCE ENGINE</span>
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a' }}>
          Crop Disease & Pest Detection
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Upload a clear photograph of a crop leaf from Cashew, Cassava, Maize, or Tomato. 
          The system will extract hybrid deep features, project them using PCA, and classify using the trained SVM.
        </p>
      </div>

      {/* Main Detection Area */}
      {!predictionData ? (
        <div className="card">
          <ImageUploader 
            onAnalyze={handleAnalyze} 
            isLoading={isLoading} 
            error={error} 
          />
        </div>
      ) : (
        <PredictionResult 
          result={predictionData} 
          previewUrl={currentPreviewUrl} 
          onReset={handleReset} 
        />
      )}
    </div>
  );
};

export default DetectDisease;
