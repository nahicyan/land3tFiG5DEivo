// client/src/components/OfferManagement/OfferActions.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle, XCircle, DollarSign, MoreHorizontal } from 'lucide-react';

const OfferActions = ({ offer, onUpdateOffer }) => {
  const [isCounterDialogOpen, setIsCounterDialogOpen] = useState(false);
  const [counterPrice, setCounterPrice] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const handleCounterSubmit = () => {
    if (!counterPrice || parseFloat(counterPrice) <= 0) {
      return;
    }
    
    onUpdateOffer(offer.id, 'COUNTERED', parseFloat(counterPrice));
    setIsCounterDialogOpen(false);
    setCounterPrice('');
  };

  const openConfirmDialog = (action) => {
    setConfirmAction(action);
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (confirmAction === 'ACCEPTED') {
      onUpdateOffer(offer.id, 'ACCEPTED');
    } else if (confirmAction === 'REJECTED') {
      onUpdateOffer(offer.id, 'REJECTED');
    }
    
    setConfirmDialogOpen(false);
    setConfirmAction(null);
  };

  // Format price for display
  const formatPrice = (price) => {
    if (!price && price !== 0) return '$0';
    return `$${parseFloat(price).toLocaleString('en-US')}`;
  };

  // Don't show actions for offers that are already processed
  if (offer.offerStatus && offer.offerStatus !== 'PENDING') {
    return (
      <span className="text-gray-500 italic text-sm">
        {offer.offerStatus === 'ACCEPTED' && 'Accepted'}
        {offer.offerStatus === 'REJECTED' && 'Rejected'}
        {offer.offerStatus === 'COUNTERED' && 'Countered'}
        {offer.offerStatus === 'EXPIRED' && 'Expired'}
      </span>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => openConfirmDialog('ACCEPTED')}
            className="text-green-600 cursor-pointer"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Accept Offer
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => openConfirmDialog('REJECTED')}
            className="text-red-600 cursor-pointer"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject Offer
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsCounterDialogOpen(true)}
            className="text-blue-600 cursor-pointer"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Counter Offer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Counter Offer Dialog */}
      <Dialog open={isCounterDialogOpen} onOpenChange={setIsCounterDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Counter Offer</DialogTitle>
            <DialogDescription>
              Enter the counter offer price for {offer.buyer?.firstName} {offer.buyer?.lastName}'s offer of {formatPrice(offer.offeredPrice)}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="counterPrice" className="text-right">
              Counter Price ($)
            </Label>
            <Input
              id="counterPrice"
              type="number"
              min="0"
              step="1000"
              value={counterPrice}
              onChange={(e) => setCounterPrice(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCounterDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCounterSubmit} className="bg-[#324c48] text-white">
              Submit Counter Offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {confirmAction === 'ACCEPTED' ? 'Accept Offer' : 'Reject Offer'}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === 'ACCEPTED'
                ? `Are you sure you want to accept ${offer.buyer?.firstName} ${offer.buyer?.lastName}'s offer of ${formatPrice(offer.offeredPrice)}?`
                : `Are you sure you want to reject ${offer.buyer?.firstName} ${offer.buyer?.lastName}'s offer of ${formatPrice(offer.offeredPrice)}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAction}
              className={confirmAction === 'ACCEPTED' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}
            >
              {confirmAction === 'ACCEPTED' ? 'Accept' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OfferActions;