import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import { signup } from '../api/user';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [errorAlert, setErrorAlert] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setSuccess(false);
      setErrorAlert([]);
    }, 5000);
  }, [success, errorAlert]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      // Submit form data
      try {
        await signup(formValues);
        setSuccess(true);
        navigate('/login');
      } catch (error) {
        setErrorAlert([error.toString()]);
      }
    }
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    // Validate name
    if (!formValues.name) {
      errors.name = 'Name is required';
      isValid = false;
    }

    // Validate email
    if (!formValues.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    // Validate password
    if (!formValues.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (formValues.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // Validate confirm password
    if (!formValues.confirmPassword) {
      errors.confirmPassword = 'Confirm password is required';
      isValid = false;
    } else if (formValues.confirmPassword !== formValues.password) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
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
      {errorAlert.length > 0 && (
        <Alert severity="error">
          {errorAlert.map((error) => (
            <div key={error}>{error}</div>
          ))}
        </Alert>
      )}
      {success && <Alert severity="success">Create account successfully</Alert>}{' '}
      <Box>
        <Typography variant="h4" component="h4">
          Join TikTalk
        </Typography>
      </Box>
      <form
        style={{
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          minWidth: '300px',
          '& > *': {
            width: '100%',
            maxWidth: '400px',
          },
        }}
        onSubmit={handleFormSubmit}
      >
        <TextField
          label="Name"
          name="name"
          value={formValues.name}
          onChange={handleInputChange}
          required
          error={!!errors.name}
          helperText={errors.name}
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formValues.email}
          onBlur={validateForm}
          onChange={handleInputChange}
          required
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          onBlur={validateForm}
          value={formValues.password}
          onChange={handleInputChange}
          required
          error={!!errors.password}
          helperText={errors.password}
          fullWidth
        />
        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formValues.confirmPassword}
          onChange={handleInputChange}
          onBlur={validateForm}
          required
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary">
          Sign Up
        </Button>
      </form>
    </div>
  );
};

export default Signup;
