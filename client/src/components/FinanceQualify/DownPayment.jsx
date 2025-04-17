import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import PaymentCalculatorQualify from "@/components/PaymentCalculator/PaymentCalculatorQualify";

export default function DownPayment({ surveyData, updateSurveyData, onNext, onBack }) {
  // State to track selected payment plan
  const [selectedOption, setSelectedOption] = useState(surveyData.selected_plan || "1");
  
  // Track if user has interacted with the calculator
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Function to grab data from PaymentCalculator
  const capturePaymentDetails = () => {
    // Get values based on selected option
    let downPayment, interestRate, monthlyPayment, loanAmount;
    
    switch (selectedOption) {
      case "2":
        downPayment = surveyData.propertyData?.downPaymentTwo || "";
        interestRate = surveyData.propertyData?.interestTwo || "";
        monthlyPayment = surveyData.propertyData?.monthlyPaymentTwo || "";
        loanAmount = surveyData.propertyData?.loanAmountTwo || "";
        break;
      case "3":
        downPayment = surveyData.propertyData?.downPaymentThree || "";
        interestRate = surveyData.propertyData?.interestThree || "";
        monthlyPayment = surveyData.propertyData?.monthlyPaymentThree || "";
        loanAmount = surveyData.propertyData?.loanAmountThree || "";
        break;
      default: // "1"
        downPayment = surveyData.propertyData?.downPaymentOne || "";
        interestRate = surveyData.propertyData?.interestOne || "";
        monthlyPayment = surveyData.propertyData?.monthlyPaymentOne || "";
        loanAmount = surveyData.propertyData?.loanAmountOne || "";
        break;
    }
    
    // Clean up the values (remove commas, ensure proper format)
    const cleanDownPayment = downPayment ? downPayment.toString().replace(/,/g, "") : "";
    const cleanInterestRate = interestRate ? interestRate.toString() : "";
    const cleanMonthlyPayment = monthlyPayment ? monthlyPayment.toString().replace(/,/g, "") : "";
    const cleanLoanAmount = loanAmount ? loanAmount.toString().replace(/,/g, "") : "";
    
    // Update survey data with selected plan values
    updateSurveyData("selected_plan", selectedOption);
    updateSurveyData("down_payment", cleanDownPayment);
    updateSurveyData("interest_rate", cleanInterestRate);
    updateSurveyData("monthly_payment", cleanMonthlyPayment);
    updateSurveyData("loan_amount", cleanLoanAmount);
    
    // Set disqualification flag if down payment is too low
    // This is application-specific and should be adjusted based on your criteria
    const property_price = parseFloat(surveyData.property_price || 0);
    const down_payment = parseFloat(cleanDownPayment);
    
    if (down_payment < property_price * 0.1) {
      updateSurveyData("disqualificationFlag", true);
    }
    
    setHasInteracted(true);
  };
  
  // Handle PaymentCalculator selection change
  const handlePlanSelectionChange = (option) => {
    setSelectedOption(option);
    // After selection changes, also capture the data
    setTimeout(capturePaymentDetails, 0);
  };
  
  // Ensure we update the surveyData when component mounts
  useEffect(() => {
    capturePaymentDetails();
  }, [selectedOption]); // Re-run when selectedOption changes
  
  // Handle next button click
  const handleNext = () => {
    // Capture final values before proceeding
    capturePaymentDetails();
    onNext();
  };
  
  // Translation object based on selected language
  const translations = {
    en: {
      title: "Choose your payment plan",
      infoText: "Select one of the payment plans and click Next to continue",
      back: "Back",
      next: "Next"
    },
    es: {
      title: "Elija su plan de pago",
      infoText: "Seleccione uno de los planes de pago y haga clic en Siguiente para continuar",
      back: "Atrás",
      next: "Siguiente"
    }
  };
  
  // Get translations based on selected language
  const t = translations[surveyData.language || "en"];
  
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <div>
          <h2 className="text-2xl font-semibold text-[#324c48] mb-6 text-center">
            {t.title}
          </h2>
          
          {/* Info text */}
          <div className="bg-blue-50 p-3 rounded-lg mb-6 flex items-center gap-2 text-blue-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{t.infoText}</p>
          </div>
          
          {/* Payment Calculator Component */}
          <div className="mb-6">
            <PaymentCalculatorQualify 
              propertyData={surveyData.propertyData} 
              onOptionChange={handlePlanSelectionChange}
              initialOption={selectedOption}
            />
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              className="text-[#324c48] border-[#324c48] hover:bg-[#f0f5f4]"
              onClick={onBack}
            >
              {t.back}
            </Button>
            
            <Button
              className="bg-[#3f4f24] hover:bg-[#546930] text-white"
              onClick={handleNext}
            >
              {t.next}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}