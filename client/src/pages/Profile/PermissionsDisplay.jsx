// client/src/pages/Profile/PermissionsDisplay.jsx
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Key, Users, Home, User, FileText, Shield } from 'lucide-react';

const PermissionsDisplay = ({ userPermissions }) => {
  // Group permissions by category
  const permissionCategories = {
    user: userPermissions.filter(p => p.includes('user')),
    property: userPermissions.filter(p => p.includes('propert')),
    buyer: userPermissions.filter(p => p.includes('buyer')),
    offer: userPermissions.filter(p => p.includes('offer')),
    qualification: userPermissions.filter(p => p.includes('qualification')),
    admin: userPermissions.filter(p => p.includes('admin')),
    other: userPermissions.filter(p => 
      !p.includes('user') && 
      !p.includes('propert') && 
      !p.includes('buyer') && 
      !p.includes('offer') && 
      !p.includes('qualification') && 
      !p.includes('admin')
    )
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-text-800 flex items-center mb-4">
        <Key className="w-5 h-5 mr-2 text-secondary-600" />
        Permissions
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* User Permissions */}
        <PermissionCategory 
          title="User Management"
          icon={<Users className="w-4 h-4 mr-2 text-secondary-600" />}
          permissions={permissionCategories.user}
        />
        
        {/* Property Permissions */}
        <PermissionCategory 
          title="Property Management"
          icon={<Home className="w-4 h-4 mr-2 text-secondary-600" />}
          permissions={permissionCategories.property}
        />
        
        {/* Buyer Permissions */}
        <PermissionCategory 
          title="Buyer Management"
          icon={<User className="w-4 h-4 mr-2 text-secondary-600" />}
          permissions={permissionCategories.buyer}
        />
        
        {/* Offer Permissions */}
        <PermissionCategory 
          title="Offer Management"
          icon={<FileText className="w-4 h-4 mr-2 text-secondary-600" />}
          permissions={permissionCategories.offer}
        />
        
        {/* Qualification Permissions */}
        <PermissionCategory 
          title="Qualification Management"
          icon={<FileText className="w-4 h-4 mr-2 text-secondary-600" />}
          permissions={permissionCategories.qualification}
        />
        
        {/* Admin Permissions */}
        <PermissionCategory 
          title="Admin Access"
          icon={<Shield className="w-4 h-4 mr-2 text-secondary-600" />}
          permissions={permissionCategories.admin}
        />
        
        {/* Other Permissions */}
        <PermissionCategory 
          title="Other Permissions"
          icon={<Key className="w-4 h-4 mr-2 text-secondary-600" />}
          permissions={permissionCategories.other}
        />
        
        {/* No Permissions */}
        {userPermissions.length === 0 && (
          <div className="col-span-2 text-center py-4">
            <p className="text-text-400 italic">No permissions assigned</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Sub-component for displaying a category of permissions
const PermissionCategory = ({ title, icon, permissions }) => {
  if (permissions.length === 0) return null;
  
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-text-700 flex items-center">
        {icon}
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {permissions.map(perm => (
          <Badge 
            key={perm}
            className="bg-secondary-50 text-secondary-700 hover:bg-secondary-100"
          >
            {perm}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default PermissionsDisplay;