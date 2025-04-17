import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import { getProperty } from "@/utils/api";

// Import navigation components
import { NavigationProvider, StepContainer, useNavigation } from "@/components/FinanceQualify/NavigationProvider";
import StepIndicator from "@/components/FinanceQualify/StepIndicator";
import PropertyHeader from "@/components/FinanceQualify/PropertyHeader";

// Import all qualification step components
import LanguageSelection from "@/components/FinanceQualify/LanguageSelection";
import HomeUsage from "@/components/FinanceQualify/HomeUsage";
import RealEstateAgent from "@/components/FinanceQualify/RealEstateAgent";
import HomePurchaseTiming from "@/components/FinanceQualify/HomePurchaseTiming";
import CurrentHomeOwnership from "@/components/FinanceQualify/CurrentHomeOwnership";
import CurrentOnAllPayments from "@/components/FinanceQualify/CurrentOnAllPayments";
import EmploymentStatus from "@/components/FinanceQualify/EmploymentStatus";
import VerifyIncomeEmployed from "@/components/FinanceQualify/VerifyIncomeEmployed";
import VerifyIncomeSelfEmployed from "@/components/FinanceQualify/VerifyIncomeSelfEmployed";
import VerifyIncomeNotEmployed from "@/components/FinanceQualify/VerifyIncomeNotEmployed";
import VerifyIncomeRetired from "@/components/FinanceQualify/VerifyIncomeRetired";
import IncomeHistory from "@/components/FinanceQualify/IncomeHistory";
import OpenCreditLines from "@/components/FinanceQualify/OpenCreditLines";
import TotalMonthlyPayments from "@/components/FinanceQualify/TotalMonthlyPayments";
import GrossAnnualIncome from "@/components/FinanceQualify/GrossAnnualIncome";
import ForeclosureForbearance from "@/components/FinanceQualify/ForeclosureForbearance";
import DeclaredBankruptcy from "@/components/FinanceQualify/DeclaredBankruptcy";
import CurrentCreditScore from "@/components/FinanceQualify/CurrentCreditScore";
import LiensOrJudgments from "@/components/FinanceQualify/LiensOrJudgments";
import UserInfo from "@/components/FinanceQualify/UserInfo";
import DownPayment from "@/components/FinanceQualify/DownPayment";
import SurveyCompletion from "@/components/FinanceQualify/SurveyCompletion";

export default function Qualify() {
  const { propertyId } = useParams();
  const [loading, setLoading] = useState(true);
  const [propertyData, setPropertyData] = useState(null);
  
  // Define all steps with their components in a standard format
  const steps = [
    { id: "language_selection", component: LanguageSelection },
    { id: "home_usage", component: HomeUsage },
    { id: "real_estate_agent", component: RealEstateAgent },
    { id: "home_purchase_timing", component: HomePurchaseTiming },
    { id: "current_home_ownership", component: CurrentHomeOwnership },
    { id: "current_on_all_payments", component: CurrentOnAllPayments },
    { id: "down_payment", component: DownPayment },
    { id: "employment_status", component: EmploymentStatus },
    { id: "verify_income_employed", component: VerifyIncomeEmployed },
    { id: "verify_income_self_employed", component: VerifyIncomeSelfEmployed },
    { id: "verify_income_not_employed", component: VerifyIncomeNotEmployed },
    { id: "verify_income_retired", component: VerifyIncomeRetired },
    { id: "income_history", component: IncomeHistory },
    { id: "open_credit_lines", component: OpenCreditLines },
    { id: "total_monthly_payments", component: TotalMonthlyPayments },
    { id: "gross_annual_income", component: GrossAnnualIncome },
    { id: "foreclosure_forbearance", component: ForeclosureForbearance },
    { id: "declared_bankruptcy", component: DeclaredBankruptcy },
    { id: "current_credit_score", component: CurrentCreditScore },
    { id: "liens_or_judgments", component: LiensOrJudgments },
    { id: "user_info", component: UserInfo },
    { id: "survey_completion", component: SurveyCompletion }
  ];
  
  // Define initial survey data state
  const [surveyData, setSurveyData] = useState({
    // Property Information
    property_id: "",
    ownerId: "",
    property_price: "",
    property_title: "",
    property_location: "",
    financing_available: false,
    propertyData: null,

    // Survey Responses
    language: "en",
    home_usage: "",
    real_estate_agent: "",
    home_purchase_timing: "",
    current_home_ownership: "",
    current_on_all_payments: "",
    employment_status: "",
    verify_income: "",
    income_history: "",
    open_credit_lines: "",
    total_monthly_payments: "",
    gross_annual_income: "",
    foreclosure_forbearance: "",
    declared_bankruptcy: "",
    current_credit_score: "",
    liens_or_judgments: "",

    // Payment Plan Data
    selected_plan: "",
    down_payment: "",
    interest_rate: "",
    monthly_payment: "",
    loan_amount: "",

    // Contact Information
   firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // Fetch property data if propertyId is available
  useEffect(() => {
    if (propertyId) {
      setLoading(true);
      getProperty(propertyId)
        .then((data) => {
          setPropertyData(data);
          
          // Initialize form data with property information
          setSurveyData(prev => ({
            ...prev,
            property_id: propertyId,
            property_price: data.askingPrice?.toString() || "100000",
            property_title: data.title || "",
            property_location: `${data.city}, ${data.state}` || "",
            financing_available: data.financing === "Available",
            propertyData: data, // Store the entire property data object
          }));
          
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching property:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [propertyId]);

  // Update form data with new field values
  const updateSurveyData = (name, value) => {
    setSurveyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to evaluate qualification status before submission
  const evaluateQualification = () => {
    // Define disqualification criteria
    const disqualifiers = [
      // Credit score
      surveyData.current_credit_score === "Below average (620-659)" ||
      surveyData.current_credit_score === "Poor (580-619)" ||
      surveyData.current_credit_score === "Bad (Below 580)",
      
      // Payment history
      surveyData.current_on_all_payments === "No",
      
      // Income level
      surveyData.gross_annual_income === "Less than $30,000" ||
      surveyData.gross_annual_income === "$30,000 - $50,000" ||
      surveyData.gross_annual_income === "$50,000 - $75,000",
      
      // Legal/Credit issues
      surveyData.foreclosure_forbearance === "Yes",
      surveyData.declared_bankruptcy === "Yes",
      surveyData.liens_or_judgments === "Yes",
      
      // Income verification
      surveyData.verify_income === "No, I cannot" || 
      surveyData.verify_income === "No, I don't",
      
      // Income history
      surveyData.income_history === "No"
    ];
    
    // Down payment check - must be at least 10% of property price
    let downPaymentDisqualifier = false;
    if (surveyData.down_payment) {
      const downPayment = parseFloat(surveyData.down_payment);
      const propertyPrice = parseFloat(surveyData.property_price || 0);
      downPaymentDisqualifier = downPayment < propertyPrice * 0.1;
    }
    
    // If any disqualifier is true, user is not qualified
    return !disqualifiers.some(condition => condition) && !downPaymentDisqualifier;
  };

  // Handle form submission
const handleSubmitSurvey = async () => {
  try {
    // Determine qualification status
    const isQualified = evaluateQualification();
    
    // Create a payload with all necessary data
    const qualificationData = {
      // Property Information
      propertyId: surveyData.property_id,
      propertyPrice: parseFloat(surveyData.property_price.replace(/,/g, '')),
      ownerId: surveyData.propertyData?.ownerId || null,
      
      // Selected Payment Plan Data
      loanAmount: surveyData.loan_amount ? parseFloat(surveyData.loan_amount.replace(/,/g, '')) : null,
      interestRate: surveyData.interest_rate ? parseFloat(surveyData.interest_rate) : null,
      monthlyPayment: surveyData.monthly_payment ? parseFloat(surveyData.monthly_payment.replace(/,/g, '')) : null,
      downPayment: surveyData.down_payment ? parseFloat(surveyData.down_payment.replace(/,/g, '')) : null,
      term: surveyData.propertyData?.term || null,
      
      // Survey Responses - renamed to match backend schema
      language: surveyData.language,
      homeUsage: surveyData.home_usage,
      realEstateAgent: surveyData.real_estate_agent,
      homePurchaseTiming: surveyData.home_purchase_timing,
      currentHomeOwnership: surveyData.current_home_ownership,
      currentOnAllPayments: surveyData.current_on_all_payments,
      downPaymentPercentage: surveyData.down_payment_percentage,
      employmentStatus: surveyData.employment_status,
      verifyIncome: surveyData.verify_income,
      incomeHistory: surveyData.income_history,
      openCreditLines: surveyData.open_credit_lines,
      totalMonthlyPayments: surveyData.total_monthly_payments ? parseFloat(surveyData.total_monthly_payments) : null,
      grossAnnualIncome: surveyData.gross_annual_income,
      foreclosureForbearance: surveyData.foreclosure_forbearance,
      declaredBankruptcy: surveyData.declared_bankruptcy,
      currentCreditScore: surveyData.current_credit_score,
      liensOrJudgments: surveyData.liens_or_judgments,
      
      // Contact Information
      firstName: surveyData.firstName,
      lastName: surveyData.lastName,
      email: surveyData.email,
      phone: surveyData.phone,
      
      // Property Details
      propertyAddress: surveyData.propertyData?.streetAddress || '',
      propertyCity: surveyData.propertyData?.city || '',
      propertyState: surveyData.propertyData?.state || '',
      propertyZip: surveyData.propertyData?.zip || '',
      
      // Qualification status
      qualified: isQualified,
    };
    
    // Update survey data with qualification result
    setSurveyData(prev => ({
      ...prev,
      qualified: isQualified,
      submission_date: new Date().toISOString()
    }));
    
    console.log("Submitting qualification data:", qualificationData);
    
    // Submit to backend
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/qualification/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(qualificationData),
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`Submission failed: ${response.status}`);
    }
    
    const result = await response.json();
    console.log("Qualification submitted successfully:", result);
    
    return result;
  } catch (error) {
    console.error("Error submitting qualification:", error);
    throw error;
  }
};

  // Show loading state while fetching property data
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <PuffLoader size={80} color="#3f4f24" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#FDF8F2] min-h-screen">
      {/* Property Header if propertyId is available */}
      {propertyId && <PropertyHeader propertyData={propertyData} />}
      
      {/* Navigation Provider wraps the entire qualification flow */}
      <NavigationProvider 
        steps={steps} 
        surveyData={surveyData} 
        updateSurveyData={updateSurveyData}
        onSubmitSurvey={handleSubmitSurvey}
      >
        {({ currentStep, CurrentStepComponent, handleNext, handleBack, handleSubmit }) => (
          <>
            {/* Progress Indicator */}
            <StepIndicator />
            
            {/* Step Content with Animation */}
            <StepContainer key={currentStep}>
              <CurrentStepComponent 
                surveyData={surveyData}
                updateSurveyData={updateSurveyData}
                onNext={handleNext}
                onBack={handleBack}
                onSubmit={handleSubmit}
              />
            </StepContainer>
          </>
        )}
      </NavigationProvider>
      
      {/* Development aids - only visible in development */}
      {import.meta.env.DEV && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <details>
            <summary className="font-semibold cursor-pointer">Debug: Form Data</summary>
            <pre className="mt-2 text-xs overflow-auto max-h-60">
              {JSON.stringify(surveyData, null, 2)}
            </pre>
          </details>
          
          <details className="mt-4">
            <summary className="font-semibold cursor-pointer">Debug: Qualification Status</summary>
            <div className="mt-2 p-3 bg-white rounded border border-gray-300">
              <p className="font-semibold">Would Qualify: {evaluateQualification() ? "Yes" : "No"}</p>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}