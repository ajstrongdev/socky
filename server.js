import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Disposition"],
    credentials: true,
  })
);

// Create HTTP server
const server = createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("chat message", (uname, msg) => {
    io.emit("chat message", uname, msg); // Broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start WebSocket Server
server.listen(4000, () => {
  console.log("Socket.IO server running on port 4000");
});
