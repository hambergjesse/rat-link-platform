import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.VITE_NODE_ENV === "development" ? 5173 : undefined,
    proxy: {},
  },
});
