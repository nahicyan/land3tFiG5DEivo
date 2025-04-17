import React, { useState } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CurrentCreditScore({ surveyData, updateSurveyData, onNext, onBack }) {
  const [selectedChoice, setSelectedChoice] = useState(surveyData.current_credit_score || null);
  
  // Handle selection
  const handleSelectChoice = (choice) => {
    setSelectedChoice(choice);
    
    // Update the survey data with the selected credit score
    updateSurveyData("current_credit_score", choice);
    
    // Use a slight delay for visual feedback
    setTimeout(() => {
      onNext();
    }, 300);
  };

  // Translation object based on selected language
  const translations = {
    en: {
      title: "What is your current credit score?",
      excellent: "Excellent (720+)",
      good: "Good (680-719)",
      fair: "Fair (660-679)",
      belowAverage: "Below average (620-659)",
      poor: "Poor (580-619)",
      bad: "Bad (Below 580)",
      noCredit: "No Credit",
      back: "Back"
    },
    es: {
      title: "¿Cuál es su puntaje de crédito actual?",
      excellent: "Excelente (720+)",
      good: "Bueno (680-719)",
      fair: "Regular (660-679)",
      belowAverage: "Por debajo del promedio (620-659)",
      poor: "Deficiente (580-619)",
      bad: "Malo (Por debajo de 580)",
      noCredit: "Sin Crédito",
      back: "Atrás"
    }
  };

  // Get translations based on selected language
  const t = translations[surveyData.language || "en"];

  // Define credit score options
  const creditScoreOptions = [
    { value: "Excellent (720+)", label: t.excellent },
    { value: "Good (680-719)", label: t.good },
    { value: "Fair (660-679)", label: t.fair },
    { value: "Below average (620-659)", label: t.belowAverage },
    { value: "Poor (580-619)", label: t.poor },
    { value: "Bad (Below 580)", label: t.bad },
    { value: "No Credit", label: t.noCredit }
  ];

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#324c48] mb-6">
            {t.title}
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mt-8">
            {creditScoreOptions.map((option) => (
              <Button
                key={option.value}
                className={`
                  py-6 
                  px-4 
                  bg-white 
                  hover:bg-[#f4f7ee] 
                  text-[#3f4f24] 
                  text-lg 
                  rounded-lg 
                  border 
                  border-[#3f4f24] 
                  transition-all 
                  duration-200 
                  hover:shadow-md
                  ${selectedChoice === option.value ? 'ring-2 ring-offset-1 ring-[#D4A017]' : ''}
                `}
                onClick={() => handleSelectChoice(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              className="text-[#324c48] border-[#324c48] hover:bg-[#f0f5f4]"
              onClick={onBack}
            >
              {t.back}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}