"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function CreateUser() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    image: "",
    role: "ADMIN", // default to ADMIN (or change as needed)
    password: "",
  });
  const [status, setStatus] = useState({ success: false, error: null });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ success: false, error: null });

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}//api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Attempt to parse the error message from the response
        const errData = await response.json().catch(() => ({}));
        const message = errData.message || `HTTP Error: ${response.status}`;
        throw new Error(message);
      }

      // If successful, parse JSON and update state
      await response.json();
      setStatus({ success: true, error: null });

      // Optionally clear form
      setFormData({
        email: "",
        name: "",
        image: "",
        role: "ADMIN",
        password: "",
      });
    } catch (err) {
      setStatus({ success: false, error: err.message });
    }
  };

  return (
    <div className="bg-[#FDF8F2] min-h-screen flex items-center justify-center p-4 text-[#4b5b4d]">
      <Card className="w-full max-w-md border border-[#324c48]/20 shadow-lg bg-white">
        <CardHeader className="p-4">
          <CardTitle className="text-xl font-bold">Create User</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Error Alert */}
          {status.error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{status.error}</AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {status.success && (
            <Alert variant="success" className="mb-4">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>User created successfully!</AlertDescription>
            </Alert>
          )}

          {/* Create User Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <Label htmlFor="email" className="block mb-1 text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter user email"
                value={formData.email}
                onChange={handleChange}
                className="border border-[#324c48]/30"
                required
              />
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="name" className="block mb-1 text-sm font-medium">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter user name"
                value={formData.name}
                onChange={handleChange}
                className="border border-[#324c48]/30"
                required
              />
            </div>

            {/* Image */}
            <div>
              <Label htmlFor="image" className="block mb-1 text-sm font-medium">
                Image URL
              </Label>
              <Input
                id="image"
                name="image"
                type="text"
                placeholder="Enter user avatar link"
                value={formData.image}
                onChange={handleChange}
                className="border border-[#324c48]/30"
              />
            </div>

            {/* Role */}
            <div>
              <Label htmlFor="role" className="block mb-1 text-sm font-medium">
                Role
              </Label>
              <Input
                id="role"
                name="role"
                type="text"
                placeholder="ADMIN, USER, etc."
                value={formData.role}
                onChange={handleChange}
                className="border border-[#324c48]/30"
                required
              />
            </div>

            {/* Password */}
            <div>
              <Label
                htmlFor="password"
                className="block mb-1 text-sm font-medium"
              >
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="border border-[#324c48]/30"
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="mt-2 bg-[#324c48] hover:bg-[#3f4f24] text-white font-semibold px-4 py-2 rounded-md"
            >
              Create
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
