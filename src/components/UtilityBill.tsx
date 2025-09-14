import React, { useState } from 'react';
import { UtilityBillData, ElectricityBill, WaterBill } from '../types';

interface Props {
  onUpdate: (data: UtilityBillData) => void;
}

const UtilityBill: React.FC<Props> = ({ onUpdate }) => {
  const [billType, setBillType] = useState<'Electricity' | 'Water' | ''>('');
  const [bills, setBills] = useState<(ElectricityBill | WaterBill)[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentBill, setCurrentBill] = useState<any>({});

  const handleBillTypeChange = (type: 'Electricity' | 'Water' | '') => {
    setBillType(type);
    if (type) {
      setShowModal(true);
      setCurrentBill({ type });
    }
  };

  const saveBill = () => {
    if (billType === 'Electricity') {
      const { scNo, uscNo, houseNo, name, paidTo } = currentBill;
      if (!scNo || !uscNo || !houseNo || !name || !paidTo) {
        alert('Please fill all required fields');
        return;
      }
    } else if (billType === 'Water') {
      const { canNo, houseNo, name } = currentBill;
      if (!canNo || !houseNo || !name) {
        alert('Please fill all required fields');
        return;
      }
    }

    const newBills = [...bills, currentBill];
    setBills(newBills);
    onUpdate({ type: billType, bills: newBills });
    
    setShowModal(false);
    setCurrentBill({});
    setBillType('');
  };

  const removeBill = (index: number) => {
    const newBills = bills.filter((_, i) => i !== index);
    setBills(newBills);
    onUpdate({ type: billType, bills: newBills });
  };

  return (
    <div className="section">
      <h2 className="section-title">
        <span className="section-icon">4</span>
        Utility Bill
      </h2>
      
      <div className="form-group">
        <label>Select Utility Bill *</label>
        <select value={billType} onChange={(e) => handleBillTypeChange(e.target.value as any)}>
          <option value="">-- Select Utility Bill --</option>
          <option value="Electricity">Electricity Bill</option>
          <option value="Water">Water Bill</option>
        </select>
      </div>

      {bills.length > 0 && (
        <div className="saved-bills">
          <h3>Saved Bills</h3>
          {bills.map((bill, index) => (
            <div key={index} className="bill-card">
              <div className="form-box">
                <label>Bill Type</label>
                <input type="text" value={bill.type} readOnly />
              </div>
              
              {bill.type === 'Electricity' && (
                <>
                  <div className="form-box">
                    <label>SC No</label>
                    <input type="text" value={(bill as ElectricityBill).scNo} readOnly />
                  </div>
                  <div className="form-box">
                    <label>USC No</label>
                    <input type="text" value={(bill as ElectricityBill).uscNo} readOnly />
                  </div>
                  <div className="form-box">
                    <label>House No</label>
                    <input type="text" value={(bill as ElectricityBill).houseNo} readOnly />
                  </div>
                  <div className="form-box">
                    <label>Name</label>
                    <input type="text" value={(bill as ElectricityBill).name} readOnly />
                  </div>
                  <div className="form-box">
                    <label>Paid To</label>
                    <input type="text" value={(bill as ElectricityBill).paidTo} readOnly />
                  </div>
                </>
              )}
              
              {bill.type === 'Water' && (
                <>
                  <div className="form-box">
                    <label>CAN No</label>
                    <input type="text" value={(bill as WaterBill).canNo} readOnly />
                  </div>
                  <div className="form-box">
                    <label>House No</label>
                    <input type="text" value={(bill as WaterBill).houseNo} readOnly />
                  </div>
                  <div className="form-box">
                    <label>Name</label>
                    <input type="text" value={(bill as WaterBill).name} readOnly />
                  </div>
                </>
              )}
              
              <button 
                type="button" 
                className="btn remove" 
                onClick={() => removeBill(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="popup" style={{ display: 'flex' }}>
          <div className="popup-content">
            <span className="close-popup" onClick={() => setShowModal(false)}>&times;</span>
            <h3>{billType} Bill Details</h3>
            
            {billType === 'Electricity' && (
              <>
                <div className="form-group">
                  <label>SC No *</label>
                  <input 
                    type="text" 
                    value={currentBill.scNo || ''}
                    onChange={(e) => setCurrentBill({ ...currentBill, scNo: e.target.value })}
                    placeholder="Enter SC No" 
                  />
                </div>
                <div className="form-group">
                  <label>USC No *</label>
                  <input 
                    type="text" 
                    value={currentBill.uscNo || ''}
                    onChange={(e) => setCurrentBill({ ...currentBill, uscNo: e.target.value })}
                    placeholder="Enter USC No" 
                  />
                </div>
                <div className="form-group">
                  <label>House No *</label>
                  <input 
                    type="text" 
                    value={currentBill.houseNo || ''}
                    onChange={(e) => setCurrentBill({ ...currentBill, houseNo: e.target.value })}
                    placeholder="Enter House No" 
                  />
                </div>
                <div className="form-group">
                  <label>Name *</label>
                  <input 
                    type="text" 
                    value={currentBill.name || ''}
                    onChange={(e) => setCurrentBill({ ...currentBill, name: e.target.value })}
                    placeholder="Enter Name" 
                  />
                </div>
                <div className="form-group">
                  <label>Paid To *</label>
                  <select 
                    value={currentBill.paidTo || ''}
                    onChange={(e) => setCurrentBill({ ...currentBill, paidTo: e.target.value })}
                  >
                    <option value="">-- Select --</option>
                    <option value="TGSPDCL">TGSPDCL</option>
                    <option value="TGNPDCL">TGNPDCL</option>
                    <option value="APCPDCL">APCPDCL</option>
                    <option value="APSPDCL">APSPDCL</option>
                    <option value="APEPDCL">APEPDCL</option>
                  </select>
                </div>
              </>
            )}

            {billType === 'Water' && (
              <>
                <div className="form-group">
                  <label>CAN No *</label>
                  <input 
                    type="text" 
                    value={currentBill.canNo || ''}
                    onChange={(e) => setCurrentBill({ ...currentBill, canNo: e.target.value })}
                    placeholder="Enter CAN No" 
                  />
                </div>
                <div className="form-group">
                  <label>House No *</label>
                  <input 
                    type="text" 
                    value={currentBill.houseNo || ''}
                    onChange={(e) => setCurrentBill({ ...currentBill, houseNo: e.target.value })}
                    placeholder="Enter House No" 
                  />
                </div>
                <div className="form-group">
                  <label>Name *</label>
                  <input 
                    type="text" 
                    value={currentBill.name || ''}
                    onChange={(e) => setCurrentBill({ ...currentBill, name: e.target.value })}
                    placeholder="Enter Name" 
                  />
                </div>
              </>
            )}
            
            <button className="btn" onClick={saveBill}>
              Add {billType} Bill
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UtilityBill;