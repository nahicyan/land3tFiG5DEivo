import React from "react"
import FinancingHero from "./Hero"
import Choose from "./Choose"
import Content from "./Content"
import FinancingSlider from "./FinanceSlider"
import Action from "./Action"
import MainContent from "./MainContent"

export default function Financing() {
  return (
    <>
    <div className="w-full bg-[#FDF8F2]">
      <FinancingHero />
    </div>
    <div className="w-full bg-[#FDF8F2]">
      <Content/>
    </div>
    <div id="financing-slider" className="w-full bg-[#FDF8F2]">
      <FinancingSlider/>
    </div>
    <div className="w-full bg-[#FDF8F2]">
      <MainContent/>
    </div>
    <div className="w-full bg-[#FDF8F2]">
      <Choose/>
    </div>
    <div className="w-full bg-[#FDF8F2]">
      <Action/>
    </div>
    </>
  )
}
