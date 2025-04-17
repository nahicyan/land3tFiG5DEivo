/**
 * Utility functions for working with buyer lists
 */

// Define the available areas
export const AREAS = [
    { id: 'DFW', label: 'Dallas Fort Worth', value: 'dfw' },
    { id: 'Austin', label: 'Austin', value: 'austin' },
    { id: 'Houston', label: 'Houston', value: 'houston' },
    { id: 'San Antonio', label: 'San Antonio', value: 'san antonio' },
    { id: 'Other Areas', label: 'Other Areas', value: 'other areas' }
  ];
  
  // Define buyer types
  export const BUYER_TYPES = [
    { id: 'CashBuyer', label: 'Cash Buyer' },
    { id: 'Builder', label: 'Builder' },
    { id: 'Developer', label: 'Developer' },
    { id: 'Realtor', label: 'Realtor' },
    { id: 'Investor', label: 'Investor' },
    { id: 'Wholesaler', label: 'Wholesaler' }
  ];
  
  /**
   * Get buyers that match the given criteria
   * @param {Array} buyers - Array of buyer objects
   * @param {Object} criteria - Criteria to match against
   * @returns {Array} Buyers that match the criteria
   */
  export function getBuyersMatchingCriteria(buyers, criteria) {
    if (!criteria || !buyers || !buyers.length) {
      return [];
    }
  
    return buyers.filter(buyer => {
      // Match areas
      if (criteria.areas && criteria.areas.length > 0) {
        if (!buyer.preferredAreas || !buyer.preferredAreas.length) {
          return false;
        }
        
        // Check if any of the buyer's preferred areas match the criteria
        const hasMatchingArea = buyer.preferredAreas.some(area => {
          // Find matching area by case-insensitive comparison
          return criteria.areas.some(criteriaArea => 
            criteriaArea.toLowerCase() === area.toLowerCase()
          );
        });
        
        if (!hasMatchingArea) {
          return false;
        }
      }
      
      // Match buyer types
      if (criteria.buyerTypes && criteria.buyerTypes.length > 0) {
        if (!buyer.buyerType || !criteria.buyerTypes.includes(buyer.buyerType)) {
          return false;
        }
      }
      
      // Match VIP status
      if (criteria.isVIP) {
        if (buyer.source !== 'VIP Buyers List') {
          return false;
        }
      }
      
      // Buyer matches all criteria
      return true;
    });
  }
  
  /**
   * Count buyers by area
   * @param {Array} buyers - Array of buyer objects 
   * @returns {Object} Object with area IDs as keys and counts as values
   */
  export function countBuyersByArea(buyers) {
    if (!buyers || !buyers.length) {
      return {};
    }
  
    const counts = {};
    
    // Initialize counts
    AREAS.forEach(area => {
      counts[area.id] = 0;
    });
    
    // Count buyers by area
    buyers.forEach(buyer => {
      if (buyer.preferredAreas && buyer.preferredAreas.length) {
        buyer.preferredAreas.forEach(buyerArea => {
          const areaObj = AREAS.find(a => 
            a.id.toLowerCase() === buyerArea.toLowerCase() || 
            a.value === buyerArea.toLowerCase()
          );
          
          if (areaObj) {
            counts[areaObj.id]++;
          }
        });
      }
    });
    
    return counts;
  }
  
  /**
   * Count buyers by type
   * @param {Array} buyers - Array of buyer objects
   * @returns {Object} Object with buyer types as keys and counts as values
   */
  export function countBuyersByType(buyers) {
    if (!buyers || !buyers.length) {
      return {};
    }
  
    const counts = {};
    
    // Initialize counts
    BUYER_TYPES.forEach(type => {
      counts[type.id] = 0;
    });
    
    // Count buyers by type
    buyers.forEach(buyer => {
      if (buyer.buyerType && counts[buyer.buyerType] !== undefined) {
        counts[buyer.buyerType]++;
      }
    });
    
    return counts;
  }
  
  /**
   * Generate a CSV file from a list of buyers
   * @param {Array} buyers - Array of buyer objects
   * @returns {Blob} CSV file as a Blob
   */
  export function generateBuyersCsv(buyers) {
    if (!buyers || !buyers.length) {
      return null;
    }
  
    // Define CSV headers
    const headers = ["First Name", "Last Name", "Email", "Phone", "Buyer Type", "Preferred Areas", "Source"];
    const csvRows = [headers];
  
    // Add buyers to CSV
    buyers.forEach(buyer => {
      const row = [
        buyer.firstName,
        buyer.lastName,
        buyer.email,
        buyer.phone,
        buyer.buyerType || "",
        (buyer.preferredAreas || []).join(", "),
        buyer.source || ""
      ];
      csvRows.push(row);
    });
  
    // Create CSV content
    const csvContent = csvRows.map(row => row.map(cell => 
      // Escape commas, quotes, etc. in cells
      typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))
        ? `"${cell.replace(/"/g, '""')}"`
        : cell
    ).join(",")).join("\n");
    
    // Create Blob
    return new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  }
  
  /**
   * Download a file
   * @param {Blob} blob - File to download as a Blob
   * @param {string} filename - Name for the downloaded file
   */
  export function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  
  /**
   * Export a list of buyers as a CSV file
   * @param {Array} buyers - Array of buyer objects
   * @param {string} filename - Name for the downloaded file
   */
  export function exportBuyersToCsv(buyers, filename = "buyers_list.csv") {
    const csvBlob = generateBuyersCsv(buyers);
    if (csvBlob) {
      downloadFile(csvBlob, filename);
      return true;
    }
    return false;
  }