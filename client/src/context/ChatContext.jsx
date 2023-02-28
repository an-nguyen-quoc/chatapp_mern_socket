import React, { createContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [chats, setChats] = React.useState([]);
  const [notifications, setNotifications] = React.useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  useEffect(() => {
    if (location.pathname === '/signup') {
      return;
    }
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (user) {
      setUser(user);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notifications,
        setNotifications,
        chats,
        setChats,
        logout,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = React.useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export default ChatProvider;
