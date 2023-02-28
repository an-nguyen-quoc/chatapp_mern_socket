import SingleChat from './SingleChat';
import { useChat } from '../context/ChatContext';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';

const ChatBoxContainer = styled('div')(({ theme, selectedChat }) => ({
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '10px',
  borderLeft: 'solid 1px #E8E8E8',
  padding: '1rem',
  height: '95vh',

  [theme.breakpoints.down('md')]: {
    width: '100%',
    display: selectedChat ? 'flex' : 'none',
  },
  [theme.breakpoints.up('md')]: {
    flex: 1,
    display: 'flex',
  },
}));

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useChat();
  const theme = useTheme();

  return (
    <ChatBoxContainer
      theme={theme}
      selectedChat={selectedChat}
      className="chatbox-container"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </ChatBoxContainer>
  );
};

export default Chatbox;
