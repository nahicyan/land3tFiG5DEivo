import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

export default function Layout() {
  return (
    <div className="bg-[#FDF8F2] text-[#333] min-h-screen flex flex-col">
      {/* Sticky Header with same background */}
      <header className="sticky top-0 z-50 w-full bg-[#FDF8F2]">
        <Header />
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer with a slightly darker beige or complementary color */}
      <footer className="bg-[#EFE8DE]">
        <Footer />
      </footer>
    </div>
  );
}
