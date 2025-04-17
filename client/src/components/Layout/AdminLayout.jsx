// client/src/components/Layout/AdminLayout.jsx
import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Assessment as AssessmentIcon,
  ViewList as ViewListIcon,
  Add as AddIcon,
  // Import more appropriate icons for Deals
  AttachMoney as AttachMoneyIcon,  // Add this icon
  Receipt as ReceiptIcon,           // Add this icon (optional alternative)
  Description as DescriptionIcon    // Add this icon (optional alternative)
} from "@mui/icons-material";

// Drawer width for the sidebar
const drawerWidth = 240;

export default function AdminLayout() {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // Admin navigation items
  const menuItems = [
    { text: "Dashboard", icon: <HomeIcon />, path: "/admin" },
    { text: "Properties", icon: <BusinessIcon />, path: "/admin/properties" },
    { text: "Add Property", icon: <AddIcon />, path: "/agent/add-property" },
    { text: "Users", icon: <PeopleIcon />, path: "/admin/users" },
    { text: "Financing Deals", icon: <AttachMoneyIcon />, path: "/admin/deals" },
    { text: "Buyers", icon: <PersonIcon />, path: "/admin/buyers" },
    { text: "Buyer Lists", icon: <ViewListIcon />, path: "/admin/buyer-lists" },
    { text: "Qualifications", icon: <AssessmentIcon />, path: "/admin/qualifications" },
  ];

  return (
    <div className="bg-[#FDF8F2] text-[#333] min-h-screen flex flex-col">
      {/* Header section */}
      <header className="sticky top-0 z-50 w-full bg-[#FDF8F2]">
        <Header />
      </header>

      <div className="flex flex-grow">
        {/* Admin Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "#f5f5f5",
              borderRight: "1px solid #e0e0e0",
              marginTop: "80px", 
            },
          }}
          open={open}
        >
          <Box sx={{ display: "flex", alignItems: "center", padding: "8px 16px" }}>
            <IconButton onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ ml: 2 }}>Admin</Typography>
          </Box>
          
          <Divider />
          
          <List>
            {menuItems.map((item) => (
              <React.Fragment key={item.text}>
                <ListItem
                  button
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path || 
                            (item.path !== '/admin' && location.pathname.startsWith(item.path))}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#e8efdc",
                      borderLeft: "4px solid #3f4f24",
                      "&:hover": {
                        backgroundColor: "#e8efdc",
                      },
                    },
                    "&:hover": {
                      backgroundColor: "#f4f7ee",
                    },
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      color: (location.pathname === item.path || 
                            (item.path !== '/admin' && location.pathname.startsWith(item.path))) 
                            ? "#3f4f24" : "#757575" 
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ 
                      color: (location.pathname === item.path || 
                            (item.path !== '/admin' && location.pathname.startsWith(item.path))) 
                            ? "#3f4f24" : "#424242",
                      "& .MuiTypography-root": { 
                        fontWeight: (location.pathname === item.path || 
                                  (item.path !== '/admin' && location.pathname.startsWith(item.path))) 
                                  ? "bold" : "normal" 
                      }
                    }}
                  />
                </ListItem>
                
                {/* Display sub-items if any and if parent is selected */}
                {item.subItems && item.path !== '/admin' && location.pathname.startsWith(item.path) && (
                  <List disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItem
                        button
                        key={subItem.text}
                        component={Link}
                        to={subItem.path}
                        selected={location.pathname === subItem.path}
                        sx={{
                          pl: 4,
                          "&.Mui-selected": {
                            backgroundColor: "#e8efdc",
                            "&:hover": {
                              backgroundColor: "#e8efdc",
                            },
                          },
                          "&:hover": {
                            backgroundColor: "#f4f7ee",
                          },
                        }}
                      >
                        <ListItemIcon 
                          sx={{ 
                            color: location.pathname === subItem.path ? "#3f4f24" : "#757575",
                            minWidth: '35px' 
                          }}
                        >
                          {subItem.icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={subItem.text} 
                          sx={{ 
                            color: location.pathname === subItem.path ? "#3f4f24" : "#424242",
                            "& .MuiTypography-root": { 
                              fontWeight: location.pathname === subItem.path ? "bold" : "normal",
                              fontSize: '0.9rem'
                            }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </React.Fragment>
            ))}
          </List>
        </Drawer>

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            padding: 3,
            backgroundColor: "#fff",
            minHeight: "calc(100vh - 160px)", // Adjust for Header and Footer
          }}
        >
          <Outlet />
        </Box>
      </div>

      {/* Footer section */}
      <footer className="bg-[#EFE8DE]">
        <Footer />
      </footer>
    </div>
  );
}