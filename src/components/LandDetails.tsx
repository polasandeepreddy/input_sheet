import React, { useState, useEffect } from 'react';
import { LandDetailsData } from '../types';

interface Props {
  onUpdate: (data: LandDetailsData) => void;
}

const LandDetails: React.FC<Props> = ({ onUpdate }) => {
  const [data, setData] = useState<LandDetailsData>({
    landA: 0,
    landB: 0,
    landC: 0,
    units: 'SqYds',
    affectedType: 'road',
    rea: 0,
    nea: 0,
    grossSource: 'A',
    netArea: 0,
    areaVal: 0
  });

  const updateData = (field: keyof LandDetailsData, value: any) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    calculateAreas(newData);
  };

  const calculateAreas = (currentData: LandDetailsData) => {
    const { landA, landB, landC, grossSource, affectedType, rea, nea } = currentData;
    
    // Get gross area based on source
    let grossArea = 0;
    switch (grossSource) {
      case 'A': grossArea = landA; break;
      case 'B': grossArea = landB; break;
      case 'C': grossArea = landC; break;
    }

    // Calculate deductions
    let deductions = 0;
    if (affectedType === 'road' || affectedType === 'both') {
      deductions += rea;
    }
    if (affectedType === 'nala' || affectedType === 'both') {
      deductions += nea;
    }

    // Calculate net area
    const netArea = Math.max(0, grossArea - deductions);
    const finalData = { ...currentData, netArea, areaVal: netArea };
    
    setData(finalData);
    onUpdate(finalData);
  };

  useEffect(() => {
    calculateAreas(data);
  }, []);

  return (
    <div className="section">
      <h2 className="section-title">
        <span className="section-icon">10</span>
        Land Details
      </h2>
      
      <div className="grid">
        <div className="form-col">
          <label>Total Land Extent as per Documents (A)</label>
          <input 
            type="number" 
            value={data.landA || ''}
            onChange={(e) => updateData('landA', parseFloat(e.target.value) || 0)}
            placeholder="Enter value" 
          />
        </div>
        <div className="form-col">
          <label>Total Land Extent as per Plan (B)</label>
          <input 
            type="number" 
            value={data.landB || ''}
            onChange={(e) => updateData('landB', parseFloat(e.target.value) || 0)}
            placeholder="Enter value" 
          />
        </div>
        <div className="form-col">
          <label>Total Land Extent as per Actual (C)</label>
          <input 
            type="number" 
            value={data.landC || ''}
            onChange={(e) => updateData('landC', parseFloat(e.target.value) || 0)}
            placeholder="Enter value" 
          />
        </div>
        <div className="form-col">
          <label>Units</label>
          <select 
            value={data.units} 
            onChange={(e) => updateData('units', e.target.value)}
          >
            <option value="SqYds">SqYds</option>
            <option value="SqMts">SqMts</option>
            <option value="Sft">Sft</option>
            <option value="Acres">Acres</option>
          </select>
        </div>
      </div>

      <div className="grid">
        <div className="form-col">
          <label>Affected Area Type (D)</label>
          <select 
            value={data.affectedType} 
            onChange={(e) => updateData('affectedType', e.target.value)}
          >
            <option value="road">Road Affected Area</option>
            <option value="nala">Nala Affected Area</option>
            <option value="both">Both</option>
          </select>
        </div>
        
        {(data.affectedType === 'road' || data.affectedType === 'both') && (
          <div className="form-col">
            <label>Road Effected Area (REA)</label>
            <input 
              type="number" 
              value={data.rea || ''}
              onChange={(e) => updateData('rea', parseFloat(e.target.value) || 0)}
              placeholder="Enter value" 
            />
          </div>
        )}
        
        {(data.affectedType === 'nala' || data.affectedType === 'both') && (
          <div className="form-col">
            <label>Nala Effected Area (NEA)</label>
            <input 
              type="number" 
              value={data.nea || ''}
              onChange={(e) => updateData('nea', parseFloat(e.target.value) || 0)}
              placeholder="Enter value" 
            />
          </div>
        )}
      </div>

      <div className="grid">
        <div className="form-col">
          <label>Gross Area Source</label>
          <select 
            value={data.grossSource} 
            onChange={(e) => updateData('grossSource', e.target.value)}
          >
            <option value="A">Use A (Documents)</option>
            <option value="B">Use B (Plan)</option>
            <option value="C">Use C (Actual)</option>
          </select>
        </div>
        <div className="form-col">
          <label>Net Plot Area (E)</label>
          <input 
            type="number" 
            value={data.netArea} 
            className="readonly" 
            readOnly 
          />
        </div>
        <div className="form-col">
          <label>Area Considered for Valuation (F)</label>
          <input 
            type="number" 
            value={data.areaVal} 
            className="readonly" 
            readOnly 
          />
        </div>
      </div>
    </div>
  );
};

export default LandDetails;