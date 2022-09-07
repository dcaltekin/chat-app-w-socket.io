const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User id: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data.room);
    var onlineUsers = io.engine.clientsCount;
    console.log(onlineUsers);

    io.to(data.room).emit("roomData", onlineUsers);
    io.to(data.room).emit("userjoin", data.username);

    console.log(`${socket.id} joined the room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    var onlineUsers = io.engine.clientsCount;
    console.log(onlineUsers);

    io.emit("roomLeave", onlineUsers);
  });
});

server.listen(3001, () => {
  console.log("Server is up!");
});
