// src/components/VipBuyerContent.jsx
import React from "react";
import { useVipBuyer } from "@/utils/VipBuyerContext";

/**
 * Component that conditionally renders content for VIP buyers
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.vipContent - Content to show for VIP buyers
 * @param {ReactNode} [props.regularContent] - Optional content to show for regular users
 * @param {ReactNode} [props.loadingContent] - Optional content to show while loading
 * @returns {ReactNode} Rendered content based on VIP status
 */
export const VipBuyerContent = ({ 
  vipContent, 
  regularContent = null, 
  loadingContent = null 
}) => {
  const { isVipBuyer, isLoading, vipBuyerData } = useVipBuyer();
  
  if (isLoading) {
    return loadingContent || (
      <div className="animate-pulse bg-gray-200 h-8 w-full rounded"></div>
    );
  }
  
  if (isVipBuyer) {
    return vipContent;
  }
  
  return regularContent;
};

/**
 * HOC that conditionally renders a component for VIP buyers
 * 
 * @param {ReactComponent} Component - The component to render for VIP buyers
 * @param {Object} options - Configuration options
 * @param {ReactComponent} [options.FallbackComponent] - Component to render for non-VIP users
 * @param {boolean} [options.hideForNonVip=false] - Whether to hide content for non-VIP users
 * @returns {ReactComponent} Wrapped component with VIP status check
 */
export const withVipBuyerAccess = (Component, { 
  FallbackComponent = null, 
  hideForNonVip = false 
} = {}) => {
  return (props) => {
    const { isVipBuyer, isLoading } = useVipBuyer();
    
    if (isLoading) {
      return (
        <div className="animate-pulse bg-gray-200 h-8 w-full rounded"></div>
      );
    }
    
    if (isVipBuyer) {
      return <Component {...props} />;
    }
    
    if (hideForNonVip) {
      return null;
    }
    
    return FallbackComponent ? <FallbackComponent {...props} /> : null;
  };
};

/**
 * Simple badge component to show VIP status
 */
export const VipBuyerBadge = () => {
  const { isVipBuyer, vipBuyerData } = useVipBuyer();
  
  if (!isVipBuyer) return null;
  
  return (
    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#D4A017] text-white">
      VIP Buyer
    </div>
  );
};

export default VipBuyerContent;