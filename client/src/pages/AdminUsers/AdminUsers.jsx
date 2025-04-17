import React from "react";
import UsersTable from "@/components/UsersTable/UsersTable";

export default function AdminUsers() {
  return (
    <div className="w-full bg-white">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-[#324c48] mb-6">User Management</h1>
        <p className="text-[#324c48] mb-6">
          View and manage all users on the platform. Use the filters to find specific users.
        </p>
        
        <UsersTable />
      </div>
    </div>
  );
}