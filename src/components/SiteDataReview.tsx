import React, { useState } from 'react';

interface Props {
  onUpdate: (data: any) => void;
}

const SiteDataReview: React.FC<Props> = ({ onUpdate }) => {
  const [inspectionCompleted, setInspectionCompleted] = useState(false);
  const [inspectionDate] = useState(new Date().toISOString().split('T')[0]);

  const demoObservations = [
    "Structure: RCC framed building.",
    "No visible cracks observed in exterior.",
    "Site dimensions match deed records (with minor +/- 0.5% variance)."
  ];

  const handleInspectionToggle = (completed: boolean) => {
    setInspectionCompleted(completed);
    onUpdate({ inspectionCompleted: completed, inspectionDate });
  };

  return (
    <div className="section">
      <h2 className="section-title">
        <span className="section-icon">8</span>
        Site Data Review
      </h2>
      <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '20px' }}>
        Data pulled from site inspection (read-only). Mark inspection completed to view.
      </p>

      <div className="row">
        <div className="form-col">
          <label>Inspection Completed?</label>
          <select 
            value={inspectionCompleted ? 'true' : 'false'}
            onChange={(e) => handleInspectionToggle(e.target.value === 'true')}
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
          <div style={{ fontSize: '12px', color: '#556074', marginTop: '4px' }}>
            If 'Yes' the Site Data area will be displayed and date locked.
          </div>
        </div>

        <div className="form-col">
          <label>Date of Inspection</label>
          <input type="date" value={inspectionDate} className="readonly" readOnly />
        </div>
      </div>

      {inspectionCompleted && (
        <div className="success-message" style={{ marginTop: '20px' }}>
          <strong>Site observations (pulled from valuator):</strong>
          <ul style={{ marginTop: '8px' }}>
            {demoObservations.map((observation, index) => (
              <li key={index}>{observation}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SiteDataReview;