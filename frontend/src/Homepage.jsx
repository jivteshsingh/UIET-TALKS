import React, { useEffect } from 'react';
import { Container, Box, Text, Link } from '@chakra-ui/react'
import Login from "./Login";
import Signup from "./Signup"
import { Route } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { ChatState } from "./ChatProvider";



function Homepage() {

  const history = useHistory();
  const { setUser } = ChatState();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    setUser(user);


    if(user){
      history.push('/chats');

    }
  }, [history]);

  return (
    <Container maxW='5xl' centerContent>
    <Route path="/" component={Login} exact />
    <Route path="/signup" component={Signup} />
    </Container>

  );
}

export default Homepage;
