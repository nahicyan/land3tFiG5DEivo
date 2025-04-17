import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PuffLoader } from "react-spinners";
import { parsePhoneNumber } from "libphonenumber-js";
import { getBuyerById, updateBuyer } from "@/utils/api";

// Define the available areas
const AREAS = [
  { id: 'DFW', label: 'Dallas Fort Worth' },
  { id: 'Austin', label: 'Austin' },
  { id: 'Houston', label: 'Houston' },
  { id: 'San Antonio', label: 'San Antonio' },
  { id: 'Other Areas', label: 'Other Areas' }
];

export default function EditBuyer() {
  const { buyerId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    buyerType: "",
    source: "",
    preferredAreas: []
  });

  // Original data for comparison
  const [originalData, setOriginalData] = useState(null);

  // Form validation errors
  const [validationErrors, setValidationErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    buyerType: ""
  });

  // Fetch buyer data
  useEffect(() => {
    const fetchBuyer = async () => {
      try {
        setLoading(true);
        const data = await getBuyerById(buyerId);
        
        // Initialize form data
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone || "",
          buyerType: data.buyerType || "",
          source: data.source || "Manual Entry",
          preferredAreas: data.preferredAreas || []
        });
        
        // Store original data for comparison
        setOriginalData(data);
      } catch (err) {
        console.error("Error fetching buyer:", err);
        setError("Failed to load buyer information");
      } finally {
        setLoading(false);
      }
    };

    if (buyerId) {
      fetchBuyer();
    }
  }, [buyerId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear validation error when user starts typing
    setValidationErrors(prev => ({
      ...prev,
      [name]: ""
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
      buyerType: ""
    }));
    
    setFormData(prev => ({
      ...prev,
      buyerType: value
    }));
  };

  // Handle source selection
  const handleSourceChange = (value) => {
    setFormData(prev => ({
      ...prev,
      source: value
    }));
  };

  // Handle preferred areas selection (checkboxes)
  const handleAreaChange = (areaId) => {
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

  // Phone number validation
  const validatePhone = (phoneInput) => {
    try {
      const phoneNumber = parsePhoneNumber(phoneInput, "US");
      return phoneNumber?.isValid();
    } catch (error) {
      console.error("Phone validation error:", error);
      return false;
    }
  };

  // Handle phone number input specifically
  const handlePhoneChange = (e) => {
    const rawInput = e.target.value;
    
    // Clear validation error when user starts typing
    setValidationErrors(prev => ({
      ...prev,
      phone: ""
    }));
    
    // Format the phone number
    const formatted = formatPhoneNumber(rawInput);
    
    setFormData(prev => ({
      ...prev,
      phone: formatted
    }));
  };

  // Format phone number as user types
  const formatPhoneNumber = (input) => {
    // Strip all non-numeric characters
    const digitsOnly = input.replace(/\D/g, "");
    
    // Format the number as user types
    let formattedNumber = "";
    if (digitsOnly.length === 0) {
      return "";
    } else if (digitsOnly.length <= 3) {
      formattedNumber = digitsOnly;
    } else if (digitsOnly.length <= 6) {
      formattedNumber = `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`;
    } else {
      formattedNumber = `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, Math.min(10, digitsOnly.length))}`;
    }
    
    return formattedNumber;
  };

  // Email validation
  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // Validate the entire form
  const validateForm = () => {
    const errors = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      buyerType: ""
    };
    
    let isValid = true;

    // First name validation
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
      isValid = false;
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Phone validation
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
      isValid = false;
    } else if (!validatePhone(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
      isValid = false;
    }

    // Buyer type validation
    if (!formData.buyerType) {
      errors.buyerType = "Please select a buyer type";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  // Check if form has changed
  const hasFormChanged = () => {
    if (!originalData) return false;
    
    return (
      formData.firstName !== originalData.firstName ||
      formData.lastName !== originalData.lastName ||
      formData.email !== originalData.email ||
      formData.phone !== originalData.phone ||
      formData.buyerType !== originalData.buyerType ||
      formData.source !== originalData.source ||
      // Check if preferred areas have changed
      JSON.stringify(formData.preferredAreas.sort()) !== JSON.stringify((originalData.preferredAreas || []).sort())
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Check if form has changed
    if (!hasFormChanged()) {
      navigate(`/admin/buyers/${buyerId}`);
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }
  
    try {
      setSubmitting(true);
      
      // Make API request to update the buyer
      await updateBuyer(buyerId, formData);
      
      setSuccess(true);
      
      // Navigate back to buyer details after success
      setTimeout(() => {
        navigate(`/admin/buyers/${buyerId}`);
      }, 1500);
      
    } catch (err) {
      console.error("Error updating buyer:", err);
      setError(err.message || "An error occurred while updating the buyer");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <PuffLoader size={80} color="#3f4f24" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#324c48]">Edit Buyer</h1>
        <p className="text-gray-600">Update buyer information for {formData.firstName} {formData.lastName}</p>
      </div>
      
      {error && (
        <Alert className="mb-6 bg-red-50 border-red-300 text-red-800">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success ? (
        <Card className="border-green-300 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-4">Buyer Updated Successfully!</h2>
              <p className="text-green-700 mb-6">
                The buyer information has been updated in the system.
              </p>
              <Button 
                onClick={() => navigate(`/admin/buyers/${buyerId}`)}
                className="bg-[#324c48] hover:bg-[#3f4f24] text-white"
              >
                Return to Buyer Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-[#324c48]/20">
          <form onSubmit={handleSubmit}>
            <CardHeader className="border-b">
              <CardTitle>Edit Buyer Information</CardTitle>
              <CardDescription>
                Make changes to the buyer's details below
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6 space-y-6">
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
                    className={`border-[#324c48]/30 focus:border-[#D4A017] focus:ring-[#D4A017] ${
                      validationErrors.firstName ? "border-red-500" : ""
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
                    className={`border-[#324c48]/30 focus:border-[#D4A017] focus:ring-[#D4A017] ${
                      validationErrors.lastName ? "border-red-500" : ""
                    }`}
                  />
                  {validationErrors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.lastName}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#324c48]">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`border-[#324c48]/30 focus:border-[#D4A017] focus:ring-[#D4A017] ${
                      validationErrors.email ? "border-red-500" : ""
                    }`}
                  />
                  {validationErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
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
                    className={`border-[#324c48]/30 focus:border-[#D4A017] focus:ring-[#D4A017] ${
                      validationErrors.phone ? "border-red-500" : ""
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
                        validationErrors.buyerType ? "border-red-500" : ""
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

                {/* Source */}
                <div className="space-y-2">
                  <Label htmlFor="source" className="text-[#324c48]">
                    Source
                  </Label>
                  <Select
                    value={formData.source}
                    onValueChange={handleSourceChange}
                  >
                    <SelectTrigger className="border-[#324c48]/30 focus:border-[#D4A017] focus:ring-[#D4A017]">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manual Entry">Manual Entry</SelectItem>
                      <SelectItem value="Property Offer">Property Offer</SelectItem>
                      <SelectItem value="VIP Buyers List">VIP Buyers List</SelectItem>
                      <SelectItem value="Website">Website</SelectItem>
                      <SelectItem value="Referral">Referral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Preferred Areas */}
              <div className="space-y-2">
                <Label className="text-[#324c48] font-medium">
                  Preferred Areas
                </Label>
                <p className="text-sm text-[#324c48]/80 mb-2">Select all areas the buyer is interested in</p>
                
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
              </div>
            </CardContent>
            
            <CardFooter className="border-t pt-6 flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/admin/buyers/${buyerId}`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className={`${hasFormChanged() ? 'bg-[#324c48] hover:bg-[#3f4f24]' : 'bg-gray-400'} text-white`}
                disabled={submitting || !hasFormChanged()}
              >
                {submitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
}