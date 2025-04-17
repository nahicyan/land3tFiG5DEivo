import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Send } from "lucide-react";
import { toast } from "react-toastify";

export default function EmailForm({ 
  open, 
  onOpenChange, 
  selectedList,
  onSendEmail 
}) {
  // Email data state
  const [emailData, setEmailData] = useState({
    subject: "",
    content: "",
    includeUnsubscribed: false
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmailData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Reset form when dialog closes
  const handleOpenChange = (open) => {
    if (!open) {
      setEmailData({
        subject: "",
        content: "",
        includeUnsubscribed: false
      });
    }
    onOpenChange(open);
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    if (!emailData.subject.trim() || !emailData.content.trim()) {
      toast.error("Email subject and content are required");
      return;
    }

    if (!selectedList) {
      toast.error("No list selected to email");
      return;
    }

    try {
      await onSendEmail(emailData);
      handleOpenChange(false);
    } catch (error) {
      // Error handling is done in the onSendEmail function
      console.error("Send email error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Send Email to List</DialogTitle>
          <DialogDescription>
            {selectedList && (
              <>
                This will send an email to all buyers in the {selectedList.name} list
                ({selectedList.buyerCount} buyers).
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              name="subject"
              value={emailData.subject}
              onChange={handleChange}
              placeholder="Enter email subject"
              className="border-[#324c48]/30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Email Content</Label>
            <Textarea
              id="content"
              name="content"
              value={emailData.content}
              onChange={handleChange}
              placeholder="Enter your email message..."
              className="min-h-[200px] border-[#324c48]/30"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-gray-600">Available Placeholders:</Label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-gray-100">
                {"{firstName}"}
              </Badge>
              <Badge variant="outline" className="bg-gray-100">
                {"{lastName}"}
              </Badge>
              <Badge variant="outline" className="bg-gray-100">
                {"{email}"}
              </Badge>
              <Badge variant="outline" className="bg-gray-100">
                {"{preferredAreas}"}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeUnsubscribed"
              name="includeUnsubscribed"
              checked={emailData.includeUnsubscribed}
              onCheckedChange={(checked) => setEmailData(prev => ({
                ...prev,
                includeUnsubscribed: checked
              }))}
            />
            <Label htmlFor="includeUnsubscribed" className="text-sm">
              Include buyers who have unsubscribed (not recommended)
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-[#324c48] text-white"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}