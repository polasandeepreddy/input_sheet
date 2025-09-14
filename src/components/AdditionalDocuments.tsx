import React, { useState } from 'react';

interface Props {
  onUpdate: (data: string) => void;
}

const AdditionalDocuments: React.FC<Props> = ({ onUpdate }) => {
  const [additionalDocs, setAdditionalDocs] = useState('');

  const handleChange = (value: string) => {
    setAdditionalDocs(value);
    onUpdate(value);
  };

  return (
    <div className="section">
      <h2 className="section-title">
        <span className="section-icon">5</span>
        Additional Documents
      </h2>
      <textarea 
        value={additionalDocs}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Enter any additional document details..."
      />
    </div>
  );
};

export default AdditionalDocuments;