// client/src/components/Header/Header.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import { useAuth } from '@/components/hooks/useAuth';
import { usePermissions } from '@/components/Auth0/PermissionsContext';
import PermissionGuard from '@/components/Auth0/PermissionGuard';
import { PERMISSIONS } from '@/utils/permissions';
import { useVipBuyer } from '@/utils/VipBuyerContext';
import { useUserProfileApi } from '@/utils/api';

const Header = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dbUser, setDbUser] = useState(null);
  
  // Use the enhanced Auth hook and permissions
  const { 
    isAuthenticated, 
    isLoading, 
    user,
    loginWithRedirect, 
    logout 
  } = useAuth();
  
  // Also access VIP buyer data
  const { isVipBuyer, vipBuyerData } = useVipBuyer();
  
  // Use the same hook that the Profile page uses
  const { getUserProfile } = useUserProfileApi();
  
  const { check } = usePermissions();

  // Load database user profile data using the proper authenticated method
  useEffect(() => {
    const loadUserProfile = async () => {
      if (isAuthenticated && !isLoading) {
        try {
          const profile = await getUserProfile();
          console.log('Loaded user profile in Header:', profile);
          setDbUser(profile);
        } catch (error) {
          console.error('Error loading user profile in Header:', error);
        }
      }
    };
    
    loadUserProfile();
  }, [isAuthenticated, isLoading, getUserProfile]);

  const handleLogin = () => {
    loginWithRedirect();
  };

  const handleLogout = () => {
    logout({ 
      logoutParams: {
        returnTo: window.location.origin 
      }
    });
  };
  
  // Get display name with priority to database information
  const getDisplayName = () => {
    // First priority: Complete name from database user profile
    if (dbUser?.firstName && dbUser?.lastName) {
      return `${dbUser.firstName} ${dbUser.lastName}`;
    }
    
    // Second priority: Complete name from VIP buyer data
    if (isVipBuyer && vipBuyerData?.firstName && vipBuyerData?.lastName) {
      return `${vipBuyerData.firstName} ${vipBuyerData.lastName}`;
    }
    
    // Third priority: Partial name from database
    if (dbUser?.firstName) {
      return dbUser.firstName;
    }
    
    if (isVipBuyer && vipBuyerData?.firstName) {
      return vipBuyerData.firstName;
    }
    
    // Fourth priority: Auth0 given_name and family_name
    if (user?.given_name && user?.family_name) {
      return `${user.given_name} ${user.family_name}`;
    }
    
    // Fifth priority: Auth0 name if not an email
    if (user?.name && !user.name.includes('@')) {
      return user.name;
    }
    
    // Final fallback: email or generic "User"
    return user?.email || 'User';
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FDF8F2] border-b border-[#e3a04f] shadow-md">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" title="Landivo">
              <img
                className="w-auto h-10 lg:h-12"
                src="https://shinyhomes.net/wp-content/uploads/2025/02/Landivo.svg"
                alt="Logo"
              />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6 text-[#324c48]" />
                  ) : (
                    <Menu className="w-6 h-6 text-[#324c48]" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="bg-[#FDF8F2] border-r border-[#e3a04f]"
              >
                <div className="space-y-4">
                  {/* Standard navigation items */}
                  {[
                    "Properties",
                    "Sell",
                    "Financing",
                    "About Us",
                    "Support",
                  ].map((item) => (
                    <Link
                      key={item}
                      to={`/${item.toLowerCase().replace(/\s/g, "-")}`}
                      className="block text-lg font-medium text-[#324c48] hover:text-[#D4A017]"
                    >
                      {item}
                    </Link>
                  ))}
                  
                  {/* Admin/Agent items in mobile menu - based on permissions */}
                  {(check.canAccessAdmin || check.canWriteProperties) && (
                    <>
                      <div className="pt-2 mt-4 border-t border-[#e3a04f]/40">
                        <p className="text-sm text-[#324c48]/60 mb-2">Management</p>
                        
                        <PermissionGuard permission={PERMISSIONS.ACCESS_ADMIN}>
                          <Link 
                            to="/admin"
                            className="block text-lg font-medium text-[#324c48] hover:text-[#D4A017]"
                          >
                            Admin Dashboard
                          </Link>
                        </PermissionGuard>
                        
                        <PermissionGuard permission={PERMISSIONS.WRITE_PROPERTIES}>
                          <Link 
                            to="/agent/add-property"
                            className="block text-lg font-medium text-[#324c48] hover:text-[#D4A017] mt-2"
                          >
                            Add Property
                          </Link>
                        </PermissionGuard>
                      </div>
                    </>
                  )}

                  {/* Auth buttons */}
                  {isLoading ? (
                    <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
                  ) : !isAuthenticated ? (
                    <Button
                      onClick={handleLogin}
                      className="w-full bg-[#3f4f24] text-white hover:bg-[#2c3b18]"
                    >
                      Login / Sign Up
                    </Button>
                  ) : (
                    <Button
                      onClick={handleLogout}
                      className="w-full bg-[#324c48] text-white hover:bg-[#253838]"
                    >
                      Logout
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:ml-auto lg:space-x-8">
            <NavigationMenu>
              <NavigationMenuList className="flex space-x-6">
                {[
                  { name: "Properties", path: "/properties" },
                  { name: "Sell", path: "/sell" },
                  { name: "Financing", path: "/financing" },
                  { name: "About Us", path: "/about-us" },
                  { name: "Support", path: "/support" },
                ].map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={item.path}
                        className="text-base font-medium text-[#324c48] hover:text-[#D4A017] transition"
                      >
                        {item.name}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Auth0 Login Button or User Profile */}
            {isLoading ? (
              <div className="h-10 w-28 bg-gray-200 animate-pulse rounded"></div>
            ) : !isAuthenticated ? (
              <Button
                onClick={handleLogin}
                className="bg-[#3f4f24] text-white hover:bg-[#2c3b18]"
              >
                Login / Sign Up
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-[#3f4f24] hover:text-[#D4A017] flex items-center"
                  >
                    {user?.picture ? (
                      <img 
                        src={user.picture} 
                        alt={getDisplayName()} 
                        className="w-8 h-8 rounded-full mr-2"
                      />
                    ) : (
                      <User className="w-5 h-5 mr-2" />
                    )}
                    <span className="max-w-[150px] truncate">
                      {getDisplayName()}
                    </span>
                    <svg
                      className="w-5 h-5 ml-2 -mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-[#FDF8F2] border border-[#e3a04f] shadow-lg"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      to="/profile"
                      className="text-[#324c48] hover:text-[#D4A017] cursor-pointer flex items-center"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  
                  {/* Show Admin Dashboard link only with access:admin permission */}
                  <PermissionGuard permission={PERMISSIONS.ACCESS_ADMIN}>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/admin"
                        className="text-[#324c48] hover:text-[#D4A017] cursor-pointer flex items-center"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </PermissionGuard>
                  
                  {/* Show property management links with write:properties permission */}
                  <PermissionGuard permission={PERMISSIONS.WRITE_PROPERTIES}>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/agent/add-property"
                        className="text-[#324c48] hover:text-[#D4A017] cursor-pointer flex items-center"
                      >
                        <svg 
                          className="w-4 h-4 mr-2" 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                          />
                        </svg>
                        Add Property
                      </Link>
                    </DropdownMenuItem>
                  </PermissionGuard>
                  
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 hover:bg-background-200 cursor-pointer flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;