import React, { useState } from 'react';

interface Props {
  onUpdate: (data: any) => void;
}

const OnlineChecks: React.FC<Props> = ({ onUpdate }) => {
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: FileList | null}>({});

  const handleFileUpload = (category: string, files: FileList | null) => {
    const newFiles = { ...uploadedFiles, [category]: files };
    setUploadedFiles(newFiles);
    onUpdate(newFiles);
  };

  const fileCategories = [
    { id: 'ec', label: 'EC (Encumbrance Certificate)' },
    { id: 'prohibited', label: 'PROHIBITED LIST' },
    { id: 'glv', label: 'GLV' },
    { id: 'isro', label: 'ISRO BHUVAN SY NO CONFIRMATION' },
    { id: 'masterPlan', label: 'MASTER PLAN' },
    { id: 'onlineRef', label: 'ONLINE REFERENCES' }
  ];

  return (
    <div className="section">
      <h2 className="section-title">
        <span className="section-icon">7</span>
        Online Checks
      </h2>
      <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '20px' }}>
        Upload evidence files for each category. Multiple files allowed. All categories are mandatory before submission.
      </p>

      {fileCategories.map((category) => (
        <div key={category.id} className="form-group" style={{ marginBottom: '20px' }}>
          <label>{category.label}</label>
          <div style={{ 
            padding: '8px', 
            border: '1px dashed #cfd8e3', 
            borderRadius: '8px', 
            background: '#fbfdff' 
          }}>
            <input 
              type="file" 
              multiple 
              onChange={(e) => handleFileUpload(category.id, e.target.files)}
            />
            <div style={{ fontSize: '13px', color: '#4b5563', marginTop: '6px' }}>
              {uploadedFiles[category.id] 
                ? `${uploadedFiles[category.id]!.length} file(s) selected`
                : 'No files selected'
              }
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OnlineChecks;