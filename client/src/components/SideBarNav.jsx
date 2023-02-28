import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import LogoutIcon from '@mui/icons-material/Logout';
import ProfileMenu from './ProfileMenu';
import NotificationMenu from './NotificationMenu';
import ConversationTab from './ConversationTab';
import { useChat } from '../context/ChatContext';

const SideBarNavContainer = styled('div')(({ theme, selectedChat }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  justifyContent: 'center',
  height: '100vh',
  [theme.breakpoints.down('md')]: {
    display: selectedChat ? 'none' : 'flex',
    flex: selectedChat ? 0 : 1,
  },
  [theme.breakpoints.up('md')]: {
    width: '400px',
  },
}));

const MainTab = styled('div')(({ theme, selectedChat }) => ({
  width: 80,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'top',
  paddingTop: '2rem',
  gap: '2rem',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.white,
  [theme.breakpoints.down('sm')]: {
    display: selectedChat ? 'none' : 'flex',
  },
}));

const ConversationTabContainer = styled('div')(({ theme, selectedChat }) => ({
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'center',
  overflow: 'scroll',
  [theme.breakpoints.down('md')]: {
    flex: 1,
    display: selectedChat ? 'none' : 'flex',
  },
  [theme.breakpoints.up('md')]: {
    width: '320px',
  },
}));

const SideBarNav = ({ fetchAgain }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { selectedChat, logout } = useChat();
  return (
    <SideBarNavContainer theme={theme} className="sidebar-nav">
      <MainTab theme={theme} selectedChat={selectedChat} className="main-tab">
        <ProfileMenu />
        <ChatRoundedIcon
          fontSize="large"
          style={{
            color: theme.palette.white,
            cursor: 'pointer',
          }}
          onClick={() => navigate('/chats')}
        />

        <NotificationMenu />
        <LogoutIcon
          fontSize="large"
          style={{ color: theme.palette.white }}
          cursor="pointer"
          onClick={logout}
        />
      </MainTab>
      <ConversationTabContainer
        theme={theme}
        selectedChat={selectedChat}
        className="conversation-tab"
      >
        <ConversationTab fetchAgain={fetchAgain} />
      </ConversationTabContainer>
    </SideBarNavContainer>
  );
};

export default SideBarNav;
