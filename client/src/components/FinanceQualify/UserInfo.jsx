import React, { useState, useEffect } from "react";
import { parsePhoneNumber } from "libphonenumber-js";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function UserInfo({ surveyData, updateSurveyData, onSubmit, onBack }) {
  // Initialize local form state from parent surveyData
  const [formData, setFormData] = useState({
    firstName: surveyData.firstName || "",
    lastName: surveyData.lastName || "",
    email: surveyData.email || "",
    phone: surveyData.phone || ""
  });

  // State for the Dialog notification
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogType, setDialogType] = useState("warning");

  // Update local state if surveyData changes
  useEffect(() => {
    setFormData({
      firstName: surveyData.firstName || "",
      lastName: surveyData.lastName || "",
      email: surveyData.email || "",
      phone: surveyData.phone || ""
    });
  }, [surveyData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Also update the parent state immediately
    updateSurveyData(name, value);
  };

  // Phone number validation using libphonenumber-js
  const validatePhone = (phoneInput) => {
    try {
      const phoneNumber = parsePhoneNumber(phoneInput, "US"); // "US" as default country code
      return phoneNumber?.isValid();
    } catch (error) {
      console.error("Phone validation error:", error);
      return false;
    }
  };

  // Format phone number as user types
  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    
    setFormData(prev => ({
      ...prev,
      phone: formatted
    }));
    
    // Also update the parent state
    updateSurveyData("phone", formatted);
  };

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

  // Handle form submission with validation
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate phone number
    if (!validatePhone(formData.phone)) {
      setDialogMessage("Please enter a valid US phone number.");
      setDialogOpen(true);
      return;
    }
    
    // Update parent state with all values
    updateSurveyData("firstName", formData.firstName);
    updateSurveyData("lastName", formData.lastName);
    updateSurveyData("email", formData.email);
    updateSurveyData("phone", formData.phone);
    
    // Move to the next step after a short delay to ensure state updates are processed
    setTimeout(() => {
      onSubmit();
    }, 100);
  };

  // Translation object based on selected language
  const translations = {
    en: {
      title: "Give us a way to reach you",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email Address",
      phone: "Phone Number (US only)",
      submit: "Submit Application",
      back: "Back",
      warning: "Warning",
      okay: "Okay"
    },
    es: {
      title: "Díganos cómo podemos comunicarnos con usted",
      firstName: "Nombre",
      lastName: "Apellido",
      email: "Correo electrónico",
      phone: "Número de teléfono (solo EE.UU.)",
      submit: "Enviar solicitud",
      back: "Atrás",
      warning: "Advertencia",
      okay: "Aceptar"
    }
  };

  // Get translations based on selected language
  const t = translations[surveyData.language || "en"];

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#324c48] mb-6">
            {t.title}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 text-left">
                <Label htmlFor="firstName" className="text-[#324c48]">{t.firstName}</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="border-[#c1d7d3] focus:border-[#324c48] focus:ring-[#324c48]"
                  required
                />
              </div>
              
              <div className="space-y-2 text-left">
                <Label htmlFor="lastName" className="text-[#324c48]">{t.lastName}</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="border-[#c1d7d3] focus:border-[#324c48] focus:ring-[#324c48]"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2 text-left">
              <Label htmlFor="email" className="text-[#324c48]">{t.email}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="border-[#c1d7d3] focus:border-[#324c48] focus:ring-[#324c48]"
                required
              />
            </div>
            
            <div className="space-y-2 text-left">
              <Label htmlFor="phone" className="text-[#324c48]">{t.phone}</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="(555) 555-5555"
                value={formData.phone}
                onChange={handlePhoneChange}
                className="border-[#c1d7d3] focus:border-[#324c48] focus:ring-[#324c48]"
                required
              />
            </div>
            
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                className="text-[#324c48] border-[#324c48] hover:bg-[#f0f5f4]"
                onClick={onBack}
              >
                {t.back}
              </Button>
              
              <Button
                type="submit"
                className="bg-[#3f4f24] hover:bg-[#546930] text-white"
              >
                {t.submit}
              </Button>
            </div>
          </form>
        </div>
      </CardContent>

      {/* Dialog for phone validation errors */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#FFF] text-[#050002] border border-[#405025]/30 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-red-600">
              {t.warning}
            </DialogTitle>
            <DialogDescription>{dialogMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setDialogOpen(false)}
              className="bg-[#324c48] text-[#FFF]"
            >
              {t.okay}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}