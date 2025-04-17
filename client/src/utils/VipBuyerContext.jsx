// src/utils/VipBuyerContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

// Create a context for VIP buyer information
export const VipBuyerContext = createContext(null);

export const VipBuyerProvider = ({ children }) => {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const [isVipBuyer, setIsVipBuyer] = useState(false);
  const [vipBuyerData, setVipBuyerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if the authenticated user is a VIP buyer
  useEffect(() => {
    const checkVipBuyerStatus = async () => {
      // Reset state when auth status changes
      setIsVipBuyer(false);
      setVipBuyerData(null);
      
      // Only proceed if user is authenticated and we have a user object
      if (!isAuthenticated || !user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Get access token for API request
        const token = await getAccessTokenSilently();
        
        // Make API call to check if the Auth0 ID matches a VIP buyer
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/buyer/byAuth0Id?auth0Id=${encodeURIComponent(user.sub)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        // If we got a successful response with buyer data
        if (response.data) {
          setIsVipBuyer(true);
          setVipBuyerData(response.data);
        } 
        
        setError(null);
      } catch (err) {
        // If error is 404, it means no buyer was found for this Auth0 ID (not a VIP)
        if (err.response && err.response.status === 404) {
          setIsVipBuyer(false);
          setVipBuyerData(null);
        } else {
          // For other errors, log them but don't disrupt the application
          console.error("Error checking VIP buyer status:", err);
          setError("Failed to verify VIP status");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkVipBuyerStatus();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  // The context value that will be provided
  const value = {
    isVipBuyer,
    vipBuyerData,
    isLoading,
    error,
  };

  return (
    <VipBuyerContext.Provider value={value}>
      {children}
    </VipBuyerContext.Provider>
  );
};

// Custom hook for using the VIP buyer context
export const useVipBuyer = () => {
  const context = useContext(VipBuyerContext);
  if (context === null) {
    throw new Error("useVipBuyer must be used within a VipBuyerProvider");
  }
  return context;
};