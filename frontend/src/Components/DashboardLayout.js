import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Button,
  useMediaQuery,
  useTheme
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Home as HomeIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  SwapHoriz as ConvertIcon,
  CloudQueue as CloudIcon,
  Logout as LogoutIcon,
  Person as PersonIcon
} from "@mui/icons-material";

const DRAWER_WIDTH = 260;

const DashboardLayout = ({ children }) => {
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const user = JSON.parse(localStorage.getItem("currUser"));

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("currUser");
    window.location.href = "/login";
  };

  const menuItems = [
    { text: "Home Portal", icon: <HomeIcon />, path: "/" },
    { text: "PDF Editor", icon: <PdfIcon />, path: "/pdf" },
    { text: "Image Editor", icon: <ImageIcon />, path: "/img" },
    { text: "File Conversion", icon: <ConvertIcon />, path: "/fileConversion" },
    { text: "Upload on Drive", icon: <CloudIcon />, path: "/drive" },
  ];

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", background: "rgba(11, 15, 25, 0.95)" }}>
      <Toolbar sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: [1] }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main", ml: 2, display: "flex", alignItems: "center" }}>
          Edit<span style={{ color: "#fff" }}>Masters</span>
        </Typography>
        {!isMobile && (
          <IconButton onClick={handleDrawerToggle} sx={{ color: "text.secondary" }}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Toolbar>
      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)" }} />
      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 2,
                  color: isActive ? "primary.main" : "text.secondary",
                  backgroundColor: isActive ? "rgba(23, 110, 222, 0.1)" : "transparent",
                  borderLeft: isActive ? "3px solid #176ede" : "3px solid transparent",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    color: "text.primary",
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? "primary.main" : "text.secondary", minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ fontSize: "0.95rem", fontWeight: isActive ? 600 : 500 }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      {user && (
        <Box sx={{ p: 2, borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
            <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>
              {user.name ? user.name[0].toUpperCase() : "U"}
            </Avatar>
            <Box sx={{ overflow: "hidden" }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", noWrap: true }}>
                {user.name}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", noWrap: true, display: "block" }}>
                {user.email}
              </Typography>
            </Box>
          </Box>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              py: 1,
              color: "error.main",
              "&:hover": {
                backgroundColor: "rgba(239, 68, 68, 0.1)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "error.main", minWidth: 36 }}>
              <LogoutIcon size="small" />
            </ListItemIcon>
            <ListItemText primary="Sign Out" primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 600 }} />
          </ListItemButton>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: open && !isMobile ? `calc(100% - ${DRAWER_WIDTH}px)` : "100%",
          ml: open && !isMobile ? `${DRAWER_WIDTH}px` : 0,
          background: "rgba(11, 15, 25, 0.7)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "none",
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {(!open || isMobile) && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                edge="start"
                sx={{ mr: 2, color: "text.primary" }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, letterSpacing: "-0.5px" }}>
              Workspace
            </Typography>
          </Box>

          {user ? (
            <Box>
              <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0.5 }}>
                <Avatar sx={{ bgcolor: "primary.main", width: 34, height: 34 }}>
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                PaperProps={{
                  className: "glass-panel",
                  sx: {
                    mt: 1.5,
                    minWidth: 180,
                    borderRadius: 3,
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
                    "& .MuiMenuItem-root": {
                      fontSize: "0.9rem",
                      py: 1,
                      px: 2,
                      borderRadius: 1.5,
                      mx: 0.5,
                      my: 0.2,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
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
                <MenuItem onClick={handleLogout} sx={{ color: "error.main", fontWeight: 600 }}>
                  <LogoutIcon sx={{ fontSize: 18, mr: 1.5 }} /> Log Out
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button component={Link} to="/login" variant="contained" size="small">
              Sign In
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { md: open ? DRAWER_WIDTH : 0 },
          flexShrink: { md: 0 },
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={open}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: DRAWER_WIDTH,
                borderRight: "1px solid rgba(255, 255, 255, 0.08)",
              },
            }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Drawer
            variant="persistent"
            open={open}
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: DRAWER_WIDTH,
                borderRight: "1px solid rgba(255, 255, 255, 0.08)",
                transition: theme.transitions.create("width", {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
              },
            }}
          >
            {drawerContent}
          </Drawer>
        )}
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pt: 10,
          width: { md: open ? `calc(100% - ${DRAWER_WIDTH}px)` : "100%" },
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
