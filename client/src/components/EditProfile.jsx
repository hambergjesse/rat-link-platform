import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HexColorPicker } from "react-colorful";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { platforms } from "../utils/platforms";
import ImageUpload from "./ImageUpload";
import api from "../utils/axios";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-8">
          <h2 className="text-xl text-red-600">Something went wrong.</h2>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    username: "",
    bio: "",
    profilePicture: "",
  });
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState({
    platform: "",
    url: "",
    title: "",
    backgroundColor: "#ffffff",
  });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      try {
        // Check authentication first
        const authResponse = await api.get("/api/auth/check");
        if (!authResponse.data.authenticated) {
          navigate("/");
          return;
        }

        // Then fetch profile data
        const profileResponse = await api.get("/api/profile");
        setProfile(
          profileResponse.data.profile || {
            username: "",
            bio: "",
            profilePicture: "",
          }
        );
        setLinks(profileResponse.data.links || []);
      } catch (error) {
        console.error("Error:", error);
        setError(error.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/api/profile");
      setProfile(response.data.profile);
      setLinks(response.data.links);
      setLoading(false);
    } catch (error) {
      setError("Error fetching profile");
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/api/profile", {
        bio: profile.bio,
      });
      setSuccess("Profile updated successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Error updating profile");
      setTimeout(() => setError(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleAddLink = async (e) => {
    e.preventDefault();

    // Validate input
    if (!newLink.platform || !newLink.url || !newLink.title) {
      setError("Please fill in all fields");
      return;
    }

    // Validate URL format
    try {
      new URL(newLink.url);
    } catch (error) {
      setError("Please enter a valid URL");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await api.post("/api/links", newLink, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      setLinks([...links, response.data.link]);
      setNewLink({
        platform: "",
        url: "",
        title: "",
        backgroundColor: "#ffffff",
      });
      setSuccess("Link added successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Error adding link");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLink = async (linkId) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;

    try {
      await api.delete(`/api/links/${linkId}`);
      setLinks(links.filter((link) => link._id !== linkId));
      setSuccess("Link deleted successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Error deleting link");
      setTimeout(() => setError(null), 3000);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLinks(items);

    try {
      await api.put("/api/links/reorder", {
        links: items.map((link, index) => ({
          id: link._id,
          order: index,
        })),
      });
    } catch (error) {
      setError("Error updating link order");
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleImageUpload = async (url) => {
    try {
      await api.put("/api/profile", {
        ...profile,
        profilePicture: url,
      });
      setProfile((prev) => ({ ...prev, profilePicture: url }));
      setSuccess("Profile picture updated successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError("Error updating profile picture");
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Edit Profile</h1>
            <button
              onClick={() => navigate(`/${profile.username}`)}
              className="text-blue-500 hover:text-blue-600"
            >
              View Profile
            </button>
          </div>

          {(error || success) && (
            <div
              className={`p-4 rounded-md mb-6 ${
                error
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {error || success}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Profile Picture</h2>
                <ImageUpload
                  currentImage={profile.profilePicture}
                  onImageUpdate={(url) =>
                    setProfile({ ...profile, profilePicture: url })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  className="w-full p-3 border rounded-md"
                  rows="4"
                  placeholder="Tell people about yourself..."
                  maxLength={500}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {profile.bio.length}/500 characters
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors ${
                  saving ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Add New Link</h2>
            <form onSubmit={handleAddLink} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform
                </label>
                <select
                  value={newLink.platform}
                  onChange={(e) =>
                    setNewLink({ ...newLink, platform: e.target.value })
                  }
                  className="w-full p-3 border rounded-md"
                >
                  <option value="">Select a platform</option>
                  {platforms.map((platform) => (
                    <option key={platform.id} value={platform.id}>
                      {platform.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newLink.title}
                  onChange={(e) =>
                    setNewLink({ ...newLink, title: e.target.value })
                  }
                  className="w-full p-3 border rounded-md"
                  placeholder="e.g., Follow me on Twitter"
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL
                </label>
                <input
                  type="url"
                  value={newLink.url}
                  onChange={(e) =>
                    setNewLink({ ...newLink, url: e.target.value })
                  }
                  className="w-full p-3 border rounded-md"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="w-full p-3 border rounded-md flex items-center"
                    style={{ backgroundColor: newLink.backgroundColor }}
                  >
                    <span
                      className="w-6 h-6 rounded mr-2 border"
                      style={{ backgroundColor: newLink.backgroundColor }}
                    ></span>
                    {newLink.backgroundColor}
                  </button>
                  {showColorPicker && (
                    <div className="absolute z-10 mt-2">
                      <div
                        className="fixed inset-0"
                        onClick={() => setShowColorPicker(false)}
                      ></div>
                      <HexColorPicker
                        color={newLink.backgroundColor}
                        onChange={(color) =>
                          setNewLink({ ...newLink, backgroundColor: color })
                        }
                      />
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className={`w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors ${
                  saving ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {saving ? "Adding..." : "Add Link"}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Your Links</h2>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="links">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {(links || []).map((link, index) => {
                      const platformData = platforms.find(
                        (p) => p?.id === link?.platform
                      ) || {
                        icon: "fa-solid fa-link",
                        name: "Custom Link",
                      };

                      return (
                        <Draggable
                          key={link._id || index}
                          draggableId={link._id || `temp-${index}`}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`transform transition-transform duration-200 ${
                                snapshot.isDragging ? "scale-105" : ""
                              }`}
                            >
                              <div
                                className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                                style={{
                                  backgroundColor: link.backgroundColor,
                                }}
                              >
                                <div className="p-4 flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <i
                                      className={`${platformData.icon} text-2xl`}
                                    ></i>
                                    <div>
                                      <div className="font-medium">
                                        {link.title}
                                      </div>
                                      <div className="text-sm text-gray-500 truncate">
                                        {link.url}
                                      </div>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteLink(link._id)}
                                    className="text-red-500 hover:text-red-600 transition-colors"
                                    title="Delete link"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {(!links || links.length === 0) && (
              <div className="text-center text-gray-500 py-8">
                No links yet. Add your first link above!
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default EditProfile;
