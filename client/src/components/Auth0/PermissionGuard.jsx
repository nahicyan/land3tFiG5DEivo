// client/src/components/Auth0/PermissionGuard.jsx
import React from 'react';
import { usePermissions } from './PermissionsContext';

/**
 * Component that conditionally renders children based on user permissions
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Content to render if permission check passes
 * @param {string} [props.permission] - Single permission to check
 * @param {string[]} [props.permissions] - Array of permissions to check (if requireAll=false, any will pass; if requireAll=true, all are required)
 * @param {boolean} [props.requireAll=false] - If true, user must have all permissions in the array
 * @param {ReactNode} [props.fallback=null] - Content to render if permission check fails
 * @returns {ReactNode} Either children or fallback based on permission check
 */
const PermissionGuard = ({ 
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

export default PermissionGuard;