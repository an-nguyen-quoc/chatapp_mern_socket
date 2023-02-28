import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useChat } from '../context/ChatContext';
import { getSender } from '../config/ChatLogics';

const ChatItem = ({ chat }) => {
  const [hover, setHover] = useState(false);

  const { user, selectedChat, setSelectedChat } = useChat();
  return (
    <Box
      onClick={() => setSelectedChat(chat)}
      style={{
        cursor: 'pointer',
        backgroundColor:
          selectedChat === chat || hover ? '#E8E8E8' : 'transparent',
        color: 'black',
        borderRadius: '10px',
        width: 'calc(100% - 24px)',
        padding: '8px 12px',
        fontFamily: 'Work sans',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      key={chat._id}
    >
      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
        {!chat.isGroupChat ? getSender(user, chat.users) : chat.chatName}
      </Typography>
      {chat.latestMessage ? (
        <Typography fontSize="xs">
          <b>{chat.latestMessage.sender.name} : </b>
          {chat.latestMessage.content.length > 50
            ? chat.latestMessage.content.substring(0, 51) + '...'
            : chat.latestMessage.content}
        </Typography>
      ) : (
        <Typography fontSize="xs">No messages yet</Typography>
      )}
    </Box>
  );
};

export default ChatItem;
