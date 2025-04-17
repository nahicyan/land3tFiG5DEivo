// client/src/utils/permissions.js

/**
 * Permission definitions for the Landivo application
 * These should match the permissions configured in Auth0
 */

export const PERMISSIONS = {
    // User management permissions
    READ_USERS: 'read:users',
    WRITE_USERS: 'write:users',
    DELETE_USERS: 'delete:users',
    
    // Property management permissions
    READ_PROPERTIES: 'read:properties',
    WRITE_PROPERTIES: 'write:properties',
    DELETE_PROPERTIES: 'delete:properties',
    
    // Buyer management permissions
    READ_BUYERS: 'read:buyers',
    WRITE_BUYERS: 'write:buyers',
    DELETE_BUYERS: 'delete:buyers',
    
    // Offer management permissions
    READ_OFFERS: 'read:offers',
    WRITE_OFFERS: 'write:offers',
    DELETE_OFFERS: 'delete:offers',
    
    // Qualification management permissions
    READ_QUALIFICATIONS: 'read:qualifications',
    WRITE_QUALIFICATIONS: 'write:qualifications',
    
    // Admin access permission
    ACCESS_ADMIN: 'access:admin',
  };
  
  /**
   * Role to permission mappings
   * These show what permissions are typically assigned to each role
   * This is for reference only - actual permissions come from Auth0
   */
  export const ROLE_PERMISSIONS = {
    Admin: [
      PERMISSIONS.READ_USERS,
      PERMISSIONS.WRITE_USERS,
      PERMISSIONS.DELETE_USERS,
      PERMISSIONS.READ_PROPERTIES,
      PERMISSIONS.WRITE_PROPERTIES,
      PERMISSIONS.DELETE_PROPERTIES,
      PERMISSIONS.READ_BUYERS,
      PERMISSIONS.WRITE_BUYERS,
      PERMISSIONS.DELETE_BUYERS,
      PERMISSIONS.READ_OFFERS,
      PERMISSIONS.WRITE_OFFERS,
      PERMISSIONS.DELETE_OFFERS,
      PERMISSIONS.READ_QUALIFICATIONS,
      PERMISSIONS.WRITE_QUALIFICATIONS,
      PERMISSIONS.ACCESS_ADMIN,
    ],
    
    Agent: [
      PERMISSIONS.READ_PROPERTIES,
      PERMISSIONS.WRITE_PROPERTIES,
      PERMISSIONS.READ_BUYERS,
      PERMISSIONS.READ_OFFERS,
      PERMISSIONS.READ_QUALIFICATIONS,
    ],
    
    User: [
      PERMISSIONS.READ_PROPERTIES,
    ],
  };
  
  /**
   * Check if a user has a specific permission
   * @param {Array} userPermissions - Array of permission strings
   * @param {String} requiredPermission - Permission to check for
   * @returns {Boolean} - True if user has the permission
   */
  export const hasPermission = (userPermissions, requiredPermission) => {
    return userPermissions.includes(requiredPermission);
  };
  
  /**
   * Check if a user has any of the required permissions
   * @param {Array} userPermissions - Array of permission strings
   * @param {Array} requiredPermissions - Array of permissions to check for
   * @returns {Boolean} - True if user has any of the required permissions
   */
  export const hasAnyPermission = (userPermissions, requiredPermissions) => {
    return requiredPermissions.some(permission => userPermissions.includes(permission));
  };
  
  /**
   * Check if a user has all of the required permissions
   * @param {Array} userPermissions - Array of permission strings
   * @param {Array} requiredPermissions - Array of permissions to check for
   * @returns {Boolean} - True if user has all of the required permissions
   */
  export const hasAllPermissions = (userPermissions, requiredPermissions) => {
    return requiredPermissions.every(permission => userPermissions.includes(permission));
  };