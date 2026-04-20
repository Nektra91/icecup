import React, { useContext, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { doSignInWithEmailAndPassword } from "../../../firebase/auth";
import { AuthContext, AuthContextType } from "../../../contexts/authContext/index";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Divider,
} from "@mui/material";
import icecupLogo from "../../../logo/icecup-logo.jpg";

const Login = () => {
  const authContext = useContext<AuthContextType | null>(AuthContext);
  const userLoggedIn = authContext?.userLoggedIn;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSigningIn) return;
    setError("");
    setIsSigningIn(true);
    try {
      await doSignInWithEmailAndPassword(email, password);
    } catch {
      setError("Invalid email or password. Please try again.");
      setIsSigningIn(false);
    }
  };

  if (userLoggedIn) return <Navigate to="/home" replace />;

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e3f0ff 0%, #f5f5f5 100%)",
        px: 2,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 420, borderRadius: 3, boxShadow: 6 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
            <img src={icecupLogo} alt="Icecup Logo" style={{ width: 72, height: 72, borderRadius: 12, marginBottom: 16 }} />
            <Typography variant="h5" fontWeight={700} color="text.primary">
              Welcome back
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Sign in to your Icecup account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={onSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              autoComplete="email"
              required
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSigningIn}
            />
            <TextField
              label="Password"
              type="password"
              autoComplete="current-password"
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSigningIn}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isSigningIn}
              sx={{ mt: 1, py: 1.5, fontWeight: 600, borderRadius: 2 }}
            >
              {isSigningIn ? "Signing in…" : "Sign in"}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" textAlign="center" color="text.secondary">
            Don't have an account?{" "}
            <Link to="/register" style={{ fontWeight: 600, color: "inherit" }}>
              Sign up
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
