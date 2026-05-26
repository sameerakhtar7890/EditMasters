import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from "@mui/material";
import { Menu as MenuIcon, AccountCircle } from "@mui/icons-material";

const Nav = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("currUser"));

  const logout = () => {
    localStorage.removeItem("currUser");
    window.location.href = "/login";
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: "Home Page", path: "/" },
    { label: "Online PDF Editor", path: "/pdf" },
    { label: "Online Image Editor", path: "/img" },
    { label: "File Conversion", path: "/fileConversion" },
    { label: "Upload on Drive", path: "/drive" },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          background: "rgba(11, 15, 25, 0.7)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 6 } }}>
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              fontWeight: "bold",
              color: "primary.main",
              textDecoration: "none",
              letterSpacing: "-0.5px",
            }}
          >
            Edit<span style={{ color: "#fff" }}>Masters</span>
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", lg: "flex" }, alignItems: "center", gap: 1 }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.label}
                  component={Link}
                  to={item.path}
                  sx={{
                    color: isActive ? "primary.main" : "text.secondary",
                    fontWeight: isActive ? 600 : 500,
                    px: 2,
                    fontSize: "0.9rem",
                    "&:hover": { color: "text.primary" },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {user ? (
              <Box>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                  sx={{ p: 0.5 }}
                >
                  <Avatar sx={{ bgcolor: "primary.main", width: 34, height: 34 }}>
                    {user.name ? user.name[0].toUpperCase() : "U"}
                  </Avatar>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    className: "glass-panel",
                    sx: {
                      mt: 1.5,
                      minWidth: 180,
                      borderRadius: 3,
                      "& .MuiMenuItem-root": {
                        fontSize: "0.9rem",
                        py: 1,
                        px: 2,
                        borderRadius: 1.5,
                        mx: 0.5,
                      },
                    },
                  }}
                >
                  <MenuItem disabled sx={{ opacity: "1 !important" }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
                        {user.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        {user.email}
                      </Typography>
                    </Box>
                  </MenuItem>
                  <Divider sx={{ my: 1, borderColor: "rgba(255, 255, 255, 0.08)" }} />
                  <MenuItem onClick={logout} sx={{ color: "error.main", fontWeight: 600 }}>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button
                component={Link}
                to="/login"
                variant="contained"
                size="small"
                sx={{ display: { xs: "none", sm: "inline-flex" } }}
              >
                Sign In
              </Button>
            )}

            {/* Mobile Menu Icon */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { lg: "none" }, ml: 1, color: "text.primary" }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 250,
            background: "rgba(11, 15, 25, 0.98)",
            borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
          },
        }}
      >
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main", mb: 3 }}>
            Edit<span style={{ color: "#fff" }}>Masters</span>
          </Typography>
          <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)" }} />
          <List sx={{ mt: 2 }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    onClick={handleDrawerToggle}
                    sx={{
                      borderRadius: 2,
                      color: isActive ? "primary.main" : "text.secondary",
                      backgroundColor: isActive ? "rgba(23, 110, 222, 0.1)" : "transparent",
                    }}
                  >
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          <Box sx={{ flexGrow: 1 }} />
          {!user && (
            <Button
              component={Link}
              to="/login"
              variant="contained"
              fullWidth
              sx={{ mb: 2 }}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Drawer>
      <Toolbar /> {/* Spacer under fixed AppBar */}
    </Box>
  );
};

export default Nav;
