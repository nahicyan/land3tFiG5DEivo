import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { 
  getBuyerLists, 
  getBuyerList,
  createBuyerList, 
  updateBuyerList, 
  deleteBuyerList, 
  addBuyersToList as addBuyersApi, 
  removeBuyersFromList as removeBuyersApi, 
  sendEmailToList 
} from "@/utils/api";

export function useBuyerLists() {
  const [lists, setLists] = useState([]);
  const [filteredLists, setFilteredLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
  });

  // Fetch all buyer lists
  useEffect(() => {
    const fetchLists = async () => {
      try {
        setLoading(true);
        const data = await getBuyerLists();
        setLists(data);
        setFilteredLists(data);
      } catch (err) {
        console.error("Error fetching buyer lists:", err);
        setError("Failed to load buyer lists");
        toast.error("Failed to load buyer lists");
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, []);

  // Apply filters when filters or lists change
  useEffect(() => {
    if (!lists.length) return;

    let result = [...lists];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(list => 
        list.name.toLowerCase().includes(searchTerm) ||
        (list.description && list.description.toLowerCase().includes(searchTerm)) ||
        (list.criteria?.areas && list.criteria.areas.some(area => 
          area.toLowerCase().includes(searchTerm)
        )) ||
        (list.criteria?.buyerTypes && list.criteria.buyerTypes.some(type => 
          type.toLowerCase().includes(searchTerm)
        ))
      );
    }

    setFilteredLists(result);
  }, [lists, filters]);

  // Create a new list
  const createList = async (listData) => {
    try {
      const response = await createBuyerList(listData);
      setLists(prev => [...prev, response.list]);
      toast.success("Buyer list created successfully!");
      return response.list;
    } catch (err) {
      console.error("Error creating buyer list:", err);
      toast.error("Failed to create buyer list");
      throw err;
    }
  };

  // Update an existing list
  const updateList = async (listId, listData) => {
    try {
      const response = await updateBuyerList(listId, listData);
      setLists(prev => 
        prev.map(list => list.id === listId ? response.list : list)
      );
      toast.success("Buyer list updated successfully!");
      return response.list;
    } catch (err) {
      console.error("Error updating buyer list:", err);
      toast.error("Failed to update buyer list");
      throw err;
    }
  };

  // Delete a list
  const deleteList = async (listId) => {
    try {
      await deleteBuyerList(listId);
      setLists(prev => prev.filter(list => list.id !== listId));
      toast.success("Buyer list deleted successfully!");
    } catch (err) {
      console.error("Error deleting buyer list:", err);
      toast.error("Failed to delete buyer list");
      throw err;
    }
  };

  // Add buyers to a list
  const addBuyersToList = async (listId, buyerIds) => {
    try {
      await addBuyersApi(listId, buyerIds);
      
      // Update the buyer count in the list
      setLists(prev => 
        prev.map(list => {
          if (list.id === listId) {
            return { 
              ...list, 
              buyerCount: (list.buyerCount || 0) + buyerIds.length 
            };
          }
          return list;
        })
      );
      
      toast.success(`${buyerIds.length} buyers added to list!`);
    } catch (err) {
      console.error("Error adding buyers to list:", err);
      toast.error("Failed to add buyers to list");
      throw err;
    }
  };

  // Remove buyers from a list
  const removeBuyersFromList = async (listId, buyerIds) => {
    try {
      await removeBuyersApi(listId, buyerIds);
      
      // Update the buyer count in the list
      setLists(prev => 
        prev.map(list => {
          if (list.id === listId) {
            return { 
              ...list, 
              buyerCount: Math.max(0, (list.buyerCount || 0) - buyerIds.length)
            };
          }
          return list;
        })
      );
      
      toast.success(`${buyerIds.length} buyers removed from list!`);
    } catch (err) {
      console.error("Error removing buyers from list:", err);
      toast.error("Failed to remove buyers from list");
      throw err;
    }
  };

  // Send email to list
  const sendEmail = async (listId, emailData) => {
    try {
      await sendEmailToList(listId, emailData);
      
      // Update the last email date
      setLists(prev => 
        prev.map(list => {
          if (list.id === listId) {
            return { 
              ...list, 
              lastEmailDate: new Date().toISOString() 
            };
          }
          return list;
        })
      );
      
      toast.success("Email sent successfully!");
    } catch (err) {
      console.error("Error sending email:", err);
      toast.error("Failed to send email");
      throw err;
    }
  };

  // Get list members
  const getListMembers = async (listId) => {
    try {
      const listData = await getBuyerList(listId);
      return listData.buyers || [];
    } catch (err) {
      console.error("Error fetching list members:", err);
      toast.error("Failed to fetch list members");
      throw err;
    }
  };

  return {
    lists,
    filteredLists,
    loading,
    error,
    createList,
    updateList,
    deleteList,
    addBuyersToList,
    removeBuyersFromList,
    sendEmail,
    getListMembers,
    setListFilters: setFilters
  };
}