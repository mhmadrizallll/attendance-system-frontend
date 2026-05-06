import { io } from "socket.io-client";

export const socket = io("http://localhost:5503", {
  autoConnect: false,
  transports: ["websocket"],
});
