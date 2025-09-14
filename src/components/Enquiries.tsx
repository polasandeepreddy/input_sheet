import React, { useState } from 'react';

interface Props {
  onUpdate: (data: any) => void;
}

interface Enquiry {
  id: number;
  perSqyd: number;
  plotArea: number;
  totalValue: number;
}

const Enquiries: React.FC<Props> = ({ onUpdate }) => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  const addEnquiry = () => {
    const newEnquiry: Enquiry = {
      id: Date.now(),
      perSqyd: 0,
      plotArea: 0,
      totalValue: 0
    };
    const newEnquiries = [...enquiries, newEnquiry];
    setEnquiries(newEnquiries);
    onUpdate(newEnquiries);
  };

  const removeEnquiry = (id: number) => {
    const newEnquiries = enquiries.filter(enquiry => enquiry.id !== id);
    setEnquiries(newEnquiries);
    onUpdate(newEnquiries);
  };

  const updateEnquiry = (id: number, field: keyof Enquiry, value: number) => {
    const newEnquiries = enquiries.map(enquiry => {
      if (enquiry.id === id) {
        const updatedEnquiry = { ...enquiry, [field]: value };
        // Auto-calculate total value
        updatedEnquiry.totalValue = updatedEnquiry.perSqyd * updatedEnquiry.plotArea;
        return updatedEnquiry;
      }
      return enquiry;
    });
    setEnquiries(newEnquiries);
    onUpdate(newEnquiries);
  };

  return (
    <div className="section">
      <h2 className="section-title">Enquiries</h2>
      
      {enquiries.map((enquiry) => (
        <div key={enquiry.id} className="section" style={{ background: '#fff', marginBottom: '15px' }}>
          <div className="grid">
            <div className="form-col">
              <label>Per Sqyd</label>
              <input 
                type="number" 
                value={enquiry.perSqyd || ''}
                onChange={(e) => updateEnquiry(enquiry.id, 'perSqyd', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="form-col">
              <label>Plot Area</label>
              <input 
                type="number" 
                value={enquiry.plotArea || ''}
                onChange={(e) => updateEnquiry(enquiry.id, 'plotArea', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="form-col">
              <label>Total Value</label>
              <input 
                type="number" 
                value={enquiry.totalValue} 
                className="readonly" 
                readOnly 
              />
            </div>
          </div>
          <button 
            type="button" 
            className="btn remove" 
            onClick={() => removeEnquiry(enquiry.id)}
          >
            Remove Enquiry
          </button>
        </div>
      ))}
      
      <button type="button" className="btn add" onClick={addEnquiry}>
        + Add Enquiry
      </button>
    </div>
  );
};

export default Enquiries;