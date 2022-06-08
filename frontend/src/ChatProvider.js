import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {

  const [user,setUser] = useState();
  const [selectedChat,setSelectedChat] = useState();
  const [notification,setNotification] = useState([]);



  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
 }, []);




  return <ChatContext.Provider value={{ user,setUser,selectedChat,setSelectedChat,notification,setNotification }}>{ children }</ChatContext.Provider>;
};

export const ChatState = () => {
  return useContext(ChatContext);
}

export default ChatProvider;
