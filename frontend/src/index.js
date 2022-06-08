import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import ChatProvider from "./ChatProvider";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

ReactDOM.render(
  <ChatProvider>
  <BrowserRouter>
  <ChakraProvider>
  <App />
  </ChakraProvider>
  </BrowserRouter>
  </ChatProvider>

  ,document.getElementById('root'));


  serviceWorkerRegistration.register();
