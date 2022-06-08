import React, { useState } from 'react';
import { Container, Box, Text, Image, VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button, Link, useToast } from '@chakra-ui/react'
import axios from "axios";
import { useHistory } from 'react-router-dom';
import { ChatState } from "./ChatProvider";

function Signup(){

const [show, setShow] = useState(false)
function handleClick(){
  setShow(!show);
}

const [showconfirm, setShowconfirm] = useState(false)
function handleClickconfirm(){
  setShowconfirm(!showconfirm);
}

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();
  const { setUser } = ChatState();


  const postDetails = (pics) => {
        setLoading(true);
        if(pics === undefined) {
           toast({ title: "Please Select an Image!", status: "warning", duration: 5000, isClosable: true, position: "bottom", });
           return;
        }

        if(pics.type === "image/jpeg" || pics.type === "image/png") {
          const data = new FormData();
          data.append("file", pics);
          data.append("upload_preset", "MERN chat app");
          data.append("cloud_name", "dmqwsxu2h");
          fetch("https://api.cloudinary.com/v1_1/dmqwsxu2h/image/upload", {method: 'post', body: data, })
          .then((res) => res.json())
          .then((data) => {
            setPic(data.url.toString());
            console.log(data);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
        }else{
          toast({ title: "Please Select an Image!", status: "warning", duration: 5000, isClosable: true, position: "bottom", });
          setLoading(false);
          return;
        }

  }



     const submitHandler = async() => {
         setLoading(true);
         if(!name || !email || !password || !confirmpassword) {
           toast({ title: "Please Fill all the Fields", status: "warning", duration: 5000, isClosable: true, position: "bottom", });
           setLoading(false);
           return;
         }

         if(password !== confirmpassword){
            toast({ title: "Passwords Do Not Match", status: "warning", duration: 5000, isClosable: true, position: "bottom", });
         }

         try {
           const config = {headers:{"Content-type": "application/json",},};
           const { data } = await axios.post("/api/user",{name,email,password,pic},config);
           toast({ title: "Registration is Successful", status: "success", duration: 5000, isClosable: true, position: "bottom", });

          localStorage.setItem("userInfo",JSON.stringify(data));

          setLoading(false);

          const userInfo = JSON.parse(localStorage.getItem("userInfo"));
          setUser(userInfo);

          history.push("/chats");
         } catch (e) {
             toast({ title: "Error Occured!", description: e.response.data.message, status: "error", duration: 5000, isClosable: true, position: "bottom", });
             setLoading(false);
         }
     }


  return(
    <Container maxW='5xl' centerContent>
    <Box d='block' p={3} bg={"white"} w="100%" mt="65px" borderRadius="lg" borderWidth="1px">
    <Text fontSize='2xl' fontFamily='Work sans' m="15px 20px">UIET TALKS</Text>
    <Container maxW='5xl' d="flex">
    <Box w="100%" d="flex" flex-direction="column" flex={0.50}>
    <Box d="block">
     <Text ml="60px" fontSize="3xl">Create your account</Text>
       <VStack spacing="5px">

       <FormControl id="first-name" isRequired>
       <FormLabel>Name</FormLabel>
       <Input placeholder="Enter Your Name" onChange={(e) => setName(e.target.value)} />
       </FormControl>

       <FormControl id="email" isRequired>
       <FormLabel>Email</FormLabel>
       <Input placeholder="Enter Your Email" onChange={(e) => setEmail(e.target.value)} />
       </FormControl>

       <FormControl id="password" isRequired>
       <FormLabel>Password</FormLabel>
       <InputGroup>
       <Input type={show? "text" : "password"} placeholder="Enter Your Password" onChange={(e) => setPassword(e.target.value)} />
       <InputRightElement width='4.5rem'>
       <Button h='1.75rem' size='sm' onClick={handleClick}>
        {show ? 'Hide' : 'Show'}
       </Button>
       </InputRightElement>
       </InputGroup>
       </FormControl>

       <FormControl id="confirm password" isRequired>
       <FormLabel>Confirm Password</FormLabel>
       <InputGroup>
       <Input type={showconfirm? "text" : "password"} placeholder="Confirm Password" onChange={(e) => setConfirmpassword(e.target.value)} />
       <InputRightElement width='4.5rem'>
       <Button h='1.75rem' size='sm' onClick={handleClickconfirm}>
        {showconfirm ? 'Hide' : 'Show'}
       </Button>
       </InputRightElement>
       </InputGroup>
       </FormControl>

       <FormControl id="pic" isRequired>
       <FormLabel>Upload Your Picture</FormLabel>
       <Input type="file" accept="image/*" p={1.5} onChange={(e) => postDetails(e.target.files[0])} />
       </FormControl>

       <Button colorScheme='blue' style={{ marginTop:25 }} onClick={submitHandler} isLoading={loading} >Register</Button>
       <Text style={{ marginTop:10 }} fontSize="1xl">
       Already have an account?
       <Link href="/" color='teal.500'>Log in</Link>
       </Text>


       </VStack>
       </Box>
    </Box>
    <Box w="100%" d="flex" flex-direction="column" flex={0.50} >
    <Image fit="contain" src="https://img.freepik.com/free-vector/group-chat-concept-illustration_114360-1495.jpg?t=st=1647280194~exp=1647280794~hmac=8a542fa778e8a63de1166fbbdfb43f9f61ef5b298d5b7d10f2aa27a23fb20910&w=1060" />
    </Box>

    </Container>

    </Box>
    </Container>
  );
}

export default Signup;
