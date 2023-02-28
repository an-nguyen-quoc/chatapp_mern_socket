import axios from 'axios';
import { showToast } from './Toast';
import ProfileModal from './ProfileModal';
import Lottie from 'react-lottie';
import animationData from '../animations/typing.json';
import io from 'socket.io-client';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import { useChat } from '../context/ChatContext';
import { getSender, getSenderFull } from '../config/ChatLogics';
import { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Box,
  FormControl,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import ScrollableChat from './ScrollableChat';

import ApiConfig from '../config';

const ENDPOINT = ApiConfig.SOCKET_ENDPOINT; // "https://talk-a-tive.herokuapp.com"; -> After deployment
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  const {
    selectedChat,
    setSelectedChat,
    user,
    notifications,
    setNotifications,
  } = useChat();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `${ApiConfig.API_ENDPOINT}/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      showToast('Failed to load the messages', 'error');
    }
  };

  const sendMessage = async (event) => {
    if (event.key === 'Enter' && newMessage) {
      socket.emit('stop typing', selectedChat._id);
      try {
        const config = {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage('');
        const { data } = await axios.post(
          `${ApiConfig.API_ENDPOINT}/api/message`,
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit('new message', data);
        setMessages([...messages, data]);
      } catch (error) {
        showToast('Failed to send the message', 'error');
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT, { transports: ['websocket'] });
    socket.emit('setup', user);
    socket.on('connected', () => setSocketConnected(true));

    socket.on('stop typing', () => setIsTyping(false));
    // eslint-disable-next-line
  }, []);

  const handleIsTyping = (room) => {
    if (room === selectedChat._id) {
      setIsTyping(true);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      socket.on('typing', handleIsTyping);
    }
  }, [selectedChat]);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on('message recieved', (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notifications.includes(newMessageRecieved)) {
          setNotifications([newMessageRecieved, ...notifications]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            style={{
              width: '100%',
              height: '50px',
              fontSize: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px',
            }}
          >
            <IconButton
              style={{
                display: 'flex',
              }}
              onClick={() => setSelectedChat('')}
            >
              <ArrowBackIcon />
            </IconButton>
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Box>
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              backgroundColor: '#E8E8E8',
              padding: '10px',
              width: '100%',
              height: 'calc(100% - 50px)',
              borderRadius: '10px',
            }}
          >
            {loading ? (
              // <Spinner
              //   size="xl"
              //   w={20}
              //   h={20}
              //   alignSelf="center"
              //   margin="auto"
              // />
              <>Loading ...</>
            ) : (
              <div
                className="messages"
                style={{
                  flex: 1,
                  overflowY: 'scroll',
                }}
              >
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              style={{
                marginTop: 10,
              }}
              required
              onKeyDown={sendMessage}
              id="first-name"
            >
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{
                      marginLeft: 0,
                      borderRadius: '24px',
                    }}
                  />
                </div>
              ) : (
                <></>
              )}
              <TextField
                variant="filled"
                placeholder="Type a message.."
                value={newMessage}
                onChange={typingHandler}
                style={{
                  backgroundColor: '#E0E0E0',
                }}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <Typography variant="h5">
            Click on a user to start chatting
          </Typography>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
