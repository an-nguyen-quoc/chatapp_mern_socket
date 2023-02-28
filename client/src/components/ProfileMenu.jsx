import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import { Button, Menu, MenuItem, Avatar } from '@mui/material';

import { useChat } from '../context/ChatContext';
import ProfileModal from './ProfileModal';

export default function ProfileMenu() {
  const [profileModal, setProfileModal] = React.useState(false);

  const showProfile = () => {
    setProfileModal(true);
  };

  const { user, logout } = useChat();

  return (
    <div>
      <Button
        style={{ backgroundColor: 'transparent', border: 'none' }}
        id="profile-avatar"
        variant="text"
        onClick={showProfile}
      >
        <Avatar
          alt={user.name}
          src={user.pic}
          style={{
            border: '1px solid #fff',
          }}
        />
      </Button>
      <ProfileModal isOpen={profileModal} />
    </div>
  );
}
