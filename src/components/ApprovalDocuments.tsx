import React, { useState } from 'react';

interface Props {
  onUpdate: (data: any) => void;
}

const ApprovalDocuments: React.FC<Props> = ({ onUpdate }) => {
  const [documents, setDocuments] = useState([{ id: 1, buildingDoc: '', landDoc: '', details: {} }]);

  const addDocument = () => {
    const newId = Math.max(...documents.map(d => d.id)) + 1;
    setDocuments([...documents, { id: newId, buildingDoc: '', landDoc: '', details: {} }]);
  };

  const removeDocument = (id: number) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const updateDocument = (id: number, field: string, value: any) => {
    setDocuments(documents.map(doc => 
      doc.id === id 
        ? { ...doc, [field]: value }
        : doc
    ));
  };

  return (
    <div className="section">
      <h2 className="section-title">
        <span className="section-icon">3</span>
        Approval Documents
      </h2>
      
      {documents.map((doc) => (
        <div key={doc.id} className="doc-item">
          <div className="doc-header">
            <div className="doc-title">Approval Document {doc.id}</div>
            {documents.length > 1 && (
              <button 
                type="button" 
                className="remove-doc-btn" 
                onClick={() => removeDocument(doc.id)}
              >
                Remove
              </button>
            )}
          </div>
          
          <div className="form-group">
            <label>Select Building Approval Document *</label>
            <select 
              value={doc.buildingDoc} 
              onChange={(e) => updateDocument(doc.id, 'buildingDoc', e.target.value)}
              required
            >
              <option value="">Select Document</option>
              <option value="SANCTION PLAN">Sanction Plan</option>
              <option value="NO PLAN CASE">No Plan Case</option>
              <option value="BPS/BRS">BPS/BRS</option>
              <option value="OC">OC</option>
            </select>
          </div>

          {doc.buildingDoc && (
            <div className="form-row">
              <div className="form-col">
                <label>File/Permit/Proceeding No *</label>
                <input 
                  type="text" 
                  value={doc.details.fileNo || ''}
                  onChange={(e) => updateDocument(doc.id, 'details', { ...doc.details, fileNo: e.target.value })}
                  required 
                />
              </div>
              <div className="form-col">
                <label>Date *</label>
                <input 
                  type="date" 
                  value={doc.details.date || ''}
                  onChange={(e) => updateDocument(doc.id, 'details', { ...doc.details, date: e.target.value })}
                  required 
                />
              </div>
            </div>
          )}
          
          <div className="form-group">
            <label>Select Land Approval Document</label>
            <select 
              value={doc.landDoc} 
              onChange={(e) => updateDocument(doc.id, 'landDoc', e.target.value)}
            >
              <option value="">Select Document</option>
              <option value="LRS">LRS</option>
              <option value="LAYOUT">Layout</option>
              <option value="NALA">NALA</option>
            </select>
          </div>

          {doc.landDoc && (
            <div className="form-row">
              <div className="form-col">
                <label>Proceeding No *</label>
                <input 
                  type="text" 
                  value={doc.details.proceedingNo || ''}
                  onChange={(e) => updateDocument(doc.id, 'details', { ...doc.details, proceedingNo: e.target.value })}
                  required 
                />
              </div>
              <div className="form-col">
                <label>Date *</label>
                <input 
                  type="date" 
                  value={doc.details.landDate || ''}
                  onChange={(e) => updateDocument(doc.id, 'details', { ...doc.details, landDate: e.target.value })}
                  required 
                />
              </div>
            </div>
          )}
        </div>
      ))}
      
      <button type="button" className="btn add" onClick={addDocument}>
        + Add Approval Document
      </button>
    </div>
  );
};

export default ApprovalDocuments;