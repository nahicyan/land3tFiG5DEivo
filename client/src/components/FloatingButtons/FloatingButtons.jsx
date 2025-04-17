import { Box, Button, useMediaQuery } from "@mui/material";
import { Phone, Email, Handshake } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const FloatingButtons = ({ propertyData }) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)"); // Detect mobile view

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 1.5,
        zIndex: 1000,
      }}
    >
      {[
        {
          label: "Call",
          icon: <Phone />,
          action: () => console.log("Calling..."),
        },
        {
          label: "Offer",
          icon: <Handshake />,
          action: () =>
            navigate(`/properties/${propertyData?.id}/offer`, {
              state: { property: propertyData },
            }),
        },
        {
          label: "Message",
          icon: <Email />,
          action: () => console.log("Messaging..."),
        },
      ].map((button, index) => (
        <Button
          key={index}
          variant="contained"
          startIcon={button.icon}
          onClick={button.action}
          sx={{
            backgroundColor: "#000",
            color: "#fff",
            fontWeight: "bold",
            fontSize: isMobile ? "8px" : "14px",
            padding: isMobile ? "10px" : "10px 20px",
            borderRadius: "50px",
            width: isMobile ? "60px" : "120px",  // Smaller width on mobile
            height: isMobile ? "60px" : "50px",  // Smaller height on mobile
            display: "flex",
            flexDirection: isMobile ? "column" : "row", // Vertical on mobile, horizontal on desktop
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            gap: isMobile ? "2px" : "8px",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#E65100",
            },
            "& .MuiButton-startIcon": {
              margin: isMobile ? "0 0 2px 0" : "0",
              fontSize: isMobile ? "18px" : "inherit",
            },
          }}
        >
          {button.label}
        </Button>
      ))}
    </Box>
  );
};

export default FloatingButtons;
