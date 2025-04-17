// client/src/utils/apiInterceptor.js
import { api } from './api';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';

/**
 * Hook to set up axios interceptors that automatically add the Auth0 token
 * to all outgoing requests to the API
 */
export function useApiAuthInterceptor() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  
  useEffect(() => {
    // Set up request interceptor to add token
    const interceptorId = api.interceptors.request.use(
      async (config) => {
        // Only add the token if the user is authenticated
        if (isAuthenticated) {
          try {
            // Get a fresh token for each request
            const token = await getAccessTokenSilently();
            if (token) {
              // Add the token to the request headers
              config.headers.Authorization = `Bearer ${token}`;
              console.log(`Added auth token to request: ${config.url}`);
            }
          } catch (error) {
            console.error('Error getting access token for request:', error);
            // Let the request proceed without the token
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Clean up function to remove the interceptor when the component unmounts
    return () => {
      api.interceptors.request.eject(interceptorId);
    };
  }, [getAccessTokenSilently, isAuthenticated]);
  
  // No need to return anything, the interceptor works automatically
}

// Usage example:
// 1. Import this hook in your App.jsx component
// 2. Call it at the top level to set up the interceptors for all api calls
// function App() {
//   useApiAuthInterceptor();
//   return (/* your app components */);
// }