import React, { useState, useEffect } from 'react';
import { FlatValuationData } from '../types';

interface Props {
  onUpdate: (data: FlatValuationData) => void;
}

const FlatValuation: React.FC<Props> = ({ onUpdate }) => {
  const [data, setData] = useState<FlatValuationData>({
    flatSBUA: 0,
    carpetArea: 0,
    flatUDS: 0,
    totalLandArea: 0,
    guidelineRate: 0,
    unitRate: 0,
    replacementCost: 0,
    guidelineValue: 0,
    flatValue: 0,
    replacementValue: 0
  });

  const updateData = (field: keyof FlatValuationData, value: number) => {
    const newData = { ...data, [field]: value };
    calculateValues(newData);
  };

  const calculateValues = (currentData: FlatValuationData) => {
    const { flatSBUA, guidelineRate, unitRate, replacementCost } = currentData;
    
    const guidelineValue = flatSBUA * guidelineRate;
    const flatValue = flatSBUA * unitRate;
    const replacementValue = flatSBUA * replacementCost;
    
    const finalData = {
      ...currentData,
      guidelineValue,
      flatValue,
      replacementValue
    };
    
    setData(finalData);
    onUpdate(finalData);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  useEffect(() => {
    calculateValues(data);
  }, []);

  return (
    <div className="section">
      <h2 className="section-title">Flat Valuation</h2>
      
      <div className="grid">
        <div className="form-col">
          <label>Flat Area (SBUA)</label>
          <input 
            type="number" 
            value={data.flatSBUA || ''}
            onChange={(e) => updateData('flatSBUA', parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="form-col">
          <label>Carpet Area</label>
          <input 
            type="number" 
            value={data.carpetArea || ''}
            onChange={(e) => updateData('carpetArea', parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="form-col">
          <label>UDS of Flat</label>
          <input 
            type="number" 
            value={data.flatUDS || ''}
            onChange={(e) => updateData('flatUDS', parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="form-col">
          <label>Total Land Area</label>
          <input 
            type="number" 
            value={data.totalLandArea || ''}
            onChange={(e) => updateData('totalLandArea', parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Area</th>
            <th>Area Considered</th>
            <th>Guideline Rate</th>
            <th>Guideline Value</th>
            <th>Unit Rate</th>
            <th>Value of Flat</th>
            <th>Replacement Cost</th>
            <th>Replacement Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>SBUA</td>
            <td>{formatNumber(data.flatSBUA)}</td>
            <td>
              <input 
                type="number" 
                value={data.guidelineRate || ''}
                onChange={(e) => updateData('guidelineRate', parseFloat(e.target.value) || 0)}
              />
            </td>
            <td>{formatNumber(data.guidelineValue)}</td>
            <td>
              <input 
                type="number" 
                value={data.unitRate || ''}
                onChange={(e) => updateData('unitRate', parseFloat(e.target.value) || 0)}
              />
            </td>
            <td>{formatNumber(data.flatValue)}</td>
            <td>
              <input 
                type="number" 
                value={data.replacementCost || ''}
                onChange={(e) => updateData('replacementCost', parseFloat(e.target.value) || 0)}
              />
            </td>
            <td>{formatNumber(data.replacementValue)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FlatValuation;