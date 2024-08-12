import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { startServer } from "./ws-server";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), startServer()],
});
