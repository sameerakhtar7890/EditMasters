import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  Stack,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Chip,
  Divider,
} from "@mui/material";
import {
  Download as DownloadIcon,
  RemoveRedEye as ViewIcon,
  Close as CloseIcon,
  PictureAsPdf as PdfIcon,
} from "@mui/icons-material";
import DragDropUpload from "./DragDropUpload";

var pdfjsLib = window["pdfjs-dist/build/pdf"];
pdfjsLib.GlobalWorkerOptions.workerSrc = "./assets/js/pdf.worker.js";

export const primary = "#176ede";

function PdftoImg() {
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [numOfPages, setNumOfPages] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const myRef = React.createRef();

  useEffect(() => {
    setLoading(false);
  }, [imageUrls]);

  useEffect(() => {
    if (imageUrls.length > 0 && myRef.current) {
      myRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [imageUrls]);

  const handleFileSelect = (file) => {
    // Reset previous results
    setImageUrls([]);
    setNumOfPages(0);
    setPdfFile(file);
  };

  const handleConvert = () => {
    if (!pdfFile) return;
    const url = URL.createObjectURL(pdfFile);
    UrlUploader(url);
  };

  const handleClickOpen = (url, index) => {
    setSelectedImage({ url, index });
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedImage(null);
    setOpen(false);
  };

  const UrlUploader = (url) => {
    fetch(url).then((response) => {
      response.blob().then((blob) => {
        let reader = new FileReader();
        reader.onload = (e) => {
          const data = atob(e.target.result.replace(/.*base64,/, ""));
          renderPage(data);
        };
        reader.readAsDataURL(blob);
      });
    });
  };

  const renderPage = async (data) => {
    setLoading(true);
    const imagesList = [];
    const canvas = document.createElement("canvas");
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const render_context = {
        canvasContext: canvas.getContext("2d"),
        viewport: viewport,
      };
      await page.render(render_context).promise;
      imagesList.push(canvas.toDataURL("image/png"));
    }
    setNumOfPages(pdf.numPages);
    setImageUrls(imagesList);
  };

  const downloadImage = (url, index) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `${pdfFile ? pdfFile.name : "page"}_${index + 1}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    handleClose();
  };

  return (
    <Paper className="glass-panel" sx={{ p: 4, borderRadius: 3 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            background: "rgba(239, 68, 68, 0.12)",
            display: "flex",
          }}
        >
          <PdfIcon sx={{ color: "error.main", fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            PDF{" "}
            <Box component="span" sx={{ color: "primary.main" }}>
              →
            </Box>{" "}
            Images
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Convert each PDF page into a downloadable PNG image
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.07)", mb: 3 }} />

      <DragDropUpload
        onFileSelect={handleFileSelect}
        currentFile={pdfFile}
        accept="application/pdf"
        label="Drop your PDF file here to convert"
        icon={PdfIcon}
        loading={loading}
      />

      {pdfFile && !loading && imageUrls.length === 0 && (
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          onClick={handleConvert}
          startIcon={<PdfIcon />}
          sx={{ mt: 2, py: 1.5, boxShadow: "0 4px 20px rgba(23,110,222,0.3)" }}
        >
          Convert PDF to Images
        </Button>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress size={48} />
        </Box>
      )}

      {/* Converted Images Grid */}
      {!loading && imageUrls.length > 0 && (
        <Box sx={{ mt: 4 }} ref={myRef}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Converted Pages
            </Typography>
            <Chip
              label={`${numOfPages} page${numOfPages > 1 ? "s" : ""}`}
              color="primary"
              variant="outlined"
              size="small"
            />
          </Stack>

          <Grid container spacing={2}>
            {imageUrls.map((url, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  className="glass-card-hover"
                  sx={{
                    position: "relative",
                    borderRadius: 3,
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.08)",
                    height: 220,
                    cursor: "pointer",
                    "&:hover .overlay": { opacity: 1 },
                  }}
                  onClick={() => handleClickOpen(url, index)}
                >
                  <Box
                    component="img"
                    src={url}
                    alt={`Page ${index + 1}`}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  {/* Hover Overlay */}
                  <Box
                    className="overlay"
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(11,15,25,0.7)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      opacity: 0,
                      transition: "opacity 0.25s ease",
                    }}
                  >
                    <IconButton
                      onClick={(e) => { e.stopPropagation(); handleClickOpen(url, index); }}
                      sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      onClick={(e) => { e.stopPropagation(); downloadImage(url, index); }}
                      sx={{ bgcolor: "rgba(23,110,222,0.7)", color: "white", "&:hover": { bgcolor: "rgba(23,110,222,0.9)" } }}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Box>
                  {/* Page Label */}
                  <Chip
                    label={`Page ${index + 1}`}
                    size="small"
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      left: 8,
                      bgcolor: "rgba(11,15,25,0.8)",
                      color: "text.secondary",
                      fontSize: "0.7rem",
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Preview Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          className: "glass-panel",
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Page {selectedImage ? selectedImage.index + 1 : ""} Preview
          </Typography>
          <IconButton onClick={handleClose} size="small" sx={{ color: "text.secondary" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          {selectedImage && (
            <Box
              component="img"
              src={selectedImage.url}
              alt="Full page preview"
              sx={{ width: "100%", borderRadius: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} variant="outlined" color="inherit">
            Close
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={() => selectedImage && downloadImage(selectedImage.url, selectedImage.index)}
          >
            Download Image
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default PdftoImg;
