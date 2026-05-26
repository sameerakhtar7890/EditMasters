import React, { useState } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert2";
import API_URL from "../config";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Stack,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  LockOutlined,
} from "@mui/icons-material";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.status === 200) {
        setEmail("");
        setPassword("");
        localStorage.setItem("currUser", JSON.stringify(data));
        setTimeout(() => (window.location.href = "/"), 1500);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please check your connection and try again.");
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        background:
          "radial-gradient(at 30% 20%, rgba(23,110,222,0.18) 0px, transparent 60%), radial-gradient(at 80% 80%, rgba(16,185,129,0.1) 0px, transparent 50%)",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 440 }}>
        {/* Logo / Brand */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
              background: "linear-gradient(135deg, #176ede, #10B981)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
              boxShadow: "0 8px 24px rgba(23,110,222,0.35)",
            }}
          >
            <LockOutlined sx={{ fontSize: 28, color: "white" }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-1px" }}>
            Edit<span style={{ color: "#176ede" }}>Masters</span>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Sign in to your workspace
          </Typography>
        </Box>

        {/* Card */}
        <Paper
          className="glass-panel"
          sx={{ p: 4, borderRadius: 4 }}
          component="form"
          onSubmit={login}
          noValidate
        >
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Welcome back
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontSize: "0.875rem" }}>
              {error}
            </Alert>
          )}

          <Stack spacing={2.5}>
            <TextField
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoComplete="email"
              size="medium"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              autoComplete="current-password"
              size="medium"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                      sx={{ color: "text.secondary" }}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <Box sx={{ textAlign: "right", mt: 1, mb: 3 }}>
            <Typography
              variant="body2"
              component="a"
              href="https://accounts.google.com/signin/v2/recoveryidentifier"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "primary.main", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
              Forgot password?
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading || !email || !password}
            sx={{
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 700,
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(23,110,222,0.35)",
              mb: 3,
            }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : "Sign In"}
          </Button>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mb: 3 }}>
            <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
              or continue with
            </Typography>
          </Divider>

          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              href="https://mail.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                borderColor: "rgba(255,255,255,0.12)",
                color: "text.secondary",
                borderRadius: 2,
                py: 1.2,
                "&:hover": { borderColor: "rgba(255,255,255,0.3)", color: "text.primary" },
              }}
            >
              Gmail
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FacebookIcon />}
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                borderColor: "rgba(255,255,255,0.12)",
                color: "text.secondary",
                borderRadius: 2,
                py: 1.2,
                "&:hover": { borderColor: "rgba(255,255,255,0.3)", color: "text.primary" },
              }}
            >
              Facebook
            </Button>
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mt: 3 }}>
            New to EditMasters?{" "}
            <Typography
              component={Link}
              to="/register"
              variant="body2"
              sx={{ color: "primary.main", fontWeight: 600, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
              Create an account
            </Typography>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default LoginScreen;
