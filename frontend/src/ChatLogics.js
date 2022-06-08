
export function getSender(loggedUser,users) {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export function getReciever(loggedUser,users) {
  return users[0]._id === loggedUser._id ? users[1]._id : users[0]._id;
};

export function getNotifSender(loggedUser,users) {
  return users[0]._id === loggedUser._id ? users[0]._id : users[1]._id;
};

export function getSenderFull(loggedUser,users) {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export function isSameSender(messages,m,i,userId) {
  return (
    i < messages.length - 1 &&
    (messages[i+1].sender._id !== m.sender._id || messages[i+1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
}


export function isLastMessage(messages, i, userId) {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
}

export function isSameSenderMargin(messages, m, i, userId) {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};


export function isSameUser(messages, m, i) {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
