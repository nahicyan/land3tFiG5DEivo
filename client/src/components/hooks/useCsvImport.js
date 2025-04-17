import { useState } from "react";
import Papa from "papaparse";
import { toast } from "react-toastify";

/**
 * Custom hook for handling CSV file import
 * Provides functions for parsing, validating, and processing CSV files
 */
export function useCsvImport() {
  // State for CSV file and data
  const [csvFile, setCsvFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [csvErrors, setCsvErrors] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Import options with defaults
  const [importOptions, setImportOptions] = useState({
    skipFirstRow: true,
    defaultBuyerType: "Investor",
    defaultArea: "DFW"
  });

  /**
   * Parse a CSV file and validate its contents
   * @param {File} file - The CSV file to parse
   * @returns {Promise<boolean>} - True if parsing was successful
   */
  const parseCsvFile = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        setCsvFile(null);
        setCsvData([]);
        setCsvErrors([]);
        resolve(false);
        return;
      }
      
      setIsProcessing(true);
      setCsvFile(file);
      setCsvData([]);
      setCsvErrors([]);
      
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setIsProcessing(false);
          const errors = [];
          
          // Validate CSV format
          const requiredColumns = ["firstName", "lastName", "email", "phone"];
          const headers = results.meta.fields || [];
          
          const missingColumns = requiredColumns.filter(col => !headers.includes(col));
          if (missingColumns.length > 0) {
            errors.push(`Missing required columns: ${missingColumns.join(", ")}`);
          }
          
          // Validate data
          const validData = results.data.filter((row, index) => {
            const rowErrors = [];
            
            // Check required fields
            if (!row.firstName) rowErrors.push("Missing first name");
            if (!row.lastName) rowErrors.push("Missing last name");
            if (!row.email) rowErrors.push("Missing email");
            if (!row.phone) rowErrors.push("Missing phone");
            
            // Add any row errors to the main errors array
            if (rowErrors.length > 0) {
              errors.push(`Row ${index + 2}: ${rowErrors.join(", ")}`);
              return false;
            }
            
            return true;
          });
          
          // Update state
          setCsvData(validData);
          setCsvErrors(errors);
          
          // Return success if there are any valid rows and no errors
          if (validData.length > 0 && errors.length === 0) {
            resolve(true);
          } else {
            if (errors.length > 0) {
              toast.error("CSV has validation errors");
            } else if (validData.length === 0) {
              toast.error("No valid data found in CSV");
            }
            resolve(false);
          }
        },
        error: (error) => {
          setIsProcessing(false);
          const errorMessage = `Error parsing CSV: ${error.message}`;
          setCsvErrors([errorMessage]);
          toast.error(errorMessage);
          reject(error);
        }
      });
    });
  };

  /**
   * Format CSV data to buyer objects
   * @returns {Array} - Array of buyer objects
   */
  const formatCsvDataToBuyers = () => {
    return csvData.map((row, index) => ({
      id: `csv-buyer-${Date.now()}-${index}`,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      phone: row.phone,
      buyerType: row.buyerType || importOptions.defaultBuyerType,
      preferredAreas: row.preferredAreas ? 
        row.preferredAreas.split(",").map(a => a.trim()) : 
        [importOptions.defaultArea],
      source: "CSV Import"
    }));
  };

  /**
   * Reset all CSV state
   */
  const resetCsvState = () => {
    setCsvFile(null);
    setCsvData([]);
    setCsvErrors([]);
    setIsProcessing(false);
  };

  /**
   * Process a file input event and parse the selected file
   * @param {Event} event - File input change event
   * @returns {Promise<boolean>} - True if processing was successful
   */
  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return false;
    
    try {
      return await parseCsvFile(file);
    } catch (error) {
      console.error("Error processing CSV file:", error);
      toast.error("Failed to process CSV file");
      return false;
    }
  };

  /**
   * Generate a CSV template for downloading
   */
  const downloadCsvTemplate = () => {
    const csv = "firstName,lastName,email,phone,buyerType,preferredAreas\nJohn,Doe,john@example.com,(555) 123-4567,Builder,\"Austin, DFW\"\nJane,Smith,jane@example.com,(555) 987-6543,Investor,Houston";
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'buyer_list_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    // State
    csvFile,
    csvData,
    csvErrors,
    importOptions,
    isProcessing,
    
    // Methods
    parseCsvFile,
    formatCsvDataToBuyers,
    resetCsvState,
    handleFileInputChange,
    downloadCsvTemplate,
    setImportOptions
  };
}