import multer, { FileFilterCallback } from "multer";

// Set up Multer to store files in memory
const storage = multer.memoryStorage();

// File filter function to only allow image files
const fileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  cb: FileFilterCallback
) => {
  // Allowed mime types for images
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];

  if (allowedMimeTypes.includes(file.mimetype)) {
    // If the file is an image, accept it
    cb(null, true);
  } else {
    cb(new Error("Only Image files are allowed!"));
  }
};

// Set up the multer upload with storage, file filter, and limits
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limit file size to 10MB (adjust as needed)
  },
});
