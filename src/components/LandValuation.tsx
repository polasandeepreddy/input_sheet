import React, { useState, useEffect } from 'react';
import { LandDetailsData, LandValuationData } from '../types';

interface Props {
  landData?: LandDetailsData;
  onUpdate: (data: LandValuationData) => void;
}

const LandValuation: React.FC<Props> = ({ landData, onUpdate }) => {
  const [data, setData] = useState<LandValuationData>({
    guidelineRate: 0,
    unitRate: 0,
    guidelineValue: 0,
    landValue: 0
  });

  const updateData = (field: keyof LandValuationData, value: number) => {
    const newData = { ...data, [field]: value };
    calculateValues(newData);
  };

  const calculateValues = (currentData: LandValuationData) => {
    const area = landData?.areaVal || 0;
    const guidelineValue = area * currentData.guidelineRate;
    const landValue = area * currentData.unitRate;
    
    const finalData = {
      ...currentData,
      guidelineValue,
      landValue
    };
    
    setData(finalData);
    onUpdate(finalData);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  useEffect(() => {
    calculateValues(data);
  }, [landData]);

  return (
    <div className="section">
      <h2 className="section-title">Land Valuation</h2>
      
      <div className="grid">
        <div className="form-col">
          <label>Guideline Rate (per unit)</label>
          <input 
            type="number" 
            value={data.guidelineRate || ''}
            onChange={(e) => updateData('guidelineRate', parseFloat(e.target.value) || 0)}
            placeholder="Enter rate" 
          />
        </div>
        <div className="form-col">
          <label>Unit Rate (per unit)</label>
          <input 
            type="number" 
            value={data.unitRate || ''}
            onChange={(e) => updateData('unitRate', parseFloat(e.target.value) || 0)}
            placeholder="Enter rate" 
          />
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Land Area Considered</th>
            <th>Guideline Rate</th>
            <th>Guideline Value</th>
            <th>Unit Rate</th>
            <th>Land Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{formatNumber(landData?.areaVal || 0)}</td>
            <td>{formatNumber(data.guidelineRate)}</td>
            <td>{formatNumber(data.guidelineValue)}</td>
            <td>{formatNumber(data.unitRate)}</td>
            <td>{formatNumber(data.landValue)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LandValuation;