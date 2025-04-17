import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check } from 'lucide-react';
// Import from heroicons for compatibility
import { UserGroupIcon, EnvelopeIcon, StarIcon, TagIcon, BellIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function Subscription() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ success: false, message: '', type: '' });
  
  // Get email from URL parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    } else {
      // If no email, redirect back to homepage
      navigate('/');
    }
  }, [location, navigate]);

  const handleOptionSelect = async (type) => {
    if (type === 'buyersList') {
      // For VIP Buyers List, redirect to the signup form
      navigate(`/vip-signup?email=${encodeURIComponent(email)}`);
      return;
    }
    
    try {
      // For standard property alerts, just show success message
      // In a real app, you would make an API call here
      const response = await new Promise(resolve => 
        setTimeout(() => resolve({ success: true }), 1000)
      );
      
      if (response.success) {
        setStatus({
          success: true,
          message: 'You have been subscribed to our property alerts!',
          type: 'propertyAlerts'
        });
      }
    } catch (error) {
      setStatus({
        success: false,
        message: 'There was an error processing your request. Please try again.',
        type: ''
      });
    }
  };

  return (
    <div className="bg-[#FDF8F2] min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#3f4f24] mb-4">Choose Your Subscription Type</h1>
          <p className="text-xl text-[#324c48] max-w-3xl mx-auto">
            Thank you for your interest in Landivo, <span className="font-semibold">{email}</span>. 
            Choose how you'd like to receive property updates and exclusive benefits.
          </p>
          
          {status.success && (
            <Alert className="mt-6 max-w-xl mx-auto bg-green-100 border-green-300 text-green-800">
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* VIP Buyers List Card - Highlighted as the preferred option */}
          <Card className="border-2 border-[#D4A017] transition-all duration-300 hover:shadow-xl scale-105 -rotate-1 transform z-10">
            <div className="absolute -top-4 right-4 bg-[#D4A017] text-white px-4 py-1 rounded-full text-sm font-bold">
              RECOMMENDED
            </div>
            <CardHeader className="text-center border-b pb-6">
              <div className="mx-auto bg-[#3f4f24]/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <StarIcon className="h-8 w-8 text-[#D4A017]" />
              </div>
              <CardTitle className="text-2xl font-bold text-[#3f4f24]">VIP Buyers List</CardTitle>
              <CardDescription className="text-[#324c48] text-base mt-2">
                Premium access to exclusive deals
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-[#D4A017] mr-2 flex-shrink-0" />
                  <span><span className="font-semibold">Early access</span> to new properties before public listings</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-[#D4A017] mr-2 flex-shrink-0" />
                  <span><span className="font-semibold">VIP discounts</span> of up to 15% off asking prices</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-[#D4A017] mr-2 flex-shrink-0" />
                  <span><span className="font-semibold">Priority notification</span> for new financing options</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-[#D4A017] mr-2 flex-shrink-0" />
                  <span><span className="font-semibold">Personalized recommendations</span> based on your preferences</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-[#D4A017] mr-2 flex-shrink-0" />
                  <span><span className="font-semibold">VIP support</span> with dedicated customer service</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleOptionSelect('buyersList')}
                className="w-full bg-[#D4A017] hover:bg-[#D4A017]/90 text-white py-6 text-lg"
              >
                Join VIP Buyers List
              </Button>
            </CardFooter>
          </Card>

          {/* Standard Property Alerts Card */}
          <Card className={`border-2 transition-all duration-300 hover:shadow-lg ${status.type === 'propertyAlerts' ? 'border-[#3f4f24] bg-[#e8efdc]' : 'hover:border-[#324c48]'}`}>
            <CardHeader className="text-center border-b pb-6">
              <div className="mx-auto bg-[#3f4f24]/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <BellIcon className="h-8 w-8 text-[#324c48]" />
              </div>
              <CardTitle className="text-2xl font-bold text-[#3f4f24]">Standard Alerts</CardTitle>
              <CardDescription className="text-[#324c48] text-base mt-2">
                Basic updates on new properties
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Regular updates on new properties</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Notifications for properties in your preferred areas</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Market trends and real estate news</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Easy unsubscribe anytime</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleOptionSelect('propertyAlerts')}
                className={`w-full ${status.type === 'propertyAlerts' 
                  ? 'bg-[#3f4f24] hover:bg-[#3f4f24]' 
                  : 'bg-[#324c48] hover:bg-[#3f4f24]'} text-white py-6 text-lg`}
                disabled={status.success}
              >
                {status.type === 'propertyAlerts' ? 'Successfully Subscribed ✓' : 'Subscribe to Property Alerts'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {status.success && (
          <div className="text-center mt-10">
            <p className="text-lg text-[#324c48] mb-4">
              Thank you for subscribing! You'll receive updates soon.
            </p>
            <Button 
              onClick={() => navigate('/')}
              variant="outline" 
              className="border-[#324c48] text-[#324c48] hover:bg-[#324c48] hover:text-white"
            >
              Return to Homepage
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}