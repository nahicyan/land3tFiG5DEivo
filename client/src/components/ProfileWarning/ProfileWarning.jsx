import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/hooks/useAuth";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

/**
 * Displays a warning notification if the user's profile is incomplete
 * This is shown on all pages if the user has auth0 permissions/roles
 * but is missing required profile information
 */
const ProfileWarning = () => {
  const { user, isLoading } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  
  // Check local storage to avoid showing repeatedly
  useEffect(() => {
    const isDismissed = localStorage.getItem('profile-warning-dismissed');
    if (isDismissed) {
      setDismissed(true);
    }
  }, []);
  
  // Handle dismissal
  const handleDismiss = () => {
    // Store in local storage but only for 24 hours
    const expiry = new Date().getTime() + (24 * 60 * 60 * 1000);
    localStorage.setItem('profile-warning-dismissed', expiry);
    setDismissed(true);
  };
  
  // Clean up expired dismissals
  useEffect(() => {
    const dismissedUntil = localStorage.getItem('profile-warning-dismissed');
    if (dismissedUntil && Number(dismissedUntil) < new Date().getTime()) {
      localStorage.removeItem('profile-warning-dismissed');
      setDismissed(false);
    }
  }, []);
  
  // Don't show if loading, dismissed, or no need to complete profile
  if (isLoading || dismissed || !user || !user.needsProfileCompletion) {
    return null;
  }
  
  return (
    <Alert className="fixed bottom-4 right-4 w-80 z-50 bg-yellow-50 border-yellow-300 shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <AlertTitle className="text-yellow-800">Complete Your Profile</AlertTitle>
          <AlertDescription className="text-yellow-700 mt-1">
            Please update your profile information to fully use the system.
          </AlertDescription>
          
          <Button 
            asChild 
            className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            <Link to="/profile">Update Profile</Link>
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 rounded-full"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4 text-yellow-700" />
        </Button>
      </div>
    </Alert>
  );
};

export default ProfileWarning;