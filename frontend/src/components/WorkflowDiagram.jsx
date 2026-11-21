import React from 'react';
import { UploadCloud, Image as ImageIcon, Cpu, Sliders, Minimize2, CheckCircle2, ArrowRight } from 'lucide-react';

const WorkflowDiagram = () => {
  const steps = [
    {
      id: 1,
      title: '1. Image Upload',
      meta: 'JPG / JPEG / PNG',
      icon: UploadCloud,
    },
    {
      id: 2,
      title: '2. Preprocessing',
      meta: 'Resize 224 x 224',
      icon: ImageIcon,
    },
    {
      id: 3,
      title: '3. Hybrid Extract',
      meta: 'ResNet + EffNet (3328d)',
      icon: Cpu,
    },
    {
      id: 4,
      title: '4. StandardScaler',
      meta: 'Mean 0, Var 1',
      icon: Sliders,
    },
    {
      id: 5,
      title: '5. PCA Reduction',
      meta: '95% Var -> 1649d',
      icon: Minimize2,
    },
    {
      id: 6,
      title: '6. SVM Classifier',
      meta: 'RBF Kernel (C=10)',
      icon: CheckCircle2,
    },
    {
      id: 7,
      title: '7. Result Output',
      meta: '22 Crop Conditions',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="card" style={{ marginBottom: '28px' }}>
      <div className="card-header-clean">
        <h3 className="card-title">
          <Cpu size={20} color="#15803d" />
          <span>How AgriVision AI Works: Selected ML Pipeline</span>
        </h3>
        <span className="dim-badge dim-badge-primary">Hybrid Deep Features + PCA + SVM</span>
      </div>

      <div className="workflow-step-container">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <React.Fragment key={step.id}>
              <div className="workflow-node">
                <div className="workflow-node-icon">
                  <Icon size={22} />
                </div>
                <div className="workflow-node-title">{step.title}</div>
                <div className="workflow-node-meta">{step.meta}</div>
              </div>
              {idx < steps.length - 1 && (
                <div className="workflow-arrow">
                  <ArrowRight size={20} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default WorkflowDiagram;
