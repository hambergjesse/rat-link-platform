// src/components/Profile.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import { platforms } from "../utils/platforms";

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/profile/${username}`);
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
      await axios.put("/api/links/reorder", {
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="text-center">
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt={profile.username}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center">
                <span className="text-4xl text-gray-400">
                  {profile.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <h1 className="text-2xl font-bold mb-2">@{profile.username}</h1>
            {profile.bio && (
              <p className="text-gray-600 mb-4 whitespace-pre-wrap">
                {profile.bio}
              </p>
            )}
            {isOwner && (
              <button
                onClick={() => navigate("/dashboard")}
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="links">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {links.map((link, index) => {
                  const platformData = platforms.find(
                    (p) => p.id === link.platform
                  );
                  return (
                    <Draggable
                      key={link._id}
                      draggableId={link._id}
                      index={index}
                      isDragDisabled={!isOwner}
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
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                            style={{
                              backgroundColor: link.backgroundColor,
                              color: getContrastColor(link.backgroundColor),
                            }}
                          >
                            <div className="p-4 flex items-center space-x-4">
                              <i
                                className={`${
                                  platformData?.icon || "fa-solid fa-link"
                                } text-2xl`}
                              ></i>
                              <span className="flex-1 font-medium">
                                {link.title}
                              </span>
                              <i className="fas fa-external-link-alt text-sm opacity-75"></i>
                            </div>
                          </a>
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

        {links.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No links added yet
            {isOwner && " - Add some links in the dashboard!"}
          </div>
        )}
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
