import React from 'react';
import Homepage from "./Homepage";
import { Route } from "react-router-dom";
import ChatsPage from "./ChatsPage";
import Login from "./Login";
import "./App.css";

function App() {
  return (
    <div className="App">
    <Route path="/" component={Homepage} exact />
    <Route path="/signup" component={Homepage} exact />
    <Route path="/chats" component={ChatsPage} />
    </div>
  );
}

export default App;
