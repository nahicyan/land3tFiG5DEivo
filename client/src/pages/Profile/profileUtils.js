// client/src/pages/Profile/profileUtils.js

/**
 * Format currency values for display
 * @param {number|string} value - Value to format as currency
 * @param {boolean} showDecimals - Whether to show decimal places
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, showDecimals = false) => {
    if (value === null || value === undefined || value === '') {
      return "N/A";
    }
    
    try {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return "N/A";
      
      return `$${numValue.toLocaleString('en-US', { 
        minimumFractionDigits: showDecimals ? 2 : 0, 
        maximumFractionDigits: showDecimals ? 2 : 0 
      })}`;
    } catch (e) {
      console.error("Error formatting currency:", e);
      return "N/A";
    }
  };
  
  /**
   * Get status color classes for badges and backgrounds
   * @param {string} status - Status string
   * @returns {Object} Object with background and text color classes
   */
  export const getStatusColors = (status) => {
    switch (status) {
      case 'QUALIFIED':
      case 'APPROVED':
      case 'ACTIVE':
      case 'PAID':
      case true:
        return {
          bg: 'bg-green-100',
          text: 'text-green-800'
        };
      case 'PENDING':
      case 'IN REVIEW':
      case 'PROCESSING':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800'
        };
      case 'NOT QUALIFIED':
      case 'REJECTED':
      case 'DECLINED':
      case 'FAILED':
      case 'DEFAULTED':
      case 'CANCELLED':
      case false:
        return {
          bg: 'bg-red-100',
          text: 'text-red-800'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800'
        };
    }
  };
  
  /**
   * Get a display status label from a status code or boolean
   * @param {string|boolean} status - Status value
   * @returns {string} Human-readable status
   */
  export const getStatusLabel = (status) => {
    if (status === true) return "Qualified";
    if (status === false) return "Not Qualified";
    return status || "Unknown";
  };
  
  /**
   * Format a date in a consistent way
   * @param {string|Date} dateValue - Date to format
   * @param {string} formatStr - Format string (default: MMM d, yyyy)
   * @returns {string} Formatted date
   */
  export const formatDate = (dateValue, formatStr = "MMM d, yyyy") => {
    if (!dateValue) return "N/A";
    try {
      const date = new Date(dateValue);
      // Use date-fns format function if available, otherwise use a basic formatter
      if (typeof format === 'function') {
        return format(date, formatStr);
      } else {
        // Basic fallback formatting
        return date.toLocaleDateString();
      }
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Invalid Date";
    }
  };
  
  /**
   * Truncate text to a specific length with ellipsis
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length
   * @returns {string} Truncated text
   */
  export const truncateText = (text, maxLength = 50) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };