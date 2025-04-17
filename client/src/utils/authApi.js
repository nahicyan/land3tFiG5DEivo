// client/src/utils/authApi.js
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect, useCallback } from 'react';

// Create a custom hook that returns authenticated API methods
export function useAuthApi() {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const [authAxios, setAuthAxios] = useState(null);
  const [isReady, setIsReady] = useState(false);
  
  // Create the authorized API instance
  useEffect(() => {
    // Don't try to create the instance until Auth0 is done loading
    if (isLoading) return;
    
    const instance = axios.create({
      baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
      withCredentials: true,
    });
    
    // Add request interceptor to add token to all requests
    instance.interceptors.request.use(
      async (config) => {
        if (isAuthenticated) {
          try {
            const token = await getAccessTokenSilently();
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
              console.log('Added auth token to request:', config.url);
            }
          } catch (error) {
            console.error('Error getting access token for request:', error);
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Add response interceptor for debugging
    instance.interceptors.response.use(
      (response) => {
        console.log(`API response ${response.config.method} ${response.config.url}:`, response.status);
        return response;
      },
      (error) => {
        console.error('API error:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data
        });
        return Promise.reject(error);
      }
    );
    
    setAuthAxios(instance);
    setIsReady(true);
  }, [getAccessTokenSilently, isAuthenticated, isLoading]);
  
  // Create API methods with better error handling
  const get = useCallback(async (url, options = {}) => {
    if (!authAxios) {
      console.error('API not ready yet');
      return null;
    }
    
    try {
      console.log(`Making GET request to ${url}`);
      const response = await authAxios.get(url, options);
      return response.data;
    } catch (error) {
      console.error(`GET ${url} failed:`, error.response?.data || error.message);
      throw error;
    }
  }, [authAxios]);
  
  const post = useCallback(async (url, data, options = {}) => {
    if (!authAxios) {
      console.error('API not ready yet');
      return null;
    }
    
    try {
      console.log(`Making POST request to ${url}`);
      const response = await authAxios.post(url, data, options);
      return response.data;
    } catch (error) {
      console.error(`POST ${url} failed:`, error.response?.data || error.message);
      throw error;
    }
  }, [authAxios]);
  
  const put = useCallback(async (url, data, options = {}) => {
    if (!authAxios) {
      console.error('API not ready yet');
      return null;
    }
    
    try {
      console.log(`Making PUT request to ${url}`);
      const response = await authAxios.put(url, data, options);
      return response.data;
    } catch (error) {
      console.error(`PUT ${url} failed:`, error.response?.data || error.message);
      throw error;
    }
  }, [authAxios]);
  
  const del = useCallback(async (url, options = {}) => {
    if (!authAxios) {
      console.error('API not ready yet');
      return null;
    }
    
    try {
      console.log(`Making DELETE request to ${url}`);
      const response = await authAxios.delete(url, options);
      return response.data;
    } catch (error) {
      console.error(`DELETE ${url} failed:`, error.response?.data || error.message);
      throw error;
    }
  }, [authAxios]);
  
  // Utility for form data submissions (file uploads)
  const postForm = useCallback(async (url, formData, options = {}) => {
    if (!authAxios) {
      console.error('API not ready yet');
      return null;
    }
    
    try {
      console.log(`Making POST FORM request to ${url}`);
      const response = await authAxios.post(url, formData, {
        ...options,
        headers: {
          ...options.headers,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`POST FORM ${url} failed:`, error.response?.data || error.message);
      throw error;
    }
  }, [authAxios]);
  
  return { 
    get, 
    post, 
    put, 
    delete: del, 
    postForm,
    isReady  // Add this to let components know when the API is ready
  };
}