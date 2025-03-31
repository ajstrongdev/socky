import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

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

// Create database if it doesn't exist
const startDatabase = async () => {
  const exists = await fetch("http://localhost:3001/database/exists");
  const response = await exists.json();
  if (response?.DatabaseExists === 0) {
    await fetch("http://localhost:3001/database/create");
  }
  console.log("Database check complete", response);
}
startDatabase();

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("chat message", (uname, msg) => {
    io.emit("chat message", uname, msg); // Broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Routes
import databaseRoutes from "./routes/database.js";
import userRoutes from "./routes/users.js";
import messageRoutes from "./routes/message.js";
app.use("/database", databaseRoutes);
app.use("/users", userRoutes);
app.use("/message", messageRoutes);

// Start Express API Server
app.listen(3001, () => console.log("Backend API running on port 3001"));

// Start WebSocket Server
server.listen(4000, () => {
  console.log("Socket.IO server running on port 4000");
});
