import React, { useState, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { showToast } from './Toast';
import axios from 'axios';
import { styled } from '@mui/material/styles';

import { Box, Button, Stack, Typography } from '@mui/material';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogics';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ChatItem from './ChatItem';
import ApiConfig from '../config';

const MyChatContainer = styled('div')(({ theme, selectedChat }) => ({
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: '10px',
  width: '100%',
  height: '100%',
  overflowY: 'auto',
  [theme.breakpoints.down('md')]: {
    display: selectedChat ? 'none' : 'flex',
  },
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const MyChats = ({ fetchAgain }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { chats, setChats, user, selectedChat, setSelectedChat } = useChat();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `${ApiConfig.API_ENDPOINT}/api/chat`,
        config
      );

      setChats(data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        showToast('Please login again', 'error');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
      showToast('Something went wrong', 'error');
    }
  };

  useEffect(() => {
    fetchChats();
  }, [fetchAgain]);

  return (
    <MyChatContainer theme={theme} selectedChat={selectedChat}>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          borderRadius: '10px',
          borderWidth: '1px',
          overflowY: 'hidden',
          height: '100%',
          backgroundColor: '#F8F8F8',
        }}
      >
        {chats ? (
          <Stack
            overflowY="scroll"
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {chats.map((chat) => (
              <ChatItem chat={chat} key={chat._id} />
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </MyChatContainer>
  );
};

export default MyChats;
