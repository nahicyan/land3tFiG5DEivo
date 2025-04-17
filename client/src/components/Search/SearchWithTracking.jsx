// client/src/components/Search/SearchWithTracking.jsx
import React, { useEffect } from 'react';
import Search from './Search';
import { useActivityTrackingContext } from '@/components/ActivityTracking/ActivityTrackingProvider';
import { useVipBuyer } from '@/utils/VipBuyerContext';

const SearchWithTracking = (props) => {
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
          { type: 'standard', ...props.filters || {} }
        );
        
        // Track additional search metadata
        trackEvent('search_query', {
          searchType: 'standard',
          query: props.query,
          resultsCount: props.filteredData?.length || 0,
          timestamp: new Date().toISOString(),
          // Track context information if available
          context: props.context || 'properties',
          // Track filters if available
          filters: props.filters || {}
        });
      }
    }, 800); // 800ms debounce
    
    return () => clearTimeout(debounceTimer);
  }, [isVipBuyer, props.query, props.filteredData, props.filters, props.context, trackSearch, trackEvent]);

  // Render the original Search component with all props
  return <Search {...props} />;
};

export default SearchWithTracking;