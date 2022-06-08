const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data");
const app =express();
const connectDB = require("./DB");
const userRoutes = require("./userRoutes");
const { notFound, errorHandler } = require("./errorMiddleware");
const chatRoutes = require("./chatRoutes");
const messageRoutes = require("./messageRoutes");
const notificationRoutes = require('./notificationRoutes');
const path = require('path');

dotenv.config();
connectDB();

app.use(express.json());



app.use('/api/user',userRoutes);

app.use('/api/chat',chatRoutes);

app.use('/api/message',messageRoutes);

app.use('/api/notification',notificationRoutes);

//------------------------------------Deployement-------------------------------------//

const ___dirname1 = path.resolve();
if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(___dirname1,"../frontend/build")));

  app.get('*',(req,res) => {
    res.sendFile(path.resolve(___dirname1,"frontend","build","index.html"));
  })
}else{
  app.get("/", (req,res) => {
      res.send("API is running");
  });
}

//------------------------------------Deployement-------------------------------------//

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 4000

const server = app.listen(PORT,console.log(`Server is running on port ${PORT}.`));

const io = require('socket.io')(server,{
  pingTimeout:60000,
  cors:{
    origin:"http://localhost:3000",
  },
})

io.on("connection",(socket) => {
  console.log("Connected to socket.io")

  socket.on("setup",(userData) => {
    socket.join(userData._id)
    socket.emit("connected")
  })

  socket.on("join chat",(room) => {
    socket.join(room);
    console.log("User joined Room " + room);
  })

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if(!chat.users) return console.log("chat.users not defined");
    chat.users.forEach((user) => {
      if(user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved",newMessageRecieved);
    })
  })

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.off("setup",() => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });

});
