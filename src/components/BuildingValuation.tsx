import React, { useState, useEffect } from 'react';
import { BuildingDetailsData } from '../types';

interface Props {
  buildingData?: BuildingDetailsData;
  onUpdate: (data: any) => void;
}

interface ValuationRow {
  id: number;
  building: string;
  floor: string;
  type: string;
  areaConsidered: number;
  guidelineRate: number;
  guidelineValue: number;
  unitRate: number;
  buildingValue: number;
  replacementCost: number;
  replacementValue: number;
}

const BuildingValuation: React.FC<Props> = ({ buildingData, onUpdate }) => {
  const [rows, setRows] = useState<ValuationRow[]>([]);

  const addRow = () => {
    const newRow: ValuationRow = {
      id: Date.now(),
      building: '',
      floor: '',
      type: '',
      areaConsidered: 0,
      guidelineRate: 0,
      guidelineValue: 0,
      unitRate: 0,
      buildingValue: 0,
      replacementCost: 0,
      replacementValue: 0
    };
    const newRows = [...rows, newRow];
    setRows(newRows);
    onUpdate(newRows);
  };

  const removeRow = (id: number) => {
    const newRows = rows.filter(row => row.id !== id);
    setRows(newRows);
    onUpdate(newRows);
  };

  const updateRow = (id: number, field: keyof ValuationRow, value: any) => {
    const newRows = rows.map(row => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        // Auto-calculate values
        updatedRow.guidelineValue = updatedRow.areaConsidered * updatedRow.guidelineRate;
        updatedRow.buildingValue = updatedRow.areaConsidered * updatedRow.unitRate;
        updatedRow.replacementValue = updatedRow.areaConsidered * updatedRow.replacementCost;
        return updatedRow;
      }
      return row;
    });
    setRows(newRows);
    onUpdate(newRows);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  return (
    <div className="section">
      <h2 className="section-title">Building Valuation</h2>
      
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Building</th>
            <th>Floor</th>
            <th>Type</th>
            <th>Area Considered</th>
            <th>Guideline Rate</th>
            <th>Guideline Value</th>
            <th>Unit Rate</th>
            <th>Value of Building</th>
            <th>Replacement Cost</th>
            <th>Replacement Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id}>
              <td>{index + 1}</td>
              <td>
                <input 
                  type="text" 
                  value={row.building}
                  onChange={(e) => updateRow(row.id, 'building', e.target.value)}
                />
              </td>
              <td>
                <input 
                  type="text" 
                  value={row.floor}
                  onChange={(e) => updateRow(row.id, 'floor', e.target.value)}
                />
              </td>
              <td>
                <input 
                  type="text" 
                  value={row.type}
                  onChange={(e) => updateRow(row.id, 'type', e.target.value)}
                />
              </td>
              <td>
                <input 
                  type="number" 
                  value={row.areaConsidered || ''}
                  onChange={(e) => updateRow(row.id, 'areaConsidered', parseFloat(e.target.value) || 0)}
                />
              </td>
              <td>
                <input 
                  type="number" 
                  value={row.guidelineRate || ''}
                  onChange={(e) => updateRow(row.id, 'guidelineRate', parseFloat(e.target.value) || 0)}
                />
              </td>
              <td>{formatNumber(row.guidelineValue)}</td>
              <td>
                <input 
                  type="number" 
                  value={row.unitRate || ''}
                  onChange={(e) => updateRow(row.id, 'unitRate', parseFloat(e.target.value) || 0)}
                />
              </td>
              <td>{formatNumber(row.buildingValue)}</td>
              <td>
                <input 
                  type="number" 
                  value={row.replacementCost || ''}
                  onChange={(e) => updateRow(row.id, 'replacementCost', parseFloat(e.target.value) || 0)}
                />
              </td>
              <td>{formatNumber(row.replacementValue)}</td>
              <td>
                <button 
                  type="button" 
                  className="btn remove" 
                  onClick={() => removeRow(row.id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <button type="button" className="btn add" onClick={addRow}>
        + Add Valuation Row
      </button>
    </div>
  );
};

export default BuildingValuation;