// client/src/components/Offer/OfferWithTracking.jsx
import React, { useEffect } from 'react';
import Offer from './Offer';
import { useActivityTrackingContext } from '@/components/ActivityTracking/ActivityTrackingProvider';
import { useVipBuyer } from '@/utils/VipBuyerContext';

/**
 * Enhanced Offer component with VIP buyer activity tracking
 * Tracks offer form views and submissions
 */
const OfferWithTracking = (props) => {
  const { trackEvent, trackOfferSubmission } = useActivityTrackingContext();
  const { isVipBuyer, vipBuyerData } = useVipBuyer();
  
  // Track when offer component mounts
  useEffect(() => {
    // Only track for VIP buyers
    if (!isVipBuyer) return;
    
    const propertyData = props.propertyData || {};
    
    // Track offer form view
    if (propertyData.id) {
      trackEvent('offer_form_view', {
        propertyId: propertyData.id,
        propertyTitle: propertyData.title || 'Unknown Property',
        askingPrice: propertyData.askingPrice,
        minPrice: propertyData.minPrice,
        timestamp: new Date().toISOString()
      });
    }
  }, [isVipBuyer, trackEvent, props.propertyData]);

  // Function to handle offer submission tracking
  const handleOfferSubmit = (offerData) => {
    // Call the original onSubmit handler if provided
    if (props.onSubmit) {
      props.onSubmit(offerData);
    }
    
    // Only track for VIP buyers
    if (isVipBuyer && vipBuyerData && offerData) {
      // Track the offer submission
      trackOfferSubmission({
        propertyId: offerData.propertyId,
        offeredPrice: offerData.offeredPrice,
        buyerId: vipBuyerData.id,
        timestamp: new Date().toISOString()
      });
    }
  };
  
  // Pass all props to the original Offer component, but override onSubmit
  return <Offer {...props} onSubmit={handleOfferSubmit} />;
};

export default OfferWithTracking;