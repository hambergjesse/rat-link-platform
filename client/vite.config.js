import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.NODE_ENV === "development" ? 5173 : undefined,
    proxy: {
      "/api": process.env.VITE_API_URL || "http://localhost:3001",
      "/auth": process.env.VITE_API_URL || "http://localhost:3001",
    },
  },
});
