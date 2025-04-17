import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export const EnhancedFooterSubscription = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Reset error state
    setError('');
    
    // Validate email input
    if (!email.trim()) {
      setShowDialog(true);
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // If we reach here, the email is valid, navigate to subscription page with email
    navigate(`/subscription?email=${encodeURIComponent(email)}`);
  };

  const handleDialogSubmit = () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setShowDialog(false);
    // Navigate to subscription page
    navigate(`/subscription?email=${encodeURIComponent(email)}`);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="relative">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="block w-full p-4 text-[#3f4f24] placeholder-[#324c48] transition-all duration-200 bg-white border border-[#324c48] rounded-md focus:outline-none focus:border-[#D4A017] caret-[#D4A017]"
          />
          
          <button
            type="submit"
            className="inline-flex items-center justify-center px-6 py-4 mt-3 w-full font-semibold text-white transition-all duration-200 bg-[#324c48] rounded-md hover:bg-[#3f4f24] focus:bg-[#3f4f24]"
          >
            Subscribe
          </button>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mt-2 bg-red-50 text-red-600 border border-red-200">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </form>

      {/* Email Request Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-white p-6 rounded-lg border border-[#324c48]/20 shadow-lg max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#3f4f24]">
              Enter Your Email
            </DialogTitle>
            <DialogDescription className="text-[#324c48] mt-2">
              Please provide your email address to subscribe to our property alerts.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full p-4 text-[#3f4f24] border border-[#324c48] rounded-md focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017]"
            />
            {error && (
              <p className="text-red-600 text-sm mt-1">{error}</p>
            )}
          </div>

          <DialogFooter className="mt-6 flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="border-[#324c48] text-[#324c48]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDialogSubmit}
              className="bg-[#324c48] text-white hover:bg-[#3f4f24]"
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedFooterSubscription;