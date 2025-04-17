// client/src/pages/Unauthorized/Unauthorized.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

export default function Unauthorized() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDF8F2] p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <Shield className="w-12 h-12 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-[#324c48] mb-2">Access Denied</h1>
        
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. Please contact your administrator
          if you believe this is an error.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button 
            onClick={() => navigate('/')}
            className="bg-[#3f4f24] hover:bg-[#2c3b18] text-white"
          >
            Return Home
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate(-1)}
            className="border-[#324c48] text-[#324c48]"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}