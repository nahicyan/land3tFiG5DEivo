"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function ContactCard() {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      {/* Desktop Card (hidden on mobile) */}
      <Card className="hidden sm:block w-full max-w-sm mx-auto p-4 shadow-md border border-gray-200">
        <CardHeader className="flex flex-col items-center space-y-4">
          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full justify-center">
            <Button
              onClick={() => (window.location.href = "tel:+18172471312")}
              className="bg-[#324c48] text-white w-28 py-2 text-sm font-semibold uppercase rounded-full shadow-md hover:shadow-lg transition-shadow"
            >
              Call
            </Button>
            <Button
              onClick={() => setOpenDialog(true)}
              className="bg-[#324c48] text-white w-28 py-2 text-sm font-semibold uppercase rounded-full shadow-md hover:shadow-lg transition-shadow"
            >
              Message
            </Button>
          </div>

          {/* Title */}
          <CardTitle className="text-xl font-bold text-gray-800">
            Reach out now!
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Mobile Sticky Bar */}
      <div className="block sm:hidden fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-200 z-50 flex gap-2 overflow-x-hidden">
        <Button
          onClick={() => (window.location.href = "tel:+18172471312")}
          className="bg-[#324c48] text-white flex-1 py-3 text-base font-semibold uppercase rounded-full shadow-md hover:shadow-lg transition-shadow"
        >
          Call
        </Button>
        <Button
          onClick={() => setOpenDialog(true)}
          className="bg-[#324c48] text-white flex-1 py-3 text-base font-semibold uppercase rounded-full shadow-md hover:shadow-lg transition-shadow"
        >
          Message
        </Button>
      </div>

      {/* Message Options Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-white text-gray-900 border border-gray-300 shadow-lg rounded-lg p-6 w-full max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Contact Options
            </DialogTitle>
            <DialogDescription>
              Select an option to contact us:
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row justify-end gap-4">
            <Button
              variant="outline"
              className="w-full sm:w-auto bg-blue-100 text-blue-800"
              onClick={() => {
                window.location.href = "sms:+18172471312";
                setOpenDialog(false);
              }}
            >
              Text/SMS
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto bg-green-100 text-green-800"
              onClick={() => {
                window.open(
                  "https://portal.landersinvestment.com/livechat",
                  "_blank"
                );
                setOpenDialog(false);
              }}
            >
              Live Chat
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto bg-red-100 text-red-800"
              onClick={() => {
                window.location.href = "mailto:info@landivo.com";
                setOpenDialog(false);
              }}
            >
              Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
