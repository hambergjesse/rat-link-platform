const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "rat-link-platform/profile-pictures",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
    transformation: [
      { width: 500, height: 500, crop: "fill", gravity: "face" },
    ],
    public_id: (req, file) => {
      const userId = req.user._id;
      const timestamp = Date.now();
      return `user_${userId}_${timestamp}`;
    },
  },
});

const upload = multer({ storage: storage });

module.exports = { upload, cloudinary };
