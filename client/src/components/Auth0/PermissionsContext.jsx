// client/src/components/Auth0/PermissionsContext.jsx
import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from '@/components/hooks/useAuth';
import { hasPermission, hasAnyPermission, hasAllPermissions, PERMISSIONS } from '@/utils/permissions';

// Create context
const PermissionsContext = createContext({
  permissions: [],
  hasPermission: () => false,
  hasAnyPermission: () => false,
  hasAllPermissions: () => false,
  check: {
    canReadUsers: false,
    canWriteUsers: false,
    canDeleteUsers: false,
    canReadProperties: false,
    canWriteProperties: false,
    canDeleteProperties: false,
    canReadBuyers: false,
    canWriteBuyers: false,
    canDeleteBuyers: false,
    canReadOffers: false,
    canWriteOffers: false,
    canDeleteOffers: false,
    canReadQualifications: false,
    canWriteQualifications: false,
    canAccessAdmin: false,
  },
});

// Provider component
export const PermissionsProvider = ({ children }) => {
  const { userPermissions } = useAuth();
  
  // Create a memo with permission check methods
  const value = useMemo(() => {
    // Create common permission check functions
    const permissionHelpers = {
      permissions: userPermissions,
      hasPermission: (permission) => hasPermission(userPermissions, permission),
      hasAnyPermission: (permissions) => hasAnyPermission(userPermissions, permissions),
      hasAllPermissions: (permissions) => hasAllPermissions(userPermissions, permissions),
    };
    
    // Create boolean flags for common permission checks
    const check = {
      canReadUsers: hasPermission(userPermissions, PERMISSIONS.READ_USERS),
      canWriteUsers: hasPermission(userPermissions, PERMISSIONS.WRITE_USERS),
      canDeleteUsers: hasPermission(userPermissions, PERMISSIONS.DELETE_USERS),
      canReadProperties: hasPermission(userPermissions, PERMISSIONS.READ_PROPERTIES),
      canWriteProperties: hasPermission(userPermissions, PERMISSIONS.WRITE_PROPERTIES),
      canDeleteProperties: hasPermission(userPermissions, PERMISSIONS.DELETE_PROPERTIES),
      canReadBuyers: hasPermission(userPermissions, PERMISSIONS.READ_BUYERS),
      canWriteBuyers: hasPermission(userPermissions, PERMISSIONS.WRITE_BUYERS),
      canDeleteBuyers: hasPermission(userPermissions, PERMISSIONS.DELETE_BUYERS),
      canReadOffers: hasPermission(userPermissions, PERMISSIONS.READ_OFFERS),
      canWriteOffers: hasPermission(userPermissions, PERMISSIONS.WRITE_OFFERS),
      canDeleteOffers: hasPermission(userPermissions, PERMISSIONS.DELETE_OFFERS),
      canReadQualifications: hasPermission(userPermissions, PERMISSIONS.READ_QUALIFICATIONS),
      canWriteQualifications: hasPermission(userPermissions, PERMISSIONS.WRITE_QUALIFICATIONS),
      canAccessAdmin: hasPermission(userPermissions, PERMISSIONS.ACCESS_ADMIN),
    };
    
    return {
      ...permissionHelpers,
      check,
    };
  }, [userPermissions]);
  
  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};

// Custom hook for accessing the context
export const usePermissions = () => useContext(PermissionsContext);

// Conditional wrapper component for permission-based rendering
export const Permissioned = ({ 
  children, 
  permission,
  permissions,
  requireAll = false,
  fallback = null 
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();
  
  let hasAccess = false;
  
  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions) {
    hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }
  
  return hasAccess ? children : fallback;
};