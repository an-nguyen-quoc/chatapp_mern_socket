import {
  Button,
  Box,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

import axios from 'axios';
import { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { showToast } from './Toast';
import UserBadgeItem from './UserBadgeItem';
import UserListItem from './UserListItem';

const GroupChatModal = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = useChat();

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      showToast('User already added', 'warning');
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      showToast('Failed to Load the Search Results', 'error');
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      showToast('Please enter a name and add users', 'error');
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      setIsOpen(false);
      showToast('Group Chat Created', 'success');
    } catch (error) {
      showToast('Failed to Create Group Chat', 'error');
    }
  };

  return (
    <>
      <span onClick={() => setIsOpen(true)}>{children}</span>

      <Dialog onClose={() => setIsOpen(false)} open={isOpen}>
        <DialogTitle
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '35px',
          }}
        >
          Create Group
        </DialogTitle>
        <DialogContent
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'column',
            width: '400px',
          }}
        >
          <TextField
            placeholder="Group Name"
            onChange={(e) => setGroupChatName(e.target.value)}
            style={{
              width: '100%',
              marginBottom: '10px',
            }}
          />

          <TextField
            placeholder="Add Users eg: An, Linn, ..."
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: '100%',
              marginBottom: '10px',
            }}
          />

          <Box
            style={{
              width: '100%',
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {selectedUsers.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleDelete(u)}
              />
            ))}
          </Box>
          {loading ? (
            //   <ChatLoading />
            <div>Loading...</div>
          ) : (
            searchResult
              ?.slice(0, 4)
              .map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GroupChatModal;
