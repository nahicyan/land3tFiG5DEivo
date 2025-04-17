// client/src/pages/Property/PropertyWithTracking.jsx
import React, { useEffect } from 'react';
import Property from './Property';
import { useActivityTrackingContext } from '@/components/ActivityTracking/ActivityTrackingProvider';
import { useVipBuyer } from '@/utils/VipBuyerContext';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getProperty } from '@/utils/api';

/**
 * Enhanced Property page component with VIP buyer activity tracking
 * Tracks property views and other interactions
 */
const PropertyWithTracking = (props) => {
  const { trackPropertyView, trackEvent, isTracking } = useActivityTrackingContext();
  const { isVipBuyer, vipBuyerData } = useVipBuyer();
  const { propertyId } = useParams(); // Get ID from URL params
  
  // Fetch property data if not provided in props
  const { data: fetchedPropertyData } = useQuery(
    ['property', propertyId],
    () => getProperty(propertyId),
    { 
      enabled: !!propertyId && !props.propertyData,
      refetchOnWindowFocus: false
    }
  );
  
  // Use either props data or fetched data
  const propertyData = props.propertyData || fetchedPropertyData;
  
  useEffect(() => {
    // Only track for VIP buyers with valid tracking and property data
    if (!isVipBuyer || !isTracking || !propertyData || !propertyData.id) {
      console.log("Skipping property view tracking:", { 
        isVipBuyer, isTracking, hasPropertyData: !!propertyData 
      });
      return;
    }
    
    console.log("Tracking property view for:", propertyData.id);
    
    // Track property view when the component mounts
    trackPropertyView({
      id: propertyData.id,
      title: propertyData.title || 'Unknown Property',
      streetAddress: propertyData.streetAddress || '',
      city: propertyData.city || '',
      state: propertyData.state || '',
      askingPrice: propertyData.askingPrice
    });
    
    // Also track detailed property view event
    const entryTime = new Date().toISOString();
    trackEvent('property_view', {
      propertyId: propertyData.id,
      propertyTitle: propertyData.title || 'Unknown Property',
      propertyAddress: propertyData.streetAddress ? 
        `${propertyData.streetAddress}, ${propertyData.city || ''}, ${propertyData.state || ''}` : 
        'Address not available',
      area: propertyData.area,
      askingPrice: propertyData.askingPrice,
      financing: propertyData.financing,
      status: propertyData.status,
      type: propertyData.type,
      acreage: propertyData.acre,
      sqft: propertyData.sqft,
      duration: 0,  // Will be updated on unmount
      entryTime: entryTime
    });
    
    // Track when user leaves
    return () => {
      if (isVipBuyer && isTracking && propertyData?.id) {
        const durationMs = new Date() - new Date(entryTime);
        const durationSec = Math.floor(durationMs / 1000);
        
        trackEvent('property_exit', {
          propertyId: propertyData.id,
          duration: durationSec,
          exitTime: new Date().toISOString()
        });
      }
    };
  }, [isVipBuyer, isTracking, propertyData, trackPropertyView, trackEvent]);

  // Render the original Property component with all original props
  return <Property {...props} propertyData={propertyData} />;
};

export default PropertyWithTracking;