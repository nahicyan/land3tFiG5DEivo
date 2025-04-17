// client/src/components/PropertyManagement/PropertyActions.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updateProperty } from "@/utils/api";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  FileEdit,
  Eye,
  ChevronDown,
  PencilLine,
  Tag,
  DollarSign,
  CheckSquare,
  Star,
  StarOff,
  CircleOff,
  CircleCheck
} from "lucide-react";

export function PropertyActions({ 
  property, 
  selectedProperties = [], 
  onRefresh = () => {},
  onToggleSelection = () => {} 
}) {
  const navigate = useNavigate();
  const [showBulkStatusDialog, setShowBulkStatusDialog] = React.useState(false);
  const [statusAction, setStatusAction] = React.useState("");
  
  // For single property actions
  const handleViewProperty = () => {
    navigate(`/properties/${property.id}`);
  };

  const handleEditProperty = () => {
    navigate(`/agent/edit-property/${property.id}`);
  };

  const handleQuickEdit = () => {
    // Placeholder for quick edit function
    toast.info("Quick edit functionality would open here");
  };

  // For bulk actions
  const updateSelectedPropertiesStatus = async (status) => {
    try {
      // Show processing toast
      const toastId = toast.loading(`Updating ${selectedProperties.length} properties...`);
      
      // Create an array of promises to update all selected properties
      const updatePromises = selectedProperties.map(propertyId => 
        updateProperty(propertyId, { status })
      );
      
      // Wait for all updates to complete
      await Promise.all(updatePromises);
      
      // Update the loading toast to success
      toast.update(toastId, { 
        render: `Successfully updated ${selectedProperties.length} properties to "${status}"`, 
        type: "success", 
        isLoading: false,
        autoClose: 3000
      });
      
      // Refresh data
      onRefresh();
      
      // Clear selection
      onToggleSelection([]);
    } catch (error) {
      console.error('Error updating properties:', error);
      toast.error(`Failed to update properties: ${error.message}`);
    }
  };

  const updateSelectedPropertiesFeatured = async (featured) => {
    try {
      // Show processing toast
      const toastId = toast.loading(`Updating ${selectedProperties.length} properties...`);
      
      // Create an array of promises to update all selected properties
      const updatePromises = selectedProperties.map(propertyId => 
        updateProperty(propertyId, { featured })
      );
      
      // Wait for all updates to complete
      await Promise.all(updatePromises);
      
      // Update the loading toast to success
      toast.update(toastId, { 
        render: `Successfully ${featured === "Yes" ? "featured" : "unfeatured"} ${selectedProperties.length} properties`, 
        type: "success", 
        isLoading: false,
        autoClose: 3000
      });
      
      // Refresh data
      onRefresh();
      
      // Clear selection
      onToggleSelection([]);
    } catch (error) {
      console.error('Error updating properties:', error);
      toast.error(`Failed to update properties: ${error.message}`);
    }
  };

  // Handle bulk status update
  const handleBulkStatusUpdate = (status) => {
    setStatusAction(status);
    setShowBulkStatusDialog(true);
  };

  // Confirm bulk status update
  const confirmBulkStatusUpdate = () => {
    updateSelectedPropertiesStatus(statusAction);
    setShowBulkStatusDialog(false);
  };

  // Render single property actions
  if (property) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleViewProperty}>
            <Eye className="mr-2 h-4 w-4" /> View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleQuickEdit}>
            <PencilLine className="mr-2 h-4 w-4" /> Quick Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEditProperty}>
            <FileEdit className="mr-2 h-4 w-4" /> Edit Property
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => updateSelectedPropertiesStatus("Available")}>
            <CircleCheck className="mr-2 h-4 w-4 text-green-600" /> Set Available
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateSelectedPropertiesStatus("Pending")}>
            <CheckSquare className="mr-2 h-4 w-4 text-amber-600" /> Set Pending
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateSelectedPropertiesStatus("Sold")}>
            <DollarSign className="mr-2 h-4 w-4 text-blue-600" /> Set Sold
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateSelectedPropertiesStatus("Not Available")}>
            <CircleOff className="mr-2 h-4 w-4 text-red-600" /> Set Not Available
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Featured</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => updateSelectedPropertiesFeatured("Yes")}>
            <Star className="mr-2 h-4 w-4 text-yellow-500" /> Feature Property
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateSelectedPropertiesFeatured("No")}>
            <StarOff className="mr-2 h-4 w-4" /> Unfeature Property
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Render bulk actions
  return (
    <>
      <div className="flex gap-2">
        <Button 
          variant="outline"
          size="sm" 
          className="text-sm"
          disabled={selectedProperties.length === 0}
        >
          {selectedProperties.length} selected
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              disabled={selectedProperties.length === 0}
            >
              Bulk Actions
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Update Status</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleBulkStatusUpdate("Available")}>
              <CircleCheck className="mr-2 h-4 w-4 text-green-600" /> Set Available
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleBulkStatusUpdate("Pending")}>
              <CheckSquare className="mr-2 h-4 w-4 text-amber-600" /> Set Pending
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleBulkStatusUpdate("Sold")}>
              <DollarSign className="mr-2 h-4 w-4 text-blue-600" /> Set Sold
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleBulkStatusUpdate("Not Available")}>
              <CircleOff className="mr-2 h-4 w-4 text-red-600" /> Set Not Available
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Featured Status</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => updateSelectedPropertiesFeatured("Yes")}>
              <Star className="mr-2 h-4 w-4 text-yellow-500" /> Feature Properties
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateSelectedPropertiesFeatured("No")}>
              <StarOff className="mr-2 h-4 w-4" /> Unfeature Properties
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button 
          variant="outline" 
          size="sm"
          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
          onClick={() => onToggleSelection([])}
          disabled={selectedProperties.length === 0}
        >
          Clear Selection
        </Button>
      </div>

      {/* Confirmation Dialog for Bulk Status Update */}
      <AlertDialog open={showBulkStatusDialog} onOpenChange={setShowBulkStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the status of {selectedProperties.length} properties to "{statusAction}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkStatusUpdate} className="bg-[#324c48]">
              Update Properties
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}