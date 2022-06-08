import React, {useState} from 'react';
import { ChatState } from "./ChatProvider";
import SideDrawer from "./SideDrawer";
import { Box } from '@chakra-ui/react';
import MyChats from "./MyChats";
import ChatBox from "./ChatBox";

function ChatsPage() {

  const { user } = ChatState();
  const [chats,setChats] = useState([]);
  const [fetchAgain,setFetchAgain] = useState(false);


  return (
    <div style={{ width: "100%" }}>
     {user && <SideDrawer chats={chats} setChats={setChats} />}
     <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
     {user && <MyChats chats={chats} setChats={setChats} fetchAgain={fetchAgain} />}
     {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>


  );
}

export default ChatsPage;
