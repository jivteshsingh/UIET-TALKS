import React, { useState, useEffect } from 'react';
import { Box, Tooltip, Button, Text, Menu, MenuButton, MenuList, MenuItem, Avatar, Drawer, useDisclosure, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Input, useToast, Spinner } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { ChatState } from "./ChatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from 'react-router-dom';
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserList from "./UserList";
import {getSender} from "./ChatLogics";
import {Effect} from "react-notification-badge";
import NotifcationBadge from "react-notification-badge";

function SideDrawer({chats,setChats}) {

  const [search,setSearch] = useState();
  const [searchResult,setSearchResult] = useState([]);
  const [loadingChat,setLoadingChat] = useState();
  const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [loading, setLoading] = useState(false);



  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setSelectedChat("");
    history.push("/");
  }

   const handleSearch = async() => {
    if(!search){
      toast({ title: "Please Enter something in search", status: "warning", duration: 5000, isClosable: true, position: "top-left", });
    }

      try {
     setLoading(true);

     const config = {
       headers: {
         Authorization: `Bearer ${user.token}`,
       },
     };

     const { data } = await axios.get(`/api/user?search=${search}`, config);

     setLoading(false);
     setSearchResult(data);
   } catch (error) {
      toast({ title: "Error Occured!", description:"Failed to Load the Search Results", status: "error", duration: 5000, isClosable: true, position: "top-left", });
    }
   }

  const accessChat = async(userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);

      if(!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      console.log(data);
      setLoadingChat(false);
      onClose();
    } catch (e) {
      toast({ title: "Error Fetching the Chat", description:e.message, status: "error", duration: 5000, isClosable: true, position: "bottom-left", });
    }
  }

const deleteChatNotification = async () => {
if(selectedChat){
  try{

  const config = {
    headers:{
      "Content-type":"application/json",
      Authorization: `Bearer ${user.token}`,
    },
    data:{
      chatId:selectedChat._id,
      recieverId:user._id,
    },
  };

  const {data} = await axios.delete('/api/notification/deleteall',config);

} catch (error) {
toast({ title: "Error Occured!", description:"Failed to Delete the Notifications", status: "error", duration: 5000, isClosable: true, position: "bottom-left", });
}
}

}



  const fetchNotifications = async () => {
    try {

      const config = {
        headers:{
          "Content-type":"application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };


      const {data} = await axios.get('/api/notification',config);
     setNotification(data);


    } catch (error) {
      toast({ title: "Error Occured!", description:"Failed to Load the Notifications", status: "error", duration: 5000, isClosable: true, position: "bottom-left", });
    }
  }

  useEffect(() => {
        deleteChatNotification();
      fetchNotifications();


},[notification])



  return (
    <div>

     <Box d="flex" justifyContent="space-between" alignItems="center" bg="white" w="100%" p="5px 10px 5px 10px" borderWidth="5px">
      <Tooltip label="Search Users To Chat" hasArrow placement='bottom-end'>
      <Button variant="ghost" onClick={onOpen}>
      <i class="fa-solid fa-magnifying-glass"></i>
      <Text d={{ base: "none", md: "flex" }} px="4">Search Users</Text>
      </Button>
      </Tooltip>
      <Text fontSize='2xl' fontFamily='Work sans'>UIET TALKS</Text>
      <div>
      <Menu>
      <MenuButton p={1}>
      <NotifcationBadge count={notification.length} effect={Effect.SCALE} />
      <BellIcon fontSize='2xl' m={1} />
      </MenuButton>
      <MenuList pl={2}>
      {!notification.length && "No New Messages"}
      {notification.map((notif) => (
          <MenuItem key={notif._id} onClick={async() => {

setSelectedChat(notif.chat);

                if(notif.chat.isGroupChat === false){
                  const config = {
                    headers:{
                      "Content-type":"application/json",
                      Authorization: `Bearer ${user.token}`,
                    },
                    data:{
                      chatId:notif.chat._id,
                      recieverId:user._id,
                    },
                  };

                  const {data} = await axios.delete('/api/notification/deleteall',config);
                };

                if(notif.chat.isGroupChat === true){
                  const config = {
                    headers:{
                      "Content-type":"application/json",
                      Authorization: `Bearer ${user.token}`,
                    },
                    data:{
                      chatId:notif.chat._id,
                      recieverId:user._id,
                    },
                  };

                  const {data} = await axios.delete('/api/notification/deletegroup',config);
                }
            }}>
          {notif.chat.isGroupChat ? `New Message in ${notif.chat.chatName}` : `New Message from ${getSender(user,notif.chat.users)}`}
          </MenuItem>

      ))}
      </MenuList>
      </Menu>
      <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
      <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
      </MenuButton>
      <MenuList>
      <ProfileModal user={user}><MenuItem>My Profile</MenuItem></ProfileModal>
      <MenuItem onClick={logoutHandler}>Logout</MenuItem>
      </MenuList>
      </Menu>
      </div>
     </Box>

     <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
     <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
        <DrawerBody>
        <Box d="flex" pb={2}>
         <Input placeholder="Search by name or email" mr={2} value={search} onChange={(e) => setSearch(e.target.value)} />
         <Button onClick={handleSearch}>Go</Button>
        </Box>
        {loading ? (<ChatLoading />) : (searchResult?.map((user) => (<UserList key={user._id} user={user} handleFunction={() => accessChat(user._id)} />)))}
        {loadingChat && <Spinner ml="auto" d="flex" />}
        </DrawerBody>
        <DrawerFooter>
          <Button variant='outline' mr={3} onClick={onClose}>Cancel</Button>
        </DrawerFooter>
      </DrawerContent>
     </Drawer>

    </div>
  );
}

export default SideDrawer;
