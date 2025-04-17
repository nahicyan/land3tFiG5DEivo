// client/src/pages/Profile/UserRolesSection.jsx
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, CalendarClock } from 'lucide-react';

const UserRolesSection = ({ user, userRoles }) => {
  // Format the date when user signed up (if available)
  const createdAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : 'Not available';

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-medium text-text-500 mb-2">Authentication Method</h3>
        <Badge className="capitalize bg-secondary-100 text-secondary-700 hover:bg-secondary-100">
          {user.sub?.split('|')[0] || 'auth0'}
        </Badge>
      </div>

      <div>
        <h3 className="text-sm font-medium text-text-500 mb-2">Account Created</h3>
        <div className="flex items-center">
          <CalendarClock className="w-4 h-4 mr-2 text-text-400" />
          <p className="text-text-700">{createdAt}</p>
        </div>
      </div>

      {user.updated_at && (
        <div>
          <h3 className="text-sm font-medium text-text-500 mb-2">Last Updated</h3>
          <p className="text-text-700">
            {new Date(user.updated_at).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Roles */}
      <div>
        <h3 className="text-sm font-medium text-text-500 mb-2">
          <div className="flex items-center">
            <Shield className="w-4 h-4 mr-2 text-primary" />
            Roles
          </div>
        </h3>
        <div className="flex flex-wrap gap-2">
          {userRoles && userRoles.length > 0 ? (
            userRoles.map((role) => (
              <Badge 
                key={role}
                className="bg-primary-50 text-primary-700 hover:bg-primary-100"
              >
                {role}
              </Badge>
            ))
          ) : (
            <span className="text-text-400 text-sm italic">No roles assigned</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRolesSection;