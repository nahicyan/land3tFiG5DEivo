import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  FileText, 
  UploadCloud, 
  Trash2, 
  AlertCircle, 
  Check 
} from "lucide-react";
import { toast } from "react-toastify";
import Papa from "papaparse";

// Define the available areas
const AREAS = [
  { id: 'DFW', label: 'Dallas Fort Worth' },
  { id: 'Austin', label: 'Austin' },
  { id: 'Houston', label: 'Houston' },
  { id: 'San Antonio', label: 'San Antonio' },
  { id: 'Other Areas', label: 'Other Areas' }
];

// Define buyer types
const BUYER_TYPES = [
  { id: 'CashBuyer', label: 'Cash Buyer' },
  { id: 'Builder', label: 'Builder' },
  { id: 'Developer', label: 'Developer' },
  { id: 'Realtor', label: 'Realtor' },
  { id: 'Investor', label: 'Investor' },
  { id: 'Wholesaler', label: 'Wholesaler' }
];

export default function ImportCsvDialog({ 
  open, 
  onOpenChange, 
  onImport 
}) {
  // CSV state
  const [csvFile, setCsvFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [csvErrors, setCsvErrors] = useState([]);
  
  // Import options
  const [importOptions, setImportOptions] = useState({
    skipFirstRow: true,
    defaultBuyerType: "Investor",
    defaultArea: "DFW"
  });

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setCsvFile(file);
    setCsvData([]);
    setCsvErrors([]);
    
    // Parse CSV file
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
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
      },
      error: (error) => {
        setCsvErrors([`Error parsing CSV: ${error.message}`]);
      }
    });
  };

  // Handle option changes
  const handleOptionChange = (name, value) => {
    setImportOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle closing the dialog
  const handleOpenChange = (open) => {
    if (!open) {
      resetState();
    }
    onOpenChange(open);
  };

  // Reset state
  const resetState = () => {
    setCsvFile(null);
    setCsvData([]);
    setCsvErrors([]);
    setImportOptions({
      skipFirstRow: true,
      defaultBuyerType: "Investor",
      defaultArea: "DFW"
    });
  };

  // Handle import submission
  const handleImport = () => {
    if (csvData.length === 0) {
      toast.error("No valid data to import");
      return;
    }

    // Format CSV data to buyer objects
    const formattedData = csvData.map((row, index) => ({
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

    try {
      onImport(formattedData, importOptions);
      toast.success(`${formattedData.length} buyers ready for import`);
      handleOpenChange(false);
    } catch (error) {
      console.error("Error formatting import data:", error);
      toast.error("Failed to prepare import data");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Buyers from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file with buyer information to import
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="csv-upload-file">Select CSV File</Label>
            <Button 
              type="button" 
              variant="outline" 
              className="border-[#324c48] text-[#324c48]"
              onClick={() => document.getElementById('csv-upload-file').click()}
            >
              <UploadCloud className="h-4 w-4 mr-2" />
              Browse Files
            </Button>
            <input
              id="csv-upload-file"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          
          {csvFile && (
            <div className="flex items-center gap-2 p-2 bg-[#f0f5f4] rounded-lg">
              <FileText className="h-5 w-5 text-[#324c48]" />
              <span className="font-medium">{csvFile.name}</span>
              <span className="text-sm text-gray-500">
                ({(csvFile.size / 1024).toFixed(1)} KB)
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="ml-auto h-8 w-8 p-0 text-gray-500"
                onClick={() => {
                  setCsvFile(null);
                  setCsvData([]);
                  setCsvErrors([]);
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          )}
          
          {csvErrors.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="font-medium text-red-700">CSV Import Errors</p>
              </div>
              <ul className="pl-5 list-disc text-sm text-red-600 space-y-1">
                {csvErrors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          
          {csvData.length > 0 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <p className="font-medium text-green-700">
                  {csvData.length} buyers ready to import
                </p>
              </div>
            </div>
          )}
          
          <div className="p-3 bg-[#f0f5f4] rounded-lg">
            <p className="text-sm font-medium text-[#324c48] mb-2">
              CSV Format Requirements:
            </p>
            <ul className="pl-5 list-disc text-sm text-gray-600 space-y-1">
              <li>Required columns: firstName, lastName, email, phone</li>
              <li>Optional columns: buyerType, preferredAreas (comma separated)</li>
              <li>First row should be column headers</li>
            </ul>
            <p className="text-sm mt-2">
              <a href="#" className="text-[#324c48] underline" onClick={(e) => {
                e.preventDefault();
                const csv = "firstName,lastName,email,phone,buyerType,preferredAreas\nJohn,Doe,john@example.com,(555) 123-4567,Builder,\"Austin, DFW\"\nJane,Smith,jane@example.com,(555) 987-6543,Investor,Houston";
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'buyer_list_template.csv';
                a.click();
                URL.revokeObjectURL(url);
              }}>
                Download template
              </a>
            </p>
          </div>
          
          <div className="bg-[#f0f5f4]/50 p-3 rounded-lg space-y-3">
            <p className="text-sm font-medium text-[#324c48]">
              Default values for missing fields:
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="defaultBuyerType" className="text-sm">Default Buyer Type</Label>
                <Select
                  value={importOptions.defaultBuyerType}
                  onValueChange={(value) => handleOptionChange("defaultBuyerType", value)}
                >
                  <SelectTrigger id="defaultBuyerType" className="text-sm h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BUYER_TYPES.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="defaultArea" className="text-sm">Default Area</Label>
                <Select
                  value={importOptions.defaultArea}
                  onValueChange={(value) => handleOptionChange("defaultArea", value)}
                >
                  <SelectTrigger id="defaultArea" className="text-sm h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AREAS.map(area => (
                      <SelectItem key={area.id} value={area.id}>
                        {area.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="skipFirstRow"
                checked={importOptions.skipFirstRow}
                onCheckedChange={(checked) => handleOptionChange("skipFirstRow", checked)}
              />
              <Label htmlFor="skipFirstRow" className="text-sm">Skip first row (header row)</Label>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            className="bg-[#324c48] text-white"
            disabled={csvData.length === 0}
            onClick={handleImport}
          >
            Import {csvData.length} Buyers
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}