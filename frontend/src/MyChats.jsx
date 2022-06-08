import React, { useState, useEffect } from 'react';
import { ChatState } from "./ChatProvider";
import { useToast, Box, Button, Stack, Text } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import axios from "axios";
import ChatLoading from "./ChatLoading";
import { getSender } from "./ChatLogics";
import GroupChatModal from "./GroupChatModal";

function MyChats({chats,setChats,fetchAgain}) {
  const {user,setUser,selectedChat,setSelectedChat} = ChatState();
  const [loggedUser,setLoggedUser] = useState();
  const toast = useToast();


  const fetchChats = async() => {
    try {

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

        const { data } = await axios.get("/api/chat", config);
        setChats(data);

    } catch (error) {
        toast({ title: "Error Occured!", description:"Failed to Load the Chats", status: "error", duration: 5000, isClosable: true, position: "bottom-left", });
    }
  }

  useEffect(() => {
    setSelectedChat("");
  },[])



  useEffect(() => {
  setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
}, [fetchAgain]);

useEffect(() => {
  fetchChats();
},[chats]);



 return(
   <Box d={{base:selectedChat ? "none" : "flex", md:"flex"}} flexDir="column" alignItems="center" p={3} bg="white" w={{base:"100%",md:"31%"}} borderRadius="lg" borderWidth="1px">
   <Box pb={3} px={3} fontSize={{base:"28px",md:"30px"}} fontFamily="Work sans" d="flex" w="100%" justifyContent="space-between" alignItems="center">
   My Chats
   <GroupChatModal chats={chats} setChats={setChats}>
   <Button d="flex" fontSize={{base:"17px",md:"10px",lg:"17px"}} rightIcon={<AddIcon />}>
   New Group Chat
   </Button>
   </GroupChatModal>
   </Box>
   <Box d="flex" flexDir="column" p={3} bg="#F8F8F8" w="100%" h="100%" borderRadius="lg" overflowY="hidden">
   {chats ? (
     <Stack overflowY="scroll">
     {chats.map((chat) => (
       <Box onClick={() => {
         setSelectedChat(chat);
       }} cursor="pointer" bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"} color={selectedChat === chat ? "white" : "black"} px={3} py={2} borderRadius="lg">
       <Text>{!chat.isGroupChat?(getSender(loggedUser,chat.users)):(chat.chatName)}</Text>
       </Box>
     ))}
     </Stack>

   ) : (<ChatLoading />)}
   </Box>
   </Box>
 )
}

export default MyChats;
