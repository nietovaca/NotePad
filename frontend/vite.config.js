import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Match the port used in Okta config
    strictPort: true, // Don't automatically try another port if 3000 is in use
  },
  build: {
    outDir: "build",
  },
});
