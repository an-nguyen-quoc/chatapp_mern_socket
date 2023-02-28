import { Avatar, Tooltip } from '@mui/material';
import ScrollableFeed from 'react-scrollable-feed';
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from '../config/ChatLogics';
import { useRef, useEffect } from 'react';

import { useChat } from '../context/ChatContext';

const ScrollableChat = ({ messages }) => {
  const { user } = useChat();
  const messageEndRef = useRef(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ScrollableFeed
      style={{
        height: '100%',
      }}
    >
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: 'flex' }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip title={m.sender.name} placement="bottom-start">
                <Avatar
                  style={{
                    size: 'sm',
                    cursor: 'pointer',
                    marginTop: '7px',
                    marginRight: '1px',
                  }}
                  alt={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? '#BEE3F8' : '#B9F5D0'
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: '20px',
                padding: '5px 15px',
                maxWidth: '75%',
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
      <div ref={messageEndRef} />
    </ScrollableFeed>
  );
};

export default ScrollableChat;
