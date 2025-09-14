import React, { useState } from 'react';
import BasicInformation from './BasicInformation';
import PropertyDocuments from './PropertyDocuments';
import ApprovalDocuments from './ApprovalDocuments';
import UtilityBill from './UtilityBill';
import AdditionalDocuments from './AdditionalDocuments';
import LocationDetails from './LocationDetails';
import OnlineChecks from './OnlineChecks';
import SiteDataReview from './SiteDataReview';
import PropertyDetails from './PropertyDetails';
import LandDetails from './LandDetails';
import LandValuation from './LandValuation';
import Enquiries from './Enquiries';
import BuildingDetails from './BuildingDetails';
import BuildingValuation from './BuildingValuation';
import FlatValuation from './FlatValuation';
import CommentsRemarks from './CommentsRemarks';
import { PropertyType } from '../types';

const PropertyValuationForm: React.FC = () => {
  const [propertyType, setPropertyType] = useState<PropertyType>('');
  const [formData, setFormData] = useState<any>({});

  const updateFormData = (section: string, data: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: data
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    alert('Form submitted successfully! (This is a demo - check console for data)');
  };

  const renderSections = () => {
    const commonSections = [
      <BasicInformation 
        key="basic" 
        propertyType={propertyType} 
        setPropertyType={setPropertyType}
        onUpdate={(data) => updateFormData('basic', data)} 
      />,
      <PropertyDocuments 
        key="property-docs" 
        propertyType={propertyType}
        onUpdate={(data) => updateFormData('propertyDocs', data)} 
      />,
      <ApprovalDocuments 
        key="approval-docs" 
        onUpdate={(data) => updateFormData('approvalDocs', data)} 
      />,
      <UtilityBill 
        key="utility-bill" 
        onUpdate={(data) => updateFormData('utilityBill', data)} 
      />,
      <AdditionalDocuments 
        key="additional-docs" 
        onUpdate={(data) => updateFormData('additionalDocs', data)} 
      />,
      <LocationDetails 
        key="location" 
        propertyType={propertyType}
        onUpdate={(data) => updateFormData('location', data)} 
      />,
      <OnlineChecks 
        key="online-checks" 
        onUpdate={(data) => updateFormData('onlineChecks', data)} 
      />,
      <SiteDataReview 
        key="site-data" 
        onUpdate={(data) => updateFormData('siteData', data)} 
      />,
      <PropertyDetails 
        key="property-details" 
        propertyType={propertyType}
        onUpdate={(data) => updateFormData('propertyDetails', data)} 
      />
    ];

    if (propertyType === 'Land and Buildings') {
      return [
        ...commonSections,
        <LandDetails 
          key="land-details" 
          onUpdate={(data) => updateFormData('landDetails', data)} 
        />,
        <LandValuation 
          key="land-valuation" 
          landData={formData.landDetails}
          onUpdate={(data) => updateFormData('landValuation', data)} 
        />,
        <Enquiries 
          key="enquiries" 
          onUpdate={(data) => updateFormData('enquiries', data)} 
        />,
        <BuildingDetails 
          key="building-details" 
          onUpdate={(data) => updateFormData('buildingDetails', data)} 
        />,
        <BuildingValuation 
          key="building-valuation" 
          buildingData={formData.buildingDetails}
          onUpdate={(data) => updateFormData('buildingValuation', data)} 
        />,
        <CommentsRemarks 
          key="comments" 
          onUpdate={(data) => updateFormData('comments', data)} 
        />
      ];
    } else if (propertyType === 'Flat') {
      return [
        ...commonSections,
        <FlatValuation 
          key="flat-valuation" 
          onUpdate={(data) => updateFormData('flatValuation', data)} 
        />,
        <CommentsRemarks 
          key="comments" 
          onUpdate={(data) => updateFormData('comments', data)} 
        />
      ];
    } else {
      return commonSections;
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Property Valuation Form</h1>
        <p>Complete property assessment and documentation system</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {renderSections()}
          
          {propertyType && (
            <div className="submit-section">
              <button type="submit" className="btn submit-btn">
                Submit Property Valuation Form
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PropertyValuationForm;