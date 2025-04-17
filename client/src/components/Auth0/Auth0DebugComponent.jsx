// client/src/components/Auth0/Auth0DebugComponent.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/hooks/useAuth';
import { useAuthApi } from '@/utils/authApi';

export default function Auth0DebugComponent() {
  const { 
    isAuthenticated, 
    isLoading, 
    user, 
    userRoles, 
    userPermissions,
    getToken,
    isAdmin,
    isAgent 
  } = useAuth();
  
  const api = useAuthApi();
  const [token, setToken] = useState(null);
  const [apiTestResult, setApiTestResult] = useState(null);
  const [apiTestError, setApiTestError] = useState(null);
  
  // Get token for display
  useEffect(() => {
    const fetchToken = async () => {
      if (isAuthenticated) {
        try {
          const accessToken = await getToken();
          // Show only the first and last few characters for security
          if (accessToken) {
            const tokenStart = accessToken.substring(0, 10);
            const tokenEnd = accessToken.substring(accessToken.length - 5);
            setToken(`${tokenStart}...${tokenEnd}`);
          }
        } catch (error) {
          console.error('Error fetching token for debug:', error);
        }
      }
    };
    
    fetchToken();
  }, [isAuthenticated, getToken]);
  
  // Function to test API access
  const testApiAccess = async () => {
    try {
      setApiTestResult(null);
      setApiTestError(null);
      
      const result = await api.get('/user/all');
      setApiTestResult(result);
    } catch (error) {
      setApiTestError(error.response?.data || error.message);
    }
  };
  
  if (isLoading) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-300 rounded-md">
        <p className="text-blue-700">Loading authentication data...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-300 rounded-md">
        <p className="text-amber-700">You are not authenticated.</p>
      </div>
    );
  }
  
  return (
    <div className="p-4 bg-green-50 border border-green-300 rounded-md">
      <h2 className="text-lg font-bold text-green-800 mb-2">Auth0 Debug Information</h2>
      
      <div className="mb-3">
        <p className="text-sm text-gray-600">User Information:</p>
        <p className="text-green-700">
          <strong>Name:</strong> {user?.name || 'N/A'}
        </p>
        <p className="text-green-700">
          <strong>Email:</strong> {user?.email || 'N/A'}
        </p>
      </div>
      
      <div className="mb-3">
        <p className="text-sm text-gray-600">Roles Information:</p>
        <p className="text-green-700">
          <strong>User Roles:</strong> {userRoles.length ? userRoles.join(', ') : 'No roles found'}
        </p>
        <p className="text-green-700">
          <strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}
        </p>
        <p className="text-green-700">
          <strong>Is Agent:</strong> {isAgent ? 'Yes' : 'No'}
        </p>
      </div>
      
      <div className="mb-3">
        <p className="text-sm text-gray-600">Permissions Information:</p>
        <p className="text-green-700">
          <strong>User Permissions:</strong> {userPermissions.length ? userPermissions.join(', ') : 'No permissions found'}
        </p>
      </div>
      
      <div className="mb-3">
        <p className="text-sm text-gray-600">Authentication Token:</p>
        <p className="text-green-700 text-xs">
          <strong>Token:</strong> {token || 'No token available'}
        </p>
      </div>
      
      <div className="mb-3">
        <button 
          onClick={testApiAccess}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Test API Access
        </button>
        
        {apiTestResult && (
          <div className="mt-2 p-2 bg-blue-100 rounded">
            <p className="text-blue-800 font-semibold">API Test Successful!</p>
            <p className="text-blue-700 text-sm">
              Retrieved {Array.isArray(apiTestResult) ? apiTestResult.length : 'data'} from API
            </p>
          </div>
        )}
        
        {apiTestError && (
          <div className="mt-2 p-2 bg-red-100 rounded">
            <p className="text-red-800 font-semibold">API Test Failed!</p>
            <p className="text-red-700 text-sm">
              Error: {typeof apiTestError === 'string' ? apiTestError : JSON.stringify(apiTestError)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}