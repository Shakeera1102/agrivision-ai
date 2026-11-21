import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ScanSearch, 
  History, 
  BarChart3, 
  Info, 
  Sprout, 
  Cpu
} from 'lucide-react';

const Sidebar = () => {
  const navLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Detect Disease', path: '/detect', icon: ScanSearch },
    { name: 'Prediction History', path: '/history', icon: History },
    { name: 'Model Performance', path: '/performance', icon: BarChart3 },
    { name: 'About Model', path: '/about', icon: Info },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-icon-wrapper">
          <Sprout size={24} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="brand-title">AgriVision AI</span>
            <span className="brand-badge">ML Core</span>
          </div>
          <div className="brand-subtitle">Crop Health & Pest Intelligence</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              end={link.path === '/'}
            >
              <Icon size={19} />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Model Badge */}
      <div className="sidebar-footer">
        <div className="model-pill">
          <div className="pulse-dot"></div>
          <div>
            <div className="pulse-text-primary">Hybrid PCA-SVM Active</div>
            <div className="pulse-text-secondary">3328 &rarr; 1649 dims | 91.21%</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
