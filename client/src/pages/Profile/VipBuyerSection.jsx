// client/src/pages/Profile/VipBuyerSection.jsx
import React, { useState } from 'react';
import { useVipBuyer } from '@/utils/VipBuyerContext';
import { StarIcon } from '@heroicons/react/24/solid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { updateBuyer } from '@/utils/api';

// Buyer type options
const BUYER_TYPES = [
  { value: 'CashBuyer', label: 'Cash Buyer' },
  { value: 'Builder', label: 'Builder' },
  { value: 'Developer', label: 'Developer' },
  { value: 'Realtor', label: 'Realtor' },
  { value: 'Investor', label: 'Investor' },
  { value: 'Wholesaler', label: 'Wholesaler' }
];

// Area options
const AREAS = [
  { value: 'DFW', label: 'Dallas Fort Worth' },
  { value: 'Austin', label: 'Austin' },
  { value: 'Houston', label: 'Houston' },
  { value: 'San Antonio', label: 'San Antonio' },
  { value: 'Other Areas', label: 'Other Areas' }
];

const VipBuyerSection = () => {
  const { isVipBuyer, vipBuyerData, isLoading: vipStatusLoading } = useVipBuyer();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '', // Add email field which is required by the API
    phone: '',
    buyerType: '',
    preferredAreas: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  // Initialize form data when VIP buyer data is loaded
  React.useEffect(() => {
    if (vipBuyerData) {
      setFormData({
        firstName: vipBuyerData.firstName || '',
        lastName: vipBuyerData.lastName || '',
        email: vipBuyerData.email || '', // Include email - it's required by the server
        phone: vipBuyerData.phone || '',
        buyerType: vipBuyerData.buyerType || '',
        preferredAreas: vipBuyerData.preferredAreas || []
      });
    }
  }, [vipBuyerData]);

  // Don't render anything if not a VIP buyer and not loading VIP status
  if (!isVipBuyer && !vipStatusLoading) {
    return null;
  }

  if (vipStatusLoading) {
    return (
      <div className="mt-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32"></div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBuyerTypeChange = (value) => {
    setFormData(prev => ({ ...prev, buyerType: value }));
  };

  const handleAreaToggle = (area) => {
    setFormData(prev => {
      const currentAreas = prev.preferredAreas || [];
      return {
        ...prev,
        preferredAreas: currentAreas.includes(area)
          ? currentAreas.filter(a => a !== area)
          : [...currentAreas, area]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUpdateSuccess(false);
    setUpdateError(null);

    try {
      console.log("Sending update with data:", formData);
      // Call the API to update the buyer
      await updateBuyer(vipBuyerData.id, {
        ...formData,
        // Ensure these fields are properly included
        email: formData.email, // Keep email the same (required by the API)
        source: vipBuyerData.source || "VIP Buyers List" // Preserve the source
      });
      
      setUpdateSuccess(true);
      setIsEditing(false);
      
      // Force a refresh to get the updated data
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error('Error updating VIP buyer profile:', error);
      setUpdateError('Failed to update your profile. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Display view mode when not editing
  if (!isEditing) {
    return (
      <div className="mt-6">
        <div className="bg-accent-50 border border-accent rounded-md px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <StarIcon className="h-5 w-5 text-accent mr-2" />
              <p className="text-accent-700 font-semibold">VIP Buyer Profile</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-accent border-accent hover:bg-accent-100"
            >
              Edit VIP Info
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-secondary-600">
            <div>
              <p className="font-medium">Name:</p>
              <p>{vipBuyerData?.firstName} {vipBuyerData?.lastName}</p>
            </div>
            
            <div>
              <p className="font-medium">Email:</p>
              <p>{vipBuyerData?.email || 'Not provided'}</p>
            </div>
            
            <div>
              <p className="font-medium">Phone:</p>
              <p>{vipBuyerData?.phone || 'Not provided'}</p>
            </div>
            
            <div>
              <p className="font-medium">Buyer Type:</p>
              <p>{vipBuyerData?.buyerType || 'Not specified'}</p>
            </div>
            
            <div className="col-span-2">
              <p className="font-medium">Preferred Areas:</p>
              <p>{vipBuyerData?.preferredAreas?.join(', ') || 'None selected'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Display edit form
  return (
    <div className="mt-6">
      <div className="bg-accent-50 border border-accent rounded-md px-4 py-3">
        <div className="flex items-center mb-4">
          <StarIcon className="h-5 w-5 text-accent mr-2" />
          <p className="text-accent-700 font-semibold">Edit VIP Buyer Profile</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email (Read Only)</Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                readOnly
                disabled
                className="bg-gray-100"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="buyerType">Buyer Type</Label>
              <Select
                value={formData.buyerType}
                onValueChange={handleBuyerTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select buyer type" />
                </SelectTrigger>
                <SelectContent>
                  {BUYER_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label className="mb-2 block">Preferred Areas</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {AREAS.map(area => (
                <div key={area.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`area-${area.value}`}
                    checked={formData.preferredAreas?.includes(area.value)}
                    onCheckedChange={() => handleAreaToggle(area.value)}
                  />
                  <Label htmlFor={`area-${area.value}`} className="cursor-pointer">
                    {area.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-2 pt-2">
            <Button 
              type="submit" 
              className="bg-[#000] hover:[#030001] text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Profile"}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
          
          {updateSuccess && (
            <Alert className="mt-4 bg-green-50 border-green-200">
              <AlertTitle className="text-green-800">Success!</AlertTitle>
              <AlertDescription className="text-green-700">
                Your VIP buyer profile has been updated successfully.
              </AlertDescription>
            </Alert>
          )}
          
          {updateError && (
            <Alert className="mt-4 bg-red-50 border-red-200">
              <AlertTitle className="text-red-800">Error</AlertTitle>
              <AlertDescription className="text-red-700">
                {updateError}
              </AlertDescription>
            </Alert>
          )}
        </form>
      </div>
    </div>
  );
};

export default VipBuyerSection;