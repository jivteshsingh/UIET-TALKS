import React from 'react';
import { ChatState } from "./ChatProvider";
import { Box } from '@chakra-ui/react';
import SingleChat from "./SingleChat";

function ChatBox({fetchAgain,setFetchAgain}) {
    const { selectedChat } = ChatState();

    return(
      <Box d={{base:selectedChat ? "flex" : "none", md:"flex"}} flexDir="column" alignItems="center" p={3} bg="white" w={{base:"100%",md:"68%"}} borderRadius="lg" borderWidth="1px">
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </Box>
    )

}

export default ChatBox;
