import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ChatProvider from './context/ChatContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chats';
import './App.css';
import { blue } from '@mui/material/colors';
import { showToast } from './components/Toast';
import Toast from './components/Toast';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0091FF',
      hover: '#006EDC',
    },
    secondary: {
      main: '#FFC107',
      hover: '#EAEDF0',
    },
    white: '#FFFFFF',
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <ChatProvider>
        <Routes>
          <Route path="/" exact element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chats" element={<Chat />} />
        </Routes>
      </ChatProvider>
      <Toast />
    </ThemeProvider>
  );
};

export default App;
