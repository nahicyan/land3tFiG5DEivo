// client/src/components/ActivityTracking/ActivityTrackingProvider.jsx
import React, { createContext, useContext, useEffect } from 'react';
import useActivityTracking from '@/hooks/useActivityTracking';
import { useVipBuyer } from '@/utils/VipBuyerContext';

// Create context for activity tracking
const ActivityTrackingContext = createContext(null);

/**
 * Provider component for activity tracking
 * Wraps the app and provides tracking functionality globally
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 */
export const ActivityTrackingProvider = ({ children }) => {
  const { isVipBuyer } = useVipBuyer();
  const tracking = useActivityTracking();

  return (
    <ActivityTrackingContext.Provider value={tracking}>
      {children}
    </ActivityTrackingContext.Provider>
  );
};

/**
 * Hook to use activity tracking in any component
 * @returns {Object} Activity tracking methods
 */
export const useActivityTrackingContext = () => {
  const context = useContext(ActivityTrackingContext);
  if (context === null) {
    throw new Error('useActivityTrackingContext must be used within an ActivityTrackingProvider');
  }
  return context;
};

/**
 * Higher-order component that adds automatic tracking to another component
 * 
 * @param {React.ComponentType} Component - The component to enhance with tracking
 * @param {Object} options - Tracking options
 * @param {string} [options.eventType] - The type of event to track
 * @param {Function} [options.getPropertyData] - Function to extract property data from props
 * @param {Function} [options.getEventData] - Function to extract custom event data from props
 * @returns {React.ComponentType} Enhanced component with tracking
 */
export const withActivityTracking = (Component, options = {}) => {
  return (props) => {
    const tracking = useActivityTrackingContext();
    const { isVipBuyer } = useVipBuyer();
    
    useEffect(() => {
      // Only track if VIP buyer and tracking is enabled
      if (!isVipBuyer || !tracking.isTracking) return;
      
      if (options.eventType) {
        // Track custom event
        let eventData = {};
        
        // Get event data from props if getEventData function is provided
        if (options.getEventData && typeof options.getEventData === 'function') {
          eventData = options.getEventData(props);
        }
        
        tracking.trackEvent(options.eventType, eventData);
      } else if (options.getPropertyData && typeof options.getPropertyData === 'function') {
        // Track property view
        const propertyData = options.getPropertyData(props);
        if (propertyData) {
          tracking.trackPropertyView(propertyData);
        }
      }
    }, [props, tracking, isVipBuyer]);
    
    return <Component {...props} />;
  };
};

export default ActivityTrackingProvider;