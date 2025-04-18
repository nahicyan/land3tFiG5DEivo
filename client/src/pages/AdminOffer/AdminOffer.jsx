// client/src/pages/AdminOffers/AdminOffers.jsx
import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { toast } from "react-toastify";

// Components
import OfferStats from "@/components/OfferManagement/OfferStats";
import OfferFilterForm from "@/components/OfferManagement/OfferFilterForm";
import AdminOfferTable from "@/components/OfferManagement/AdminOfferTable";

// UI Components
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, RefreshCw } from "lucide-react";

// API functions
const fetchOfferStats = async () => {
  const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/buyer/offers/stats`);
  return data;
};

const fetchAllOffers = async (filters = {}) => {
  // Build query params
  const params = new URLSearchParams();
  
  if (filters.status && filters.status !== 'ALL') {
    params.append('status', filters.status);
  }
  
  if (filters.search) {
    params.append('search', filters.search);
  }
  
  if (filters.startDate) {
    params.append('startDate', filters.startDate);
  }
  
  if (filters.endDate) {
    params.append('endDate', filters.endDate);
  }
  
  const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/buyer/offers/all?${params.toString()}`);
  return data;
};

const updateOffer = async ({ id, status, counterPrice }) => {
  const { data } = await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/buyer/offers/${id}`, {
    offerStatus: status,
    counterPrice
  });
  return data;
};

export default function AdminOffers() {
  // State for filters
  const [filters, setFilters] = useState({
    status: 'ALL',
    search: '',
    startDate: '',
    endDate: ''
  });
  
  // State to track applied filters
  const [appliedFilters, setAppliedFilters] = useState(filters);
  
  // Fetch offer stats
  const { 
    data: statsData, 
    isLoading: statsLoading, 
    refetch: refetchStats 
  } = useQuery('offerStats', fetchOfferStats, {
    // Handle errors gracefully
    onError: () => {
      toast.error("Failed to load offer statistics");
      return { total: 0, byStatus: {} };
    }
  });
  
  // Fetch offers with applied filters
  const { 
    data: offersData, 
    isLoading: offersLoading, 
    refetch: refetchOffers 
  } = useQuery(
    ['offers', appliedFilters], 
    () => fetchAllOffers(appliedFilters),
    {
      onError: () => {
        toast.error("Failed to load offers");
        return { offers: [] };
      }
    }
  );
  
  // Handle applying filters
  const handleApplyFilters = () => {
    setAppliedFilters({...filters});
  };
  
  // Handle resetting filters
  const handleResetFilters = () => {
    const resetFilters = {
      status: 'ALL',
      search: '',
      startDate: '',
      endDate: ''
    };
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
  };
  
  // Handle updating an offer
  const handleUpdateOffer = async (id, status, counterPrice = null) => {
    try {
      await updateOffer({ id, status, counterPrice });
      // Refetch data after update
      refetchOffers();
      refetchStats();
      toast.success(`Offer successfully ${status.toLowerCase()}`);
    } catch (error) {
      toast.error(`Error updating offer: ${error.response?.data?.message || error.message}`);
    }
  };
  
  // Handle refreshing data
  const handleRefreshData = () => {
    refetchOffers();
    refetchStats();
    toast.info('Refreshing offer data...');
  };
  
  // Handle exporting to CSV
  const handleExportToCsv = () => {
    if (!offersData?.offers || offersData.offers.length === 0) {
      toast.warn("No data to export");
      return;
    }
    
    // Create CSV content
    const headers = ['Property', 'Buyer Name', 'Buyer Email', 'Offer Price', 'Status', 'Date'];
    const rows = offersData.offers.map(offer => [
      offer.property ? `${offer.property.title || "Property"} (${offer.propertyId})` : `ID: ${offer.propertyId}`,
      `${offer.buyer?.firstName || ""} ${offer.buyer?.lastName || ""}`,
      offer.buyer?.email || "",
      offer.offeredPrice,
      offer.offerStatus || 'PENDING',
      new Date(offer.timestamp).toLocaleDateString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => 
        typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
      ).join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `offers_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-white">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#324c48] mb-2">Offer Management</h1>
            <p className="text-[#324c48] mb-2">
              View and manage property offers, track status, and respond to buyers
            </p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button 
              variant="outline" 
              className="flex items-center"
              onClick={handleRefreshData}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button 
              className="bg-[#324c48] hover:bg-[#3f4f24] text-white flex items-center"
              onClick={handleExportToCsv}
              disabled={!offersData?.offers || offersData.offers.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        {statsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <OfferStats stats={statsData || { total: 0, byStatus: {} }} />
        )}

        {/* Filters Section */}
        <div className="mt-6">
          <OfferFilterForm
            filters={filters}
            setFilters={setFilters}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Offers Table */}
        <div className="mt-6">
          <AdminOfferTable
            offers={offersData?.offers || []}
            isLoading={offersLoading}
            onUpdateOffer={handleUpdateOffer}
          />
        </div>
      </div>
    </div>
  );
}