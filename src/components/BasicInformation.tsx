import React, { useState, useEffect } from 'react';
import { PropertyType, BasicInformationData } from '../types';

interface Props {
  propertyType: PropertyType;
  setPropertyType: (type: PropertyType) => void;
  onUpdate: (data: BasicInformationData) => void;
}

const BasicInformation: React.FC<Props> = ({ propertyType, setPropertyType, onUpdate }) => {
  const [inspectionDate, setInspectionDate] = useState('');
  const [valuationDate, setValuationDate] = useState('');
  const [dateError, setDateError] = useState('');

  const validateDates = (inspection: string, valuation: string) => {
    if (inspection && valuation) {
      if (new Date(valuation) < new Date(inspection)) {
        setDateError('Date of Valuation must be greater than or equal to Date of Inspection');
        return false;
      } else {
        setDateError('');
        return true;
      }
    }
    return true;
  };

  useEffect(() => {
    if (propertyType && inspectionDate && valuationDate) {
      const isValid = validateDates(inspectionDate, valuationDate);
      if (isValid) {
        onUpdate({
          propertyType,
          inspectionDate,
          valuationDate
        });
      }
    }
  }, [propertyType, inspectionDate, valuationDate, onUpdate]);

  return (
    <div className="section">
      <h2 className="section-title">
        <span className="section-icon">1</span>
        Basic Information
      </h2>
      
      <div className="form-row">
        <div className="form-col">
          <label htmlFor="propertyType">Type of Property *</label>
          <select 
            id="propertyType" 
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value as PropertyType)}
            required
          >
            <option value="">Select Property Type</option>
            <option value="Land and Buildings">Land and Buildings</option>
            <option value="Flat">Flat</option>
          </select>
        </div>
        
        <div className="form-col">
          <label htmlFor="inspectionDate">Date of Inspection *</label>
          <input 
            type="date" 
            id="inspectionDate" 
            value={inspectionDate}
            onChange={(e) => setInspectionDate(e.target.value)}
            required 
          />
        </div>
        
        <div className="form-col">
          <label htmlFor="valuationDate">Date of Valuation *</label>
          <input 
            type="date" 
            id="valuationDate" 
            value={valuationDate}
            onChange={(e) => {
              setValuationDate(e.target.value);
              validateDates(inspectionDate, e.target.value);
            }}
            required 
          />
          {dateError && <div className="error-message">{dateError}</div>}
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;