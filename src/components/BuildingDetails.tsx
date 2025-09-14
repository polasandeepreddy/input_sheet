import React, { useState } from 'react';
import { BuildingDetailsData, BuildingData } from '../types';

interface Props {
  onUpdate: (data: BuildingDetailsData) => void;
}

const BuildingDetails: React.FC<Props> = ({ onUpdate }) => {
  const [buildings, setBuildings] = useState<BuildingData[]>([]);

  const addBuilding = () => {
    const newBuilding: BuildingData = {
      building: '',
      floorName: '',
      type: '',
      buaPlan: 0,
      buaActual: 0,
      permissibleArea: 0,
      areaConsidered: 0
    };
    const newBuildings = [...buildings, newBuilding];
    setBuildings(newBuildings);
    onUpdate({ buildings: newBuildings });
  };

  const removeBuilding = (index: number) => {
    const newBuildings = buildings.filter((_, i) => i !== index);
    setBuildings(newBuildings);
    onUpdate({ buildings: newBuildings });
  };

  const updateBuilding = (index: number, field: keyof BuildingData, value: any) => {
    const newBuildings = buildings.map((building, i) => 
      i === index ? { ...building, [field]: value } : building
    );
    setBuildings(newBuildings);
    onUpdate({ buildings: newBuildings });
  };

  return (
    <div className="section">
      <h2 className="section-title">Building / Floor Details</h2>
      
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Building</th>
            <th>Floor Name</th>
            <th>Type</th>
            <th>BUA (Plan)</th>
            <th>BUA (Actual)</th>
            <th>Permissible Area</th>
            <th>Area Considered</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {buildings.map((building, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <input 
                  type="text" 
                  value={building.building}
                  onChange={(e) => updateBuilding(index, 'building', e.target.value)}
                />
              </td>
              <td>
                <input 
                  type="text" 
                  value={building.floorName}
                  onChange={(e) => updateBuilding(index, 'floorName', e.target.value)}
                />
              </td>
              <td>
                <input 
                  type="text" 
                  value={building.type}
                  onChange={(e) => updateBuilding(index, 'type', e.target.value)}
                />
              </td>
              <td>
                <input 
                  type="number" 
                  value={building.buaPlan || ''}
                  onChange={(e) => updateBuilding(index, 'buaPlan', parseFloat(e.target.value) || 0)}
                />
              </td>
              <td>
                <input 
                  type="number" 
                  value={building.buaActual || ''}
                  onChange={(e) => updateBuilding(index, 'buaActual', parseFloat(e.target.value) || 0)}
                />
              </td>
              <td>
                <input 
                  type="number" 
                  value={building.permissibleArea || ''}
                  onChange={(e) => updateBuilding(index, 'permissibleArea', parseFloat(e.target.value) || 0)}
                />
              </td>
              <td>
                <input 
                  type="number" 
                  value={building.areaConsidered || ''}
                  onChange={(e) => updateBuilding(index, 'areaConsidered', parseFloat(e.target.value) || 0)}
                />
              </td>
              <td>
                <button 
                  type="button" 
                  className="btn remove" 
                  onClick={() => removeBuilding(index)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <button type="button" className="btn add" onClick={addBuilding}>
        + Add Building Row
      </button>
    </div>
  );
};

export default BuildingDetails;