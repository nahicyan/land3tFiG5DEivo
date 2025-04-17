// client/src/components/ActivityTracking/TrackingComponentIntegration.js
import React from 'react';
import { withActivityTracking } from './ActivityTrackingProvider';

/**
 * HOC to track property views
 * @param {React.ComponentType} Component - The component to wrap
 * @returns {React.ComponentType} Wrapped component with tracking
 */
export const withPropertyViewTracking = (Component) => {
  return withActivityTracking(Component, {
    getPropertyData: (props) => props.propertyData || null,
  });
};

/**
 * HOC to track search actions
 * @param {React.ComponentType} Component - The component to wrap
 * @returns {React.ComponentType} Wrapped component with tracking
 */
export const withSearchTracking = (Component) => {
  return withActivityTracking(Component, {
    eventType: 'search_view',
    getEventData: (props) => ({
      currentQuery: props.query || '',
      hasResults: props.filteredData && props.filteredData.length > 0,
      resultsCount: props.filteredData ? props.filteredData.length : 0,
      filters: props.filters || {}
    })
  });
};

/**
 * HOC to track offer form views
 * @param {React.ComponentType} Component - The component to wrap
 * @returns {React.ComponentType} Wrapped component with tracking
 */
export const withOfferFormTracking = (Component) => {
  return withActivityTracking(Component, {
    eventType: 'offer_form_view',
    getEventData: (props) => {
      const property = props.propertyData || {};
      return {
        propertyId: property.id,
        propertyTitle: property.title,
        askingPrice: property.askingPrice
      };
    }
  });
};

/**
 * HOC to track page views
 * @param {React.ComponentType} Component - The component to wrap
 * @param {string} pageName - Name of the page
 * @returns {React.ComponentType} Wrapped component with tracking
 */
export const withPageViewTracking = (Component, pageName) => {
  return withActivityTracking(Component, {
    eventType: 'page_view',
    getEventData: () => ({
      pageName,
      title: document.title,
      path: window.location.pathname
    })
  });
};

/**
 * Helper function to get tracking-enabled components
 * @returns {Object} Object with tracking-enabled components
 */
export const getTrackingEnabledComponents = () => {
  // Import all the components that need tracking
  const Property = require('../../pages/Property/Property').default;
  const Offer = require('../Offer/Offer').default;
  const Search = require('../Search/Search').default;
  const Properties = require('../../pages/Properties/Properties').default;
  
  // Apply tracking HOCs
  const PropertyWithTracking = withPropertyViewTracking(Property);
  const OfferWithTracking = withOfferFormTracking(Offer);
  const SearchWithTracking = withSearchTracking(Search);
  const PropertiesWithTracking = withPageViewTracking(Properties, 'properties_listing');
  
  return {
    PropertyWithTracking,
    OfferWithTracking,
    SearchWithTracking,
    PropertiesWithTracking
  };
};