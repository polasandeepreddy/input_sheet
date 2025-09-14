import React, { useState } from 'react';
import { PropertyType } from '../types';

interface Props {
  propertyType: PropertyType;
  onUpdate: (data: any) => void;
}

interface PropertyDocument {
  id: number;
  type: string;
  details: any;
  generatedSentence?: string;
}

const PropertyDocuments: React.FC<Props> = ({ propertyType, onUpdate }) => {
  const [documents, setDocuments] = useState<PropertyDocument[]>([
    { id: 1, type: '', details: {} }
  ]);

  const addDocument = () => {
    const newId = Math.max(...documents.map(d => d.id)) + 1;
    setDocuments([...documents, { id: newId, type: '', details: {} }]);
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

  const generateSentence = (id: number) => {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;

    let sentence = '';
    if (doc.type === 'AOS') {
      const { seller, purchaser, aosDate } = doc.details;
      if (seller && purchaser && aosDate) {
        sentence = `Copy of ${doc.type} dated: ${aosDate}, executed in between ${seller} and ${purchaser}`;
      }
    } else if (doc.type) {
      const { regDate, owner } = doc.details;
      if (owner && regDate) {
        sentence = `Copy of ${doc.type} dated: ${regDate}, in favor of ${owner}`;
      }
    }

    if (sentence) {
      updateDocument(id, 'generatedSentence', sentence);
    } else {
      alert('Please fill in all required fields to generate the sentence.');
    }
  };

  const renderDocumentForm = (doc: PropertyDocument) => {
    if (doc.type === 'AOS') {
      return (
        <div key={doc.id}>
          <div className="form-row">
            <div className="form-col">
              <label>Name of the Seller (vendor) *</label>
              <input 
                type="text" 
                value={doc.details.seller || ''}
                onChange={(e) => updateDocument(doc.id, 'details', { ...doc.details, seller: e.target.value })}
                required 
              />
            </div>
            <div className="form-col">
              <label>Name of the Purchaser (vendee) *</label>
              <input 
                type="text" 
                value={doc.details.purchaser || ''}
                onChange={(e) => updateDocument(doc.id, 'details', { ...doc.details, purchaser: e.target.value })}
                required 
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-col">
              <label>Date of AOS *</label>
              <input 
                type="date" 
                value={doc.details.aosDate || ''}
                onChange={(e) => updateDocument(doc.id, 'details', { ...doc.details, aosDate: e.target.value })}
                required 
              />
            </div>
            <div className="form-col">
              <label>Sale Consideration (in rupees) *</label>
              <input 
                type="text" 
                value={doc.details.saleConsideration || ''}
                onChange={(e) => updateDocument(doc.id, 'details', { ...doc.details, saleConsideration: e.target.value })}
                placeholder="e.g., 10,00,000" 
                required 
              />
            </div>
          </div>
        </div>
      );
    } else if (doc.type) {
      return (
        <div key={doc.id}>
          <div className="form-row">
            <div className="form-col">
              <label>Name of the Owner (vendee) *</label>
              <input 
                type="text" 
                value={doc.details.owner || ''}
                onChange={(e) => updateDocument(doc.id, 'details', { ...doc.details, owner: e.target.value })}
                required 
              />
            </div>
            <div className="form-col">
              <label>Doc No *</label>
              <input 
                type="text" 
                value={doc.details.docNo || ''}
                onChange={(e) => updateDocument(doc.id, 'details', { ...doc.details, docNo: e.target.value })}
                required 
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-col">
              <label>Date of Registration *</label>
              <input 
                type="date" 
                value={doc.details.regDate || ''}
                onChange={(e) => updateDocument(doc.id, 'details', { ...doc.details, regDate: e.target.value })}
                required 
              />
            </div>
            <div className="form-col">
              <label>SRO Name *</label>
              <input 
                type="text" 
                value={doc.details.sroName || ''}
                onChange={(e) => updateDocument(doc.id, 'details', { ...doc.details, sroName: e.target.value })}
                required 
              />
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="section">
      <h2 className="section-title">
        <span className="section-icon">2</span>
        Property Documents
      </h2>
      
      {documents.map((doc) => (
        <div key={doc.id} className="doc-item">
          <div className="doc-header">
            <div className="doc-title">Property Document {doc.id}</div>
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
            <label>Select Document *</label>
            <select 
              value={doc.type} 
              onChange={(e) => updateDocument(doc.id, 'type', e.target.value)}
              required
            >
              <option value="">Select Document</option>
              <option value="AOS">AOS</option>
              <option value="SALE DEED">Sale Deed</option>
              <option value="GIFT DEED">Gift Deed</option>
              <option value="ANY DEED">Any Deed</option>
            </select>
          </div>

          {renderDocumentForm(doc)}

          {doc.type && (
            <button 
              type="button" 
              className="btn" 
              onClick={() => generateSentence(doc.id)}
            >
              Generate Sentence
            </button>
          )}

          {doc.generatedSentence && (
            <div className="generated-sentence">
              {doc.generatedSentence}
            </div>
          )}
        </div>
      ))}
      
      <button type="button" className="btn add" onClick={addDocument}>
        + Add Property Document
      </button>
    </div>
  );
};

export default PropertyDocuments;