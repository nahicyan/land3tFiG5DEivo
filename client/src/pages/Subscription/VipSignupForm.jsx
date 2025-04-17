import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { UserIcon, EnvelopeIcon, PhoneIcon, StarIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { parsePhoneNumber } from 'libphonenumber-js';
import { createVipBuyer } from "@/utils/api";

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

export default function VipSignupForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Auth0 authentication hooks
  const { isAuthenticated, loginWithRedirect, user } = useAuth0();
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    buyerType: '',
    preferredAreas: []
  });

  // Form validation errors
  const [validationErrors, setValidationErrors] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    buyerType: '',
    preferredAreas: ''
  });

  // Get email from URL parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
      
      // Check for saved form data first - retrieve it but don't set it yet
      const savedData = localStorage.getItem('vipSignupData');
      let parsedData = null;
      
      if (savedData) {
        try {
          parsedData = JSON.parse(savedData);
        } catch (e) {
          console.error("Error parsing saved form data:", e);
        }
      }
      
      // Only use Auth0 data if we don't have saved form data
      if (isAuthenticated && user && !parsedData) {
        setFormData(prev => ({
          ...prev,
          firstName: user.given_name || user.name?.split(' ')[0] || '',
          lastName: user.family_name || user.name?.split(' ').slice(1).join(' ') || '',
        }));
      }
    } else {
      // If no email, redirect back to homepage
      navigate('/');
    }
  }, [location, navigate, isAuthenticated, user]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear validation error when user starts typing
    setValidationErrors(prev => ({
      ...prev,
      [name]: ''
    }));

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle buyer type selection
  const handleBuyerTypeChange = (value) => {
    setValidationErrors(prev => ({
      ...prev,
      buyerType: ''
    }));
    
    setFormData(prev => ({
      ...prev,
      buyerType: value
    }));
  };

  // Handle preferred areas selection (checkboxes)
  const handleAreaChange = (areaId) => {
    setValidationErrors(prev => ({
      ...prev,
      preferredAreas: ''
    }));

    setFormData(prev => {
      // Check if the area is already selected
      if (prev.preferredAreas.includes(areaId)) {
        // If it is, remove it
        return {
          ...prev,
          preferredAreas: prev.preferredAreas.filter(id => id !== areaId)
        };
      } else {
        // If it's not, add it
        return {
          ...prev,
          preferredAreas: [...prev.preferredAreas, areaId]
        };
      }
    });
  };

  // Phone number validation based on Offer.jsx implementation
  const validatePhone = (phoneInput) => {
    try {
      // Try to parse the phone number using libphonenumber-js
      const phoneNumber = parsePhoneNumber(phoneInput, 'US');
      return phoneNumber?.isValid();
    } catch (error) {
      console.error("Phone validation error:", error);
      return false;
    }
  };

  // Handle phone number input specifically
  const handlePhoneChange = (e) => {
    // Get the raw input value
    const rawInput = e.target.value;
    
    // Clear validation error when user starts typing
    setValidationErrors(prev => ({
      ...prev,
      phone: ''
    }));
    
    // Format the phone number
    const formatted = formatPhoneNumber(rawInput);
    
    setFormData(prev => ({
      ...prev,
      phone: formatted
    }));
  };

  // Format phone number as user types (matching implementation from Offer.jsx)
  const formatPhoneNumber = (input) => {
    // Strip all non-numeric characters
    const digitsOnly = input.replace(/\D/g, '');
    
    // Format the number as user types
    let formattedNumber = '';
    if (digitsOnly.length === 0) {
      return '';
    } else if (digitsOnly.length <= 3) {
      formattedNumber = digitsOnly;
    } else if (digitsOnly.length <= 6) {
      formattedNumber = `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`;
    } else {
      formattedNumber = `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, Math.min(10, digitsOnly.length))}`;
    }
    
    return formattedNumber;
  };

  // Validate the entire form
  const validateForm = () => {
    const errors = {
      firstName: '',
      lastName: '',
      phone: '',
      buyerType: '',
      preferredAreas: ''
    };
    
    let isValid = true;

    // First name validation
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
      isValid = false;
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
      isValid = false;
    }

    // Phone validation
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
      isValid = false;
    } else if (!validatePhone(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
      isValid = false;
    }

    // Buyer type validation
    if (!formData.buyerType) {
      errors.buyerType = 'Please select a buyer type';
      isValid = false;
    }

    // Preferred areas validation
    if (formData.preferredAreas.length === 0) {
      errors.preferredAreas = 'Please select at least one area';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      // If user is not authenticated, store form data in localStorage and redirect to Auth0 signup
      if (!isAuthenticated) {
        // Save form data to localStorage
        localStorage.setItem('vipSignupData', JSON.stringify({
          email,
          ...formData
        }));
        
        // Redirect to Auth0 signup with redirect back to this page
        loginWithRedirect({
          authorizationParams: {
            screen_hint: 'signup',
            redirect_uri: `${window.location.origin}/vip-signup?email=${encodeURIComponent(email)}`
          },
          appState: { returnTo: `/vip-signup?email=${encodeURIComponent(email)}` }
        });
        return; // Don't proceed with API call yet
      }
      
      // If authenticated, include user's Auth0 ID in the submission
      const buyerData = {
        email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        buyerType: formData.buyerType,
        preferredAreas: formData.preferredAreas,
        auth0Id: user.sub // Include Auth0 user ID to link buyer record
      };
      
      // Make API call to create the VIP buyer
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/buyer/createVipBuyer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buyerData),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create VIP profile');
      }
      
      const data = await response.json();
      navigate('/vip-signup-success', { 
        state: { 
          firstName: formData.firstName 
        } 
      });
      
      // Clear stored form data after successful submission
      localStorage.removeItem('vipSignupData');
      
    } catch (err) {
      console.error("Error creating VIP buyer profile:", err);
      setError(err.message || 'An error occurred while creating your profile');
    } finally {
      setLoading(false);
    }
  };

  // Check for saved form data when returning from Auth0
  useEffect(() => {
    // Only run this if user is authenticated and we're not in a success state
    if (isAuthenticated && !success) {
      const savedData = localStorage.getItem('vipSignupData');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          // Make sure we're on the right email before restoring data
          if (parsedData.email === email) {
            // Always use the user's entered data from before Auth0 redirect
            setFormData({
              firstName: parsedData.firstName || '',
              lastName: parsedData.lastName || '',
              phone: parsedData.phone || '',
              buyerType: parsedData.buyerType || '',
              preferredAreas: parsedData.preferredAreas || []
            });
            
            // Automatically submit the form if it's coming back from Auth0
            setTimeout(() => {
              const submitButton = document.querySelector('button[type="submit"]');
              if (submitButton) submitButton.click();
            }, 500);
          }
        } catch (e) {
          console.error("Error parsing saved form data:", e);
        }
      }
    }
  }, [isAuthenticated, email, success]);

  return (
    <div className="bg-[#FDF8F2] min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <StarIcon className="h-12 w-12 text-[#D4A017] mx-auto mb-2" />
          <h1 className="text-3xl font-bold text-[#3f4f24] mb-2">One Last Step to Join Our VIP Buyers List</h1>
          <p className="text-lg text-[#324c48]">
            Please complete your profile to get access to exclusive property deals
          </p>
        </div>

        {error && (
          <Alert className="mb-6 bg-red-50 border-red-300 text-red-800">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
          <Card className="border-[#324c48]/20">
            <CardHeader className="border-b pb-6">
              <CardTitle className="text-xl text-[#3f4f24] flex items-center">
                <UserIcon className="w-5 h-5 mr-2" />
                Your Information
              </CardTitle>
              <CardDescription>
                Your email: <span className="font-medium">{email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* First Name */}
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-[#324c48]">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      className={`border-[#324c48]/30 focus:border-[#D4A017] focus:ring-[#D4A017] ${
                        validationErrors.firstName ? 'border-red-500' : ''
                      }`}
                    />
                    {validationErrors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.firstName}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-[#324c48]">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      className={`border-[#324c48]/30 focus:border-[#D4A017] focus:ring-[#D4A017] ${
                        validationErrors.lastName ? 'border-red-500' : ''
                      }`}
                    />
                    {validationErrors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.lastName}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[#324c48]">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      placeholder="(555) 555-5555"
                      className={`border-[#324c48]/30 focus:border-[#D4A017] focus:ring-[#D4A017] ${
                        validationErrors.phone ? 'border-red-500' : ''
                      }`}
                    />
                    {validationErrors.phone && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                    )}
                  </div>

                  {/* Buyer Type */}
                  <div className="space-y-2">
                    <Label htmlFor="buyerType" className="text-[#324c48]">
                      Buyer Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.buyerType}
                      onValueChange={handleBuyerTypeChange}
                    >
                      <SelectTrigger 
                        className={`border-[#324c48]/30 focus:border-[#D4A017] focus:ring-[#D4A017] ${
                          validationErrors.buyerType ? 'border-red-500' : ''
                        }`}
                      >
                        <SelectValue placeholder="Select buyer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CashBuyer">Cash Buyer</SelectItem>
                        <SelectItem value="Builder">Builder</SelectItem>
                        <SelectItem value="Developer">Developer</SelectItem>
                        <SelectItem value="Realtor">Realtor</SelectItem>
                        <SelectItem value="Investor">Investor</SelectItem>
                        <SelectItem value="Wholesaler">Wholesaler</SelectItem>
                      </SelectContent>
                    </Select>
                    {validationErrors.buyerType && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.buyerType}</p>
                    )}
                  </div>
                </div>

                {/* Preferred Areas (Multi-select using checkboxes) */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <MapPinIcon className="w-5 h-5 mr-2 text-[#324c48]" />
                    <Label className="text-[#324c48] font-medium">
                      Preferred Areas <span className="text-red-500">*</span>
                    </Label>
                  </div>
                  <p className="text-sm text-[#324c48]/80 mb-2">Select all areas you're interested in</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {AREAS.map((area) => (
                      <div key={area.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`area-${area.id}`}
                          checked={formData.preferredAreas.includes(area.id)}
                          onCheckedChange={() => handleAreaChange(area.id)}
                          className="border-[#324c48]/50 data-[state=checked]:bg-[#D4A017] data-[state=checked]:border-[#D4A017]"
                        />
                        <Label
                          htmlFor={`area-${area.id}`}
                          className="text-[#324c48] cursor-pointer"
                        >
                          {area.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  {validationErrors.preferredAreas && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.preferredAreas}</p>
                  )}
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-[#D4A017] hover:bg-[#D4A017]/90 text-white font-medium py-3 text-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Complete VIP Registration"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="border-t pt-6 pb-4 text-sm text-[#324c48]/80 text-center">
              By submitting this form, you agree to receive exclusive property alerts and special offers from Landivo.
              <br />
              We respect your privacy and will never share your information with third parties.
            </CardFooter>
          </Card>
      </div>
    </div>
  );
}