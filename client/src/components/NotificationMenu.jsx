import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import { useChat } from '../context/ChatContext';
import { getSender } from '../config/ChatLogics';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: 'transparent',
    padding: 0,
  },
  '& .MuiMenu-list': {
    backgroundColor: '#fff',
    borderRadius: 5,
    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)',
    padding: 0,
    minHeight: 'fit-content',
  },

  '& .notification-menu-item': {
    borderRadius: 5,
    padding: '8px 8px',
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: theme.palette.primary.hover,
      color: '#fff',
    },
  },
}));

export default function NotificationMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { user, notifications, setSelectedChat, setNotifications } = useChat();

  return (
    <div>
      <Badge
        id="demo-customized-button"
        variant="contained"
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
        color="secondary"
        badgeContent={notifications.length ? notifications.length : null}
      >
        <NotificationsIcon fontSize="large" />
      </Badge>
      <StyledMenu
        id="notification-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        theme={theme}
      >
        {!notifications.length && (
          <p className="notification-menu-item"> No New Messages </p>
        )}
        {notifications.map((notif) => (
          <MenuItem
            className="notification-menu-item"
            key={notif._id}
            onClick={() => {
              setSelectedChat(notif.chat);
              setNotifications(notifications.filter((n) => n !== notif));
            }}
          >
            {notif.chat.isGroupChat
              ? `New Message in ${notif.chat.chatName}`
              : `New Message from ${getSender(user, notif.chat.users)}`}
          </MenuItem>
        ))}
      </StyledMenu>
    </div>
  );
}
