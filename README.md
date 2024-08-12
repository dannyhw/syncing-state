see ws-server.ts which is a vite plugin that starts a web socket server

it just forwards any message it recieves to all connected clients

It expects to receive an id and payload from all messages so as to not create an infinite loop resending messages to the same client

Usage:

app:

```ts
const [count, setCount] = useSyncedState(0);
```

vite:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { startServer } from "./ws-server";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), startServer()],
});
```

See ws-server.ts and App.tsx for implementation

https://github.com/user-attachments/assets/6d005e83-9758-4930-9432-85452767f75b
