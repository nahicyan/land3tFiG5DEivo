// client/src/components/hooks/useAuth.js
import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { checkUserExists, syncAuth0User } from '@/utils/api';

export function useAuth() {
  const {
    isAuthenticated,
    isLoading: auth0Loading,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();
  
  const [userRoles, setUserRoles] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
  const [needsProfileCompletion, setNeedsProfileCompletion] = useState(false);
  const [rolesLoaded, setRolesLoaded] = useState(false);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);
  const [token, setToken] = useState(null);
  const [tokenLoaded, setTokenLoaded] = useState(false);

  // Calculate admin/agent status from roles
  const { isAdmin, isAgent } = useMemo(() => {
    return {
      isAdmin: userRoles.includes('Admin'),
      isAgent: userRoles.includes('Agent')
    };
  }, [userRoles]);
  
  // Extract roles from user object
  useEffect(() => {
    if (user) {
      console.log('Auth0 user object:', user);
      
      // Find roles in the user object
      const AUTH0_NAMESPACE = 'https://landivo.com';
      let roles = [];
      
      // Try different places where roles might be stored
      if (user[`${AUTH0_NAMESPACE}/roles`]) {
        roles = user[`${AUTH0_NAMESPACE}/roles`];
        console.log(`Found roles in ${AUTH0_NAMESPACE}/roles:`, roles);
      } else if (user.roles) {
        roles = user.roles;
        console.log('Found roles in user.roles:', roles); 
      } else if (user[AUTH0_NAMESPACE] && user[AUTH0_NAMESPACE].roles) {
        roles = user[AUTH0_NAMESPACE].roles;
        console.log(`Found roles in ${AUTH0_NAMESPACE}.roles:`, roles);
      } else {
        console.log('No roles found in user object');
      }
      
      // Set roles in state
      setUserRoles(roles);
      setRolesLoaded(true);
    } else if (!auth0Loading) {
      setUserRoles([]);
      setRolesLoaded(true);
    }
  }, [user, auth0Loading]);

  // Get the token and extract permissions from it
  useEffect(() => {
    const fetchTokenAndPermissions = async () => {
      if (isAuthenticated) {
        try {
          const accessToken = await getAccessTokenSilently();
          setToken(accessToken);
          
          // Extract permissions from the token
          const tokenParts = accessToken.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            console.log('Access token payload:', payload);
            
            // Look for permissions in the token payload
            let permissions = [];
            
            // Check for permissions at root level first (this is where they are in your token)
            if (payload.permissions && Array.isArray(payload.permissions)) {
              permissions = payload.permissions;
              console.log('Found permissions in token payload:', permissions);
            } 
            // Also check namespace locations as fallback
            else {
              const AUTH0_NAMESPACE = 'https://landivo.com';
              if (payload[`${AUTH0_NAMESPACE}/permissions`]) {
                permissions = payload[`${AUTH0_NAMESPACE}/permissions`];
                console.log(`Found permissions in ${AUTH0_NAMESPACE}/permissions:`, permissions);
              } else if (payload[AUTH0_NAMESPACE] && payload[AUTH0_NAMESPACE].permissions) {
                permissions = payload[AUTH0_NAMESPACE].permissions;
                console.log(`Found permissions in ${AUTH0_NAMESPACE}.permissions:`, permissions);
              } else {
                console.log('No permissions found in token payload');
              }
            }
            
            setUserPermissions(permissions);
          }
          
          setTokenLoaded(true);
          setPermissionsLoaded(true);
          console.log('Fetched auth token successfully');
        } catch (error) {
          console.error('Error fetching token:', error);
          setTokenLoaded(true);
          setPermissionsLoaded(true);
        }
      } else if (!auth0Loading) {
        setToken(null);
        setUserPermissions([]);
        setTokenLoaded(true);
        setPermissionsLoaded(true);
      }
    };
    
    fetchTokenAndPermissions();
  }, [isAuthenticated, getAccessTokenSilently, auth0Loading]);

  // Check if user exists in our database and create if needed
  useEffect(() => {
    const checkUserInDatabase = async () => {
      if (isAuthenticated && user?.sub && (userRoles.length > 0 || userPermissions.length > 0)) {
        try {
          // Try to find user in database
          const dbUser = await checkUserExists(user.sub);
          
          if (dbUser) {
            // User exists, check if profile is complete
            setNeedsProfileCompletion(!dbUser.firstName || !dbUser.lastName);
            console.log('User exists in database, profile complete:', !!dbUser.firstName && !!dbUser.lastName);
          } else {
            // User with roles/permissions doesn't exist in database, create them
            // Extract name components if available
            const names = user.name ? user.name.split(' ') : [];
            // Check if name looks like an email
            const nameIsEmail = user.name && user.name.includes('@');
            const firstName = nameIsEmail ? '' : (user.given_name || (names.length > 0 ? names[0] : ''));
            const lastName = nameIsEmail ? '' : (user.family_name || (names.length > 1 ? names.slice(1).join(' ') : ''));
            
            // Create user in database
            try {
              const result = await syncAuth0User({
                auth0Id: user.sub,
                email: user.email,
                firstName,
                lastName
              });
              
              console.log('Created user in database:', result);
              
              // Check if profile is complete
              setNeedsProfileCompletion(!firstName || !lastName);
            } catch (syncError) {
              console.error('Error creating user in database:', syncError);
              setNeedsProfileCompletion(true);
            }
          }
        } catch (error) {
          console.error('Error checking user in database:', error);
        }
      }
    };
    
    // Only run when authenticated and permissions/roles are loaded
    if (isAuthenticated && rolesLoaded && permissionsLoaded) {
      checkUserInDatabase();
    }
  }, [isAuthenticated, user, userRoles, userPermissions, rolesLoaded, permissionsLoaded]);

  // Function to get auth token for API calls
  const getToken = useCallback(async () => {
    if (!isAuthenticated) return null;
    
    try {
      // If we already have a token, return it
      if (token) return token;
      
      // Otherwise, fetch a new one
      const newToken = await getAccessTokenSilently();
      setToken(newToken);
      return newToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }, [isAuthenticated, getAccessTokenSilently, token]);

  // Combined loading state
  const isLoading = auth0Loading || !rolesLoaded || !permissionsLoaded || !tokenLoaded;

  return {
    isAuthenticated,
    isLoading,
    user: user ? { ...user, needsProfileCompletion } : null,
    userRoles,
    userPermissions,
    isAdmin,
    isAgent,
    needsProfileCompletion,
    loginWithRedirect,
    logout,
    getToken,
  };
}