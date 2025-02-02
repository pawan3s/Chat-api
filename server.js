const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const { createServer } = require("http");
const socketio = require("socket.io");

const app = require("./app");

const server = createServer(app);
const io = socketio(server, { cors: { origin: process.env.ORIGIN } });
// const io = socketio(server, {
//   cors: { origin: "https://faith-chat-9620f.web.app" },
// });
mongoose.set("strictQuery", false); 
//Database
const DB = process.env.DATABASE_URI;

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connected to Database Successfully!");
  })
  .catch((err) => {
    console.log(err);
  });

//server listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running  on port ${PORT}`);
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketid) => {
  users = users.filter((user) => user.socketId !== socketid);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when connected
  console.log("a user conected");
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get messages
  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    const user = getUser(receiverId);
    io.to(user?.socketId).emit("getMessage", {
      senderId,
      message,
    });
  });

  //when disconnected
  socket.on("disconnect", () => {
    console.log("a user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
