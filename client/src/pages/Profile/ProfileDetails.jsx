// client/src/pages/Profile/ProfileDetails.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const ProfileDetails = ({ 
  user, 
  dbUserData,
  profileData,
  setProfileData,
  isEditing,
  setIsEditing,
  handleSubmit,
  isSubmitting,
  updateSuccess,
  profileError,
  isLoading
}) => {
  // Show loading skeleton while fetching user data
  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="firstName" className="text-sm font-medium text-text-500">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={profileData.firstName}
              onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="lastName" className="text-sm font-medium text-text-500">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={profileData.lastName}
              onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
              className="mt-1"
              required
            />
          </div>
          
          <div className="flex space-x-2 pt-2">
            <Button 
              type="submit" 
              className="bg-[#000] hover:[#030001]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Profile"}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
          
          {updateSuccess && (
            <Alert className="mt-4 bg-green-50 border-green-200">
              <AlertTitle className="text-green-800">Success!</AlertTitle>
              <AlertDescription className="text-green-700">
                Your profile has been updated successfully.
              </AlertDescription>
            </Alert>
          )}
          
          {profileError && (
            <Alert className="mt-4 bg-red-50 border-red-200">
              <AlertTitle className="text-red-800">Error</AlertTitle>
              <AlertDescription className="text-red-700">
                {profileError}
              </AlertDescription>
            </Alert>
          )}
        </form>
      ) : (
        <>
          <div>
            <h3 className="text-sm font-medium text-text-500 mb-2">Name</h3>
            <p className="text-text-700">
              {dbUserData?.firstName || profileData.firstName || "Not set"} {dbUserData?.lastName || profileData.lastName || ""}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-text-500 mb-2">Email</h3>
            <p className="text-text-700">{user?.email}</p>
          </div>
          
          <Button
            onClick={() => setIsEditing(true)}
            className="mt-4"
            variant="outline"
          >
            Edit Profile
          </Button>
        </>
      )}

      <div>
        <h3 className="text-sm font-medium text-text-500 mb-2">Email Verification</h3>
        {user.email_verified ? (
          <Badge className="bg-primary-100 text-primary-800 hover:bg-primary-100">
            Verified
          </Badge>
        ) : (
          <Badge className="bg-accent-100 text-accent-800 hover:bg-accent-100">
            Not Verified
          </Badge>
        )}
      </div>

      {user.nickname && (
        <div>
          <h3 className="text-sm font-medium text-text-500 mb-2">Nickname</h3>
          <p className="text-text-700">{user.nickname}</p>
        </div>
      )}

      {user.locale && (
        <div>
          <h3 className="text-sm font-medium text-text-500 mb-2">Locale</h3>
          <p className="text-text-700">{user.locale}</p>
        </div>
      )}
    </div>
  );
};

export default ProfileDetails;