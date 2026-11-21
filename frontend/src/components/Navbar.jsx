import React from 'react';
import { useLocation } from 'react-router-dom';
import { Cpu, Award, Layers } from 'lucide-react';

const PAGE_TITLES = {
  '/': 'Overview Dashboard',
  '/detect': 'Crop Disease & Pest Detection',
  '/history': 'Inference History & Logs',
  '/performance': 'Model Performance & Benchmark Analysis',
  '/about': 'Architecture & Research Methodology',
};

const Navbar = () => {
  const location = useLocation();
  const currentTitle = PAGE_TITLES[location.pathname] || 'AgriVision AI';

  return (
    <header className="top-navbar">
      <div>
        <h1 className="navbar-page-title">{currentTitle}</h1>
      </div>

      <div className="navbar-badge-group">
        <div className="badge-tag badge-tag-highlight" title="Paper Highlighted Accuracy">
          <Award size={14} />
          <span>Reported Accuracy: 91.21%</span>
        </div>

        <div className="badge-tag badge-tag-green" title="Standardized Pipeline Model">
          <Cpu size={14} />
          <span>ResNet50 + EfficientNetB0 + PCA + SVM</span>
        </div>

        <div className="badge-tag" style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>
          <Layers size={14} />
          <span>4 Crops | 22 Classes</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
