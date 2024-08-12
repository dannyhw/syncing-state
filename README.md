see ws-server.ts which is a vite plugin that starts a web socket server

it just forwards any message it recieves to all connected clients

It expects to receive an id and payload from all messages so as to not create an infinite loop resending messages to the same client
