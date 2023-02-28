import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/material';

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Box
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '10px',
        margin: '5px',
        marginBottom: '10px',
        padding: '5px',
        fontSize: '1rem',
        backgroundColor: '#E8E8E8',
      }}
      onClick={handleFunction}
    >
      {user.name}
      {admin === user._id && <span> (Admin)</span>}
      <CloseIcon />
    </Box>
  );
};

export default UserBadgeItem;
