// client/src/pages/Profile/Profile.jsx
import React, { useState, useEffect } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { useAuth } from '@/components/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useUserProfileApi } from '@/utils/api';
import { useVipBuyer } from '@/utils/VipBuyerContext';

import ProfileHeader from './ProfileHeader';
import ProfileDetails from './ProfileDetails';
import VipBuyerSection from './VipBuyerSection';
import UserRolesSection from './UserRolesSection';
import PermissionsDisplay from './PermissionsDisplay';
import ProfileSkeleton from './ProfileSkeleton';
import BuyerOffersTable from './BuyerOffersTable';
import BuyerQualificationsTable from './BuyerQualificationsTable';

const Profile = () => {
  const { user, isLoading, isAuthenticated } = useAuth0();
  const { userRoles, userPermissions } = useAuth();
  const { getUserProfile, updateUserProfile } = useUserProfileApi();
  const { isVipBuyer } = useVipBuyer();

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [dbUserData, setDbUserData] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Check if user is a system user (has roles or permissions)
  const isSystemUser = userRoles.length > 0 || userPermissions.length > 0;

  // Load user profile data only for system users
  useEffect(() => {
    const loadUserProfile = async () => {
      // Only attempt to load profile data for system users, not VIP buyers without roles
      if (isAuthenticated && user?.sub && isSystemUser) {
        try {
          setIsLoadingProfile(true);
          setProfileError(null);
          const userProfile = await getUserProfile();
          if (userProfile) {
            setDbUserData(userProfile);
            setProfileData({
              firstName: userProfile.firstName || '',
              lastName: userProfile.lastName || ''
            });
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
          // Don't show the error for VIP buyers who don't have system profiles
          if (isSystemUser) {
            setProfileError("Unable to load your profile information. Please try again later.");
          }
        } finally {
          setIsLoadingProfile(false);
        }
      }
    };

    loadUserProfile();
  }, [isAuthenticated, user, getUserProfile, isSystemUser]);

  // Handle profile form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUpdateSuccess(false);
    setProfileError(null);

    try {
      await updateUserProfile(profileData);
      setUpdateSuccess(true);
      setIsEditing(false);

      // Update local data
      setDbUserData({
        ...dbUserData,
        firstName: profileData.firstName,
        lastName: profileData.lastName
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      setProfileError("Failed to update your profile. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] bg-background/50">
        <Card className="w-full max-w-md shadow-md">
          <div className="pt-6 pb-6 text-center">
            <h2 className="text-xl font-semibold text-text-700">Not Logged In</h2>
            <p className="mt-2 text-text-500">Please log in to view your profile</p>
          </div>
        </Card>
      </div>
    );
  }

  // Show error message if profile loading failed for system users
  if (profileError && !isLoading && isSystemUser) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Alert className="bg-red-50 border-red-200">
          <AlertTitle className="text-red-800">Error Loading Profile</AlertTitle>
          <AlertDescription className="text-red-700">
            {profileError}
          </AlertDescription>
          <div className="mt-4">
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Retry
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Card className="w-full shadow-lg overflow-hidden bg-background">
        <ProfileHeader
          user={user}
          dbUserData={dbUserData}
        />

        {/* Profile Main Content */}
        <div className="px-6 py-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            {/* Only show ProfileDetails for system users or show a simplified version for VIP buyers */}
            {isSystemUser ? (
              <ProfileDetails
                user={user}
                dbUserData={dbUserData}
                profileData={profileData}
                setProfileData={setProfileData}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                updateSuccess={updateSuccess}
                profileError={profileError}
                isLoading={isLoadingProfile}
              />
            ) : (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-medium text-text-500 mb-2">Email</h3>
                  <p className="text-text-700">{user?.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-text-500 mb-2">Email Verification</h3>
                  <p className="text-text-700">{user.email_verified ? "Verified" : "Not Verified"}</p>
                </div>
                {user.nickname && (
                  <div>
                    <h3 className="text-sm font-medium text-text-500 mb-2">Nickname</h3>
                    <p className="text-text-700">{user.nickname}</p>
                  </div>
                )}
              </div>
            )}

            {/* Right Column */}
            <UserRolesSection
              user={user}
              userRoles={userRoles}
            />
          </div>

          {/* VIP Badge section - will show up for VIP buyers */}
          <VipBuyerSection />

          {/* Permissions Section - only for system users */}
          {isSystemUser && (
            <PermissionsDisplay
              userPermissions={userPermissions}
            />
          )}
          
          {/* VIP Buyer Activity Tables - show only for VIP buyers */}
          {isVipBuyer && (
            <div className="mt-8 space-y-6">
              <h2 className="text-xl font-semibold">My Activity</h2>
              
              {/* Offers Table */}
              <BuyerOffersTable />
              
              {/* Qualifications Table */}
              <BuyerQualificationsTable />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Profile;