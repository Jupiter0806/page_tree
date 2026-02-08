import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  // this is for dev with docer as the vite server needs to be accessible from outside the container
  server: {
    host: true,
  },
  base: process.env.VITE_BASE_PATH || "/",
});
