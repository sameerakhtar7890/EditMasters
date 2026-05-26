import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import {
  Box,
  Typography,
  Button,
  Paper,
  Slider,
  Stack,
  Divider,
  TextField,
  Grid,
  Tooltip,
  IconButton,
  Chip,
} from "@mui/material";
import {
  RotateLeft,
  RotateRight,
  FlipOutlined,
  SaveAlt,
  AddPhotoAlternate,
  Refresh,
  TextFields,
} from "@mui/icons-material";

const ImageEditor = () => {
  const user = JSON.parse(localStorage.getItem("currUser"));
  const fileInput = useRef(null);

  const [brightness, setBrightness] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [inversion, setInversion] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(1);
  const [flipVertical, setFlipVertical] = useState(1);
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(20);
  const [fontColor, setFontColor] = useState("#ffffff");
  const [hasImage, setHasImage] = useState(false);

  useEffect(() => {
    if (!user) window.location.href = "/login";
  }, [user]);

  const applyFilter = (br, sat, inv, gs, rot, fh, fv) => {
    const previewImg = document.querySelector(".preview-img img");
    if (!previewImg) return;
    previewImg.style.transform = `rotate(${rot}deg) scale(${fh}, ${fv})`;
    previewImg.style.filter = `brightness(${br}%) saturate(${sat}%) invert(${inv}%) grayscale(${gs}%)`;
  };

  const handleLoadImage = () => {
    const file = fileInput.current.files[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    const defaults = { brightness: 100, saturation: 100, inversion: 0, grayscale: 0, rotate: 0, flipH: 1, flipV: 1 };
    setBrightness(defaults.brightness);
    setSaturation(defaults.saturation);
    setInversion(defaults.inversion);
    setGrayscale(defaults.grayscale);
    setRotate(defaults.rotate);
    setFlipHorizontal(defaults.flipH);
    setFlipVertical(defaults.flipV);
    setText("");
    setHasImage(true);
    const imgEl = document.querySelector(".preview-img img");
    if (imgEl) {
      imgEl.src = objectUrl;
      imgEl.style.filter = "";
      imgEl.style.transform = "";
    }
  };

  const handleFilterChange = (filter, value) => {
    let br = brightness, sat = saturation, inv = inversion, gs = grayscale;
    switch (filter) {
      case "brightness": setBrightness(value); br = value; break;
      case "saturation": setSaturation(value); sat = value; break;
      case "inversion": setInversion(value); inv = value; break;
      case "grayscale": setGrayscale(value); gs = value; break;
      default: break;
    }
    applyFilter(br, sat, inv, gs, rotate, flipHorizontal, flipVertical);
  };

  const handleRotate = (angle) => {
    const newRotate = angle;
    setRotate(newRotate);
    applyFilter(brightness, saturation, inversion, grayscale, newRotate, flipHorizontal, flipVertical);
  };

  const handleFlip = (axis) => {
    let fh = flipHorizontal, fv = flipVertical;
    if (axis === "horizontal") { fh = flipHorizontal === 1 ? -1 : 1; setFlipHorizontal(fh); }
    else { fv = flipVertical === 1 ? -1 : 1; setFlipVertical(fv); }
    applyFilter(brightness, saturation, inversion, grayscale, rotate, fh, fv);
  };

  const handleResetFilter = () => {
    setBrightness(100); setSaturation(100); setInversion(0); setGrayscale(0);
    setRotate(0); setFlipHorizontal(1); setFlipVertical(1); setText("");
    applyFilter(100, 100, 0, 0, 0, 1, 1);
  };

  const handleSaveImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const previewImg = document.querySelector(".preview-img img");
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (rotate !== 0) ctx.rotate((rotate * Math.PI) / 180);
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    if (text) {
      ctx.font = `${fontSize}px Inter`;
      ctx.fillStyle = fontColor;
      ctx.fillText(text, 20, canvas.height - 20);
    }
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const filterSliders = [
    { label: "Brightness", key: "brightness", value: brightness, min: 0, max: 200 },
    { label: "Saturation", key: "saturation", value: saturation, min: 0, max: 200 },
    { label: "Inversion", key: "inversion", value: inversion, min: 0, max: 100 },
    { label: "Grayscale", key: "grayscale", value: grayscale, min: 0, max: 100 },
  ];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, letterSpacing: "-0.5px" }}>
          Online Image Editor
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Apply filters, rotate, flip, add text, and save your edited image.
        </Typography>
      </Box>

      <Grid container spacing={3} alignItems="flex-start">
        {/* Left Panel — Controls */}
        <Grid item xs={12} md={4} lg={3}>
          <Stack spacing={2}>
            {/* Filters */}
            <Paper className="glass-panel" sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: "primary.main" }}>
                Filters
              </Typography>
              <Stack spacing={2.5}>
                {filterSliders.map(({ label, key, value, min, max }) => (
                  <Box key={key}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">{label}</Typography>
                      <Chip label={`${value}%`} size="small" sx={{ height: 20, fontSize: "0.7rem", bgcolor: "rgba(255,255,255,0.05)", color: "text.secondary" }} />
                    </Stack>
                    <Slider
                      value={value}
                      min={min}
                      max={max}
                      onChange={(_, v) => handleFilterChange(key, v)}
                      size="small"
                      sx={{
                        color: "primary.main",
                        "& .MuiSlider-thumb": { width: 14, height: 14 },
                        "& .MuiSlider-rail": { opacity: 0.2 },
                      }}
                      disabled={!hasImage}
                    />
                  </Box>
                ))}
              </Stack>
            </Paper>

            {/* Rotate & Flip */}
            <Paper className="glass-panel" sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: "primary.main" }}>
                Transform
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Tooltip title="Rotate Left 90°">
                    <span>
                      <Button fullWidth variant="outlined" size="small" startIcon={<RotateLeft />}
                        onClick={() => handleRotate(rotate - 90)} disabled={!hasImage}
                        sx={{ borderColor: "rgba(255,255,255,0.12)", color: "text.secondary", fontSize: "0.75rem" }}>
                        Left
                      </Button>
                    </span>
                  </Tooltip>
                </Grid>
                <Grid item xs={6}>
                  <Tooltip title="Rotate Right 90°">
                    <span>
                      <Button fullWidth variant="outlined" size="small" startIcon={<RotateRight />}
                        onClick={() => handleRotate(rotate + 90)} disabled={!hasImage}
                        sx={{ borderColor: "rgba(255,255,255,0.12)", color: "text.secondary", fontSize: "0.75rem" }}>
                        Right
                      </Button>
                    </span>
                  </Tooltip>
                </Grid>
                <Grid item xs={6}>
                  <Tooltip title="Flip Horizontal">
                    <span>
                      <Button fullWidth variant="outlined" size="small" startIcon={<FlipOutlined />}
                        onClick={() => handleFlip("horizontal")} disabled={!hasImage}
                        sx={{ borderColor: "rgba(255,255,255,0.12)", color: "text.secondary", fontSize: "0.75rem" }}>
                        Flip H
                      </Button>
                    </span>
                  </Tooltip>
                </Grid>
                <Grid item xs={6}>
                  <Tooltip title="Flip Vertical">
                    <span>
                      <Button fullWidth variant="outlined" size="small" startIcon={<FlipOutlined sx={{ transform: "rotate(90deg)" }} />}
                        onClick={() => handleFlip("vertical")} disabled={!hasImage}
                        sx={{ borderColor: "rgba(255,255,255,0.12)", color: "text.secondary", fontSize: "0.75rem" }}>
                        Flip V
                      </Button>
                    </span>
                  </Tooltip>
                </Grid>
              </Grid>
            </Paper>

            {/* Add Text */}
            <Paper className="glass-panel" sx={{ p: 3, borderRadius: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <TextFields sx={{ color: "primary.main", fontSize: 18 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "primary.main" }}>
                  Add Text
                </Typography>
              </Stack>
              <Stack spacing={1.5}>
                <TextField
                  label="Text content"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  size="small"
                  fullWidth
                  disabled={!hasImage}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
                <TextField
                  label="Font size (px)"
                  type="number"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  size="small"
                  fullWidth
                  disabled={!hasImage}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                    Text color
                  </Typography>
                  <Box
                    component="input"
                    type="color"
                    value={fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                    disabled={!hasImage}
                    sx={{
                      width: 36,
                      height: 36,
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 1,
                      cursor: "pointer",
                      background: "none",
                      padding: 0,
                    }}
                  />
                </Stack>
              </Stack>
            </Paper>
          </Stack>
        </Grid>

        {/* Right Panel — Preview + Actions */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper className="glass-panel" sx={{ p: 3, borderRadius: 3, minHeight: 500, display: "flex", flexDirection: "column" }}>
            {/* Preview Area */}
            <Box
              className="preview-img"
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2,
                overflow: "hidden",
                background: "rgba(0,0,0,0.2)",
                border: "1px solid rgba(255,255,255,0.06)",
                minHeight: 380,
                position: "relative",
              }}
            >
              <Box
                component="img"
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 24 24' fill='none' stroke='%23374151' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpath d='m21 15-5-5L5 21'/%3E%3C/svg%3E"
                alt="Preview"
                className="preview-img"
                sx={{
                  maxWidth: "100%",
                  maxHeight: "420px",
                  objectFit: "contain",
                  transition: "filter 0.2s ease, transform 0.2s ease",
                }}
              />
              {/* Overlay text preview */}
              {text && hasImage && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    left: 16,
                    fontSize: `${fontSize}px`,
                    color: fontColor,
                    fontWeight: 600,
                    textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                    pointerEvents: "none",
                    fontFamily: "Inter",
                  }}
                >
                  {text}
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.07)" }} />

            {/* Action Buttons */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <input
                type="file"
                accept="image/*"
                ref={fileInput}
                hidden
                onChange={handleLoadImage}
              />
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<AddPhotoAlternate />}
                onClick={() => fileInput.current.click()}
                sx={{ flex: 1, py: 1.5, boxShadow: "0 4px 20px rgba(23,110,222,0.3)" }}
              >
                Choose Image
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Refresh />}
                onClick={handleResetFilter}
                disabled={!hasImage}
                sx={{ borderColor: "rgba(255,255,255,0.15)", color: "text.secondary" }}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<SaveAlt />}
                onClick={handleSaveImage}
                disabled={!hasImage}
                sx={{ flex: 1, py: 1.5, bgcolor: "#10B981", "&:hover": { bgcolor: "#059669" }, boxShadow: "0 4px 20px rgba(16,185,129,0.3)" }}
              >
                Save Image
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default ImageEditor;
