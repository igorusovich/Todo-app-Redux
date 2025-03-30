
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    allowedHosts: ["c7bcfc2d-3d01-4873-97ac-508f31153247-00-kku2ioxkvf7u.worf.replit.dev"]
  },
});
