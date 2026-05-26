import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import DashboardLayout from "./DashboardLayout";
import DragDropUpload from "./DragDropUpload";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  Paper
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  CloudUpload as CloudIcon,
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  InsertDriveFile as FileIcon
} from "@mui/icons-material";
import API_URL from "../config";

const Drive = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post(`${API_URL}/drive`, formData);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "File Uploaded on Google Drive",
        showConfirmButton: false,
        timer: 1500
      });
      setFile(null);
      showFiles();
    } catch (error) {
      console.error("Error uploading file:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to upload file",
        text: error.message
      });
    }
    setLoading(false);
  };

  const showFiles = async () => {
    try {
      const response = await axios.get(`${API_URL}/drives`);
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    showFiles();
  }, []);

  const getFileIcon = (type) => {
    if (!type) return <FileIcon sx={{ fontSize: 40, color: "text.secondary" }} />;
    if (type.includes("pdf")) {
      return <PdfIcon sx={{ fontSize: 40, color: "error.main" }} />;
    }
    if (type.includes("image")) {
      return <ImageIcon sx={{ fontSize: 40, color: "primary.main" }} />;
    }
    return <FileIcon sx={{ fontSize: 40, color: "text.secondary" }} />;
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, letterSpacing: "-0.5px" }}>
          Upload Your Files on Google Drive
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Store your PDFs, documents, and images securely.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={4}>
          <Paper className="glass-panel" sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Upload New File
            </Typography>
            <DragDropUpload
              onFileSelect={handleFileChange}
              currentFile={file}
              loading={loading}
              label="Drag & drop file or click to browse"
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleUpload}
              disabled={!file || loading}
              startIcon={<UploadIcon />}
              sx={{ mt: 1 }}
            >
              {loading ? "Uploading..." : "Upload File"}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={8}>
          <Paper className="glass-panel" sx={{ p: 3, borderRadius: 3, minHeight: "400px" }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Stored Files ({files.length})
            </Typography>

            {files.length === 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 8 }}>
                <CloudIcon sx={{ fontSize: 64, color: "text.secondary", opacity: 0.3, mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No files uploaded yet. Upload a file on the left panel to get started.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {files.map((f) => (
                  <Grid item xs={12} sm={6} md={4} key={f._id}>
                    <Card className="glass-panel glass-card-hover" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                      <CardContent sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 2, pt: 3, pb: 2 }}>
                        {getFileIcon(f.type)}
                        <Box sx={{ overflow: "hidden" }}>
                          <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600, color: "text.primary" }}>
                            {f.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
                            {f.type || "Unknown Type"}
                          </Typography>
                        </Box>
                      </CardContent>
                      <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2, pt: 0 }}>
                        <Tooltip title="Download File">
                          <IconButton
                            href="https://drive.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ 
                              color: "primary.main", 
                              backgroundColor: "rgba(23, 110, 222, 0.08)",
                              "&:hover": { backgroundColor: "rgba(23, 110, 222, 0.15)" }
                            }}
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default Drive;
