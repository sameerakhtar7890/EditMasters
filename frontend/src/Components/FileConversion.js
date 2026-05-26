import React from "react";
import DashboardLayout from "./DashboardLayout";
import Imgtopdf from "./Imgtopdf";
import PdftoImg from "./PdftoImg";
import {
  Box,
  Typography,
} from "@mui/material";
import { SwapHoriz as ConvertIcon } from "@mui/icons-material";

const FileConversion = () => {
  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, letterSpacing: "-0.5px" }}>
          File Conversion Tools
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Convert between image and PDF formats instantly in your browser — no uploads needed.
        </Typography>
      </Box>

      <Imgtopdf />
      <PdftoImg />
    </DashboardLayout>
  );
};

export default FileConversion;
