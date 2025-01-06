import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { platforms } from "../utils/platforms";

const EditLinkModal = ({ link, onSave, onClose }) => {
  const [editedLink, setEditedLink] = useState({ ...link });
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(editedLink);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-dark-200 rounded-lg p-6 w-full max-w-md animate-fade-in">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Edit Link
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Platform
            </label>
            <select
              value={editedLink.platform}
              onChange={(e) =>
                setEditedLink({ ...editedLink, platform: e.target.value })
              }
              className="w-full p-3 border rounded-md bg-white dark:bg-dark-300 dark:border-dark-400"
            >
              {platforms.map((platform) => (
                <option key={platform.id} value={platform.id}>
                  {platform.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={editedLink.title}
              onChange={(e) =>
                setEditedLink({ ...editedLink, title: e.target.value })
              }
              className="w-full p-3 border rounded-md bg-white dark:bg-dark-300 dark:border-dark-400"
              maxLength={50}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL
            </label>
            <input
              type="url"
              value={editedLink.url}
              onChange={(e) =>
                setEditedLink({ ...editedLink, url: e.target.value })
              }
              className="w-full p-3 border rounded-md bg-white dark:bg-dark-300 dark:border-dark-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Background Color
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-full p-3 border rounded-md flex items-center"
                style={{ backgroundColor: editedLink.backgroundColor }}
              >
                <span
                  className="w-6 h-6 rounded mr-2 border"
                  style={{ backgroundColor: editedLink.backgroundColor }}
                />
                {editedLink.backgroundColor}
              </button>
              {showColorPicker && (
                <div className="absolute z-10 mt-2">
                  <div
                    className="fixed inset-0"
                    onClick={() => setShowColorPicker(false)}
                  />
                  <HexColorPicker
                    color={editedLink.backgroundColor}
                    onChange={(color) =>
                      setEditedLink({ ...editedLink, backgroundColor: color })
                    }
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-primary-500 text-white py-2 rounded-md hover:bg-primary-600 transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLinkModal;
