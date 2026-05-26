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
  PersonAddOutlined,
} from "@mui/icons-material";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordsMatch = password === cpassword;
  const isValid = name.length >= 4 && email.length > 0 && password.length >= 4 && passwordsMatch;

  const register = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValid) {
      setError(
        password !== cpassword
          ? "Passwords do not match."
          : "All fields must be at least 4 characters long."
      );
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, cpassword }),
      });

      if (response.status === 200) {
        setName(""); setEmail(""); setPassword(""); setCpassword("");
        swal
          .fire({
            title: "Account Created!",
            text: "You have been successfully registered.",
            icon: "success",
            background: "#111827",
            color: "#F3F4F6",
            confirmButtonColor: "#176ede",
          })
          .then((result) => {
            if (result.isConfirmed) window.location.href = "/login";
          });
      } else {
        setError("This email is already registered. Please sign in instead.");
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
        py: 4,
        background:
          "radial-gradient(at 70% 20%, rgba(23,110,222,0.18) 0px, transparent 60%), radial-gradient(at 20% 80%, rgba(16,185,129,0.1) 0px, transparent 50%)",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 460 }}>
        {/* Brand */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
              background: "linear-gradient(135deg, #10B981, #176ede)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
              boxShadow: "0 8px 24px rgba(16,185,129,0.35)",
            }}
          >
            <PersonAddOutlined sx={{ fontSize: 28, color: "white" }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-1px" }}>
            Edit<span style={{ color: "#176ede" }}>Masters</span>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Create your free account today
          </Typography>
        </Box>

        {/* Card */}
        <Paper
          className="glass-panel"
          sx={{ p: 4, borderRadius: 4 }}
          component="form"
          onSubmit={register}
          noValidate
        >
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Create account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontSize: "0.875rem" }}>
              {error}
            </Alert>
          )}

          <Stack spacing={2.5}>
            <TextField
              label="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              autoComplete="name"
              size="medium"
              helperText={name.length > 0 && name.length < 4 ? "Name must be at least 4 characters" : ""}
              error={name.length > 0 && name.length < 4}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
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
              autoComplete="new-password"
              size="medium"
              helperText={password.length > 0 && password.length < 4 ? "Password must be at least 4 characters" : ""}
              error={password.length > 0 && password.length < 4}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small" sx={{ color: "text.secondary" }}>
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm password"
              type={showCPassword ? "text" : "password"}
              value={cpassword}
              onChange={(e) => setCpassword(e.target.value)}
              required
              fullWidth
              autoComplete="new-password"
              size="medium"
              helperText={cpassword.length > 0 && !passwordsMatch ? "Passwords do not match" : ""}
              error={cpassword.length > 0 && !passwordsMatch}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowCPassword(!showCPassword)} edge="end" size="small" sx={{ color: "text.secondary" }}>
                      {showCPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading || !isValid}
            sx={{
              mt: 3,
              mb: 3,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 700,
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(23,110,222,0.35)",
            }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : "Create Account"}
          </Button>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mb: 3 }}>
            <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
              or sign up with
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
            Already have an account?{" "}
            <Typography
              component={Link}
              to="/login"
              variant="body2"
              sx={{ color: "primary.main", fontWeight: 600, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
              Sign in
            </Typography>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default RegisterScreen;
