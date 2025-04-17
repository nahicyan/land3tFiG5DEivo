import { useState } from "react";
import { Box, Typography, Fab } from "@mui/material";

const FloatingButton = ({ icon, label, bgColor, hoverColor, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        mb: 2, // Space between buttons
      }}
    >
      {/* Label (Visible on Hover) */}
      {hovered && (
        <Typography
          variant="body2"
          sx={{
            background: "#000",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: "6px",
            marginRight: "10px",
            transition: "opacity 0.3s ease",
            opacity: hovered ? 1 : 0,
          }}
        >
          {label}
        </Typography>
      )}

      {/* Floating Button */}
      <Fab
        color="primary"
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        sx={{
          backgroundColor: bgColor,
          width: hovered ? 72 : 48, // Increase size on hover
          height: hovered ? 72 : 48, // Increase size on hover
          transition: "all 0.3s ease-in-out",
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
          "&:hover": {
            backgroundColor: hoverColor,
          },
        }}
      >
        {icon}
      </Fab>
    </Box>
  );
};

export default FloatingButton;
