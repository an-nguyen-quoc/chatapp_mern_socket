import { useState } from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import { useChat } from '../context/ChatContext';

const UserListItem = ({ user, handleFunction }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Box
      onClick={handleFunction}
      style={{
        cursor: 'pointer',
        background: isHovered ? '#38B2AC' : '#E8E8E8',
        width: 'auto',
        display: 'flex',
        alignItems: 'center',
        color: isHovered ? 'white' : 'black',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '10px',
        gap: '12px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      //   bg="#E8E8E8"
      //   _hover={{
      //     background: '#38B2AC',
      //     color: 'white',
      //   }}
      //   w="100%"
      //   d="flex"
      //   alignItems="center"
      //   color="black"
      //   px={3}
      //   py={2}
      //   mb={2}
      //   borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Typography>{user.name}</Typography>
        <Typography fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserListItem;
