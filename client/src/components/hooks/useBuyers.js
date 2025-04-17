import { useState, useEffect, useCallback } from "react";
import { getAllBuyers } from "@/utils/api";
import { toast } from "react-toastify";

/**
 * Custom hook for managing buyer data
 * Handles fetching, filtering, and updating buyers
 */
export function useBuyer() {
  // State for buyers data
  const [buyers, setBuyers] = useState([]);
  const [availableBuyers, setAvailableBuyers] = useState([]);
  const [filteredBuyers, setFilteredBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    buyerType: "all",
    area: "all",
    source: "all"
  });

  // Fetch all buyers
  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        setLoading(true);
        const data = await getAllBuyers();
        setBuyers(data);
        setAvailableBuyers(data);
        setFilteredBuyers(data);
      } catch (err) {
        console.error("Error fetching buyers:", err);
        setError("Failed to load buyers");
        toast.error("Failed to load buyers");
      } finally {
        setLoading(false);
      }
    };

    fetchBuyers();
  }, []);

  // Update filtered buyers when filters change
  useEffect(() => {
    if (!buyers.length) return;

    let results = [...buyers];

    // Apply search filter
    if (filters.search) {
      const query = filters.search.toLowerCase();
      results = results.filter(buyer => 
        buyer.firstName.toLowerCase().includes(query) ||
        buyer.lastName.toLowerCase().includes(query) ||
        buyer.email.toLowerCase().includes(query) ||
        buyer.phone.includes(query)
      );
    }

    // Apply buyer type filter
    if (filters.buyerType !== "all") {
      results = results.filter(buyer => buyer.buyerType === filters.buyerType);
    }

    // Apply area filter
    if (filters.area !== "all") {
      const areaFilter = filters.area.toLowerCase();
      results = results.filter(buyer => 
        buyer.preferredAreas && buyer.preferredAreas.some(area => 
          area.toLowerCase() === areaFilter
        )
      );
    }

    // Apply source filter
    if (filters.source !== "all") {
      results = results.filter(buyer => buyer.source === filters.source);
    }

    setFilteredBuyers(results);
  }, [buyers, filters]);

  // Filter available buyers (those not already in a list)
  const filterAvailableBuyers = useCallback((listBuyerIds = []) => {
    if (!buyers.length) return;

    // Filter out buyers that are already in the list
    const filtered = buyers.filter(buyer => !listBuyerIds.includes(buyer.id));
    setAvailableBuyers(filtered);
  }, [buyers]);

  // Add buyers from CSV
  const addBuyersFromCsv = useCallback((csvBuyers) => {
    if (!csvBuyers || !csvBuyers.length) return;

    // Add the new buyers to the buyers list
    setBuyers(prev => {
      // Create a map of existing emails to avoid duplicates
      const existingEmails = new Map(prev.map(b => [b.email.toLowerCase(), b]));
      
      // Filter out duplicate emails
      const uniqueBuyers = csvBuyers.filter(b => !existingEmails.has(b.email.toLowerCase()));
      
      // Return combined array
      return [...prev, ...uniqueBuyers];
    });

    toast.success(`Added ${csvBuyers.length} buyers from CSV`);
  }, []);

  // Get buyers by IDs
  const getBuyersByIds = useCallback((buyerIds) => {
    if (!buyerIds || !buyerIds.length || !buyers.length) return [];
    return buyers.filter(buyer => buyerIds.includes(buyer.id));
  }, [buyers]);

  // Get buyers not in the given list
  const getBuyersNotInList = useCallback((listBuyerIds) => {
    if (!buyers.length) return [];
    return buyers.filter(buyer => !listBuyerIds.includes(buyer.id));
  }, [buyers]);

  return {
    buyers,
    availableBuyers,
    filteredBuyers,
    loading,
    error,
    filterAvailableBuyers,
    addBuyersFromCsv,
    getBuyersByIds,
    getBuyersNotInList,
    setFilters
  };
}

export default useBuyer;