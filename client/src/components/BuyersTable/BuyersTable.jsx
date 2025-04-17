// client/src/components/BuyersTable/BuyersTable.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BuyersTableBase from "./BuyersTableBase";
import ActivityDetailView from "./ActivityDetailView";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import ActivityDataProvider from "@/services/ActivityDataProvider";

/**
 * Enhanced BuyersTable component that integrates activity tracking
 * This component wraps the base BuyersTable implementation and adds activity data
 */
const BuyersTable = (props) => {
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [selectedBuyerForActivity, setSelectedBuyerForActivity] = useState(null);
  const [activityData, setActivityData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  /**
   * Handle viewing buyer activity
   * @param {Object} buyer - Buyer object
   */
  const handleViewActivity = async (buyer) => {
    if (!buyer || !buyer.id) {
      console.error("Cannot view activity: Missing buyer or buyer ID");
      return;
    }
    
    setSelectedBuyerForActivity(buyer);
    setActivityDialogOpen(true);
    setLoading(true);
    
    try {
      // If this buyer is a VIP buyer with an auth0Id, fetch their activity data
      if (buyer.auth0Id) {
        console.log(`Fetching activity data for VIP buyer: ${buyer.id}`);
        const activitySummary = await ActivityDataProvider.getActivitySummary(buyer.id);
        setActivityData(activitySummary);
      } else {
        console.log(`No activity data available for buyer: ${buyer.id}`);
        setActivityData(null);
      }
    } catch (error) {
      console.error("Error fetching activity data:", error);
      setActivityData(null);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      {/* Original BuyersTable with enhanced onViewActivity prop */}
      <BuyersTableBase 
        {...props}
        onViewActivity={handleViewActivity}
      />
      
      {/* Activity Detail Dialog */}
      <Dialog 
        open={activityDialogOpen} 
        onOpenChange={setActivityDialogOpen}
      >
        <DialogContent className="max-w-4xl">
          <div className="max-h-[70vh] overflow-y-auto">
            {selectedBuyerForActivity && (
              loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-[#324c48] mb-4" />
                  <p className="text-[#324c48]">Loading buyer activity data...</p>
                </div>
              ) : (
                <ActivityDetailView 
                  buyer={selectedBuyerForActivity} 
                  activityData={activityData}
                />
              )
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BuyersTable;