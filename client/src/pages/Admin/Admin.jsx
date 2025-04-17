// client/src/pages/Admin/Admin.jsx
import React from "react";
import DashboardPage from "@/components/Dashboard/DashboardPage";

export default function Admin({ propertyData }) {
  return (
    <div className="w-full bg-white">
      <div className="w-full px-4 py-6">
        <DashboardPage propertyData={propertyData} />
      </div>
    </div>
  );
}