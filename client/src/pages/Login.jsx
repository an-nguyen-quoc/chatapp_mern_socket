import React, { useEffect } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import { login } from '../api/user';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';

const Login = () => {
  const [values, setValues] = React.useState({
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState([]);
  const [success, setSuccess] = React.useState(false);

  const navigate = useNavigate();
  const { user, setUser } = useChat();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  useEffect(() => {
    if (user) {
      navigate('/chats');
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setError([]);
    }, 5000);
  }, [error]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      await login(values);
      setSuccess(true);
      setTimeout(() => {
        navigate('/chats');
      });
    } catch (error) {
      setError(['Invalid email or password']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      await login({ email: 'guest@test.com', password: 'guest' });
      setSuccess(true);
      setTimeout(() => {
        navigate('/chats');
      });
    } catch (error) {
      setError(['Invalid email or password']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {error.length > 0 && (
        <Alert severity="error">
          {error.map((error) => (
            <div key={error}>{error}</div>
          ))}
        </Alert>
      )}
      {success && <Alert severity="success">Login successful</Alert>}{' '}
      <Box>
        <Typography variant="h4" component="h4">
          Sign in
        </Typography>
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit}
        style={{
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          minWidth: '300px',
        }}
      >
        <TextField
          id="email"
          label="Email"
          name="email"
          onChange={handleChange}
          fullWidth
          required
          error={
            !!(values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
          }
          helperText={
            values.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) &&
            'Invalid email address'
          }
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          name="password"
          onChange={handleChange}
          fullWidth
        />
        <Button
          variant="contained"
          type="submit"
          style={{
            fontSize: '1rem',
            fontWeight: 'bold',
          }}
          disabled={isLoading}
        >
          Login
        </Button>

        <Button
          variant="contained"
          onClick={handleGuestLogin}
          style={{
            fontSize: '1rem',
            fontWeight: 'bold',
          }}
          disabled={isLoading}
        >
          Login as guest user
        </Button>
      </Box>
    </div>
  );
};

export default Login;
