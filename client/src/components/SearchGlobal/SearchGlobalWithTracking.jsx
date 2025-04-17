// client/src/components/SearchGlobal/SearchGlobalWithTracking.jsx
import React, { useEffect } from 'react';
import SearchGlobal from './SearchGlobal';
import { useActivityTrackingContext } from '@/components/ActivityTracking/ActivityTrackingProvider';
import { useVipBuyer } from '@/utils/VipBuyerContext';

const SearchGlobalWithTracking = (props) => {
  const { trackSearch, trackEvent } = useActivityTrackingContext();
  const { isVipBuyer } = useVipBuyer();
  
  // Track when search query changes
  useEffect(() => {
    // Only track for VIP buyers
    if (!isVipBuyer || !props.query) return;
    
    // Debounce tracking to avoid excessive events on rapid typing
    const debounceTimer = setTimeout(() => {
      // Only track non-empty searches
      if (props.query.trim()) {
        trackSearch(
          props.query,
          props.filteredData?.length || 0,
          { type: 'global', ...props.filters || {} }
        );
        
        // Track additional search metadata
        trackEvent('search_query', {
          searchType: 'global',
          query: props.query,
          resultsCount: props.filteredData?.length || 0,
          timestamp: new Date().toISOString(),
          // Track filters if available
          area: props.filters?.area || null,
          priceRange: props.filters?.priceRange || null,
          propertyType: props.filters?.propertyType || null,
        });
      }
    }, 800); // 800ms debounce
    
    return () => clearTimeout(debounceTimer);
  }, [isVipBuyer, props.query, props.filteredData, props.filters, trackSearch, trackEvent]);

  // Render the original SearchGlobal component with all props
  return <SearchGlobal {...props} />;
};

export default SearchGlobalWithTracking;