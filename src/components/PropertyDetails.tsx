import React, { useState } from 'react';
import { PropertyType } from '../types';

interface Props {
  propertyType: PropertyType;
  onUpdate: (data: any) => void;
}

interface FloorData {
  id: number;
  floorName: string;
  units: number;
  occupancy: string;
  rentalValue: string;
  progress?: number;
}

const PropertyDetails: React.FC<Props> = ({ propertyType, onUpdate }) => {
  const [data, setData] = useState({
    stageConstruction: '',
    coordinates: '',
    nearbyLandmark: '',
    nearbyRail: '',
    railDistance: '',
    nearbyBus: '',
    busDistance: '',
    nearbyHospital: '',
    hospitalDistance: '',
    distanceCity: '',
    numFloors: '',
    unitsPerFloor: '',
    totalUnits: '',
    internalComposition: '',
    occupancyStatus: '',
    rentalValue: ''
  });

  const [floors, setFloors] = useState<FloorData[]>([]);

  const updateData = (field: string, value: any) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    onUpdate({ ...newData, floors });
  };

  const addFloor = () => {
    const newFloor: FloorData = {
      id: Date.now(),
      floorName: '',
      units: 0,
      occupancy: '',
      rentalValue: '',
      ...(data.stageConstruction === 'Under Construction' && { progress: 0 })
    };
    setFloors([...floors, newFloor]);
  };

  const removeFloor = (id: number) => {
    setFloors(floors.filter(floor => floor.id !== id));
  };

  const updateFloor = (id: number, field: keyof FloorData, value: any) => {
    setFloors(floors.map(floor => 
      floor.id === id ? { ...floor, [field]: value } : floor
    ));
  };

  const autoFillUnits = () => {
    if (!data.unitsPerFloor) {
      alert('Enter units per floor in comma separated format first');
      return;
    }
    
    const unitsArr = data.unitsPerFloor
      .split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n));
    
    const newFloors: FloorData[] = unitsArr.map((units, index) => ({
      id: Date.now() + index,
      floorName: `Floor ${index + 1}`,
      units,
      occupancy: '',
      rentalValue: '',
      ...(data.stageConstruction === 'Under Construction' && { progress: 0 })
    }));
    
    setFloors(newFloors);
    
    const total = unitsArr.reduce((a, b) => a + b, 0);
    updateData('totalUnits', total.toString());
  };

  return (
    <div className="section">
      <h2 className="section-title">
        <span className="section-icon">9</span>
        Property Details
      </h2>

      <div className="row">
        <div className="form-col">
          <label>Property Type</label>
          <input type="text" value={propertyType} readOnly />
        </div>
        <div className="form-col">
          <label>Stage of Construction</label>
          <select 
            value={data.stageConstruction}
            onChange={(e) => updateData('stageConstruction', e.target.value)}
          >
            <option value="">Select</option>
            <option value="Completed">Completed</option>
            <option value="Under Construction">Under Construction</option>
          </select>
          <div style={{ fontSize: '12px', color: '#556074', marginTop: '4px' }}>
            If 'Under Construction' you'll get progress % columns in floor table.
          </div>
        </div>
        <div className="form-col">
          <label>Coordinates</label>
          <input 
            type="text" 
            value={data.coordinates}
            onChange={(e) => updateData('coordinates', e.target.value)}
            placeholder="e.g. 17.3850° N, 78.4867° E" 
          />
        </div>
        <div className="form-col">
          <label>Nearby Landmark</label>
          <input 
            type="text" 
            value={data.nearbyLandmark}
            onChange={(e) => updateData('nearbyLandmark', e.target.value)}
            placeholder="Landmark name" 
          />
        </div>
      </div>

      <div className="row">
        <div className="form-col">
          <label>Nearby Railway Station</label>
          <input 
            type="text" 
            value={data.nearbyRail}
            onChange={(e) => updateData('nearbyRail', e.target.value)}
          />
        </div>
        <div className="form-col">
          <label>Distance from property (km)</label>
          <input 
            type="number" 
            step="0.01"
            value={data.railDistance}
            onChange={(e) => updateData('railDistance', e.target.value)}
          />
        </div>
        <div className="form-col">
          <label>Nearby Bus Stop</label>
          <input 
            type="text" 
            value={data.nearbyBus}
            onChange={(e) => updateData('nearbyBus', e.target.value)}
          />
        </div>
        <div className="form-col">
          <label>Distance from property (km)</label>
          <input 
            type="number" 
            step="0.01"
            value={data.busDistance}
            onChange={(e) => updateData('busDistance', e.target.value)}
          />
        </div>
      </div>

      <div className="row">
        <div className="form-col">
          <label>Nearby Hospital</label>
          <input 
            type="text" 
            value={data.nearbyHospital}
            onChange={(e) => updateData('nearbyHospital', e.target.value)}
          />
        </div>
        <div className="form-col">
          <label>Distance from property (km)</label>
          <input 
            type="number" 
            step="0.01"
            value={data.hospitalDistance}
            onChange={(e) => updateData('hospitalDistance', e.target.value)}
          />
        </div>
        <div className="form-col">
          <label>Distance from City Center (km)</label>
          <input 
            type="number" 
            step="0.01"
            value={data.distanceCity}
            onChange={(e) => updateData('distanceCity', e.target.value)}
          />
        </div>
        <div className="form-col">
          <label>No. of Floors</label>
          <input 
            type="number" 
            min="0"
            value={data.numFloors}
            onChange={(e) => updateData('numFloors', e.target.value)}
          />
        </div>
      </div>

      <div className="row">
        <div className="form-col">
          <label>No. of Units in Each Floor (comma separated)</label>
          <input 
            type="text" 
            value={data.unitsPerFloor}
            onChange={(e) => updateData('unitsPerFloor', e.target.value)}
            placeholder="e.g. 2,2,1" 
          />
        </div>
        <div className="form-col">
          <label>Total No. of Units</label>
          <input 
            type="number" 
            min="0"
            value={data.totalUnits}
            onChange={(e) => updateData('totalUnits', e.target.value)}
          />
        </div>
        <div className="form-col">
          <label>Internal Composition Unit Wise</label>
          <input 
            type="text" 
            value={data.internalComposition}
            onChange={(e) => updateData('internalComposition', e.target.value)}
            placeholder="e.g. 2BHK,1BHK ..." 
          />
        </div>
        <div className="form-col">
          <label>Occupancy Status</label>
          <select 
            value={data.occupancyStatus}
            onChange={(e) => updateData('occupancyStatus', e.target.value)}
          >
            <option value="">Select</option>
            <option value="Under Construction">Under Construction</option>
            <option value="Vacant">Vacant</option>
            <option value="Rented">Rented</option>
            <option value="Self Occupied">Self Occupied</option>
            <option value="Self Occupied and Rented">Self Occupied and Rented</option>
            <option value="Self Occupied and Vacant">Self Occupied and Vacant</option>
            <option value="Rented and Vacant">Rented and Vacant</option>
          </select>
        </div>
      </div>

      {/* Floor-wise table */}
      <div style={{ marginTop: '20px' }}>
        <label>Floor-wise & Unit-wise Details</label>
        <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '10px' }}>
          Add floors. If stage = Under Construction you'll see a Progress % column.
        </div>
        
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Floor Name</th>
              <th>No. of Units</th>
              <th>Occupancy (units status summary)</th>
              <th>Rental Value (per unit or floor)</th>
              {data.stageConstruction === 'Under Construction' && <th>Progress (%)</th>}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {floors.map((floor, index) => (
              <tr key={floor.id}>
                <td>{index + 1}</td>
                <td>
                  <input 
                    type="text" 
                    value={floor.floorName}
                    onChange={(e) => updateFloor(floor.id, 'floorName', e.target.value)}
                    placeholder="e.g. GF" 
                  />
                </td>
                <td>
                  <input 
                    type="number" 
                    value={floor.units}
                    onChange={(e) => updateFloor(floor.id, 'units', parseInt(e.target.value) || 0)}
                    placeholder="No. of units" 
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    value={floor.occupancy}
                    onChange={(e) => updateFloor(floor.id, 'occupancy', e.target.value)}
                    placeholder="e.g. 1 rented, 1 vacant" 
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    value={floor.rentalValue}
                    onChange={(e) => updateFloor(floor.id, 'rentalValue', e.target.value)}
                    placeholder="e.g. 12000 per unit" 
                  />
                </td>
                {data.stageConstruction === 'Under Construction' && (
                  <td>
                    <input 
                      type="number" 
                      min="0" 
                      max="100"
                      value={floor.progress || 0}
                      onChange={(e) => updateFloor(floor.id, 'progress', parseInt(e.target.value) || 0)}
                      placeholder="0-100" 
                    />
                  </td>
                )}
                <td>
                  <button 
                    type="button" 
                    className="btn remove" 
                    onClick={() => removeFloor(floor.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button type="button" className="btn add" onClick={addFloor}>
            + Add Floor
          </button>
          <button type="button" className="btn" onClick={autoFillUnits}>
            Auto-fill total units
          </button>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <label>Rental Value (overall comments)</label>
        <input 
          type="text" 
          value={data.rentalValue}
          onChange={(e) => updateData('rentalValue', e.target.value)}
          placeholder="e.g. Expected rent / month" 
        />
      </div>
    </div>
  );
};

export default PropertyDetails;