import React, { useState, useRef } from "react";
import { Box, Typography, Button, Paper, CircularProgress } from "@mui/material";
import { CloudUpload as UploadIcon, InsertDriveFile as FileIcon } from "@mui/icons-material";

const DragDropUpload = ({ 
  onFileSelect, 
  accept = "*", 
  label = "Drag & drop your file here, or click to browse", 
  icon: Icon = UploadIcon,
  currentFile = null,
  loading = false
}) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // Basic type validation if accept is specified
      if (accept !== "*") {
        const fileType = file.type;
        const acceptedTypes = accept.split(",").map(t => t.trim());
        const isValid = acceptedTypes.some(type => {
          if (type.endsWith("/*")) {
            return fileType.startsWith(type.replace("/*", ""));
          }
          return fileType === type;
        });

        if (!isValid) {
          alert(`Invalid file type. Please upload a file matching: ${accept}`);
          return;
        }
      }
      onFileSelect(file);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Box sx={{ width: "100%", my: 3 }}>
      <input
        ref={inputRef}
        type="file"
        style={{ display: "none" }}
        accept={accept}
        onChange={handleChange}
        disabled={loading}
      />
      
      <Paper
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        sx={{
          py: 5,
          px: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: "2px dashed",
          borderColor: dragActive ? "primary.main" : "rgba(255, 255, 255, 0.15)",
          borderRadius: 4,
          backgroundColor: dragActive ? "rgba(23, 110, 222, 0.08)" : "rgba(17, 24, 39, 0.4)",
          transition: "all 0.3s ease",
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: dragActive ? "0 0 20px rgba(23, 110, 222, 0.2)" : "none",
          "&:hover": {
            borderColor: loading ? "rgba(255, 255, 255, 0.15)" : "primary.main",
            backgroundColor: loading ? "rgba(17, 24, 39, 0.4)" : "rgba(23, 110, 222, 0.03)",
          }
        }}
        onClick={loading ? undefined : onButtonClick}
      >
        {loading ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              Processing file, please wait...
            </Typography>
          </Box>
        ) : currentFile ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <FileIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, maxWidth: 400, noWrap: true, mb: 0.5 }}>
              {currentFile.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {formatFileSize(currentFile.size)}
            </Typography>
            <Button variant="outlined" color="primary" size="small" onClick={(e) => { e.stopPropagation(); onButtonClick(); }}>
              Change File
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <Icon sx={{ fontSize: 48, color: "text.secondary", mb: 2, transition: "transform 0.3s ease" }} />
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 1, color: "text.primary" }}>
              {label}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Supports files up to 50MB
            </Typography>
            <Button variant="contained" color="primary" size="medium" onClick={(e) => { e.stopPropagation(); onButtonClick(); }}>
              Select File
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default DragDropUpload;
