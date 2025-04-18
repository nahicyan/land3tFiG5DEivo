"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/hooks/useAuth";
import { useUserProfileApi } from '@/utils/api';

export default function UserSubmit() {
  // State for the database user
  const [dbUser, setDbUser] = useState(null);
  // Flag to prevent multiple API calls
  const [profileFetched, setProfileFetched] = useState(false);
  
  // Use the authentication hook
  const { user, isLoading } = useAuth();
  
  // Use the API hook to get the authenticated getUserProfile function
  const { getUserProfile } = useUserProfileApi();

  // Load database user profile data - only once
  useEffect(() => {
    if (user?.sub && !isLoading && !profileFetched) {
      setProfileFetched(true); // Set flag to prevent duplicate calls
      
      const loadUserProfile = async () => {
        try {
          const profile = await getUserProfile();
          if (profile) {
            setDbUser(profile);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      };
      
      loadUserProfile();
    }
  }, [user, isLoading, profileFetched, getUserProfile]);

  // Display name logic - database first, then fallbacks
  const getUserDisplayName = () => {
    if (!user) return "Not logged in";
    
    // First check database user 
    if (dbUser?.firstName && dbUser?.lastName) {
      return `${dbUser.firstName} ${dbUser.lastName}`;
    }
    
    if (dbUser?.firstName) {
      return dbUser.firstName;
    }
    
    if (dbUser?.email) {
      return dbUser.email;
    }
    
    // Fallback to auth0 user email if available
    return user.email || "User";
  };

  return (
    <div className="bg-[#f0f0f0] p-4 rounded-[12px] border border-[rgba(200,200,200,0.6)]">
      <p className="text-base font-semibold text-[#333]">
        You are uploading as:{" "}
        {isLoading ? (
          <span className="italic text-gray-500">Loading user info...</span>
        ) : (
          <span className="font-bold text-[#000]">{getUserDisplayName()}</span>
        )}
      </p>
    </div>
  );
}