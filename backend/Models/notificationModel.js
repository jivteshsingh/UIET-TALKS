const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
  {
    sender:{ type: mongoose.Schema.Types.ObjectId, ref:"User" },
    reciever:{ type: mongoose.Schema.Types.ObjectId, ref:"User" },
    chat:{ type: mongoose.Schema.Types.ObjectId, ref:"Chat" },
    content:{ type:String, trim: true },
  },
  {
    timestamps:true
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
