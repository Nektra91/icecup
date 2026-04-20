import React, { useContext, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { AuthContext, AuthContextType } from "../../../contexts/authContext/index";
import { doCreateUserWithEmailAndPassword } from "../../../firebase/auth";
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

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");

  const authContext = useContext<AuthContextType | null>(AuthContext);
  const userLoggedIn = authContext?.userLoggedIn;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isRegistering) return;
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setIsRegistering(true);
    try {
      await doCreateUserWithEmailAndPassword(email, password);
    } catch {
      setError("Could not create account. Please try again.");
      setIsRegistering(false);
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
              Create an account
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Join Icecup today
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
              disabled={isRegistering}
            />
            <TextField
              label="Password"
              type="password"
              autoComplete="new-password"
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isRegistering}
            />
            <TextField
              label="Confirm Password"
              type="password"
              autoComplete="off"
              required
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isRegistering}
              error={confirmPassword.length > 0 && password !== confirmPassword}
              helperText={confirmPassword.length > 0 && password !== confirmPassword ? "Passwords do not match" : ""}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isRegistering}
              sx={{ mt: 1, py: 1.5, fontWeight: 600, borderRadius: 2 }}
            >
              {isRegistering ? "Creating account…" : "Sign up"}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" textAlign="center" color="text.secondary">
            Already have an account?{" "}
            <Link to="/login" style={{ fontWeight: 600, color: "inherit" }}>
              Sign in
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
