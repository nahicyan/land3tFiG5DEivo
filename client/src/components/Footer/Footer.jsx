import { ArrowRight, Mail, MessageCircle, Phone, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  const linkStyle = "relative transition duration-300 ease-in-out hover:text-[#D4A017]";
  
  return (
    <footer className="bg-[#FDF8F2] text-[#324c48] py-20 px-4 md:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-[#3f4f24] opacity-5 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#D4A017] opacity-5 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 relative z-10">
        {/* Left Column with Logo and Contact */}
        <div className="space-y-10">
          <div>
            {/* Logo placeholder */}
            <div className="mb-6 flex items-center">
              <span className="text-2xl font-bold text-[#324c48]">LANDIVO</span>
              <span className="ml-2 px-2 py-1 bg-[#D4A017]/10 rounded text-[#D4A017] text-xs uppercase tracking-wider font-semibold">Land Wholesaling</span>
            </div>
            
            <p className="text-[#324c48]/80 max-w-md">
              Connecting you with exclusive land opportunities through flexible, buyer-friendly solutions.
            </p>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#324c48] uppercase tracking-wider">CONTACT US</h3>
            
            <div className="space-y-6">
              <a 
                href="tel:+18172471312" 
                className="flex items-center space-x-3 group"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-md group-hover:bg-[#D4A017] transition-all duration-300">
                  <Phone className="w-5 h-5 text-[#324c48] group-hover:text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#324c48]/60">Send Us A Text</p>
                  <p className="text-[#324c48] font-medium">+1 (817) 247-1312</p>
                </div>
              </a>
              
              <a 
                href="mailto:info@landivo.com" 
                className="flex items-center space-x-3 group"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-md group-hover:bg-[#D4A017] transition-all duration-300">
                  <Mail className="w-5 h-5 text-[#324c48] group-hover:text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#324c48]/60">Email Us At</p>
                  <p className="text-[#324c48] font-medium">info@landivo.com</p>
                </div>
              </a>
              
              <a 
                href="#" 
                className="flex items-center space-x-3 group"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-md group-hover:bg-[#D4A017] transition-all duration-300">
                  <MessageCircle className="w-5 h-5 text-[#324c48] group-hover:text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#324c48]/60">Chat With Us</p>
                  <p className="text-[#324c48] font-medium">Live Support Available</p>
                </div>
              </a>
            </div>
          </div>
        </div>
        
        {/* Right Column with Links and CTA */}
        <div className="flex flex-col justify-between space-y-10">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#324c48] uppercase tracking-wider">Explore</h3>
              <ul className="space-y-4">
                <li>
                  <a href="/properties" className={linkStyle}>
                    Properties
                  </a>
                </li>
                <li>
                  <a href="/about-us" className={linkStyle}>
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/financing" className={linkStyle}>
                    Financing Options
                  </a>
                </li>
                <li>
                  <a href="/vip-signup" className={linkStyle}>
                    VIP Buyers List
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#324c48] uppercase tracking-wider">Areas</h3>
              <ul className="space-y-4">
                <li>
                  <a href="/DFW" className={linkStyle}>
                    Dallas Fort Worth
                  </a>
                </li>
                <li>
                  <a href="/Austin" className={linkStyle}>
                    Austin
                  </a>
                </li>
                <li>
                  <a href="/Houston" className={linkStyle}>
                    Houston
                  </a>
                </li>
                <li>
                  <a href="/SanAntonio" className={linkStyle}>
                    San Antonio
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-auto">
            <div className="flex space-x-4 mb-8">
              <a href="#" className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[#3f4f24] hover:text-white transition-all duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[#3f4f24] hover:text-white transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[#3f4f24] hover:text-white transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[#3f4f24] hover:text-white transition-all duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            
            <a 
              href="/schedule-call" 
              className="group flex items-center gap-2 bg-white shadow-md text-[#324c48] py-3 px-8 font-medium rounded-full transition-all duration-300 hover:bg-[#D4A017] hover:text-white"
            >
              <span>Schedule a call now</span>
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-[#324c48]/10 text-sm text-[#324c48]/60 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-medium">© LANDIVO {new Date().getFullYear()}. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-6">
          <a href="/privacy-policy" className="hover:text-[#D4A017] transition-colors">Privacy Policy</a>
          <a href="/terms" className="hover:text-[#D4A017] transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}