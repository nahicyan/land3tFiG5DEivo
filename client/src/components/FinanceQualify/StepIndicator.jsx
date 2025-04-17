import React from "react";
import { useNavigation } from "./NavigationProvider";

const StepIndicator = () => {
  const { progress, stages, currentStageIndex } = useNavigation();

  return (
    <div className="w-full mb-8">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
        <div 
          className="bg-[#3f4f24] h-2.5 rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Stage indicators */}
      <div className="flex justify-between px-2">
        {stages.map((stage, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className={`w-4 h-4 rounded-full mb-1 ${
                index <= currentStageIndex 
                  ? 'bg-[#3f4f24]' 
                  : 'bg-gray-300'
              }`}
            ></div>
            <span 
              className={`text-xs ${
                index <= currentStageIndex 
                  ? 'text-[#3f4f24] font-medium' 
                  : 'text-gray-500'
              }`}
            >
              {stage.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;