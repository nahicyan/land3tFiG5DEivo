import React from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BriefcaseIcon, UserIcon, WalletIcon, HeartPulseIcon } from "lucide-react";

export default function EmploymentStatus({ surveyData, updateSurveyData, onNext, onBack }) {
  // Handle selection of employment status
  const handleSelection = (status) => {
    updateSurveyData("employment_status", status);
    onNext();
  };

  // Translation object based on selected language
  const translations = {
    en: {
      title: "What is your current employment status?",
      employed: "Employed",
      notEmployed: "Not Employed",
      selfEmployed: "Self-Employed 1099",
      retired: "Retired",
      back: "Back"
    },
    es: {
      title: "¿Cuál es su situación laboral actual?",
      employed: "Empleado",
      notEmployed: "Desempleado",
      selfEmployed: "Autónomo (1099)",
      retired: "Jubilado",
      back: "Atrás"
    }
  };

  // Get translations based on selected language
  const t = translations[surveyData.language || "en"];

  const options = [
    {
      value: "Employed",
      label: t.employed,
      icon: <BriefcaseIcon className="w-5 h-5 mr-2" />
    },
    {
      value: "Not Employed",
      label: t.notEmployed,
      icon: <UserIcon className="w-5 h-5 mr-2" />
    },
    {
      value: "Self-Employed 1099",
      label: t.selfEmployed,
      icon: <WalletIcon className="w-5 h-5 mr-2" />
    },
    {
      value: "Retired",
      label: t.retired,
      icon: <HeartPulseIcon className="w-5 h-5 mr-2" />
    }
  ];

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#324c48] mb-6">
            {t.title}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            {options.map((option) => (
              <Button
                key={option.value}
                className="py-6 px-4 bg-white hover:bg-[#f4f7ee] text-[#3f4f24] text-lg rounded-lg border border-[#3f4f24] transition-all duration-200 hover:shadow-md flex items-center justify-center"
                onClick={() => handleSelection(option.value)}
              >
                {option.icon}
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