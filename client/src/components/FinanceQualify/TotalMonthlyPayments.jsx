import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSignIcon } from "lucide-react";

export default function TotalMonthlyPayments({ surveyData, updateSurveyData, onNext, onBack }) {
  const [displayValue, setDisplayValue] = useState(formatCurrency(surveyData.total_monthly_payments || ""));

  // Format currency value with dollar sign and commas
  function formatCurrency(value) {
    if (!value) return "";
    
    // Remove non-numeric characters
    const numericValue = value.toString().replace(/[^0-9]/g, "");
    
    // Format with $ and commas
    if (numericValue) {
      const number = parseInt(numericValue, 10);
      return `$${number.toLocaleString('en-US')}`;
    }
    
    return "";
  }

  // Parse currency string to number (removing formatting)
  function parseCurrency(formattedValue) {
    if (!formattedValue) return "";
    return formattedValue.replace(/[^0-9]/g, "");
  }

  // Handle input change
  const handleInputChange = (e) => {
    const rawValue = e.target.value;
    setDisplayValue(formatCurrency(rawValue));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Store numeric value in survey data
    const numericValue = parseCurrency(displayValue);
    updateSurveyData("total_monthly_payments", numericValue);
    
    onNext();
  };

  // Translation object based on selected language
  const translations = {
    en: {
      title: "What are your total monthly payments?",
      subtitle: "Include all loans, credit cards, and other debt payments",
      next: "Next",
      back: "Back"
    },
    es: {
      title: "¿Cuáles son sus pagos mensuales totales?",
      subtitle: "Incluya todos los préstamos, tarjetas de crédito y otros pagos de deudas",
      next: "Siguiente",
      back: "Atrás"
    }
  };

  // Get translations based on selected language
  const t = translations[surveyData.language || "en"];

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#324c48] mb-4">
            {t.title}
          </h2>
          
          <p className="text-gray-500 mb-6">
            {t.subtitle}
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="relative mt-8">
              <Label htmlFor="monthly-payments" className="sr-only">Monthly Payments</Label>
              <div className="relative">
                <DollarSignIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                <Input
                  id="monthly-payments"
                  type="text"
                  value={displayValue}
                  onChange={handleInputChange}
                  className="pl-10 py-6 text-xl border-[#3f4f24] focus:border-[#D4A017] focus:ring-[#D4A017]"
                  placeholder="$0"
                  autoComplete="off"
                />
              </div>
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
                {t.next}
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}