import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Alert } from '@mui/material';

const root = document.getElementById('toast');
let showToast;
const Toast = () => {
  const [toast, setToast] = React.useState({
    message: '',
    severity: '',
  });

  showToast = (message, severity = 'success') => {
    setToast({ message, severity });
  };

  useEffect(() => {
    return () =>
      setTimeout(() => {
        setToast({ message: '', severity: '' });
      }, 5000);
  }, [toast]);

  const el = document.createElement('div');
  root.appendChild(el);
  return toast.message
    ? createPortal(<Alert severity={toast.severity}>{toast.message}</Alert>, el)
    : null;
};

export { showToast };

export default Toast;
