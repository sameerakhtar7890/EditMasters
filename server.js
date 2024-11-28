const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const userRoute = require("./Routes/userRoutes");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/api/users", userRoute);
const uploadDrive = multer({ dest: "uploads/" });

// Connect to MongoDB
mongoose.connect(
  "mongodb://localhost:27017/test");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const fileSchema = new mongoose.Schema({
  name: String,
  path: String,
  type: String,
});

const File = mongoose.model("File", fileSchema);

const GoogleDriveSchema = new mongoose.Schema({
  name: String,
  path: String,
  type: String,
});

const Drive = mongoose.model("Drive", GoogleDriveSchema);

app.post("/drive", uploadDrive.single("file"), async (req, res) => {
  try {
    const { originalname, path, mimetype } = req.file;
    const file = new Drive({
      name: originalname,
      path: path,
      type: mimetype,
    });
    await file.save();
    res.send("File uploaded successfully on Google Drive");
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Failed to upload file");
  }
});

app.get("/drives", async (req, res) => {
  try {
    const files = await Drive.find();
    res.json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).send("Failed to fetch files");
  }
});

// app.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     const { originalname, path, mimetype } = req.file;
//     const file = new File({
//       name: originalname,
//       path: path,
//       type: mimetype,
//     });
//     await file.save();
//     res.send("File uploaded successfully");
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     res.status(500).send("Failed to upload file");
//   }
// });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext);
  },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { originalname, path, mimetype } = req.file;
    console.log('File received:', req.file);

    const file = new File({
      name: originalname,
      path: path,
      type: mimetype,
    });

    await file.save();
    res.send('File uploaded successfully on Google Drive');
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Failed to upload file');
  }
});

app.get("/files", async (req, res) => {
  try {
    const files = await File.find();
    res.json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).send("Failed to fetch files");
  }
});
// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
