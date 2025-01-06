import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useTheme } from "../contexts/ThemeContext";

const ColorCustomizer = () => {
  const { customColors, updateCustomColors } = useTheme();
  const [activeColor, setActiveColor] = useState(null);

  const colorOptions = [
    { key: "background", label: "Page Background" },
    { key: "cardBackground", label: "Card Background" },
    { key: "text", label: "Text Color" },
    { key: "linkBackground", label: "Link Background" },
    { key: "linkText", label: "Link Text" },
  ];

  return (
    <div className="space-y-4 p-4 bg-white dark:bg-dark-200 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Customize Colors
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {colorOptions.map(({ key, label }) => (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </label>
            <button
              onClick={() => setActiveColor(key)}
              className="w-full h-10 rounded border-2 border-gray-300 dark:border-gray-600"
              style={{ backgroundColor: customColors[key] }}
            />
          </div>
        ))}
      </div>

      {activeColor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-dark-200 p-4 rounded-lg">
            <HexColorPicker
              color={customColors[activeColor]}
              onChange={(color) => updateCustomColors({ [activeColor]: color })}
            />
            <button
              onClick={() => setActiveColor(null)}
              className="mt-4 w-full py-2 px-4 bg-primary-500 text-white rounded hover:bg-primary-600"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorCustomizer;
