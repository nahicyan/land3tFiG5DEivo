import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Input, Divider, IconButton } from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { loginUser, checkSession } from "../../utils/api";

const LoginModal = ({ onClose }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);

  const setCookie = (name, value, days = 7) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });
      console.log("Login successful:", response);
  
      const sessionCheck = await checkSession();
      if (sessionCheck?.user) {
        console.log("Session active after manual login:", sessionCheck.user);
  
        // Store the user data in a cookie
        setCookie("loggedInUser", JSON.stringify(sessionCheck.user), 7);
      }
  
      onClose(); // Close the modal
      window.location.reload(); // Manually refresh the page
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`;
  };

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const session = await checkSession();
        console.log("Session check:", session);
      } catch (error) {
        console.log("Session check failed");
      }
    };
    checkUserSession();
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "1rem",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <img src="https://shinyhomes.net/wp-content/uploads/2025/02/Landivo.svg" alt="Landivo Logo" style={{ height: "48px" }} />
        </Box>
        <Typography variant="h5" align="center" sx={{ fontWeight: 600, color: "#1f2937", mb: 2 }}>
          Welcome to Landivo
        </Typography>
        <form onSubmit={handleLogin}>
          <Box sx={{ mb: 2 }}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              sx={{
                padding: "1rem",
                border: "2px solid #d1d5db",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                "&:focus-within": {
                  borderColor: "#3b82f6",
                  boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.2)",
                },
              }}
            />
          </Box>
          <Box sx={{ position: "relative", mb: 2 }}>
            <Input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              sx={{
                padding: "1rem",
                border: "2px solid #d1d5db",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                "&:focus-within": {
                  borderColor: "#3b82f6",
                  boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.2)",
                },
              }}
            />
            <IconButton
              sx={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)" }}
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            </IconButton>
          </Box>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#dc2626",
              color: "#fff",
              py: 1.5,
              borderRadius: "50px",
              "&:hover": { backgroundColor: "#b91c1c" },
            }}
          >
            Log in
          </Button>
        </form>
        <Divider sx={{ my: 2 }}>OR</Divider>
        <Button
          fullWidth
          onClick={handleGoogleLogin}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 1.5,
            borderRadius: "50px",
            border: "2px solid #d1d5db",
            color: "#1f2937",
            backgroundColor: "#fff",
            "&:hover": { backgroundColor: "#f3f4f6" },
          }}
        >
          <FcGoogle size={24} style={{ marginRight: "8px" }} />
          Continue with Google
        </Button>
      </Box>
    </Box>
  );
};

export default LoginModal;
