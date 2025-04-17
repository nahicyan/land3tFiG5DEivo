import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { motion } from "framer-motion";
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarIcon, SparklesIcon, ArrowRightIcon, ChevronDoubleRightIcon, UserCircleIcon, HomeIcon, TagIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import confetti from 'canvas-confetti';

export default function VipSignupSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth0();
  const [showConfetti, setShowConfetti] = useState(true);
  
  // Get user's name with proper fallbacks
  const getUserName = () => {
    // First try location state (passed from VipSignupForm)
    if (location.state && location.state.firstName) {
      return location.state.firstName;
    }
    
    // Then try Auth0 user object if authenticated
    if (isAuthenticated && user) {
      // Try different possible name fields in Auth0 user object
      return user.given_name || 
             user.name?.split(' ')[0] || 
             user.nickname ||
             user.email?.split('@')[0] ||
             'VIP Member';
    }
    
    // Final fallback
    return 'VIP Member';
  };
  
  const firstName = getUserName();

  // Trigger confetti effect on mount
  useEffect(() => {
    if (showConfetti) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // Gold confetti from left
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: randomInRange(0.2, 0.5) },
          colors: ['#D4A017', '#FFD700', '#FFF8DC'],
        });
        
        // Green confetti from right
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: randomInRange(0.2, 0.5) },
          colors: ['#3f4f24', '#324c48', '#546930'],
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [showConfetti]);

  const benefits = [
    { 
      icon: <ChevronDoubleRightIcon className="h-6 w-6" />,
      title: "Priority Access",
      description: "Be the first to see new properties days before public listings"
    },
    { 
      icon: <TagIcon className="h-6 w-6" />,
      title: "Exclusive Discounts",
      description: "Enjoy up to 15% off asking prices available only to VIP members"
    },
    { 
      icon: <SparklesIcon className="h-6 w-6" />,
      title: "Personalized Matchmaking",
      description: "Receive property recommendations tailored to your preferences"
    },
    { 
      icon: <StarIconSolid className="h-6 w-6" />,
      title: "VIP Support",
      description: "Direct line to our land specialists for premium assistance"
    }
  ];

  return (
    <div className="min-h-screen py-16 bg-gradient-to-b from-[#FDF8F2] to-[#f4f7ee]">
      <div className="max-w-4xl mx-auto px-4">
        {/* Top badge */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium bg-gradient-to-r from-[#D4A017] to-[#e6ac19] text-white mb-6 rounded-full shadow-lg">
              <StarIconSolid className="h-4 w-4 text-white" />
              VIP STATUS ACTIVATED
            </Badge>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#3f4f24] to-[#324c48] text-transparent bg-clip-text mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            Welcome to the Inner Circle!
          </motion.h1>
          
          <motion.p 
            className="text-xl text-[#324c48]/80 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            Your exclusive journey to premium land opportunities begins now
          </motion.p>
        </div>
        
        {/* Main card */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.7 }}
        >
          <Card className="relative overflow-hidden border-0 shadow-2xl bg-white backdrop-blur-sm bg-opacity-90">
            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#D4A017]/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#3f4f24]/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 p-8 md:p-12">
              {/* Success checkmark */}
              <div className="mb-8 flex justify-center">
                <motion.div 
                  className="h-24 w-24 rounded-full bg-gradient-to-br from-[#3f4f24] to-[#546930] flex items-center justify-center shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 1 
                  }}
                >
                  <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              </div>
              
              {/* Welcome message */}
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-[#324c48] mb-2">
                  Congratulations, <span className="text-[#D4A017]">{firstName}!</span>
                </h2>
                <p className="text-xl text-[#324c48]/80">
                  You've successfully joined our elite VIP Buyers List
                </p>
              </div>
              
              {/* Benefits section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex gap-4 p-4 rounded-xl bg-gradient-to-br from-[#f7f9f0] to-white border border-[#3f4f24]/10 shadow-md"
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + (index * 0.1), duration: 0.5 }}
                  >
                    <div className="h-12 w-12 rounded-full bg-[#D4A017]/10 flex items-center justify-center text-[#D4A017]">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#3f4f24]">{benefit.title}</h3>
                      <p className="text-sm text-[#324c48]/80">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Action buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.5 }}
              >
                <Button 
                  onClick={() => navigate('/properties')}
                  className="w-full sm:w-auto py-6 px-8 bg-gradient-to-r from-[#D4A017] to-[#e6ac19] hover:from-[#e6ac19] hover:to-[#D4A017] text-white font-medium rounded-full shadow-md transition-all duration-300 hover:shadow-xl group"
                >
                  <span>Browse Exclusive Properties</span>
                  <ArrowRightIcon className="ml-2 h-5 w-5 inline-block transition-transform group-hover:translate-x-1" />
                </Button>
                
                <Button 
                  onClick={() => navigate('/profile')}
                  className="w-full sm:w-auto py-6 px-8 bg-gradient-to-r from-[#324c48] to-[#3f4f24] hover:from-[#3f4f24] hover:to-[#324c48] text-white font-medium rounded-full shadow-md transition-all duration-300 hover:shadow-xl group"
                >
                  <UserCircleIcon className="mr-2 h-5 w-5 inline-block" />
                  <span>Customize Your Profile</span>
                </Button>
                
                <Button 
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="w-full sm:w-auto py-6 px-8 border-[#324c48] text-[#324c48] font-medium rounded-full hover:bg-[#324c48]/5 transition-all duration-300"
                >
                  <HomeIcon className="mr-2 h-5 w-5 inline-block" />
                  <span>Return to Homepage</span>
                </Button>
              </motion.div>
            </div>
          </Card>
        </motion.div>
        
        {/* Bottom message */}
        <motion.div 
          className="text-center mt-8 text-[#324c48]/60 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <p>Need help? Contact our VIP support team at <a href="mailto:vip@landivo.com" className="text-[#D4A017] underline hover:text-[#D4A017]/80">vip@landivo.com</a></p>
        </motion.div>
      </div>
    </div>
  );
}