import { Plugin } from "vite";
import { RawData, type WebSocket, WebSocketServer } from "ws";

const options = {
  port: 7007,
  host: "localhost",
};

const port = options.port ?? 7007;

const host = options.host ?? "localhost";

let wss: WebSocketServer;

const clients = new Array<WebSocket & { id: string }>();

export const startServer = () => {
  return {
    name: "vite-plugin-ws-server",
    buildEnd: () => {
      wss.close();
    },
    buildStart: () => {
      if (!wss) {
        wss = new WebSocketServer({ port, host });
      }

      wss.on("connection", (ws: WebSocket & { id: string }) => {
        console.log("websocket connection established");

        ws.on("error", console.error);

        ws.on("close", () => {
          if (ws.id) {
            console.log(ws.id, "closed");

            clients.splice(
              clients.findIndex((client) => client.id === ws.id),
              1
            );
          }
        });

        ws.on("message", (data: RawData) => {
          try {
            const message = data.toString();

            const json = JSON.parse(message);
            if (
              json.id &&
              clients.find((client) => client.id === json.id) === undefined
            ) {
              ws.id = json.id;

              console.log("adding ws to client list");

              clients.push(ws);
            }

            console.log("Websocket message received from client:", message);

            clients.forEach((wsClient) => {
              const typedClient = wsClient as WebSocket & { id: string };

              if (typedClient.id === json.id) return;
              console.log(
                "sending message to client",
                json.id,
                "message",
                data.toString()
              );
              console.log(clients.map((c) => c.id));
              typedClient.send(JSON.stringify({ data: data.toString() }));
            });
          } catch (error) {
            console.error(error);
          }
        });
      });
    },
  } satisfies Plugin;
};
