const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const { createServer } = require("http");
const socketio = require("socket.io");

const app = require("./app");

const server = createServer(app);
// const io = socketio(server, { cors: { origin: process.env.NODE_ENV=="development" ? process.env.ORIGIN_DEV :process.env.ORIGIN_PROD} });
const io = socketio(server, {
  cors: { origin: "https://faith-chat-9620f.web.app" },
});
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
  const existingUser = users.find((user) => user.userId === userId);
  if (existingUser) {
    existingUser.socketId = socketId; // Update socket ID if user reconnects
  } else {
    users.push({ userId, socketId }); // Add new user if not in list
  }
//  if (!users.some((user) => user.userId === userId)){
//   users.push({ userId, socketId });
//  }
//  console.log("Users:", users);
};

const removeUser = (socketid) => {
  users = users.filter((user) => user.socketId !== socketid);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};



io.on("connection", (socket) => {
  //when connected
  console.log(`a user conected: ${socket.id}`);
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

  socket.on("callUser", (data) => {
    const userToCall = users.find((user) => user.userId === data.userToCall);
    if (userToCall) {
      console.log(`Calling ${userToCall.userId} at ${userToCall.socketId}`);
      io.to(userToCall.socketId).emit("hey", {
        signal: data.signalData,
        from: data.from,
      });
    }
    // io.to(data.userToCall).emit("hey", {
    //   signal: data.signalData,
    //   from: data.from,
    // });
  });

  socket.on("acceptCall", (data) => {
    const user = users.find((user) => user.userId === data.to);
    if (user) {
      io.to(user.socketId).emit("callAccepted", data.signal);
    }
    // io.to(data.to).emit("callAccepted", data.signal);
  });

  //when disconnected
  socket.on("disconnect", () => {
    console.log("a user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});


