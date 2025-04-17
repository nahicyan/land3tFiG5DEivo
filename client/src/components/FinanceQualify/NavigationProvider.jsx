import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Create Context
const NavigationContext = createContext(null);

// Custom hook to access navigation context
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};

export const NavigationProvider = ({ 
  children, 
  steps, 
  surveyData, 
  updateSurveyData,
  onSubmitSurvey 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  // Use a ref to track the last open_credit_lines value.
  const lastOpenCreditRef = useRef(surveyData.open_credit_lines);

  // Helper to find step index by ID
  const getStepIndexById = useCallback((stepId) => {
    return steps.findIndex(step => step.id === stepId);
  }, [steps]);

  // Auto-correct verification step if employment status changes
  useEffect(() => {
    const verificationSteps = [
      "verify_income_employed",
      "verify_income_not_employed",
      "verify_income_retired",
      "verify_income_self_employed"
    ];
    if (verificationSteps.includes(steps[currentStep].id)) {
      const verifyMap = {
        "Employed": "verify_income_employed",
        "Not Employed": "verify_income_not_employed",
        "Retired": "verify_income_retired",
        "Self-Employed 1099": "verify_income_self_employed"
      };
      const desiredStepId = verifyMap[surveyData.employment_status];
      if (steps[currentStep].id !== desiredStepId) {
        setCurrentStep(getStepIndexById(desiredStepId));
      }
    }
  }, [surveyData.employment_status, currentStep, steps, getStepIndexById]);

  // Auto-correct open credit lines step only when the answer actually changes.
  useEffect(() => {
    const currentStepId = steps[currentStep].id;
    
    // Only process if the value has actually changed
    if (lastOpenCreditRef.current !== surveyData.open_credit_lines) {
      // If the current step is open_credit_lines, update navigation based on the selection
      if (currentStepId === "open_credit_lines") {
        if (surveyData.open_credit_lines === "Yes, I do") {
          setCurrentStep(getStepIndexById("total_monthly_payments"));
        } else if (surveyData.open_credit_lines === "No, I don't") {
          setCurrentStep(getStepIndexById("gross_annual_income"));
        }
      }
      // Also handle the case when we're on total_monthly_payments and the answer changes to No
      else if (currentStepId === "total_monthly_payments" && surveyData.open_credit_lines === "No, I don't") {
        setCurrentStep(getStepIndexById("gross_annual_income"));
      }
      // Handle the case when we're on gross_annual_income and the answer changes to Yes
      else if (currentStepId === "gross_annual_income" && surveyData.open_credit_lines === "Yes, I do") {
        setCurrentStep(getStepIndexById("total_monthly_payments"));
      }
      
      // Always update the ref to track the latest value
      lastOpenCreditRef.current = surveyData.open_credit_lines;
    }
  }, [surveyData.open_credit_lines, currentStep, steps, getStepIndexById]);

  // Forward navigation based on current step and surveyData
  const handleNext = useCallback(() => {
    const currentStepId = steps[currentStep].id;
    
    // From employment_status, choose verification step based on current answer
    if (currentStepId === "employment_status") {
      switch(surveyData.employment_status) {
        case "Employed":
          setCurrentStep(getStepIndexById("verify_income_employed"));
          return;
        case "Not Employed":
          setCurrentStep(getStepIndexById("verify_income_not_employed"));
          return;
        case "Retired":
          setCurrentStep(getStepIndexById("verify_income_retired"));
          return;
        case "Self-Employed 1099":
          setCurrentStep(getStepIndexById("verify_income_self_employed"));
          return;
        default:
          break;
      }
    }
    
    // From any verification step, go to income_history
    if ([
      "verify_income_employed", 
      "verify_income_not_employed", 
      "verify_income_retired", 
      "verify_income_self_employed"
    ].includes(currentStepId)) {
      setCurrentStep(getStepIndexById("income_history"));
      return;
    }
    
    // From income_history, go to open_credit_lines
    if (currentStepId === "income_history") {
      setCurrentStep(getStepIndexById("open_credit_lines"));
      return;
    }
    
    // From open_credit_lines, conditionally go to total_monthly_payments (if yes) or gross_annual_income (if no)
    if (currentStepId === "open_credit_lines") {
      if (surveyData.open_credit_lines === "Yes, I do") {
        setCurrentStep(getStepIndexById("total_monthly_payments"));
        return;
      } else if (surveyData.open_credit_lines === "No, I don't") {
        setCurrentStep(getStepIndexById("gross_annual_income"));
        return;
      }
    }
    
    // From total_monthly_payments, go to gross_annual_income
    if (currentStepId === "total_monthly_payments") {
      setCurrentStep(getStepIndexById("gross_annual_income"));
      return;
    }
    
    // Default behavior – go to the next step in the steps array.
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  }, [currentStep, getStepIndexById, steps, surveyData]);

  // Backward navigation based on current step and surveyData
  const handleBack = useCallback(() => {
    const currentStepId = steps[currentStep].id;
    
    // From any verification step, go back to employment_status
    if ([
      "verify_income_employed", 
      "verify_income_not_employed", 
      "verify_income_retired", 
      "verify_income_self_employed"
    ].includes(currentStepId)) {
      setCurrentStep(getStepIndexById("employment_status"));
      return;
    }
    
    // From income_history, go back to the correct verification step based on employment status
    if (currentStepId === "income_history") {
      switch(surveyData.employment_status) {
        case "Employed":
          setCurrentStep(getStepIndexById("verify_income_employed"));
          return;
        case "Not Employed":
          setCurrentStep(getStepIndexById("verify_income_not_employed"));
          return;
        case "Retired":
          setCurrentStep(getStepIndexById("verify_income_retired"));
          return;
        case "Self-Employed 1099":
          setCurrentStep(getStepIndexById("verify_income_self_employed"));
          return;
        default:
          break;
      }
    }
    
    // From open_credit_lines, go back to income_history
    if (currentStepId === "open_credit_lines") {
      setCurrentStep(getStepIndexById("income_history"));
      return;
    }
    
    // From total_monthly_payments, go back to open_credit_lines
    if (currentStepId === "total_monthly_payments") {
      setCurrentStep(getStepIndexById("open_credit_lines"));
      return;
    }
    
    // From gross_annual_income, go back based on the answer for credit lines
    if (currentStepId === "gross_annual_income") {
      if (surveyData.open_credit_lines === "Yes, I do") {
        setCurrentStep(getStepIndexById("total_monthly_payments"));
        return;
      } else if (surveyData.open_credit_lines === "No, I don't") {
        setCurrentStep(getStepIndexById("open_credit_lines"));
        return;
      }
    }
    
    // Default behavior – go to the previous step.
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, [currentStep, getStepIndexById, steps, surveyData]);

  // Handle form submission (when reaching the final step)
  const handleSubmit = useCallback(async () => {
    try {
      await onSubmitSurvey();
      setCurrentStep(steps.length - 1);
    } catch (error) {
      console.error("Error submitting qualification data:", error);
    }
  }, [onSubmitSurvey, steps.length]);

  // Calculate progress and stage info
  const progress = Math.floor((currentStep / (steps.length - 1)) * 100);
  const stages = [
    { name: "Property", range: [0, 6] },
    { name: "Financial", range: [7, 14] },
    { name: "Credit", range: [15, 19] },
    { name: "Complete", range: [20, 21] }
  ];
  const currentStageIndex = stages.findIndex(
    stage => currentStep >= stage.range[0] && currentStep <= stage.range[1]
  );
  const CurrentStepComponent = steps[currentStep].component;

  const value = {
    currentStep,
    handleNext,
    handleBack,
    handleSubmit,
    progress,
    stages,
    currentStageIndex,
    steps
  };

  return (
    <NavigationContext.Provider value={value}>
      {children({
        currentStep,
        CurrentStepComponent,
        progress,
        stages,
        currentStageIndex,
        handleNext,
        handleBack,
        handleSubmit
      })}
    </NavigationContext.Provider>
  );
};

// StepContainer component with animation
export const StepContainer = ({ children }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={children.key}
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 border border-gray-200 rounded-xl shadow-lg mx-auto max-w-2xl min-h-[400px]"
    >
      {children}
    </motion.div>
  </AnimatePresence>
);