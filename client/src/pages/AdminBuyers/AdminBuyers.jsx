import React from "react";
import BuyersTable from "@/components/BuyersTable";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminBuyers() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#324c48] mb-2">Buyer Management</h1>
            <p className="text-[#324c48]">
              View and manage all buyers on the platform, including VIP buyers list members.
            </p>
          </div>
{/*           
          <Button 
            onClick={() => navigate('/admin/buyers/create')}
            className="bg-[#324c48] hover:bg-[#3f4f24] text-white"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Buyer
          </Button> */}
        </div>
        
        <BuyersTable />
      </div>
    </div>
  );
}