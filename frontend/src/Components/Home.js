import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Stack,
  Grow,
  IconButton
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import "./Home.css";

const Home = () => {
  const user = JSON.parse(localStorage.getItem("currUser"));
  const [activeIndex, setActiveIndex] = useState(0);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  }, [user]);

  const randomImages = [
    "https://techviral.net/wp-content/uploads/2020/07/Free-Online-PDF-Editors-1.jpg",
    "https://www.guidingtech.com/wp-content/uploads/How-to-Edit-PDFs-Using-Microsoft-Edges-Built-In-PDF-Editor.jpg",
    "https://top10pcsoftware.com/wp-content/uploads/2021/09/PDF-Editor-on-Windows-10.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex === randomImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    setShowToast(true);
    const toastTimer = setTimeout(() => setShowToast(false), 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(toastTimer);
    };
  }, []);

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') return;
    setShowToast(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Nav />
      <Box className="all" sx={{ py: 6, flexGrow: 1 }}>
        <Container maxWidth="lg">
          {/* Welcome Banner */}
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Grow in={true} timeout={1000}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  background: "linear-gradient(45deg, #fff 30%, #176ede 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 2,
                  fontSize: { xs: "2.5rem", md: "4rem" },
                  letterSpacing: "-1px",
                }}
              >
                Welcome to Edit Masters
              </Typography>
            </Grow>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: "auto", fontWeight: 400 }}>
              The all-in-one suite to edit PDFs, compress files, crop images, convert document formats, and upload direct to cloud.
            </Typography>
          </Box>

          {/* Description Card */}
          <Card className="glass-panel" sx={{ mb: 6, borderRadius: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: "1.05rem", color: "text.primary" }}>
                My application aims to provide a comprehensive set of tools for
                editing and managing documents and images. It features a PDF editor
                that allows users to modify text, annotate, merge, split, and rotate
                pages in PDF documents. Additionally, the image editor offers
                functionalities such as cropping, resizing, adding text or images,
                applying filters, basic retouching, and removing backgrounds. The
                application also supports file format conversion, enabling users to
                convert PDF documents to image formats (e.g., JPG, PNG) and vice
                versa, supporting common file formats. These tools are designed to be
                user-friendly and efficient, enhancing the overall editing experience
                for the users.
              </Typography>
            </CardContent>
          </Card>

          {/* Interactive Slide Panel Grid */}
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, letterSpacing: "-0.5px" }}>
                Digital document & photo manipulation made effortless
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
                In the age of digital communication and content creation, the
                demand for accessible and user-friendly tools to edit and
                manipulate PDF documents and photos has never been greater.
                Recognizing this need, we present "EditMasters," an innovative
                online platform designed to empower users with the ability to
                effortlessly edit, enhance, and transform their PDFs and photos
                with just a few clicks.
              </Typography>
              
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
                <Button
                  href="/pdf"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                    boxShadow: "0 4px 20px rgba(23, 110, 222, 0.3)",
                  }}
                >
                  Try PDF Editor
                </Button>
                <Button
                  href="/img"
                  variant="outlined"
                  color="primary"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                    borderWidth: 2,
                    "&:hover": { borderWidth: 2 },
                  }}
                >
                  Try Image Editor
                </Button>
              </Stack>
            </Grid>

            {/* Premium Animated Slide Frame */}
            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  position: "relative",
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  height: 350,
                  width: "100%",
                }}
              >
                {randomImages.map((image, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={image}
                    alt={`Slider image ${index + 1}`}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: index === activeIndex ? 1 : 0,
                      transition: "opacity 1s ease-in-out",
                      transform: index === activeIndex ? "scale(1)" : "scale(1.05)",
                      transitionProperty: "opacity, transform",
                    }}
                  />
                ))}
                {/* Visual glass overlay inside slide frame */}
                <Box 
                  sx={{ 
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    p: 2,
                    background: "linear-gradient(transparent, rgba(11, 15, 25, 0.9))",
                    display: "flex",
                    justifyContent: "center",
                    gap: 1
                  }}
                >
                  {randomImages.map((_, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: index === activeIndex ? "primary.main" : "rgba(255,255,255,0.3)",
                        transition: "all 0.3s ease"
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />

      {/* Snackbar Toast replacement for Bootstrap Toast */}
      <Snackbar
        open={showToast}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseToast} 
          severity="success" 
          variant="filled"
          sx={{ 
            borderRadius: 3, 
            boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
            background: "rgba(16, 185, 129, 0.95)",
            backdropFilter: "blur(8px)",
          }}
          action={
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseToast}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          Welcome to Edit Masters, {user ? user.name : "sir"}.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;
