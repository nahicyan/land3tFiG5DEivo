// client/src/hooks/useActivityTracking.js
import { useEffect, useCallback, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useVipBuyer } from '@/utils/VipBuyerContext';
import { useLocation } from 'react-router-dom';
import activityTrackingService from '@/services/ActivityTrackingService';

/**
 * Hook for tracking VIP buyer activity
 * This hook should be used at the app level to initialize tracking
 * and at the component level to track specific actions
 * 
 * @param {Object} options - Options for activity tracking
 * @param {boolean} [options.trackPageViews=true] - Whether to track page views automatically
 * @param {boolean} [options.trackClicks=true] - Whether to track clicks automatically
 * @returns {Object} Activity tracking methods
 */
export function useActivityTracking(options = {}) {
  const {
    trackPageViews = true,
    trackClicks = true
  } = options;

  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const { isVipBuyer, vipBuyerData } = useVipBuyer();
  const location = useLocation();
  const initialized = useRef(false);
  const prevPathname = useRef(location.pathname);

  // Initialize activity tracking when a VIP buyer logs in
  useEffect(() => {
    if (
      isAuthenticated && 
      isVipBuyer && 
      vipBuyerData && 
      vipBuyerData.id && 
      user && 
      user.sub && 
      !initialized.current
    ) {
      // Initialize the activity tracking service
      activityTrackingService.init({
        getToken: getAccessTokenSilently,
        vipBuyerId: vipBuyerData.id,
        auth0UserId: user.sub
      });
      
      // Start tracking
      activityTrackingService.startTracking();
      initialized.current = true;
      
      console.log('VIP buyer activity tracking initialized');
      
      // Cleanup when component unmounts
      return () => {
        if (initialized.current) {
          activityTrackingService.stopTracking();
          initialized.current = false;
        }
      };
    }
  }, [isAuthenticated, isVipBuyer, vipBuyerData, user, getAccessTokenSilently]);

  // Track page views when location changes
  useEffect(() => {
    if (
      initialized.current && 
      trackPageViews && 
      location.pathname !== prevPathname.current
    ) {
      activityTrackingService.recordPageView();
      prevPathname.current = location.pathname;
    }
  }, [location.pathname, trackPageViews]);

  // Callback functions for tracking specific actions
  
  /**
   * Track property view
   * @param {Object} property - Property data
   */
  const trackPropertyView = useCallback((property) => {
    if (initialized.current && property) {
      console.log("Tracking property view in hook:", property);
      activityTrackingService.recordPropertyView(property);
      
      // For debugging, also log the tracking state
      console.log("Tracking state:", {
        isVipBuyer,
        isInitialized: initialized.current,
        vipBuyerId: vipBuyerData?.id,
        auth0Id: user?.sub
      });
    } else {
      console.log("Cannot track property view:", { 
        initialized: initialized.current,
        hasProperty: !!property
      });
    }
  }, [isVipBuyer, vipBuyerData, user]);

  /**
   * Track search
   * @param {string} query - Search query
   * @param {number} resultsCount - Number of results
   * @param {Object} filters - Search filters
   */
  const trackSearch = useCallback((query, resultsCount, filters = {}) => {
    if (initialized.current) {
      activityTrackingService.recordSearch(query, resultsCount, filters);
    }
  }, []);

  /**
   * Track offer submission
   * @param {Object} offerData - Offer data
   */
  const trackOfferSubmission = useCallback((offerData) => {
    if (initialized.current && offerData) {
      activityTrackingService.recordOfferSubmission(offerData);
    }
  }, []);

  /**
   * Track email interaction
   * @param {Object} emailData - Email interaction data
   */
  const trackEmailInteraction = useCallback((emailData) => {
    if (initialized.current && emailData) {
      activityTrackingService.recordEmailInteraction(emailData);
    }
  }, []);

  /**
   * Track custom event
   * @param {string} eventType - Type of event
   * @param {Object} eventData - Event data
   */
  const trackEvent = useCallback((eventType, eventData = {}) => {
    if (initialized.current) {
      activityTrackingService.recordEvent(eventType, eventData);
    }
  }, []);

  return {
    isTracking: initialized.current,
    trackPropertyView,
    trackSearch,
    trackOfferSubmission,
    trackEmailInteraction,
    trackEvent
  };
}

export default useActivityTracking;