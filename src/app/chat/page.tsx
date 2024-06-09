'use client'

import React, { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

import styles from './Chat.module.scss';

interface Message {
  id: string;
  content: string;
  time: string;
  fromMe: boolean;
  fromSocketId: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log("소켓 연결을 시도합니다.");
    const newSocket = io('http://localhost:3000', { path: '/api/chat' });
    setSocket(newSocket);
  
    newSocket.on('receive-message', (message: Message) => {
      console.log('Received message:', message);
      setMessages(prevMessages => {
        const isFromMe = message.fromSocketId === newSocket.id;
        return [...prevMessages, { ...message, fromMe: isFromMe }];
      });
    });
  
    return () => {
        console.log("소켓 연결을 종료합니다.");
      if (newSocket) newSocket.close();
    };
  }, []); 

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    const text = inputText.trim();
    if (text !== '') {
      const messageId = uuidv4(); 
      const date = new Date();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? '오후' : '오전';
      const formattedHours = hours % 12 || 12;
      const timeString = `${ampm} ${formattedHours < 10 ? '0' : ''}${formattedHours}:${minutes < 10 ? '0' : ''}${minutes}`;
  
      const newMessage: Message = {
        id: messageId,
        content: text,
        time: timeString,
        fromMe: true,
        fromSocketId: socket?.id || ''
      };
  
      console.log('Sending message:', newMessage);
  
      socket?.emit('new-message', newMessage);
      setInputText('');
    }
  };
  
  return (
    <section className={styles.chat}>
      <div className={styles.wrap}>
        <div className={styles.top}>
          <img src="./images/chat/chat_top.svg" alt="chat top" />
          대화상대
        </div>
        <div className={styles.middle}>
          {messages.map((message, index) => (
            <div key={index} className={message.fromMe ? styles.me : styles.other}>
              {!message.fromMe && <img src="/images/chat/default_other.svg" alt="other" />}
              {message.fromMe && <span className={styles.time}>{message.time}</span>}
              <p className={styles.content}>{message.content}</p>
              {message.fromMe && <img src="/images/chat/default_me.svg" alt="me" />}
              {!message.fromMe && <span className={styles.time}>{message.time}</span>}
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>
        <div className={styles.bottom}>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                sendMessage();
                e.preventDefault();
              }
            }}
            placeholder="내용을 입력해주세요"
          ></textarea>
          <button type="button" onClick={sendMessage}>
            <img src="/images/chat/enter.svg" alt="enter" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Chat;
