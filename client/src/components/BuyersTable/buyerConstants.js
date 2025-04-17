/**
 * Constants related to buyers functionality
 */

// Define the available areas with both ID and lowercase value for matching
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

// Define sources
export const BUYER_SOURCES = [
  { id: 'VIP Buyers List', label: 'VIP Buyers List' },
  { id: 'Manual Entry', label: 'Manual Entry' },
  { id: 'Property Offer', label: 'Property Offer' },
  { id: 'Website', label: 'Website' },
  { id: 'CSV Import', label: 'CSV Import' },
  { id: 'Referral', label: 'Referral' }
];

/**
 * Get a buyer type by its ID
 * @param {string} id - Buyer type ID 
 * @returns {Object|undefined} Buyer type object or undefined if not found
 */
export const getBuyerTypeById = (id) => {
  return BUYER_TYPES.find(type => type.id === id);
};

/**
 * Get an area by its ID
 * @param {string} id - Area ID
 * @returns {Object|undefined} Area object or undefined if not found
 */
export const getAreaById = (id) => {
  return AREAS.find(area => area.id === id);
};

/**
 * Get CSS class for a buyer type
 * @param {string} buyerType - Buyer type ID
 * @returns {string} CSS class
 */
export const getBuyerTypeClass = (buyerType) => {
  switch (buyerType) {
    case 'CashBuyer':
      return 'bg-green-100 text-green-800';
    case 'Investor':
      return 'bg-blue-100 text-blue-800';
    case 'Realtor':
      return 'bg-purple-100 text-purple-800';
    case 'Builder':
      return 'bg-orange-100 text-orange-800';
    case 'Developer':
      return 'bg-yellow-100 text-yellow-800';
    case 'Wholesaler':
      return 'bg-indigo-100 text-indigo-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Utility functions for exporting buyers to CSV
 * @param {Array} buyers - Array of buyer objects
 * @returns {string} CSV content
 */
export const exportBuyersToCsv = (buyers, filename = "buyers_list.csv") => {
  if (!buyers || !buyers.length) return false;
  
  const headers = ["First Name", "Last Name", "Email", "Phone", "Buyer Type", "Preferred Areas", "Source"];
  const csvRows = [headers];

  buyers.forEach(buyer => {
    const row = [
      buyer.firstName || '',
      buyer.lastName || '',
      buyer.email || '',
      buyer.phone || '',
      buyer.buyerType || '',
      (buyer.preferredAreas && Array.isArray(buyer.preferredAreas)) ? buyer.preferredAreas.join(", ") : '',
      buyer.source || "Unknown"
    ];
    
    // Escape any fields with commas or quotes
    const escapedRow = row.map(field => {
      if (typeof field !== 'string') return field;
      if (field.includes(',') || field.includes('"') || field.includes('\n')) {
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    });
    
    csvRows.push(escapedRow);
  });

  const csvContent = csvRows.map(row => row.join(",")).join("\n");
  
  // Create and download the file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  return true;
};