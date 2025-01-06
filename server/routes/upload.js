const express = require("express");
const router = express.Router();
const { upload } = require("../config/cloudinary");
const uploadController = require("../controllers/uploadController");
const isAuthenticated = require("../middleware/auth");

router.post(
  "/profile-picture",
  isAuthenticated,
  upload.single("image"),
  uploadController.uploadProfilePicture
);

router.delete(
  "/profile-picture",
  isAuthenticated,
  uploadController.deleteProfilePicture
);

module.exports = router;
