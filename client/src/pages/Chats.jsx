import React, { useEffect, useState } from 'react';
import { useChat } from '../context/ChatContext';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

import { Chatbox, SideBarNav } from '../components';

const ChatsContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  justifyContent: 'flex-start',
  flex: 1,
  height: '100%',
}));

const Chats = () => {
  const { user } = useChat();
  const theme = useTheme();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <ChatsContainer theme={theme} className="chat-container">
      {user && <SideBarNav fetchAgain={fetchAgain} />}
      {user && (
        <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      )}
    </ChatsContainer>
  );
};

export default Chats;
