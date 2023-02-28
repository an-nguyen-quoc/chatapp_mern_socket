import React, { useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Slide,
  DialogTitle,
} from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ProfileModal = ({ isOpen = false }) => {
  const [open, setOpen] = React.useState(false);
  const { user } = useChat();
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {' '}
      {user && (
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{'User Profile'}</DialogTitle>
          <DialogContent
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '400px',
            }}
          >
            <Avatar
              alt={user.name}
              src={user.pic}
              style={{
                width: '100px',
                height: '100px',
              }}
            />
            <DialogContentText id="alert-dialog-slide-description" variant="h5">
              Name: {user.name} <br />
              Email: {user.email}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="contained">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default ProfileModal;
