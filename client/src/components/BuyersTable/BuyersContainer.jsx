import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBuyers } from "@/utils/api";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";

// Import sub-components
import BuyersTable from "./BuyersTable";
import BuyerStats from "./BuyerStats";
import BuyerAreasTab from "./BuyerAreasTab";

// Import UI components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Send, FileUp } from "lucide-react";

// Import constants and utils
import { AREAS, BUYER_TYPES, exportBuyersToCsv } from "./buyerConstants";

/**
 * Main container component for the Buyers section
 */
const BuyersContainer = () => {
  const navigate = useNavigate();
  
  // State for buyers data and filtering
  const [loading, setLoading] = useState(true);
  const [buyers, setBuyers] = useState([]);
  const [filteredBuyers, setFilteredBuyers] = useState([]);
  const [selectedBuyers, setSelectedBuyers] = useState([]);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");
  const [buyerTypeFilter, setBuyerTypeFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  
  // Dialog states
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  // Form states
  const [emailData, setEmailData] = useState({
    subject: "",
    content: "",
    includeUnsubscribed: false
  });
  const [importOptions, setImportOptions] = useState({
    skipFirstRow: true,
    defaultBuyerType: "Investor",
    defaultArea: "DFW",
    defaultSource: "CSV Import"
  });
  
  // Stats state
  const [stats, setStats] = useState({
    total: 0,
    vip: 0,
    byArea: {},
    byType: {}
  });

  // Fetch buyers data
  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        setLoading(true);
        console.log("Fetching buyers...");
        const data = await getAllBuyers();
        console.log("Buyers data received:", data);
        
        // Ensure we have an array even if the API returns undefined
        const buyersData = Array.isArray(data) ? data : [];
        
        // Debug buyers count
        console.log(`Retrieved ${buyersData.length} buyers from API`);
        
        setBuyers(buyersData);
        setFilteredBuyers(buyersData);
        updateStats(buyersData);
      } catch (error) {
        console.error("Error fetching buyers:", error);
        toast.error("Failed to load buyers list");
        
        // Set empty arrays as fallback
        setBuyers([]);
        setFilteredBuyers([]);
        updateStats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBuyers();
  }, []);

  // Update stats when buyers change
  const updateStats = useCallback((buyersList = []) => {
    const newStats = {
      total: buyersList.length || 0,
      vip: buyersList.filter(b => b?.source === "VIP Buyers List").length || 0,
      byArea: {},
      byType: {}
    };

    // Initialize area counts to zero
    AREAS.forEach(area => {
      newStats.byArea[area.id] = 0;
    });

    // Count buyers by area
    buyersList.forEach(buyer => {
      if (buyer?.preferredAreas && Array.isArray(buyer.preferredAreas)) {
        buyer.preferredAreas.forEach(area => {
          if (area) {
            // Find matching area handling case insensitivity
            const areaObj = AREAS.find(a => 
              a.value === area.toLowerCase() || 
              a.id.toLowerCase() === area.toLowerCase()
            );
            
            if (areaObj) {
              newStats.byArea[areaObj.id] = (newStats.byArea[areaObj.id] || 0) + 1;
            }
          }
        });
      }
    });

    // Count buyers by type
    buyersList.forEach(buyer => {
      if (buyer?.buyerType) {
        newStats.byType[buyer.buyerType] = (newStats.byType[buyer.buyerType] || 0) + 1;
      }
    });

    setStats(newStats);
  }, []);

  // Apply filters to buyers
  useEffect(() => {
    const applyFilters = () => {
      // Check if buyers array is valid
      if (!Array.isArray(buyers) || buyers.length === 0) {
        console.log("No buyers to filter");
        setFilteredBuyers([]);
        return;
      }
      
      console.log(`Filtering ${buyers.length} buyers with criteria:`, {
        searchQuery,
        areaFilter,
        buyerTypeFilter,
        sourceFilter
      });
      
      // Make a defensive copy of buyers array
      let results = [...buyers];

      // Apply search query filter
      if (searchQuery?.trim()) {
        const query = searchQuery.toLowerCase();
        results = results.filter(buyer => 
          (buyer?.firstName || '').toLowerCase().includes(query) ||
          (buyer?.lastName || '').toLowerCase().includes(query) ||
          (buyer?.email || '').toLowerCase().includes(query) ||
          (buyer?.phone || '').includes(query)
        );
      }

      // Apply area filter
      if (areaFilter && areaFilter !== "all") {
        const areaValue = AREAS.find(a => a.id === areaFilter)?.value || areaFilter.toLowerCase();
        results = results.filter(buyer => {
          if (!buyer?.preferredAreas || !Array.isArray(buyer.preferredAreas)) return false;
          return buyer.preferredAreas.some(area => 
            area && area.toLowerCase() === areaValue
          );
        });
      }

      // Apply buyer type filter
      if (buyerTypeFilter && buyerTypeFilter !== "all") {
        results = results.filter(buyer => buyer?.buyerType === buyerTypeFilter);
      }

      // Apply source filter
      if (sourceFilter && sourceFilter !== "all") {
        results = results.filter(buyer => buyer?.source === sourceFilter);
      }

      console.log(`Filter applied: ${results.length} buyers after filtering`);
      setFilteredBuyers(results);
    };

    applyFilters();
  }, [buyers, searchQuery, areaFilter, buyerTypeFilter, sourceFilter]);

  // Handle buyer selection
  const handleSelectBuyer = useCallback((buyerId) => {
    setSelectedBuyers(prev => {
      if (prev.includes(buyerId)) {
        return prev.filter(id => id !== buyerId);
      } else {
        return [...prev, buyerId];
      }
    });
  }, []);

  // Handle select all buyers
  const handleSelectAll = useCallback((event) => {
    if (event) {
      setSelectedBuyers(filteredBuyers.map(buyer => buyer.id));
    } else {
      setSelectedBuyers([]);
    }
  }, [filteredBuyers]);

  // Handle email content change
  const handleEmailChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setEmailData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  // Handle sending email to selected buyers
  const handleSendEmail = useCallback(async () => {
    try {
      if (!emailData.subject.trim() || !emailData.content.trim()) {
        toast.error("Email subject and content are required");
        return;
      }

      // Get the selected buyers' data
      const selectedBuyersData = buyers.filter(buyer => 
        selectedBuyers.includes(buyer.id)
      );

      // Here you would normally call an API to send emails
      toast.success(`Email sent to ${selectedBuyersData.length} buyers!`);
      
      // Reset the form and close the dialog
      setEmailData({
        subject: "",
        content: "",
        includeUnsubscribed: false
      });
      setEmailDialogOpen(false);
    } catch (error) {
      console.error("Error sending emails:", error);
      toast.error("Failed to send emails");
    }
  }, [buyers, selectedBuyers, emailData]);

  // Handle bulk import functionality
  const handleBulkImport = useCallback((e) => {
    // This would handle CSV processing
    // For now, just close the dialog and show a toast
    toast.info("Bulk import functionality will be implemented soon");
    setBulkImportOpen(false);
  }, []);

  // Handle buyer deletion
  const handleDeleteSelected = useCallback(() => {
    setDeleteConfirmOpen(true);
  }, []);

  // Confirm and process buyer deletion
  const confirmDeleteSelected = useCallback(async () => {
    try {
      // In a real app, you would call an API to delete these buyers
      // For now, just remove them from the local state
      const updatedBuyers = buyers.filter(buyer => !selectedBuyers.includes(buyer.id));
      setBuyers(updatedBuyers);
      setFilteredBuyers(prev => prev.filter(buyer => !selectedBuyers.includes(buyer.id)));
      setSelectedBuyers([]);
      updateStats(updatedBuyers);
      
      toast.success(`${selectedBuyers.length} buyer${selectedBuyers.length !== 1 ? 's' : ''} deleted successfully`);
      setDeleteConfirmOpen(false);
    } catch (error) {
      console.error("Error deleting buyers:", error);
      toast.error("Failed to delete selected buyers");
    }
  }, [buyers, selectedBuyers, updateStats]);

  // Export buyer list
  const handleExport = useCallback(() => {
    try {
      // Get the selected buyers (or all if none selected)
      const buyersToExport = selectedBuyers.length > 0
        ? buyers.filter(buyer => selectedBuyers.includes(buyer.id))
        : filteredBuyers;

      // Export to CSV
      const success = exportBuyersToCsv(buyersToExport, "buyers_list.csv");
      
      if (success) {
        toast.success(`Exported ${buyersToExport.length} buyers`);
      } else {
        toast.error("Failed to export buyers - no data to export");
      }
    } catch (error) {
      console.error("Error exporting buyers:", error);
      toast.error("Failed to export buyers list");
    }
  }, [buyers, filteredBuyers, selectedBuyers]);

  // Get buyers for a specific area with proper case-insensitive matching
  const getBuyersForArea = useCallback((areaId) => {
    if (!areaId) return [];
    
    const areaValue = AREAS.find(a => a.id === areaId)?.value || areaId.toLowerCase();
    return buyers.filter(b => 
      b?.preferredAreas && Array.isArray(b.preferredAreas) && b.preferredAreas.some(area => 
        area && area.toLowerCase() === areaValue
      )
    );
  }, [buyers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <PuffLoader size={80} color="#3f4f24" />
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto p-4 sm:p-6">
      {/* Stats Cards */}
      <BuyerStats stats={stats} selectedCount={selectedBuyers.length} />

      {/* Main Tabs */}
      <Tabs defaultValue="list" className="mb-6">
        <TabsList className="bg-[#f0f5f4] p-1">
          <TabsTrigger value="list" className="data-[state=active]:bg-white">
            Buyer List
          </TabsTrigger>
          <TabsTrigger value="areas" className="data-[state=active]:bg-white">
            By Area
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white">
            Analytics
          </TabsTrigger>
        </TabsList>
        
        {/* Buyer List Tab */}
        <TabsContent value="list">
          <Card className="border-[#324c48]/20">
            <BuyersTable 
              filteredBuyers={filteredBuyers}
              buyers={buyers}
              selectedBuyers={selectedBuyers}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              areaFilter={areaFilter}
              setAreaFilter={setAreaFilter}
              buyerTypeFilter={buyerTypeFilter}
              setBuyerTypeFilter={setBuyerTypeFilter}
              sourceFilter={sourceFilter}
              setSourceFilter={setSourceFilter}
              onSelectBuyer={handleSelectBuyer}
              onSelectAll={handleSelectAll}
              onDeleteSelected={handleDeleteSelected}
              setEmailDialogOpen={setEmailDialogOpen}
              setBulkImportOpen={setBulkImportOpen}
              onExport={handleExport}
              navigate={navigate}
            />
          </Card>
        </TabsContent>
        
        {/* By Area Tab */}
        <TabsContent value="areas">
          <BuyerAreasTab 
            areas={AREAS}
            stats={stats}
            getBuyersForArea={getBuyersForArea}
            setAreaFilter={setAreaFilter}
            setSelectedBuyers={setSelectedBuyers}
            setEmailDialogOpen={setEmailDialogOpen}
          />
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Buyer List Analytics</CardTitle>
              <CardDescription>
                Insights into your buyer database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Buyer Types Chart */}
                <Card className="border border-[#324c48]/20">
                  <CardHeader className="bg-[#f0f5f4] border-b">
                    <CardTitle>Buyer Types</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 min-h-[300px]">
                    <div className="space-y-4">
                      {Object.entries(stats.byType).map(([type, count]) => (
                        <div key={type} className="flex items-center">
                          <div className="w-36 font-medium">{type}</div>
                          <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                type === 'CashBuyer' ? 'bg-green-400' : 
                                type === 'Investor' ? 'bg-blue-400' :
                                type === 'Realtor' ? 'bg-purple-400' :
                                type === 'Builder' ? 'bg-orange-400' :
                                type === 'Developer' ? 'bg-yellow-400' :
                                'bg-indigo-400'
                              }`}
                              style={{ width: `${stats.total ? (count / stats.total) * 100 : 0}%` }}
                            />
                          </div>
                          <div className="w-10 text-right ml-2">{count}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Areas Distribution Chart */}
                <Card className="border border-[#324c48]/20">
                  <CardHeader className="bg-[#f0f5f4] border-b">
                    <CardTitle>Area Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 min-h-[300px]">
                    <div className="space-y-4">
                      {AREAS.map(area => {
                        const count = stats.byArea[area.id] || 0;
                        return (
                          <div key={area.id} className="flex items-center">
                            <div className="w-36 font-medium">{area.label}</div>
                            <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#3f4f24]"
                                style={{ width: `${stats.total ? (count / stats.total) * 100 : 0}%` }}
                              />
                            </div>
                            <div className="w-10 text-right ml-2">{count}</div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Growth Over Time */}
                <Card className="border border-[#324c48]/20 md:col-span-2">
                  <CardHeader className="bg-[#f0f5f4] border-b">
                    <CardTitle>Buyer List Growth</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 min-h-[300px] flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <p>Historical growth data will be available soon</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Email to Selected Buyers</DialogTitle>
            <DialogDescription>
              This will send an email to {selectedBuyers.length} selected buyers.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                value={emailData.subject}
                onChange={handleEmailChange}
                placeholder="Enter email subject"
                className="border-[#324c48]/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Email Content</Label>
              <Textarea
                id="content"
                name="content"
                value={emailData.content}
                onChange={handleEmailChange}
                placeholder="Enter your email message..."
                className="min-h-[200px] border-[#324c48]/30"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeUnsubscribed"
                name="includeUnsubscribed"
                checked={emailData.includeUnsubscribed}
                onCheckedChange={(checked) => 
                  setEmailData(prev => ({ ...prev, includeUnsubscribed: checked }))
                }
              />
              <Label htmlFor="includeUnsubscribed" className="text-sm">
                Include unsubscribed buyers (not recommended)
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEmailDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendEmail}
              className="bg-[#324c48] text-white"
              disabled={!emailData.subject.trim() || !emailData.content.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedBuyers.length} selected buyer{selectedBuyers.length !== 1 ? 's' : ''}? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteSelected}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Bulk Import Sheet */}
      <Sheet open={bulkImportOpen} onOpenChange={setBulkImportOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Import Buyers from CSV</SheetTitle>
            <SheetDescription>
              Upload a CSV file with buyer information
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="csvFile">CSV File</Label>
                <Input id="csvFile" type="file" accept=".csv" />
                <p className="text-sm text-gray-500">
                  File should have columns: First Name, Last Name, Email, Phone, Type, Preferred Areas (comma-separated)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="defaultSource">Default Source</Label>
                <Select 
                  value={importOptions.defaultSource || "CSV Import"}
                  onValueChange={(value) => 
                    setImportOptions(prev => ({ ...prev, defaultSource: value }))
                  }
                >
                  <SelectTrigger id="defaultSource">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSV Import">CSV Import</SelectItem>
                    <SelectItem value="VIP Buyers List">VIP Buyers List</SelectItem>
                    <SelectItem value="Manual Entry">Manual Entry</SelectItem>
                    <SelectItem value="Website">Website</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="defaultBuyerType">Default Buyer Type</Label>
                <Select 
                  value={importOptions.defaultBuyerType}
                  onValueChange={(value) => 
                    setImportOptions(prev => ({ ...prev, defaultBuyerType: value }))
                  }
                >
                  <SelectTrigger id="defaultBuyerType">
                    <SelectValue placeholder="Select buyer type" />
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
              
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="skipFirstRow"
                  checked={importOptions.skipFirstRow}
                  onCheckedChange={(checked) => 
                    setImportOptions(prev => ({ ...prev, skipFirstRow: checked }))
                  }
                />
                <Label htmlFor="skipFirstRow">
                  Skip first row (header row)
                </Label>
              </div>
            </div>
          </div>
          <SheetFooter>
            <Button className="bg-[#324c48] text-white" onClick={handleBulkImport}>
              <FileUp className="h-4 w-4 mr-2" />
              Import Buyers
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default BuyersContainer;