const asyncHandler = require("express-async-handler");
const User = require("./Models/userModel");
const Notification = require("./Models/notificationModel")

const sendNotification = asyncHandler(async(req,res) => {

  const {senderId,chatId,content,recieverId} = req.body

  if(!senderId || !chatId || !recieverId || !content){
    console.log("Invalid Data Passed into Request.");
    return res.sendStatus(400);
  }

    var newNotification = {
      sender: senderId,
      reciever: recieverId,
      chat: chatId,
      content: content,
    }


  try {
      var notification = await Notification.create(newNotification);
      notification = await notification.populate("sender","name pic");
      notification = await notification.populate("reciever","name pic");
      notification = await notification.populate("chat");
      notification = await User.populate(notification,{
        path:"chat.users",
        select:"name pic email",
     })

      res.json(notification);



  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }


});

const fetchNotification = asyncHandler(async(req,res) => {

  try {
    var notifications = await Notification.find({reciever : req.user._id})
    .populate("sender","name pic email")
    .populate("reciever","name pic email")
    .populate("chat")
    .populate("content");

    notifications = await User.populate(notifications,{
      path:"chat.users",
      select:"name pic email",
    })



    res.json(notifications);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const deleteNotification = asyncHandler(async(req,res) => {

  const { notificationId } = req.body;
  try {
    const deleted = await Notification.findByIdAndDelete(notificationId);
    if(!deleted) {
      res.status(404);
      throw new Error("Notification not deleted.")
    }else{
      res.json(deleted);
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }

})

const deleteAll = asyncHandler(async(req,res) => {
  const { chatId, recieverId } = req.body;

  try {
    const deletedNotifications = await Notification.deleteMany({chat:chatId,reciever:recieverId});
    if(!deletedNotifications){
      res.status(404);
      throw new Error("Notifications not deleted.")
    }else{
      res.json(deletedNotifications);
    }
    } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
})

const groupDelete = asyncHandler(async(req,res) => {
  const { chatId, recieverId } = req.body;
  try {
    const deletedGroup = await Notification.deleteMany({chat:chatId,reciever:recieverId});
    if(!deletedGroup){
      res.status(404);
      throw new Error("Notifications not deleted.")
    }else{
      res.json(deletedGroup);
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
})

module.exports = { sendNotification, fetchNotification, deleteNotification, deleteAll, groupDelete }
