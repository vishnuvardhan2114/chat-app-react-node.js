import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import io from 'socket.io-client';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import './Chat.css';

let socket;

const Chat = () => {
  const location = useLocation();
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const[message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'localhost:5000';

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);
    
    socket.emit('join',{name , room}, () => {

    });

    return () =>{
      socket.disconnect();

      socket.off();
    }
  },[ENDPOINT,location.search]);

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
        setMessages(messages => [...messages, newMessage]);
    };

    socket.on('message', handleNewMessage);

    return () => {
        // Cleanup by removing the event listener when the component unmounts
        socket.off('message', handleNewMessage);
    };
}, [messages]);


  const sendMessage = (e) => {
    e.preventDefault();
    if(message){
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  return (
    <div className='outerContainer'>
      <div className='container'>
        <InfoBar room = {room} />
        <Messages messages ={messages} name={name} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default Chat;
