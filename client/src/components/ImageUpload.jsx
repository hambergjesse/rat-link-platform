import React, { useState } from "react";
import api from "../utils/axios";

const ImageUpload = ({ currentImage, onImageUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImage);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await api.post("/upload/profile-picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      onImageUpdate(response.data.profilePicture);
    } catch (error) {
      console.error("Error uploading image:", error);
      setPreviewUrl(currentImage);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    try {
      await api.delete("/upload/profile-picture");
      setPreviewUrl("");
      onImageUpdate("");
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
        )}
        <div className="flex flex-col space-y-2">
          <label className="relative cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            <span>{uploading ? "Uploading..." : "Upload New Picture"}</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
              disabled={uploading}
            />
          </label>
          {previewUrl && (
            <button
              onClick={handleDeleteImage}
              className="text-red-500 hover:text-red-600"
            >
              Remove Picture
            </button>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-500">
        Supported formats: JPG, PNG, GIF. Max file size: 5MB
      </p>
    </div>
  );
};

export default ImageUpload;
