import React, { useState, useCallback } from 'react';
import { X, Plus } from 'lucide-react';

interface BuildingDetail {
  id: string;
  name: string;
  floors: number;
  area: number;
}

interface ApprovalDocument {
  id: number;
  buildingApproval: string;
  landApproval: string;
  approvalDetails: any;
  landApprovalDetails: any;
}

interface PopupState {
  isOpen: boolean;
  target: string;
  type: string;
}

const ApprovalDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<ApprovalDocument[]>([
    { id: 1, buildingApproval: '', landApproval: '', approvalDetails: null, landApprovalDetails: null }
  ]);
  const [popup, setPopup] = useState<PopupState>({ isOpen: false, target: '', type: '' });
  const [buildingCount, setBuildingCount] = useState(1);
  const [buildings, setBuildings] = useState<{ [key: string]: BuildingDetail[] }>({});
  
  // Form states for popups
  const [sanctionBodySelect, setSanctionBodySelect] = useState('');
  const [bpsBrsSelect, setBpsBrsSelect] = useState('');
  const [localBodySelect, setLocalBodySelect] = useState('');
  const [ocBodySelect, setOcBodySelect] = useState('');
  const [lrsSanctionSelect, setLrsSanctionSelect] = useState('');
  const [layoutSanctionSelect, setLayoutSanctionSelect] = useState('');
  
  // NALA form state
  const [nalaForm, setNalaForm] = useState({
    proceeding: '',
    syNo: '',
    syExtent: ''
  });
  
  // Building form state
  const [buildingForm, setBuildingForm] = useState({
    name: '',
    floors: 1,
    area: 0
  });

  const addApprovalDoc = useCallback(() => {
    const newId = Math.max(...documents.map(d => d.id)) + 1;
    setDocuments(prev => [...prev, {
      id: newId,
      buildingApproval: '',
      landApproval: '',
      approvalDetails: null,
      landApprovalDetails: null
    }]);
  }, [documents]);

  const removeApprovalDoc = useCallback((id: number) => {
    if (documents.length > 1) {
      setDocuments(prev => prev.filter(doc => doc.id !== id));
    }
  }, [documents.length]);

  const handleBuildingApprovalChange = useCallback((docId: number, value: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId ? { ...doc, buildingApproval: value, approvalDetails: null } : doc
    ));

    if (value) {
      const target = `approvalDetails${docId}`;
      let popupType = '';
      
      switch (value) {
        case 'SANCTION PLAN':
          popupType = 'sanctionBody';
          break;
        case 'NO PLAN CASE':
          popupType = 'localBody';
          break;
        case 'BPS/BRS':
          popupType = 'bpsBrs';
          break;
        case 'OC':
          popupType = 'ocBody';
          break;
      }
      
      if (popupType) {
        setPopup({ isOpen: true, target, type: popupType });
      }
    }
  }, []);

  const handleLandApprovalChange = useCallback((docId: number, value: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId ? { ...doc, landApproval: value, landApprovalDetails: null } : doc
    ));

    if (value) {
      const target = `landApprovalDetails${docId}`;
      let popupType = '';
      
      switch (value) {
        case 'LRS':
          popupType = 'lrsSanction';
          break;
        case 'LAYOUT':
          popupType = 'layoutSanction';
          break;
        case 'NALA':
          popupType = 'nalaDetails';
          break;
      }
      
      if (popupType) {
        setPopup({ isOpen: true, target, type: popupType });
      }
    }
  }, []);

  const closePopup = useCallback(() => {
    setPopup({ isOpen: false, target: '', type: '' });
    // Reset form states
    setSanctionBodySelect('');
    setBpsBrsSelect('');
    setLocalBodySelect('');
    setOcBodySelect('');
    setLrsSanctionSelect('');
    setLayoutSanctionSelect('');
    setNalaForm({ proceeding: '', syNo: '', syExtent: '' });
    setBuildingForm({ name: '', floors: 1, area: 0 });
  }, []);

  const confirmSelection = useCallback((selectedValue: string) => {
    if (!selectedValue || !popup.target) return;

    const docId = parseInt(popup.target.replace(/\D/g, ''));
    let fields = null;

    switch (popup.type) {
      case 'sanctionBody':
        fields = getSanctionBodyFields(selectedValue);
        break;
      case 'bpsBrs':
        fields = getBpsBrsFields(selectedValue);
        break;
      case 'localBody':
        fields = getLocalBodyFields(selectedValue);
        break;
      case 'ocBody':
        fields = getOCBodyFields(selectedValue);
        break;
      case 'lrsSanction':
        fields = getLrsFields(selectedValue);
        break;
      case 'layoutSanction':
        fields = getLayoutFields(selectedValue);
        break;
    }

    if (fields) {
      setDocuments(prev => prev.map(doc => {
        if (doc.id === docId) {
          if (popup.target.includes('landApproval')) {
            return { ...doc, landApprovalDetails: fields };
          } else {
            return { ...doc, approvalDetails: fields };
          }
        }
        return doc;
      }));
    }

    closePopup();
  }, [popup, closePopup]);

  const addNalaDetails = useCallback(() => {
    if (!nalaForm.proceeding || !nalaForm.syNo || !nalaForm.syExtent || !popup.target) return;

    const docId = parseInt(popup.target.replace(/\D/g, ''));
    const fields = {
      type: 'nala',
      proceeding: nalaForm.proceeding,
      syNo: nalaForm.syNo,
      syExtent: nalaForm.syExtent
    };

    setDocuments(prev => prev.map(doc => 
      doc.id === docId ? { ...doc, landApprovalDetails: fields } : doc
    ));

    closePopup();
  }, [nalaForm, popup.target, closePopup]);

  const addBuildingDetails = useCallback(() => {
    if (!buildingForm.name || !buildingForm.floors || !buildingForm.area) return;

    const newBuilding: BuildingDetail = {
      id: Date.now().toString(),
      name: buildingForm.name,
      floors: buildingForm.floors,
      area: buildingForm.area
    };

    setBuildings(prev => ({
      ...prev,
      [popup.target]: [...(prev[popup.target] || []), newBuilding]
    }));

    closePopup();
  }, [buildingForm, popup.target, closePopup]);

  const getSanctionBodyFields = (sanctionBody: string) => {
    const currentBuildingCount = buildingCount;
    setBuildingCount(prev => prev + 1);
    
    return {
      type: 'sanctionBody',
      sanctionBody,
      buildingContainerId: `buildingsContainer${currentBuildingCount}`
    };
  };

  const getBpsBrsFields = (sanctionBody: string) => {
    const currentBuildingCount = buildingCount;
    setBuildingCount(prev => prev + 1);
    
    return {
      type: 'bpsBrs',
      sanctionBody,
      buildingContainerId: `buildingsContainer${currentBuildingCount}`
    };
  };

  const getLocalBodyFields = (localBody: string) => {
    return {
      type: 'localBody',
      localBody
    };
  };

  const getOCBodyFields = (ocBody: string) => {
    return {
      type: 'ocBody',
      ocBody
    };
  };

  const getLrsFields = (sanctionBody: string) => {
    return {
      type: 'lrs',
      sanctionBody
    };
  };

  const getLayoutFields = (sanctionBody: string) => {
    return {
      type: 'layout',
      sanctionBody
    };
  };

  const renderApprovalDetails = (details: any) => {
    if (!details) return null;

    switch (details.type) {
      case 'sanctionBody':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valid Upto *</label>
                <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
            </div>
            {renderSanctionBodySpecificFields(details.sanctionBody)}
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sanction Buildings and Floors</label>
              <button
                type="button"
                onClick={() => setPopup({ isOpen: true, target: details.buildingContainerId, type: 'buildingDetails' })}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Building Details
              </button>
              {buildings[details.buildingContainerId] && (
                <div className="mt-4 space-y-2">
                  {buildings[details.buildingContainerId].map(building => (
                    <div key={building.id} className="bg-white border border-gray-200 rounded-lg p-3 text-left">
                      <div className="font-medium">{building.name}</div>
                      <div className="text-sm text-gray-600">
                        Floors: {building.floors} | Area: {building.area} sq.ft
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'bpsBrs':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Proceeding No *</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issued By *</label>
              <input type="text" value={details.sanctionBody} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" readOnly />
            </div>
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">Regularized/Penalized Buildings and Floors</label>
              <button
                type="button"
                onClick={() => setPopup({ isOpen: true, target: details.buildingContainerId, type: 'buildingDetails' })}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Building Details
              </button>
              {buildings[details.buildingContainerId] && (
                <div className="mt-4 space-y-2">
                  {buildings[details.buildingContainerId].map(building => (
                    <div key={building.id} className="bg-white border border-gray-200 rounded-lg p-3 text-left">
                      <div className="font-medium">{building.name}</div>
                      <div className="text-sm text-gray-600">
                        Floors: {building.floors} | Area: {building.area} sq.ft
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'localBody':
        return renderLocalBodyFields(details.localBody);

      case 'ocBody':
        return renderOCBodyFields(details.ocBody);

      case 'lrs':
        return renderLrsFields(details.sanctionBody);

      case 'layout':
        return renderLayoutFields(details.sanctionBody);

      case 'nala':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Proceeding Number:</label>
              <input type="text" value={details.proceeding} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SY NO:</label>
              <input type="text" value={details.syNo} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SY NO Wise Extent:</label>
              <input type="number" value={details.syExtent} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" readOnly />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderSanctionBodySpecificFields = (sanctionBody: string) => {
    switch (sanctionBody) {
      case 'GP':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">File No/Permit No/Proceeding No/Application No *</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issued By *</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                <option value="">Select Grampanchayath</option>
                <option value="GP1">Grampanchayath 1</option>
                <option value="GP2">Grampanchayath 2</option>
              </select>
            </div>
          </div>
        );

      case 'DTCP':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File No *</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Permit No/Proceeding No *</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issued By *</label>
              <input type="text" value="DISTRICT TOWN AND COUNTRY PLANNING OFFICER, (_________)" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
            </div>
          </>
        );

      case 'GHMC DPMS':
      case 'GHMC-2016':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File No *</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Permit No/Proceeding No *</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issued By *</label>
              <input type="text" value="GHMC" className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" readOnly />
            </div>
          </>
        );

      case 'HMDA DPMS':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application No/Proceeding No *</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issued By *</label>
              <input type="text" value="HMDA" className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" readOnly />
            </div>
          </>
        );

      case 'TG BPASS':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application No/Proceeding No *</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issued By *</label>
              <input type="text" value="TG BPASS, ___________ (MUNICIPALITY/ MUNICIPAL CORPORATION)" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const renderLocalBodyFields = (localBody: string) => {
    const commonFields = (
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Door No *</label>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
        </div>
      </div>
    );

    switch (localBody) {
      case 'GHMC':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PTI No *</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paid To *</label>
                <input type="text" value="GHMC" className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" readOnly />
              </div>
            </div>
            {commonFields}
          </div>
        );

      case 'CDMA':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PTI No *</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paid To *</label>
                <input type="text" value="CDMA" className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" readOnly />
              </div>
            </div>
            {commonFields}
          </div>
        );

      case 'GRAMPANCHAYATH':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assessment No *</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paid To *</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                  <option value="">Select Grampanchayath</option>
                  <option value="GP1">Grampanchayath 1</option>
                  <option value="GP2">Grampanchayath 2</option>
                </select>
              </div>
            </div>
            {commonFields}
          </div>
        );

      default:
        return null;
    }
  };

  const renderOCBodyFields = (ocBody: string) => {
    const commonFields = (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
          <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Issued By *</label>
          <input type="text" value={getOCIssuedBy(ocBody)} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" readOnly />
        </div>
      </>
    );

    const fileFields = (
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">File No *</label>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">OC No *</label>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
        </div>
      </div>
    );

    const applicationFields = (
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Application No *</label>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">OC No *</label>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
        </div>
      </div>
    );

    return (
      <div className="space-y-4">
        {['DTCP', 'GHMC DPMS', 'GHMC-2016'].includes(ocBody) ? fileFields : applicationFields}
        {commonFields}
      </div>
    );
  };

  const getOCIssuedBy = (ocBody: string) => {
    switch (ocBody) {
      case 'DTCP':
        return 'DISTRICT TOWN AND COUNTRY PLANNING OFFICER';
      case 'GHMC DPMS':
      case 'GHMC-2016':
        return 'GHMC';
      case 'HMDA DPMS':
        return 'HMDA';
      case 'TG BPASS':
        return 'TG BPASS';
      case 'TGIIC':
        return 'TGIIC';
      default:
        return '';
    }
  };

  const renderLrsFields = (sanctionBody: string) => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proceeding No *</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issued By *</label>
            {sanctionBody === 'MUNICIPALITY' ? (
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                <option value="">Select Municipality</option>
                <option value="Municipality 1">Municipality 1</option>
                <option value="Municipality 2">Municipality 2</option>
              </select>
            ) : (
              <input type="text" value={sanctionBody} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" readOnly />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Extent *</label>
            <input type="number" step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
          </div>
        </div>
      </div>
    );
  };

  const renderLayoutFields = (sanctionBody: string) => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Permit/Proceeding/File/Letter/Application No *</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Issued By *</label>
          {sanctionBody === 'GRAMPANCHAYATH LAYOUT' ? (
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
              <option value="">Select Grampanchayath</option>
              <option value="GP1">Grampanchayath 1</option>
              <option value="GP2">Grampanchayath 2</option>
            </select>
          ) : sanctionBody === 'DRAFT LAYOUT' ? (
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
          ) : (
            <input type="text" value={sanctionBody.includes('HMDA') ? 'HMDA' : 'DTCP'} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" readOnly />
          )}
        </div>
      </div>
    );
  };

  const renderPopup = () => {
    if (!popup.isOpen) return null;

    const getPopupTitle = () => {
      switch (popup.type) {
        case 'sanctionBody':
          return 'Select Sanction Body';
        case 'bpsBrs':
          return 'Select BPS/BRS Sanction Body';
        case 'localBody':
          return 'Select Local Body';
        case 'ocBody':
          return 'Select Occupancy Certificate Body';
        case 'lrsSanction':
          return 'Select LRS Sanction Body';
        case 'layoutSanction':
          return 'Select Layout Sanction Body';
        case 'nalaDetails':
          return 'Enter NALA Details';
        case 'buildingDetails':
          return 'Add Building Details';
        default:
          return '';
      }
    };

    const renderPopupContent = () => {
      switch (popup.type) {
        case 'sanctionBody':
          return (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sanction Body *</label>
                <select
                  value={sanctionBodySelect}
                  onChange={(e) => setSanctionBodySelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Sanction Body</option>
                  <option value="GP">GP</option>
                  <option value="DTCP">DTCP</option>
                  <option value="GHMC DPMS">GHMC DPMS</option>
                  <option value="HMDA DPMS">HMDA DPMS</option>
                  <option value="TG BPASS">TG BPASS</option>
                  <option value="GHMC-2016">GHMC-2016</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => confirmSelection(sanctionBodySelect)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Confirm Selection
              </button>
            </>
          );

        case 'bpsBrs':
          return (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sanction Body *</label>
                <select
                  value={bpsBrsSelect}
                  onChange={(e) => setBpsBrsSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Sanction Body</option>
                  <option value="GHMC">GHMC</option>
                  <option value="HMDA">HMDA</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => confirmSelection(bpsBrsSelect)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Confirm Selection
              </button>
            </>
          );

        case 'localBody':
          return (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Local Body *</label>
                <select
                  value={localBodySelect}
                  onChange={(e) => setLocalBodySelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Local Body</option>
                  <option value="GHMC">GHMC</option>
                  <option value="CDMA">CDMA</option>
                  <option value="GRAMPANCHAYATH">Grampanchayath</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => confirmSelection(localBodySelect)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Confirm Selection
              </button>
            </>
          );

        case 'ocBody':
          return (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Occupancy Certificate Body *</label>
                <select
                  value={ocBodySelect}
                  onChange={(e) => setOcBodySelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Occupancy Certificate Body</option>
                  <option value="DTCP">DTCP</option>
                  <option value="GHMC DPMS">GHMC DPMS</option>
                  <option value="HMDA DPMS">HMDA DPMS</option>
                  <option value="TG BPASS">TG BPASS</option>
                  <option value="GHMC-2016">GHMC-2016</option>
                  <option value="TGIIC">TGIIC</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => confirmSelection(ocBodySelect)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Confirm Selection
              </button>
            </>
          );

        case 'lrsSanction':
          return (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sanction Body *</label>
                <select
                  value={lrsSanctionSelect}
                  onChange={(e) => setLrsSanctionSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Sanction Body</option>
                  <option value="GHMC">GHMC</option>
                  <option value="HMDA">HMDA</option>
                  <option value="MUNICIPALITY">Municipality</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => confirmSelection(lrsSanctionSelect)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Confirm Selection
              </button>
            </>
          );

        case 'layoutSanction':
          return (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sanction Body *</label>
                <select
                  value={layoutSanctionSelect}
                  onChange={(e) => setLayoutSanctionSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Sanction Body</option>
                  <option value="HMDA FINAL LAYOUT">HMDA Final Layout</option>
                  <option value="DTCP FINAL LAYOUT">DTCP Final Layout</option>
                  <option value="GRAMPANCHAYATH LAYOUT">Grampanchayath Layout</option>
                  <option value="DRAFT LAYOUT">Draft Layout</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => confirmSelection(layoutSanctionSelect)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Confirm Selection
              </button>
            </>
          );

        case 'nalaDetails':
          return (
            <>
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proceeding Number *</label>
                  <input
                    type="text"
                    value={nalaForm.proceeding}
                    onChange={(e) => setNalaForm(prev => ({ ...prev, proceeding: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SY NO *</label>
                  <input
                    type="text"
                    value={nalaForm.syNo}
                    onChange={(e) => setNalaForm(prev => ({ ...prev, syNo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SY NO Wise Extent (in numbers) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={nalaForm.syExtent}
                    onChange={(e) => setNalaForm(prev => ({ ...prev, syExtent: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={addNalaDetails}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Add NALA Details
              </button>
            </>
          );

        case 'buildingDetails':
          return (
            <>
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Building Name *</label>
                  <input
                    type="text"
                    value={buildingForm.name}
                    onChange={(e) => setBuildingForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Floors *</label>
                  <input
                    type="number"
                    min="1"
                    value={buildingForm.floors}
                    onChange={(e) => setBuildingForm(prev => ({ ...prev, floors: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Built-up Area (sq.ft) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={buildingForm.area}
                    onChange={(e) => setBuildingForm(prev => ({ ...prev, area: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={addBuildingDetails}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Building
              </button>
            </>
          );

        default:
          return null;
      }
    };

    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40" onClick={closePopup} />
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 min-w-96 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">{getPopupTitle()}</h3>
              <button
                onClick={closePopup}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {renderPopupContent()}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <main className="bg-white rounded-3xl shadow-2xl p-8">
          <section>
            <h2 className="flex items-center text-2xl font-semibold text-gray-800 mb-8">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center mr-4 text-lg font-bold">
                3
              </span>
              Approval Documents
            </h2>

            <div className="space-y-6 mb-8">
              {documents.map((doc) => (
                <div key={doc.id} className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">Approval Document {doc.id}</h3>
                    {documents.length > 1 && (
                      <button
                        onClick={() => removeApprovalDoc(doc.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-2 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Building Approval Document *
                      </label>
                      <select
                        value={doc.buildingApproval}
                        onChange={(e) => handleBuildingApprovalChange(doc.id, e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      >
                        <option value="">Select Document</option>
                        <option value="SANCTION PLAN">Sanction Plan</option>
                        <option value="NO PLAN CASE">No Plan Case</option>
                        <option value="BPS/BRS">BPS/BRS</option>
                        <option value="OC">OC</option>
                      </select>
                    </div>

                    {doc.approvalDetails && (
                      <div className="bg-white border border-gray-200 rounded-xl p-4 min-h-16">
                        {renderApprovalDetails(doc.approvalDetails)}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Land Approval Document
                      </label>
                      <select
                        value={doc.landApproval}
                        onChange={(e) => handleLandApprovalChange(doc.id, e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="">Select Document</option>
                        <option value="LRS">LRS</option>
                        <option value="LAYOUT">Layout</option>
                        <option value="NALA">NALA</option>
                      </select>
                    </div>

                    {doc.landApprovalDetails && (
                      <div className="bg-white border border-gray-200 rounded-xl p-4 min-h-16">
                        {renderApprovalDetails(doc.landApprovalDetails)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addApprovalDoc}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Approval Document
            </button>
          </section>
        </main>
      </div>

      {renderPopup()}
    </div>
  );
};

export default ApprovalDocuments;
