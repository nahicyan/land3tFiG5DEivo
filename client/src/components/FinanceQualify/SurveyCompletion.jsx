import React, { useEffect, useState } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Phone, Upload, Home, Download } from "lucide-react";

export default function SurveyCompletion({ surveyData }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const disqualified = !surveyData.qualified;

  // Simulate processing time
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Translation object based on selected language
  const translations = {
    en: {
      evaluating: "Evaluating Your Application...",
      congratulations: "Congratulations",
      completed: "You're Pre-Qualified!",
      review: "We'll review your application and contact you shortly to discuss next steps for purchasing this property.",
      sorry: "We're Sorry",
      notQualified: "You Currently Do Not Qualify For Our Seller Finance Program",
      helpMessage: "However, we may still be able to help!",
      nextSteps: "Here's what you can do next:",
      step1: "Provide additional documents (such as proof of income, bank statements, or credit report)",
      step2: "Speak with our team to explore possible solutions",
      reviewMessage: "We're happy to review your situation and see if we can find a way to move forward.",
      backToProperties: "Back to Properties",
      downloadResults: "Download Results",
      callTeam: "Call our team",
      sendDocuments: "Send more Documents"
    },
    es: {
      evaluating: "Evaluando su solicitud...",
      congratulations: "¡Felicidades!",
      completed: "¡Está pre-calificado!",
      review: "Revisaremos su solicitud y nos comunicaremos con usted en breve para hablar sobre los próximos pasos para la compra de esta propiedad.",
      sorry: "Lo sentimos",
      notQualified: "Actualmente no califica para nuestro programa de financiación del vendedor",
      helpMessage: "Sin embargo, ¡aún podemos ayudarle!",
      nextSteps: "Esto es lo que puede hacer a continuación:",
      step1: "Proporcionar documentos adicionales (como comprobante de ingresos, estados de cuenta bancarios o informe crediticio)",
      step2: "Hable con nuestro equipo para explorar posibles soluciones",
      reviewMessage: "Estaremos encantados de revisar su situación y ver si podemos encontrar una manera de avanzar.",
      backToProperties: "Volver a Propiedades",
      downloadResults: "Descargar Resultados",
      callTeam: "Llamar a nuestro equipo",
      sendDocuments: "Enviar más documentos"
    }
  };

  // Get translations based on selected language
  const t = translations[surveyData.language || "en"];
  
  // First name to personalize the message
  const firstName = surveyData.firstName || "";

  // Function to generate a PDF report (this would be implemented with a PDF library in practice)
  const handleDownloadResults = () => {
    alert("This feature would generate a PDF qualification report showing the user's qualification status and details.");
  };
  
  // Function to call the team
  const handleCallTeam = () => {
    window.location.href = "tel:+18172471312";
  };
  
  // Function to send documents
  const handleSendDocuments = () => {
    window.location.href = "mailto:info@landivo.com?subject=Additional Documents for Qualification";
  };

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <div className="text-center">
          {loading ? (
            <>
              <h2 className="text-2xl font-semibold text-[#324c48] mb-6">
                {t.evaluating}
              </h2>
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#D4A017]"></div>
              </div>
            </>
          ) : (
            <>
              {disqualified ? (
                <div className="space-y-6">
                  {/* Disqualified Result - Enhanced Design */}
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-amber-50 border-2 border-amber-100 flex items-center justify-center mb-4">
                      <span className="text-3xl font-bold text-amber-500">!</span>
                    </div>
                    <h2 className="text-2xl font-bold text-[#324c48] mb-2">
                      {t.sorry}{firstName && `, ${firstName}`}
                    </h2>
                    <div className="max-w-md mx-auto">
                      <p className="text-xl font-medium text-gray-700 mb-2">
                        {t.notQualified}
                      </p>
                      <p className="text-lg text-[#3f4f24] font-medium">
                        {t.helpMessage}
                      </p>
                    </div>
                  </div>
                  
                  {/* Next Steps Section - Enhanced with shadcn */}
                  <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6 max-w-md mx-auto">
                    <h3 className="font-semibold text-[#3f4f24] mb-4 text-left">{t.nextSteps}</h3>
                    <ul className="space-y-4 text-[#324c48] text-left">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{t.step1}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{t.step2}</span>
                      </li>
                    </ul>
                    <p className="mt-4 text-[#324c48] text-left">
                      {t.reviewMessage}
                    </p>
                  </div>
                  
                  {/* Call-to-Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                    <Button
                      className="bg-[#324c48] hover:bg-[#3c5d58] text-white py-6"
                      onClick={handleCallTeam}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {t.callTeam}
                    </Button>
                    <Button
                      className="bg-[#D4A017] hover:bg-[#b88914] text-white py-6"
                      onClick={handleSendDocuments}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {t.sendDocuments}
                    </Button>
                  </div>
                  
                  {/* Back to Properties Link */}
                  <div className="mt-6">
                    <Button
                      variant="outline"
                      className="border-[#324c48] text-[#324c48]"
                      onClick={() => navigate("/properties")}
                    >
                      <Home className="w-4 h-4 mr-2" />
                      {t.backToProperties}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Qualified Result */}
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-100 flex items-center justify-center mb-4">
                      <span className="text-3xl font-bold text-green-500">✓</span>
                    </div>
                    <h2 className="text-2xl font-bold text-[#3f4f24] mb-2">
                      {t.congratulations}{firstName && ` ${firstName}!`}
                    </h2>
                    <p className="text-xl font-medium text-[#324c48] mb-2">
                      {t.completed}
                    </p>
                    <p className="text-lg text-[#324c48] max-w-lg mx-auto">
                      {t.review}
                    </p>
                  </div>
                  
                  {/* Display Selected Payment Plan Details */}
                  {surveyData.selected_plan && (
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6 max-w-md mx-auto">
                      <h3 className="font-semibold text-[#3f4f24] mb-4 text-left">Selected Payment Plan Details</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div className="font-medium">Plan:</div>
                        <div>Plan {surveyData.selected_plan}</div>
                        
                        <div className="font-medium">Down Payment:</div>
                        <div>${parseFloat(surveyData.down_payment || 0).toLocaleString()}</div>
                        
                        <div className="font-medium">Monthly Payment:</div>
                        <div>${parseFloat(surveyData.monthly_payment || 0).toLocaleString()}/mo</div>
                        
                        <div className="font-medium">Interest Rate:</div>
                        <div>{surveyData.interest_rate}%</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                    <Button
                      className="bg-[#324c48] hover:bg-[#3c5d58] text-white py-6"
                      onClick={handleDownloadResults}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {t.downloadResults}
                    </Button>
                    <Button
                      className="bg-[#D4A017] hover:bg-[#b88914] text-white py-6"
                      onClick={() => navigate("/properties")}
                    >
                      <Home className="w-4 h-4 mr-2" />
                      {t.backToProperties}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}