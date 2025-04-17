// client/src/pages/Profile/ProfileHeader.jsx
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useVipBuyer } from '@/utils/VipBuyerContext';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Mail, User, LogOut } from 'lucide-react';

const ProfileHeader = ({ user, dbUserData }) => {
  const { logout } = useAuth0();
  const { isVipBuyer, vipBuyerData } = useVipBuyer();

  // Get display name with proper priority order
  const getDisplayName = () => {
    // First priority: Complete name from database user profile
    if (dbUserData?.firstName && dbUserData?.lastName) {
      return `${dbUserData.firstName} ${dbUserData.lastName}`;
    }
    
    // Second priority: Complete name from VIP buyer data
    if (isVipBuyer && vipBuyerData?.firstName && vipBuyerData?.lastName) {
      return `${vipBuyerData.firstName} ${vipBuyerData.lastName}`;
    }
    
    // Third priority: First name only from database
    if (dbUserData?.firstName) {
      return dbUserData.firstName;
    }
    
    // Fourth priority: First name only from VIP data
    if (isVipBuyer && vipBuyerData?.firstName) {
      return vipBuyerData.firstName;
    }
    
    // Fifth priority: Auth0 given_name and family_name
    if (user?.given_name && user?.family_name) {
      return `${user.given_name} ${user.family_name}`;
    }
    
    // Sixth priority: Auth0 name if not an email
    if (user?.name && !user.name.includes('@')) {
      return user.name;
    }
    
    // Final fallback: email or generic "User"
    return user?.email || 'User';
  };

  // Get email with priority
  const getEmailDisplay = () => {
    // Priority: Database email, VIP buyer email, Auth0 email
    return dbUserData?.email || (vipBuyerData?.email) || user?.email || '';
  };

  return (
    <>
      <div className="relative">
        {/* Background banner */}
        <div className="h-40 bg-gradient-to-r from-primary-600 to-secondary-600"></div>
        
        {/* User info with aligned profile picture */}
        <div className="px-6 pb-4 pt-4 flex flex-col md:flex-row md:items-end gap-4">
          {/* Profile picture */}
          <Avatar className="h-24 w-24 border-4 border-background mt-[-3rem] bg-white shadow-md">
            {user?.picture ? (
              <img
                src={user.picture}
                alt={getDisplayName()}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-14 w-14 text-gray-400" />
            )}
          </Avatar>
          
          {/* User name and email */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-text-800">
              {getDisplayName()}
            </h1>
            <div className="flex items-center mt-1 text-text-500">
              <Mail className="w-4 h-4 mr-2" />
              <span>{getEmailDisplay()}</span>
            </div>
          </div>
          
          {/* Logout Button */}
          <Button
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 whitespace-nowrap mt-2 md:mt-0"
            onClick={() => logout({
              logoutParams: { returnTo: window.location.origin }
            })}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
      <Separator />
    </>
  );
};

export default ProfileHeader;