// client/src/pages/AdminProperties/AdminProperties.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { getAllProperties } from "@/utils/api";
import PropertiesTable from "@/components/PropertiesTable/PropertiesTable";
import { QuickEditModal } from "@/components/PropertyManagement/QuickEditModal";
import PropertyStats from "@/components/PropertyManagement/PropertyStats";
import { PropertyFilters } from "@/components/PropertyManagement/PropertyFilters";

// UI Components
import { Button } from "@/components/ui/button";
import { PuffLoader } from "react-spinners";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Plus,
  FileEdit,
  Trash2,
  MoreHorizontal,
  MapPin,
  DollarSign,
  PencilLine,
  Eye
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminProperties() {
  const navigate = useNavigate();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false);
  
  // Fetch properties
  const { data, isLoading, isError, refetch } = useQuery(
    "allProperties",
    getAllProperties,
    { refetchOnWindowFocus: false }
  );

  // Calculate statistics
  const stats = useMemo(() => {
    if (!data) return {
      totalProperties: 0,
      availableProperties: 0,
      pendingProperties: 0,
      soldProperties: 0,
      averagePrice: 0,
      featuredProperties: 0,
      byArea: {}
    };

    const properties = data;
    const available = properties.filter(p => p.status === "Available").length;
    const pending = properties.filter(p => p.status === "Pending").length;
    const sold = properties.filter(p => p.status === "Sold").length;
    const featured = properties.filter(p => p.featured === "Yes").length;
    
    // Calculate average price
    let totalPrice = 0;
    properties.forEach(property => {
      if (property.askingPrice) totalPrice += Number(property.askingPrice);
    });
    const avgPrice = properties.length > 0 ? totalPrice / properties.length : 0;
    
    // Properties by area
    const areaCount = {};
    properties.forEach(property => {
      const area = property.area || 'Unspecified';
      areaCount[area] = (areaCount[area] || 0) + 1;
    });

    return {
      totalProperties: properties.length,
      availableProperties: available,
      pendingProperties: pending,
      soldProperties: sold,
      featuredProperties: featured,
      averagePrice: avgPrice,
      byArea: areaCount
    };
  }, [data]);

  // Handle creating a new property
  const handleCreateProperty = () => {
    navigate("/agent/add-property");
  };

  // Handle editing a property
  const handleEditProperty = (propertyId) => {
    navigate(`/agent/edit-property/${propertyId}`);
  };

  // Handle view property details
  const handleViewProperty = (propertyId) => {
    navigate(`/properties/${propertyId}`);
  };

  // Handle quick edit
  const handleQuickEdit = (property) => {
    setSelectedProperty(property);
    setIsQuickEditOpen(true);
  };

  // Handle quick edit save
  const handleQuickEditSave = async (editedData) => {
    // Logic for saving quick edit data will go here
    console.log("Saving quick edit:", editedData);
    setIsQuickEditOpen(false);
    refetch(); // Refresh the data after edit
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <h2 className="text-red-600 text-xl font-semibold">Error fetching properties data.</h2>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#324c48] mb-2">Property Management</h1>
            <p className="text-[#324c48] mb-2">
              Manage property listings, track status, and update information
            </p>
          </div>
          <Button 
            className="bg-[#324c48] hover:bg-[#3f4f24] text-white mt-4 md:mt-0"
            onClick={handleCreateProperty}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Property
          </Button>
        </div>

        {/* Stats Section */}
        {isLoading ? (
          <div className="flex justify-center p-12">
            <PuffLoader size={60} color="#3f4f24" />
          </div>
        ) : (
          <PropertyStats stats={stats} />
        )}

        {/* Table with Actions */}
        <Card className="mt-6">
          <CardHeader className="pb-2">
            <CardTitle>All Properties</CardTitle>
            <CardDescription>View and manage all property listings</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-12">
                <PuffLoader size={60} color="#3f4f24" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Title</th>
                      <th className="text-left p-4">Location</th>
                      <th className="text-left p-4">Price</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Area</th>
                      <th className="text-right p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data && data.slice(0, 10).map((property) => (
                      <tr key={property.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium">{property.title}</td>
                        <td className="p-4">{property.city}, {property.state}</td>
                        <td className="p-4">${Number(property.askingPrice).toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            property.status === 'Available' ? 'bg-green-100 text-green-800' : 
                            property.status === 'Pending' ? 'bg-orange-100 text-orange-800' : 
                            property.status === 'Sold' ? 'bg-blue-100 text-blue-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {property.status}
                          </span>
                        </td>
                        <td className="p-4">{property.area}</td>
                        <td className="p-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewProperty(property.id)}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleQuickEdit(property)}>
                                <PencilLine className="mr-2 h-4 w-4" /> Quick Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditProperty(property.id)}>
                                <FileEdit className="mr-2 h-4 w-4" /> Edit Property
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-gray-50 border-t p-4 flex justify-between">
            <div className="text-sm text-gray-500">
              Showing 10 of {data?.length || 0} properties
            </div>
            <Button 
              onClick={() => {}}
              variant="outline" 
              className="text-[#324c48] border-[#324c48]"
            >
              View All Properties
            </Button>
          </CardFooter>
        </Card>

        {/* Full Properties Table */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-[#324c48] mb-4">Advanced Property Management</h2>
          <PropertiesTable />
        </div>

        {/* Quick Edit Modal */}
        {isQuickEditOpen && selectedProperty && (
          <QuickEditModal
            property={selectedProperty}
            isOpen={isQuickEditOpen}
            onClose={() => setIsQuickEditOpen(false)}
            onSave={handleQuickEditSave}
          />
        )}
      </div>
    </div>
  );
}