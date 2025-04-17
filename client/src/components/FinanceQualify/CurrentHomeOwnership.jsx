import React from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HomeIcon, Building2Icon, MoreHorizontalIcon } from "lucide-react";

export default function CurrentHomeOwnership({ surveyData, updateSurveyData, onNext, onBack }) {
  // Handle selection
  const handleSelection = (ownershipStatus) => {
    updateSurveyData("current_home_ownership", ownershipStatus);
    onNext();
  };

  // Translation object based on selected language
  const translations = {
    en: {
      title: "Do you currently own a home?",
      ownHome: "Yes. I currently own a home",
      renting: "No. I am currently renting",
      otherArrangements: "No. I have other living arrangements",
      back: "Back"
    },
    es: {
      title: "¿Actualmente posee una casa?",
      ownHome: "Sí. Actualmente tengo una casa",
      renting: "No. Actualmente estoy alquilando",
      otherArrangements: "No. Tengo otras condiciones de vivienda",
      back: "Atrás"
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
          
          <div className="grid grid-cols-1 gap-4 mt-8">
            <Button
              className="py-6 px-4 bg-white hover:bg-[#f4f7ee] text-[#3f4f24] text-lg rounded-lg border border-[#3f4f24] transition-all duration-200 hover:shadow-md flex items-center justify-center"
              onClick={() => handleSelection("Yes. I currently own a home")}
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              {t.ownHome}
            </Button>
            
            <Button
              className="py-6 px-4 bg-white hover:bg-[#f4f7ee] text-[#3f4f24] text-lg rounded-lg border border-[#3f4f24] transition-all duration-200 hover:shadow-md flex items-center justify-center"
              onClick={() => handleSelection("No. I am currently renting")}
            >
              <Building2Icon className="w-5 h-5 mr-2" />
              {t.renting}
            </Button>
            
            <Button
              className="py-6 px-4 bg-white hover:bg-[#f4f7ee] text-[#3f4f24] text-lg rounded-lg border border-[#3f4f24] transition-all duration-200 hover:shadow-md flex items-center justify-center"
              onClick={() => handleSelection("No. I have other living arrangements")}
            >
              <MoreHorizontalIcon className="w-5 h-5 mr-2" />
              {t.otherArrangements}
            </Button>
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