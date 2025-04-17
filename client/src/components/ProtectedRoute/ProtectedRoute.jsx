// client/src/components/ProtectedRoute/ProtectedRoute.jsx
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/hooks/useAuth';

/**
 * Protected route component that checks for authentication and authorization
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - The protected content
 * @param {string[]} [props.requiredPermissions=[]] - Permissions required to access this route
 * @param {boolean} [props.fallbackToRoles=true] - Whether to fall back to role-based checks if permission check fails
 * @param {string[]} [props.allowedRoles=[]] - Roles allowed to access this route (used if fallbackToRoles is true)
 * @returns {ReactNode} Protected content or redirect
 */
const ProtectedRoute = ({ 
  children, 
  requiredPermissions = [], 
  fallbackToRoles = true, 
  allowedRoles = [] 
}) => {
  const { 
    isAuthenticated, 
    isLoading, 
    userRoles, 
    userPermissions, 
    user 
  } = useAuth();
  const location = useLocation();

  // Create a detailed loading message for debugging
  const getLoadingMessage = () => {
    if (!user) return "Waiting for user information...";
    if (!userPermissions || userPermissions.length === 0) return "Waiting for permission information...";
    return "Verifying access...";
  };

  // Debug logging
  useEffect(() => {
    console.log('ProtectedRoute render:', {
      path: location.pathname,
      isAuthenticated,
      isLoading,
      userRoles,
      allowedRoles,
      userPermissions,
      requiredPermissions,
      user: user ? `${user.name} (${user.email})` : 'No user'
    });

    if (!isLoading) {
      // Check permissions first
      if (requiredPermissions.length > 0) {
        const hasPermission = userPermissions.some(perm => requiredPermissions.includes(perm));
        console.log(`Permission check: ${hasPermission ? 'GRANTED' : 'DENIED'} - User permissions: [${userPermissions.join(', ')}], Required permissions: [${requiredPermissions.join(', ')}]`);
      }
      
      // Fall back to roles if needed
      if (fallbackToRoles && allowedRoles.length > 0) {
        const hasRole = userRoles.some(role => allowedRoles.includes(role));
        console.log(`Role fallback check: ${hasRole ? 'GRANTED' : 'DENIED'} - User roles: [${userRoles.join(', ')}], Allowed roles: [${allowedRoles.join(', ')}]`);
      }
    }
  }, [isAuthenticated, isLoading, userRoles, allowedRoles, userPermissions, requiredPermissions, location.pathname, user, fallbackToRoles]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3f4f24] mb-4"></div>
        <p className="text-gray-600">{getLoadingMessage()}</p>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to home');
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  // Check permissions first
  let hasAccess = false;
  
  // If permission check is required
  if (requiredPermissions.length > 0) {
    hasAccess = userPermissions.some(perm => requiredPermissions.includes(perm));
  } 
  // If permission check fails, fall back to role check if fallbackToRoles is true
  else if (!hasAccess && fallbackToRoles && allowedRoles.length > 0) {
    hasAccess = userRoles.some(role => allowedRoles.includes(role));
  }
  // If no specific permissions or roles are required, grant access
  else if (requiredPermissions.length === 0 && (!fallbackToRoles || allowedRoles.length === 0)) {
    hasAccess = true;
  }
  
  if (!hasAccess) {
    console.log('User lacks required permissions/roles, redirecting to unauthorized');
    // Redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }
  
  // User is authenticated and authorized
  return children;
};

export default ProtectedRoute;