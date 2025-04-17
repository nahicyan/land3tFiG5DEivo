// client/src/components/ui/date-input.jsx
import React from "react";
import { format } from "date-fns";
import { Input } from "./input";
import { cn } from "@/lib/utils";

/**
 * A simple date input component that uses the native HTML date input
 * Compatible with date-fns v4
 */
export function DateInput({
  date,
  setDate,
  className,
  ...props
}) {
  // Format date to YYYY-MM-DD (required format for HTML date input)
  const formatDateForInput = (date) => {
    if (!date) return '';
    return format(new Date(date), 'yyyy-MM-dd');
  };

  const handleChange = (e) => {
    const value = e.target.value;
    // If empty, keep as null or default
    if (!value) {
      setDate(null);
      return;
    }
    // Otherwise set as Date object
    setDate(new Date(value));
  };

  return (
    <Input
      type="date"
      value={formatDateForInput(date)}
      onChange={handleChange}
      className={cn("w-full", className)}
      {...props}
    />
  );
}