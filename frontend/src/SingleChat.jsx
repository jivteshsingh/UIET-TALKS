import React, {useState, useEffect } from 'react';
import { ChatState } from "./ChatProvider";
import { Box, Text, IconButton, Spinner, FormControl, Input, useToast } from '@chakra-ui/react';
import {ArrowBackIcon} from "@chakra-ui/icons";
import { getSender, getSenderFull, getReciever, getNotifSender } from "./ChatLogics";
import ProfileModal from "./ProfileModal";
import UpdateGroupModal from "./UpdateGroupModal";
import axios from "axios";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from 'react-lottie';
import animationData from "./typing.json"

const ENDPOINT = "http://localhost:4000/";
const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };
var socket, selectedChatCompare;

function SingleChat({fetchAgain,setFetchAgain}) {
  const {user,selectedChat,setSelectedChat,notification,setNotification} = ChatState();
  const [messages,setMessages] = useState([]);
  const [loading,setLoading] = useState(false);
  const [newMessage,setNewMessage] = useState();
  const [typing,setTyping] = useState(false);
  const [isTyping,setIsTyping] = useState(false);
  const toast = useToast();
  const [socketConnected,setSocketConnected] = useState(false);

  const fetchMessages = async() => {
    if(!selectedChat) return;

    try {
      const config = {
        headers:
        {
          "Content-type": "application/json",
           Authorization: `Bearer ${user.token}`,
        }
         };

         setLoading(true);

         const {data} = await axios.get(`/api/message/${selectedChat._id}`,config);
         setMessages(data);
         setLoading(false);
         socket.emit("join chat",selectedChat._id);
    } catch (error) {
      toast({ title: "Error Occured!", description: "Failed to load the Messages!", status: "error", duration: 5000, isClosable: true, position: "bottom", });
    }

  }



  useEffect(() => {
   socket = io(ENDPOINT);
   socket.emit("setup",user);
   socket.on("connected",() => setSocketConnected(true));
   socket.on("typing", () => setIsTyping(true));
   socket.on("stop typing", () => setIsTyping(false));
  },[])

  useEffect(() => {

  fetchMessages();
  selectedChatCompare = selectedChat;
}, [selectedChat]);

//console.log(notification);


useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if ( selectedChatCompare || selectedChatCompare._id === newMessageRecieved.chat._id ){
        setMessages([...messages, newMessageRecieved]);   //real-time messages
      }
    });
  });




  const sendMessage = async(event) => {
    if(event.key === "Enter" && newMessage){
      socket.emit("stop typing",selectedChat._id)


      try {
          const config = {
            headers:
            {
              "Content-type": "application/json",
               Authorization: `Bearer ${user.token}`,
            }
             };
              setNewMessage("");
              const {data} = await axios.post('/api/message',{ content:newMessage, chatId:selectedChat._id, },config);
              socket.emit("new message",data);
              setMessages([...messages,data]);

      } catch (error) {
        toast({ title: "Error Occured!", description: "Failed to send the Message!", status: "error", duration: 5000, isClosable: true, position: "bottom", });
      }

        if(selectedChat.isGroupChat === false){

            try {
                  const config = {
                    headers:
                    {
                      "Content-type": "application/json",
                       Authorization: `Bearer ${user.token}`,
                    }
                     };
                       const {data} = await axios.post('/api/notification',{ chatId:selectedChat._id, content:newMessage, senderId:getNotifSender(user,selectedChat.users), recieverId:getReciever(user,selectedChat.users) },config);
                       //socket.emit("new notification",data);
                } catch (error) {
                  toast({ title: "Error Occured!", description: "Failed to send the Notification!", status: "error", duration: 5000, isClosable: true, position: "bottom", });
                }

        }




if(selectedChat.isGroupChat === true){
  selectedChat.users.map(async(singleUser) => {
 if(singleUser._id !== user._id){
   try {
         const config = {
           headers:
           {
             "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
           }
            };
              const {data} = await axios.post('/api/notification',{ chatId:selectedChat._id, content:newMessage, senderId:user._id, recieverId:singleUser },config);
              //socket.emit("new notification",data);

            //setNotification([data,...notification]);
       } catch (error) {
         toast({ title: "Error Occured!", description: "Failed to send the Notification!", status: "error", duration: 5000, isClosable: true, position: "bottom", });
       }
 }
  })
}

    }
  }




  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if(!socketConnected) return;

    if(!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if(timeDiff >= timerLength && typing){
        socket.emit("stop typing",selectedChat._id);
        setTyping(false);
      }
    },timerLength);
  }



  return(
    <>
    {selectedChat ? (
      <>
      <Text fontSize={{base:"28px",md:"30px"}} pb={3} px={2} w="100%" fontFamily="Work sans" d="flex" justifyContent={{base:"space-between"}} alignItems="center">
      <IconButton d={{base:"flex",md:"none"}} icon={<ArrowBackIcon />} onClick={() => setSelectedChat("")} />
      {!selectedChat.isGroupChat ? (
        <>
        {getSender(user,selectedChat.users)}
        <ProfileModal user={getSenderFull(user,selectedChat.users)} />
        </>
      ) : (
        <>
        {selectedChat.chatName.toUpperCase()}
        <UpdateGroupModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
        </>
      )}
      </Text>
      <Box d="flex" flexDir="column" justifyContent="flex-end" p={3} bg="#E8E8E8" w="100%" h="100%" borderRadius="lg" overflowY="hidden">

      {loading ? (
        <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
      ) : (<div className="messages">
      <ScrollableChat messages={messages} />
        </div>)}

        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
        {isTyping ? (
          <div><Lottie width={100} style={{ marginBottom: 15, marginLeft: 0 }} options={defaultOptions} /></div>
        ) : (<></>)}
        <Input variant="filled" bg="#E0E0E00" placeholder="Enter a message.." value={newMessage} onChange={typingHandler} />
        </FormControl>

      </Box>
      </>
    ) : (
      <Box d="flex" alignItems="center" justifyContent="center" h="100%">
      <Text fontSize="3xl" pb={3} fontFamily="Work sans">
      Click on a user to start chatting
      </Text>
      </Box>
    )}
    </>
  );

}

export default SingleChat;
