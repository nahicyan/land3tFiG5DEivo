// client/src/components/PropertyManagement/QuickEditModal.jsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { updateProperty } from "@/utils/api";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export function QuickEditModal({ property, isOpen, onClose, onSave }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      title: property.title || "",
      description: property.description || "",
      status: property.status || "Available",
      askingPrice: property.askingPrice || "",
      minPrice: property.minPrice || "",
      financing: property.financing || "Not-Available",
      featured: property.featured === "Yes",
      featuredWeight: property.featuredWeight || 0,
    },
  });

  // Set form values when property changes
  useEffect(() => {
    if (property) {
      reset({
        title: property.title || "",
        description: property.description || "",
        status: property.status || "Available",
        askingPrice: property.askingPrice?.toString() || "",
        minPrice: property.minPrice?.toString() || "",
        financing: property.financing || "Not-Available",
        featured: property.featured === "Yes",
        featuredWeight: property.featuredWeight?.toString() || "0",
      });
    }
  }, [property, reset]);

  const onSubmit = async (data) => {
    try {
      // Format data before sending
      const formattedData = {
        ...data,
        askingPrice: parseFloat(data.askingPrice),
        minPrice: parseFloat(data.minPrice),
        featuredWeight: parseInt(data.featuredWeight),
        featured: data.featured ? "Yes" : "No",
      };

      // Call API to update property
      await updateProperty(property.id, formattedData);
      
      toast.success("Property updated successfully!");
      
      // Close modal and call onSave
      onSave(formattedData);
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error("Failed to update property");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Quick Edit Property</DialogTitle>
          <DialogDescription>
            Update essential property information. Fields left blank will remain unchanged.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* Basic Info Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-500">Basic Information</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Property Title</Label>
                <Input
                  id="title"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Status and Pricing Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-500">Status & Pricing</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  defaultValue={property.status || "Available"}
                  onValueChange={(value) => setValue("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Sold">Sold</SelectItem>
                    <SelectItem value="Not Available">Not Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="financing">Financing</Label>
                <Select 
                  defaultValue={property.financing || "Not-Available"}
                  onValueChange={(value) => setValue("financing", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select financing option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Not-Available">Not Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="askingPrice">Asking Price ($)</Label>
                <Input
                  id="askingPrice"
                  type="number"
                  step="0.01"
                  {...register("askingPrice", { 
                    required: "Asking price is required",
                    min: { value: 0, message: "Price must be positive" }
                  })}
                />
                {errors.askingPrice && <p className="text-red-500 text-sm">{errors.askingPrice.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minPrice">Minimum Price ($)</Label>
                <Input
                  id="minPrice"
                  type="number"
                  step="0.01"
                  {...register("minPrice", { 
                    required: "Minimum price is required",
                    min: { value: 0, message: "Price must be positive" }
                  })}
                />
                {errors.minPrice && <p className="text-red-500 text-sm">{errors.minPrice.message}</p>}
              </div>
            </div>
          </div>

          {/* Featured Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-500">Featured Settings</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="featured">Featured Property</Label>
                <p className="text-sm text-gray-500">Mark this property as featured on the homepage</p>
              </div>
              <Switch
                id="featured"
                defaultChecked={property.featured === "Yes"}
                onCheckedChange={(checked) => setValue("featured", checked)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="featuredWeight">Featured Weight</Label>
              <p className="text-xs text-gray-500">Higher numbers appear first (0-100)</p>
              <Input
                id="featuredWeight"
                type="number"
                min="0"
                max="100"
                {...register("featuredWeight", { 
                  min: { value: 0, message: "Weight must be 0 or higher" },
                  max: { value: 100, message: "Weight must be 100 or lower" }
                })}
              />
              {errors.featuredWeight && <p className="text-red-500 text-sm">{errors.featuredWeight.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              type="submit" 
              className="bg-[#324c48] hover:bg-[#3f4f24]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}