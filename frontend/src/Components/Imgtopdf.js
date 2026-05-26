import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Divider,
  Chip,
} from "@mui/material";
import {
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import DragDropUpload from "./DragDropUpload";

const Imgtopdf = () => {
  const [file, setFile] = useState(null);
  const [converting, setConverting] = useState(false);

  const fileToArrBuffer = (f) =>
    new Promise((res, rej) => {
      const fileReader = new FileReader();
      fileReader.onload = () => res(fileReader.result);
      fileReader.onerror = () => rej(fileReader.error);
      fileReader.readAsArrayBuffer(f);
    });

  const downloadFile = async (blob) => {
    const URL = window.URL.createObjectURL(blob);
    const el = document.createElement("a");
    el.download = "converted.pdf";
    el.href = URL;
    el.click();
    window.URL.revokeObjectURL(URL);
  };

  const embedImageInPdfAndDownload = async () => {
    if (!file) return;
    setConverting(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const buffer = await fileToArrBuffer(file);
      let image;
      if (/jpe?g/i.test(file.type)) {
        image = await pdfDoc.embedJpg(buffer);
      } else if (/png/i.test(file.type)) {
        image = await pdfDoc.embedPng(buffer);
      } else {
        throw new Error("Please choose a JPEG or PNG file to proceed");
      }
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      const scaleFactor = Math.min(width / image.width, height / image.height);
      page.drawImage(image, {
        width: image.width * scaleFactor,
        height: image.height * scaleFactor,
        x: (width - image.width * scaleFactor) / 2,
        y: (height - image.height * scaleFactor) / 2,
      });
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      downloadFile(blob);
    } catch (error) {
      console.error("Error converting image:", error);
    }
    setConverting(false);
  };

  return (
    <Paper
      className="glass-panel"
      sx={{ p: 4, borderRadius: 3, mb: 4 }}
    >
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            background: "rgba(23, 110, 222, 0.12)",
            display: "flex",
          }}
        >
          <ImageIcon sx={{ color: "primary.main", fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Image{" "}
            <Box component="span" sx={{ color: "primary.main" }}>
              →
            </Box>{" "}
            PDF
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Convert JPG or PNG images to a downloadable PDF file
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.07)", mb: 3 }} />

      <DragDropUpload
        onFileSelect={(f) => setFile(f)}
        currentFile={file}
        accept="image/jpeg,image/png"
        label="Drop your JPG or PNG image here"
        icon={ImageIcon}
        loading={converting}
      />

      {/* Preview */}
      {file && !converting && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 2,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Chip
              label={file.name}
              size="small"
              variant="outlined"
              sx={{ color: "text.secondary", borderColor: "rgba(255,255,255,0.15)", maxWidth: 280 }}
            />
          </Stack>
          <Box
            component="img"
            src={URL.createObjectURL(file)}
            alt="Preview"
            sx={{
              width: "100%",
              maxHeight: 220,
              objectFit: "contain",
              borderRadius: 2,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          />
        </Box>
      )}

      {file && (
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          startIcon={<PdfIcon />}
          endIcon={<DownloadIcon />}
          onClick={embedImageInPdfAndDownload}
          disabled={converting}
          sx={{
            mt: 3,
            py: 1.5,
            boxShadow: "0 4px 20px rgba(23,110,222,0.3)",
          }}
        >
          {converting ? "Converting..." : "Convert & Download PDF"}
        </Button>
      )}
    </Paper>
  );
};

export default Imgtopdf;
