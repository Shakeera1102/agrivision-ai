import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, RefreshCw, Loader2, AlertCircle } from 'lucide-react';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
const MAX_SIZE_MB = 15;

const ImageUploader = ({ onAnalyze, isLoading, error }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileDetails, setFileDetails] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [localError, setLocalError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileProcess = (file) => {
    setLocalError(null);

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setLocalError('Invalid file format. Please upload a JPG, JPEG, or PNG image.');
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setLocalError(`File exceeds maximum size limit of ${MAX_SIZE_MB} MB.`);
      return;
    }

    setSelectedFile(file);
    setFileDetails({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      type: file.type.replace('image/', '').toUpperCase(),
    });

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileDetails(null);
    setLocalError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyzeClick = () => {
    if (selectedFile && onAnalyze) {
      onAnalyze(selectedFile, previewUrl);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Error alert */}
      {(localError || error) && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#991b1b',
          fontSize: '0.9rem'
        }}>
          <AlertCircle size={20} />
          <span>{localError || error}</span>
        </div>
      )}

      {/* Upload Dropzone */}
      {!previewUrl ? (
        <div
          className={`dropzone ${isDragOver ? 'active' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".jpg,.jpeg,.png"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileProcess(e.target.files[0]);
              }
            }}
          />

          <div className="dropzone-icon-box">
            <UploadCloud size={32} />
          </div>

          <h3 className="dropzone-title">Upload Your Crop Image</h3>
          <p className="dropzone-hint">
            Upload a clear image of a crop leaf to identify its disease or pest condition.
          </p>

          <div className="dropzone-tags">
            <span className="dropzone-pill">JPG</span>
            <span className="dropzone-pill">JPEG</span>
            <span className="dropzone-pill">PNG</span>
            <span className="dropzone-pill">Max 15 MB</span>
          </div>

          <div style={{ marginTop: '20px' }}>
            <span className="btn-secondary" style={{ backgroundColor: '#ffffff', color: '#15803d', borderColor: '#bbf7d0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              Browse Image
            </span>
          </div>
        </div>
      ) : (
        /* Preview Card */
        <div className="preview-card">
          <div className="preview-img-container">
            <img src={previewUrl} alt="Crop Leaf Preview" />
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              display: 'flex',
              gap: '8px'
            }}>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: '#334155',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Replace Image"
              >
                <RefreshCw size={14} />
                <span>Replace</span>
              </button>

              <button
                onClick={handleClear}
                disabled={isLoading}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: '#dc2626',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Remove Image"
              >
                <X size={14} />
                <span>Remove</span>
              </button>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".jpg,.jpeg,.png"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileProcess(e.target.files[0]);
              }
            }}
          />

          <div className="preview-meta-bar">
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0f172a' }}>
                {fileDetails?.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Size: {fileDetails?.size} | Format: {fileDetails?.type}
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={handleAnalyzeClick}
              disabled={isLoading}
              style={{
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Extracting Features & Predicting...</span>
                </>
              ) : (
                <>
                  <ImageIcon size={18} />
                  <span>Analyze Image</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
