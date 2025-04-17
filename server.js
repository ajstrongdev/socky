import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// SocketIO Server
const server = createServer((req, res) => {
  handle(req, res);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");
  // Chat messages
  socket.on("chat message", (roomid, uname, msg) => {
    io.emit("chat message", roomid, uname, msg);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.prepare().then(() => {
  server.listen(4000, (err) => {
    if (err) throw err;
  });
});
