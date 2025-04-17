import React from "react";
import Header from "../components/Header/Header";
import Hero from "../components/Hero/Hero";
import Lands from "../components/Lands/Lands";
import Why from "../components/Why/Why";
import Contact from "../components/Contact/Contact";
import GetStarted from "../components/GetStarted/GetStarted";
import Footer from "../components/Footer/Footer";
import Content from "@/components/Content/Content";
export const Site = () => {
  return (
    <div className="App">
      <div>
        <div className="white-gradient" />
        <Hero />
      </div>
      <Lands />
      <Content/>
      <Why />
      <Contact />
      <GetStarted />
    </div>
  );
};
export default Site;
