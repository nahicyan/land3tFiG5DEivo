import React from "react";
import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";

// Reusable Styles
export const textFieldStyle = {
  borderRadius: "12px",
  background: "#fff",
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
  },
  "& .MuiInputLabel-root": {
    fontWeight: 500,
  },
};

export const sectionStyle = {
  borderRadius: "20px",
  padding: "16px 0",              // Padding only for top and bottom
  background: "#f9f9f9",
  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
  border: "1px solid rgba(220, 220, 220, 0.8)",
  marginBottom: "24px",
};

export const sectionTitleStyle = {
  fontWeight: 700,
  fontSize: "1.5rem",
  color: "#2d2d2d",
  marginBottom: "16px",
  borderBottom: "2px solid #e0e0e0",
  paddingBottom: "8px",
  paddingLeft: "16px",
};

export const dropdownStyle = {
  backgroundColor: "#fff",
  borderRadius: "12px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    "& fieldset": {
      borderColor: "#ccc",
    },
    "&:hover fieldset": {
      borderColor: "#4caf50",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#6ac259",
      borderWidth: "2px",
    },
  },
  "& .MuiSelect-select": {
    padding: "12px 14px",
  },
};

export const inputLabelStyle = {
  fontWeight: 600,
  color: "#4a4a4a",
  "&.Mui-focused": {
    color: "#6ac259",
  },
  "&.Mui-disabled": {
    color: "#b0b0b0",
  },
};

export const submitButtonStyle = {
  px: 5,
  py: 1.8,
  fontSize: "18px",
  borderRadius: "50px",
  background: "linear-gradient(135deg, #6ac259, #4caf50)",
  color: "#fff",
  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
  "&:hover": {
    background: "linear-gradient(135deg, #4caf50, #388e3c)",
  },
  transition: "all 0.3s ease-in-out",
};

// Reusable Dropdown Component
export const FormControlWithSelect = ({ label, name, value, onChange, options }) => (
  <FormControl fullWidth sx={dropdownStyle}>
    <InputLabel sx={inputLabelStyle}>{label}</InputLabel>
    <Select name={name} value={value} onChange={onChange} label={label}>
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);
