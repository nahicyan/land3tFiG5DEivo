import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail } from "lucide-react";

/**
 * BuyerAreasTab component - Displays buyers grouped by area
 * 
 * @param {Object} props
 * @param {Array} props.areas - Array of area objects with id and label
 * @param {Object} props.stats - Stats object containing byArea counts
 * @param {Function} props.getBuyersForArea - Function to get buyers for a specific area
 * @param {Function} props.setAreaFilter - Function to set area filter
 * @param {Function} props.setSelectedBuyers - Function to set selected buyers
 * @param {Function} props.setEmailDialogOpen - Function to open email dialog
 */
const BuyerAreasTab = ({ 
  areas = [], 
  stats = { byArea: {} }, 
  getBuyersForArea = () => [], 
  setAreaFilter = () => {}, 
  setSelectedBuyers = () => {}, 
  setEmailDialogOpen = () => {} 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Buyers by Area</CardTitle>
        <CardDescription>
          Browse buyers grouped by their preferred areas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map(area => {
            const areaCount = stats.byArea[area.id] || 0;
            const areaBuyers = getBuyersForArea(area.id) || [];
            
            return (
              <Card key={area.id} className="border border-[#324c48]/20">
                <CardHeader className="bg-[#f0f5f4] border-b">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">{area.label}</CardTitle>
                    <Badge className="bg-[#3f4f24]">{areaCount}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  {areaCount > 0 ? (
                    <div className="space-y-4">
                      <div className="text-sm">
                        {areaBuyers.slice(0, 3).map((buyer, idx) => (
                          <div key={idx} className="py-2 border-b border-dashed border-gray-200 last:border-0">
                            <div className="font-medium">{buyer.firstName} {buyer.lastName}</div>
                            <div className="text-xs text-gray-500">{buyer.email}</div>
                          </div>
                        ))}
                        {areaCount > 3 && (
                          <div className="text-center text-sm text-[#324c48] mt-2">
                            + {areaCount - 3} more
                          </div>
                        )}
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full border-[#324c48] text-[#324c48]"
                        onClick={() => {
                          setAreaFilter(area.id);
                          // Simulate clicking the "list" tab more safely
                          const listTab = document.querySelector('[data-state="inactive"][value="list"]');
                          if (listTab && typeof listTab.click === 'function') {
                            listTab.click();
                          }
                        }}
                      >
                        View All {area.label} Buyers
                      </Button>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-gray-500">
                      No buyers for this area
                    </div>
                  )}
                </CardContent>
                <CardFooter className="bg-gray-50 border-t py-2">
                  <Button 
                    variant="ghost" 
                    className="w-full text-[#324c48]"
                    onClick={() => {
                      // Select all buyers for this area and open email dialog
                      const buyersForArea = getBuyersForArea(area.id) || [];
                      setSelectedBuyers(buyersForArea.map(b => b.id));
                      setEmailDialogOpen(true);
                    }}
                    disabled={areaCount === 0}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email {area.label} Buyers
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BuyerAreasTab;