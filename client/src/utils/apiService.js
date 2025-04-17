// client/src/utils/apiService.js
import { useAuthApi } from './authApi';

// Create service functions that use the authenticated API
export const useApiService = () => {
  const api = useAuthApi();
  
  // Users
  const getUsers = async () => {
    return await api.get('/user/all');
  };
  
  const getUserById = async (id) => {
    return await api.get(`/user/${id}`);
  };
  
  // Properties
  const getProperties = async () => {
    return await api.get('/residency/allresd');
  };
  
  const getPropertyById = async (id) => {
    return await api.get(`/residency/${id}`);
  };
  
  const createProperty = async (data) => {
    return await api.post('/residency/create', data);
  };
  
  const createPropertyWithFiles = async (formData) => {
    return await api.postForm('/residency/createWithFile', formData);
  };
  
  const updateProperty = async (id, data) => {
    return await api.put(`/residency/update/${id}`, data);
  };
  
  // Buyers
  const getBuyers = async () => {
    return await api.get('/buyer/all');
  };
  
  const getBuyerById = async (id) => {
    return await api.get(`/buyer/${id}`);
  };
  
  const createBuyer = async (data) => {
    return await api.post('/buyer/create', data);
  };
  
  const updateBuyer = async (id, data) => {
    return await api.put(`/buyer/update/${id}`, data);
  };
  
  const deleteBuyer = async (id) => {
    return await api.delete(`/buyer/delete/${id}`);
  };
  
  // Buyer Lists
  const getBuyerLists = async () => {
    return await api.get('/buyer-lists');
  };
  
  const getBuyerList = async (id) => {
    return await api.get(`/buyer-lists/${id}`);
  };
  
  const createBuyerList = async (data) => {
    return await api.post('/buyer-lists', data);
  };
  
  const updateBuyerList = async (id, data) => {
    return await api.put(`/buyer-lists/${id}`, data);
  };
  
  const deleteBuyerList = async (id) => {
    return await api.delete(`/buyer-lists/${id}`);
  };
  
  // Offers
  const makeOffer = async (data) => {
    return await api.post('/buyer/makeOffer', data);
  };
  
  const getPropertyOffers = async (propertyId) => {
    return await api.get(`/buyer/offers/property/${propertyId}`);
  };
  
  // Qualifications
  const submitQualification = async (data) => {
    return await api.post('/qualification/create', data);
  };
  
  const getPropertyQualifications = async (propertyId) => {
    return await api.get(`/qualification/property/${propertyId}`);
  };
  
  const getAllQualifications = async (page = 1, limit = 10, filters = {}) => {
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters
    });
    
    return await api.get(`/qualification/all?${queryParams}`);
  };
  
  return {
    // Users
    getUsers,
    getUserById,
    
    // Properties
    getProperties,
    getPropertyById,
    createProperty,
    createPropertyWithFiles,
    updateProperty,
    
    // Buyers
    getBuyers,
    getBuyerById,
    createBuyer,
    updateBuyer,
    deleteBuyer,
    
    // Buyer Lists
    getBuyerLists,
    getBuyerList,
    createBuyerList,
    updateBuyerList,
    deleteBuyerList,
    
    // Offers
    makeOffer,
    getPropertyOffers,
    
    // Qualifications
    submitQualification,
    getPropertyQualifications,
    getAllQualifications,
  };
};