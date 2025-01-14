import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { platforms } from "../utils/platforms";
import { useTheme } from "../contexts/ThemeContext";
import api from "../utils/axios";

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { customColors } = useTheme();
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCustomization, setShowCustomization] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/api/profile/${username}`);
        setProfile(response.data.profile);
        setLinks(response.data.links);
        setIsOwner(response.data.isOwner);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || "Error loading profile");
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  const onDragEnd = async (result) => {
    if (!result.destination || !isOwner) return;

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
      console.error("Error updating link order:", error);
      // Optionally revert the state if the API call fails
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button
          onClick={() => navigate("/")}
          className="text-blue-500 hover:text-blue-600"
        >
          Go Home
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-xl mb-4">Profile not found</div>
        <button
          onClick={() => navigate("/")}
          className="text-blue-500 hover:text-blue-600"
        >
          Go Home
        </button>
      </div>
    );
  }

  const toggleCustomization = () => setShowCustomization(!showCustomization);

  return (
    <div className="min-h-screen transition-colors duration-200 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="text-center">
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt={profile.username}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover ring-2 ring-primary-500"
              />
            ) : (
              <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <span className="text-4xl font-medium text-primary-500">
                  {profile.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              @{profile.username}
            </h1>

            {profile.bio && (
              <p className="text-gray-600 dark:text-gray-300 mb-4 whitespace-pre-wrap">
                {profile.bio}
              </p>
            )}

            {isOwner && (
              <button
                onClick={() => navigate("/dashboard")}
                className="text-primary-500 hover:text-primary-600 transition-colors text-sm"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Links Section */}
        <div className="space-y-4">
          {(links || []).map((link, index) => {
            const platformData = platforms.find(
              (p) => p?.id === link?.platform
            ) || {
              icon: "fa-brands fa-link",
              name: "Custom Link",
            };

            return (
              <a
                key={link._id || index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className="rounded-lg p-4 flex items-center justify-between animate-slide-up"
                  style={{ backgroundColor: link.backgroundColor }}
                >
                  <div className="flex items-center space-x-4">
                    <i className={`${platformData.icon} text-2xl`}></i>
                    <div>
                      <div className="font-medium text-white">{link.title}</div>
                      <div className="text-sm text-white/75 truncate max-w-[200px] sm:max-w-[300px]">
                        {link.url}
                      </div>
                    </div>
                  </div>
                  <i className="fas fa-external-link-alt text-sm text-white/75"></i>
                </div>
              </a>
            );
          })}

          {(!links || links.length === 0) && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <i className="fas fa-link text-4xl mb-4"></i>
              <p>
                No links yet
                {isOwner ? ". Add some links in the dashboard!" : "."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to determine text color based on background
const getContrastColor = (hexcolor) => {
  // If no color provided, return black
  if (!hexcolor) return "#000000";

  // Convert hex to RGB
  const r = parseInt(hexcolor.slice(1, 3), 16);
  const g = parseInt(hexcolor.slice(3, 5), 16);
  const b = parseInt(hexcolor.slice(5, 7), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black or white based on luminance
  return luminance > 0.5 ? "#000000" : "#ffffff";
};

export default Profile;
