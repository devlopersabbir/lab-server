const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

// Middleware
app.use(express.json());
app.use(cors());

// Configuration
const UPLOAD_DIR = "./uploads";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Hello world",
  });
});

// Endpoint 1: Upload File
app.post("/upload", upload.any(), (req, res) => {
  const file = req.files && req.files[0];
  if (file) {
    return res.json({
      success: true,
      message: `File uploaded to ${file.path}`,
    });
  }

  console.log(req.files[0]);
  const { filename, content } = req.body;
  if (!filename) {
    return res.status(400).json({ error: "No file or filename provided" });
  }

  const filePath = path.join(UPLOAD_DIR, filename);

  // Write the file
  fs.writeFileSync(filePath, content || "", "utf8");

  res.json({ success: true, message: `File uploaded to ${filePath}` });
});

// Endpoint 2: Retrieve Files
app.get("/retrieve", (req, res) => {
  const { filename } = req.query;
  console.log(req.query);

  try {
    if (filename) {
      const filePath = path.join(UPLOAD_DIR, filename);
      return res.sendFile(path.resolve(filePath));
    }

    const files = fs.readdirSync(UPLOAD_DIR);
    res.json({ files: files });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT ?? 5000, () =>
  console.log(`Server running on port ${process.env.PORT}`),
);
