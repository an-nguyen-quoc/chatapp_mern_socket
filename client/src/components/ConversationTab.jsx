import React, { useState, useEffect } from 'react';

import {
  Box,
  IconButton,
  Tooltip,
  Button,
  Typography,
  TextField,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { useChat } from '../context/ChatContext';
import { showToast } from '../components/Toast';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserListItem from './UserListItem';
import GroupChatModal from './GroupChatModal';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import MyChats from './MyChats';
import ApiConfig from '../config';

const ConversationTab = ({ fetchAgain }) => {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { setSelectedChat, user, chats, setChats } = useChat();

  useEffect(() => {
    if (!search) return;
    const timeout = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  const handleSearch = async () => {
    if (search.length === 0) {
      showToast('Please enter a username', 'error');
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const res = await axios.get(
        `${ApiConfig.API_ENDPOINT}/api/user?search=${search}`,
        config
      );

      setSearchResult(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showToast('Something went wrong', 'error');
    }
  };

  const accessChat = async (id) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `${ApiConfig.API_ENDPOINT}/api/chat`,
        { userId: id },
        config
      );
      if (!chats.find((chat) => chat._id === data._id)) {
        setChats([...chats, data]);
      }
      setSelectedChat(data);
      setIsSearchOpen(false);
      setLoadingChat(false);
    } catch (error) {
      setLoadingChat(false);
      showToast('Something went wrong', 'error');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1rem',
        flex: 1,
      }}
    >
      <Box
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          gap: '1rem',
        }}
      >
        <TextField
          name="search"
          value={search}
          label={
            <span
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '0.5rem',
                padding: 0,
              }}
            >
              <SearchIcon />
              <span>Search for a user </span>
            </span>
          }
          onFocus={() => setIsSearchOpen(true)}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
          style={{
            flex: 1,
          }}
        />
        {isSearchOpen ? (
          <Button variant="text" onClick={() => setIsSearchOpen(false)}>
            <Typography
              variant="body1"
              fontWeight="bold"
              color={'black'}
              textTransform="capitalize"
            >
              Close
            </Typography>
          </Button>
        ) : (
          <GroupChatModal>
            <Tooltip title="Create a group chat">
              <IconButton sx={{ color: theme.palette.primary.main }}>
                <GroupAddIcon />
              </IconButton>
            </Tooltip>
          </GroupChatModal>
        )}
      </Box>
      <Box
        style={{
          flex: 1,
        }}
      >
        {isSearchOpen ? (
          <>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                );
              })
            )}
          </>
        ) : (
          <>{user ? <MyChats fetchAgain={fetchAgain} /> : null}</>
        )}
      </Box>
    </Box>
  );
};

export default ConversationTab;
