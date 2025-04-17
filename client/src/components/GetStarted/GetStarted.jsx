import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HiOutlineMail } from "react-icons/hi";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const GetStarted = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Reset error state
    setError("");
    
    // Validate email input
    if (!email.trim()) {
      setShowDialog(true);
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    // If email is valid, navigate to subscription page
    navigate(`/subscription?email=${encodeURIComponent(email)}`);
  };

  const handleDialogSubmit = () => {
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setShowDialog(false);
    // Navigate to subscription page
    navigate(`/subscription?email=${encodeURIComponent(email)}`);
  };

  return (
    <section className="py-12 bg-[#FDF8F2]">
      <div className="max-w-screen-lg mx-auto px-6 relative">
        {/* Background elements with themed colors */}
        <div className="absolute top-10 right-10 w-40 h-40 bg-[#D4A017]/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-[#3f4f24]/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-40 left-40 w-20 h-20 bg-[#324c48]/15 rounded-full blur-2xl -z-10"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10"
        >
          {/* Card Container */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#e3a04f]/20">
            <div className="grid md:grid-cols-5 gap-0">
              {/* Left Content - Form */}
              <div className="md:col-span-3 p-8 md:p-10 bg-white">
                <div className="max-w-md mx-auto md:ml-0">
                  {/* Heading & Subtext */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <h2 className="text-3xl sm:text-4xl font-bold text-[#3f4f24] mb-4">
                      Join Our Exclusive Buyers List
                    </h2>
                    <p className="text-[#324c48] mb-8 leading-relaxed">
                      Get notified before everyone else, receive instant discounts on
                      properties, and stay up to date with notifications only in the areas
                      you care about.
                    </p>
                  </motion.div>
                  
                  {/* Form Container */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="space-y-4"
                  >
                    <form onSubmit={handleSubmit}>
                      <div className="relative">
                        <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#324c48] h-5 w-5" />
                        <input
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-3 pl-10 border border-[#324c48] rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4A017] hover:border-[#3f4f24] transition-all"
                        />
                      </div>
                      
                      {error && (
                        <Alert variant="destructive" className="mt-2 bg-red-50 text-red-600 border border-red-200">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                      
                      <Button
                        type="submit"
                        className="w-full mt-4 bg-[#324c48] hover:bg-[#3f4f24] text-white font-semibold py-6 text-lg rounded-md transition-all shadow-md hover:shadow-lg"
                      >
                        Get Started
                      </Button>
                    </form>
                    
                    <p className="text-[#324c48] text-sm mt-2">
                      Your email is 100% confidential and we won't spam you.
                    </p>
                  </motion.div>
                </div>
              </div>
              
              {/* Right Content - Pricing Card */}
              <div className="md:col-span-2 bg-[#f4f7ee] p-8 md:p-10 flex flex-col justify-center border-l border-[#e3a04f]/10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="max-w-xs mx-auto"
                >
                  <div className="bg-white rounded-xl shadow-md p-8 text-center border border-[#e3a04f]/10 hover:shadow-lg transition-all">
                    {/* Pricing Display */}
                    <div className="flex flex-col items-center mb-6">
                      {/* Listed Price with strikethrough */}
                      <div className="relative inline-block mb-2">
                        <span className="text-xl font-medium text-[#324c48] relative">
                          Listed Price
                        </span>
                        <span className="absolute left-0 right-0 top-1/2 h-0.5 bg-[#e12b26]"></span>
                      </div>
                      
                      {/* Big Discount */}
                      <div className="relative">
                        <span className="text-3xl sm:text-4xl font-bold text-[#D4A017]">
                          Big Discount
                        </span>
                        <div className="absolute -bottom-1 left-0 right-0 h-3 bg-[#D4A017]/20 -z-10 rounded-sm"></div>
                      </div>
                    </div>
                    
                    {/* Benefits */}
                    <div className="space-y-2 text-left border-t border-[#bacf96]/30 pt-4">
                      <div className="flex items-center text-[#324c48]">
                        <span className="text-[#D4A017] mr-2 text-lg">•</span>
                        <span>Early access to new listings</span>
                      </div>
                      <div className="flex items-center text-[#324c48]">
                        <span className="text-[#D4A017] mr-2 text-lg">•</span>
                        <span>Member-only special pricing</span>
                      </div>
                      <div className="flex items-center text-[#324c48]">
                        <span className="text-[#D4A017] mr-2 text-lg">•</span>
                        <span>Exclusive property alerts</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Email Request Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-white p-6 rounded-lg border border-[#324c48]/20 shadow-lg max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#3f4f24]">
              Enter Your Email
            </DialogTitle>
            <DialogDescription className="text-[#324c48] mt-2">
              Please provide your email address to join our exclusive VIP buyers list.
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
    </section>
  );
};

export default GetStarted;