// client/src/components/Auth0/Auth0Provider.jsx
import React, { useEffect } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

export const Auth0ProviderWithNavigate = ({ children }) => {
  const navigate = useNavigate();
  
  // Log auth0 configuration on load (sanitized for security)
  useEffect(() => {
    console.log('Auth0 Provider Configuration:', {
      domain: import.meta.env.VITE_AUTH0_DOMAIN ? 'configured' : 'missing',
      clientId: import.meta.env.VITE_AUTH0_CLIENT_ID ? 'configured' : 'missing',
      audience: import.meta.env.VITE_AUTH0_AUDIENCE ? 'configured' : 'missing',
      redirectUri: window.location.origin
    });
  }, []);

  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  // Ensure all required properties are present
  if (!import.meta.env.VITE_AUTH0_DOMAIN || 
      !import.meta.env.VITE_AUTH0_CLIENT_ID || 
      !import.meta.env.VITE_AUTH0_AUDIENCE) {
    console.error('Auth0 configuration incomplete. Check your environment variables.');
    return (
      <div className="p-4 bg-red-50 border border-red-300 rounded-md mt-4">
        <h2 className="text-lg font-bold text-red-700">Auth0 Configuration Error</h2>
        <p className="text-red-600">
          Authentication is not properly configured. Please check your environment variables.
        </p>
      </div>
    );
  }

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        scope: "openid profile email",
        audience: import.meta.env.VITE_AUTH0_AUDIENCE
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};