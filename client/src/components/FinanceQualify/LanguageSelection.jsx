import React from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LanguageSelection({ surveyData, updateSurveyData, onNext }) {
  // Handle language selection
  const handleSelectLanguage = (language) => {
    updateSurveyData("language", language);
    onNext();
  };

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#324c48] mb-8">
            Choose Your Language / Elija su Idioma
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-md mx-auto">
            <Button
              className="py-8 bg-[#3f4f24] hover:bg-[#546930] text-white text-lg rounded-lg transition-all duration-200 hover:shadow-md"
              onClick={() => handleSelectLanguage("en")}
            >
              English
            </Button>
            
            <Button
              className="py-8 bg-[#3f4f24] hover:bg-[#546930] text-white text-lg rounded-lg transition-all duration-200 hover:shadow-md"
              onClick={() => handleSelectLanguage("es")}
            >
              Español
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 mt-8">
            Select your preferred language to continue with the qualification process.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}