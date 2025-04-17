// client/src/components/SearchArea/SearchAreaWithTracking.jsx
import React, { useEffect } from 'react';
import SearchArea from './SearchArea';
import { useActivityTrackingContext } from '@/components/ActivityTracking/ActivityTrackingProvider';
import { useVipBuyer } from '@/utils/VipBuyerContext';

const SearchAreaWithTracking = (props) => {
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
          { type: 'area', area: props.area || 'unknown', ...props.filters || {} }
        );
        
        // Track additional search metadata
        trackEvent('search_query', {
          searchType: 'area',
          query: props.query,
          resultsCount: props.filteredData?.length || 0,
          timestamp: new Date().toISOString(),
          area: props.area || 'unknown',
          // Additional area-specific metadata
          placeholder: props.placeholder || 'Search'
        });
      }
    }, 800); // 800ms debounce
    
    return () => clearTimeout(debounceTimer);
  }, [isVipBuyer, props.query, props.filteredData, props.area, props.filters, trackSearch, trackEvent]);

  // Render the original SearchArea component with all props
  return <SearchArea {...props} />;
};

export default SearchAreaWithTracking;