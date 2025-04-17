import React from "react";
import AboutHero from "./Hero";
import AboutUsContent from "./Content";
import Mission from "./Mission";
import FAQ from "./FAQ";
import Story from "./Story";

// import Choose from "./Choose"
// import Content from "./Content"
// import FinancingSlider from "./FinanceSlider"
// import Action from "./action"

export default function About() {
  return (
    <>
      <div className="w-full bg-[#283e3a]">
        <AboutHero />
      </div>
      <div className="w-full bg-[#FDF8F2]">
        <Story />
      </div>
      <div className="w-full bg-[#FDF8F2]">
        <Mission />
      </div>
      <div className="w-full bg-[#FDF8F2]">
        <AboutUsContent />
      </div>
      <div className="w-full bg-[#FDF8F2]">
        <FAQ />
      </div>
    </>
  );
}
