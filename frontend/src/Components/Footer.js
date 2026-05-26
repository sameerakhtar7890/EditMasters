import React from "react";
import { Box, Typography, Container, Divider, Stack } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        py: 4,
        background: "rgba(11, 15, 25, 0.5)",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(12px)",
      }}
    >
      <Container maxWidth="lg">
        <Divider sx={{ mb: 3, borderColor: "rgba(255, 255, 255, 0.08)" }} />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} Edit Masters. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={3}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                cursor: "pointer",
                "&:hover": { color: "text.primary", transition: "color 0.2s ease" },
              }}
            >
              Privacy Policy
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                cursor: "pointer",
                "&:hover": { color: "text.primary", transition: "color 0.2s ease" },
              }}
            >
              Terms & Conditions
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
