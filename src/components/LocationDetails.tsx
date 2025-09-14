import React, { useState } from 'react';
import { PropertyType, LocationData } from '../types';

interface Props {
  propertyType: PropertyType;
  onUpdate: (data: LocationData) => void;
}

const locationData = {
  "Telangana": {
    "Hyderabad": {
      "Serilingampally": ["Kondapur", "Gachibowli", "Madhapur", "Miyapur"],
      "Kukatpally": ["Kukatpally", "Nizampet", "Bachupally", "Pragathi Nagar"],
      "Rajendranagar": ["Rajendranagar", "Shamshabad", "Chevella", "Moinabad"]
    },
    "Rangareddy": {
      "Shamshabad": ["Shamshabad", "Rajiv Gandhi International Airport", "Kothur"],
      "Chevella": ["Chevella", "Vikarabad Road", "Shankarpally"],
      "Ibrahimpatnam": ["Ibrahimpatnam", "Yacharam", "Pocharam"]
    }
  },
  "Andhra Pradesh": {
    "Krishna": {
      "Vijayawada Rural": ["Poranki", "Gannavaram"]
    }
  }
};

const LocationDetails: React.FC<Props> = ({ propertyType, onUpdate }) => {
  const [data, setData] = useState<LocationData>({
    state: '',
    district: '',
    mandal: '',
    village: '',
    syNos: '',
    plotNo: '',
    buildingName: '',
    houseNo: '',
    pincode: '',
    apartmentName: '',
    flatNo: '',
    floor: ''
  });

  const [districts, setDistricts] = useState<string[]>([]);
  const [mandals, setMandals] = useState<string[]>([]);
  const [villages, setVillages] = useState<string[]>([]);

  const updateData = (field: keyof LocationData, value: string) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    onUpdate(newData);

    // Handle cascading dropdown updates
    if (field === 'state') {
      const stateData = locationData[value as keyof typeof locationData];
      setDistricts(stateData ? Object.keys(stateData) : []);
      setMandals([]);
      setVillages([]);
      newData.district = '';
      newData.mandal = '';
      newData.village = '';
    } else if (field === 'district') {
      const stateData = locationData[data.state as keyof typeof locationData];
      const districtData = stateData?.[value as keyof typeof stateData];
      setMandals(districtData ? Object.keys(districtData) : []);
      setVillages([]);
      newData.mandal = '';
      newData.village = '';
    } else if (field === 'mandal') {
      const stateData = locationData[data.state as keyof typeof locationData];
      const districtData = stateData?.[data.district as keyof typeof stateData];
      const mandalData = districtData?.[value as keyof typeof districtData];
      setVillages(mandalData || []);
      newData.village = '';
    }
  };

  return (
    <div className="section">
      <h2 className="section-title">
        <span className="section-icon">6</span>
        Location Details
      </h2>

      <div className="form-row">
        <div className="form-col">
          <label>State *</label>
          <select 
            value={data.state} 
            onChange={(e) => updateData('state', e.target.value)}
            required
          >
            <option value="">Select State</option>
            <option value="Telangana">Telangana</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
          </select>
        </div>
        <div className="form-col">
          <label>District *</label>
          <select 
            value={data.district} 
            onChange={(e) => updateData('district', e.target.value)}
            required
          >
            <option value="">Select District</option>
            {districts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>
        <div className="form-col">
          <label>Mandal *</label>
          <select 
            value={data.mandal} 
            onChange={(e) => updateData('mandal', e.target.value)}
            required
          >
            <option value="">Select Mandal</option>
            {mandals.map(mandal => (
              <option key={mandal} value={mandal}>{mandal}</option>
            ))}
          </select>
        </div>
        <div className="form-col">
          <label>Village *</label>
          <select 
            value={data.village} 
            onChange={(e) => updateData('village', e.target.value)}
            required
          >
            <option value="">Select Village</option>
            {villages.map(village => (
              <option key={village} value={village}>{village}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-col">
          <label>Sy Nos *</label>
          <input 
            type="text" 
            value={data.syNos}
            onChange={(e) => updateData('syNos', e.target.value)}
            placeholder="Enter Sy Nos" 
            required 
          />
        </div>
        <div className="form-col">
          <label>Plot No *</label>
          <input 
            type="text" 
            value={data.plotNo}
            onChange={(e) => updateData('plotNo', e.target.value)}
            placeholder="Enter Plot No" 
            required 
          />
        </div>
        <div className="form-col">
          <label>Building Name (Optional)</label>
          <input 
            type="text" 
            value={data.buildingName}
            onChange={(e) => updateData('buildingName', e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-col">
          <label>House No (Optional)</label>
          <input 
            type="text" 
            value={data.houseNo}
            onChange={(e) => updateData('houseNo', e.target.value)}
          />
        </div>
        <div className="form-col">
          <label>Pincode *</label>
          <input 
            type="number" 
            value={data.pincode}
            onChange={(e) => updateData('pincode', e.target.value)}
            placeholder="Enter Pincode" 
            required 
          />
        </div>
      </div>

      {propertyType === 'Flat' && (
        <div className="form-row">
          <div className="form-col">
            <label>Apartment Name</label>
            <input 
              type="text" 
              value={data.apartmentName}
              onChange={(e) => updateData('apartmentName', e.target.value)}
            />
          </div>
          <div className="form-col">
            <label>Flat No</label>
            <input 
              type="text" 
              value={data.flatNo}
              onChange={(e) => updateData('flatNo', e.target.value)}
            />
          </div>
          <div className="form-col">
            <label>Floor in Which Situated</label>
            <input 
              type="text" 
              value={data.floor}
              onChange={(e) => updateData('floor', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Boundaries Section */}
      <h3>Land Boundaries and Dimensions</h3>
      <div className="boundaries-container">
        <div className="boundary-group">
          <label>Boundaries as per Document</label>
          <input type="text" placeholder="North" />
          <input type="text" placeholder="South" />
          <input type="text" placeholder="East" />
          <input type="text" placeholder="West" />
        </div>
        <div className="boundary-group">
          <label>Dimensions as per Document</label>
          <input type="text" placeholder="North" />
          <input type="text" placeholder="South" />
          <input type="text" placeholder="East" />
          <input type="text" placeholder="West" />
        </div>
      </div>

      {propertyType === 'Flat' && (
        <>
          <h3 style={{marginTop: '20px'}}>Apartment Boundaries and Dimensions</h3>
          <div className="boundaries-container">
            <div className="boundary-group">
              <label>Boundaries as per Document</label>
              <input type="text" placeholder="North" />
              <input type="text" placeholder="South" />
              <input type="text" placeholder="East" />
              <input type="text" placeholder="West" />
            </div>
            <div className="boundary-group">
              <label>Dimensions as per Document</label>
              <input type="text" placeholder="North" />
              <input type="text" placeholder="South" />
              <input type="text" placeholder="East" />
              <input type="text" placeholder="West" />
            </div>
          </div>

          <h3 style={{marginTop: '20px'}}>Flat Boundaries and Dimensions</h3>
          <div className="boundaries-container">
            <div className="boundary-group">
              <label>Boundaries as per Document</label>
              <input type="text" placeholder="North" />
              <input type="text" placeholder="South" />
              <input type="text" placeholder="East" />
              <input type="text" placeholder="West" />
            </div>
            <div className="boundary-group">
              <label>Dimensions as per Document</label>
              <input type="text" placeholder="North" />
              <input type="text" placeholder="South" />
              <input type="text" placeholder="East" />
              <input type="text" placeholder="West" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LocationDetails;