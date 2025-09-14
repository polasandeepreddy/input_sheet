import React, { useState } from 'react';

interface Props {
  onUpdate: (data: string) => void;
}

const CommentsRemarks: React.FC<Props> = ({ onUpdate }) => {
  const [remarks, setRemarks] = useState('');

  const handleChange = (value: string) => {
    setRemarks(value);
    onUpdate(value);
  };

  return (
    <div className="section">
      <h2 className="section-title">Comments / Remarks</h2>
      <textarea 
        value={remarks}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Enter remarks..."
      />
    </div>
  );
};

export default CommentsRemarks;