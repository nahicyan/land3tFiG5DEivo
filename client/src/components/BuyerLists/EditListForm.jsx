import React, { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUp } from "lucide-react";
import { toast } from "react-toastify";

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

export default function EditListForm({ 
  open, 
  onOpenChange, 
  selectedList,
  onUpdateList,
  onImportCsv 
}) {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    criteria: {
      areas: [],
      buyerTypes: [],
      isVIP: false
    }
  });

  // Update form data when selected list changes
  useEffect(() => {
    if (selectedList) {
      setFormData({
        name: selectedList.name || "",
        description: selectedList.description || "",
        criteria: {
          areas: selectedList.criteria?.areas || [],
          buyerTypes: selectedList.criteria?.buyerTypes || [],
          isVIP: selectedList.criteria?.isVIP || false
        }
      });
    }
  }, [selectedList]);

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle criteria changes
  const handleCriteriaChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        [field]: value
      }
    }));
  };

  // Reset form when dialog closes
  const handleOpenChange = (open) => {
    if (!open) {
      setFormData({
        name: "",
        description: "",
        criteria: {
          areas: [],
          buyerTypes: [],
          isVIP: false
        }
      });
    }
    onOpenChange(open);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("List name is required");
      return;
    }

    if (!selectedList) {
      toast.error("No list selected for update");
      return;
    }

    try {
      await onUpdateList(selectedList.id, formData);
      handleOpenChange(false);
    } catch (error) {
      // Error handling is done in the onUpdateList function
      console.error("Update list error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Edit Buyer List</DialogTitle>
          <DialogDescription>
            Update list details and criteria
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">List Details</TabsTrigger>
            <TabsTrigger value="import">Import Buyers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="py-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">List Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="border-[#324c48]/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  className="border-[#324c48]/30"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Area Criteria</Label>
                <div className="flex flex-wrap gap-2">
                  {AREAS.map(area => (
                    <Badge
                      key={area.id}
                      variant={formData.criteria.areas.includes(area.id) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        formData.criteria.areas.includes(area.id) 
                          ? "bg-[#324c48]" 
                          : "hover:bg-[#324c48]/10"
                      }`}
                      onClick={() => {
                        const updatedAreas = formData.criteria.areas.includes(area.id)
                          ? formData.criteria.areas.filter(a => a !== area.id)
                          : [...formData.criteria.areas, area.id];
                        handleCriteriaChange("areas", updatedAreas);
                      }}
                    >
                      {area.label}
                    </Badge>
                  ))}
                </div>
                {formData.criteria.areas.length === 0 && (
                  <p className="text-sm text-gray-500">No areas selected (will include all areas)</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Buyer Type Criteria</Label>
                <div className="flex flex-wrap gap-2">
                  {BUYER_TYPES.map(type => (
                    <Badge
                      key={type.id}
                      variant={formData.criteria.buyerTypes.includes(type.id) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        formData.criteria.buyerTypes.includes(type.id) 
                          ? "bg-[#324c48]" 
                          : "hover:bg-[#324c48]/10"
                      }`}
                      onClick={() => {
                        const updatedTypes = formData.criteria.buyerTypes.includes(type.id)
                          ? formData.criteria.buyerTypes.filter(t => t !== type.id)
                          : [...formData.criteria.buyerTypes, type.id];
                        handleCriteriaChange("buyerTypes", updatedTypes);
                      }}
                    >
                      {type.label}
                    </Badge>
                  ))}
                </div>
                {formData.criteria.buyerTypes.length === 0 && (
                  <p className="text-sm text-gray-500">No types selected (will include all buyer types)</p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-isVip"
                  checked={formData.criteria.isVIP}
                  onCheckedChange={(checked) => handleCriteriaChange("isVIP", checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#324c48] focus:ring-[#324c48]"
                />
                <Label htmlFor="edit-isVip">VIP Buyers Only</Label>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="import" className="py-4">
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="edit-csv-file">Import additional buyers from CSV</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="border-[#324c48] text-[#324c48]"
                  onClick={onImportCsv}
                >
                  <FileUp className="h-4 w-4 mr-2" />
                  Select CSV File
                </Button>
              </div>
              
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
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-[#324c48] text-white">
            Update List
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}