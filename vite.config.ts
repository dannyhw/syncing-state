import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { startServer } from "./ws-server";

// declare global {
//   // eslint-disable-next-line @typescript-eslint/no-namespace
//   namespace globalThis {
//     // eslint-disable-next-line no-var
//     var ran: boolean;
//   }
// }

// global.ran = false;

// if (!global.ran) {
//   startServer();

//   global.ran = true;
// }

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), startServer()],
});
