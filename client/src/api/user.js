import axios from 'axios';

export const signup = async ({ name, email, password }) => {
  const response = await axios.post('/api/user', {
    name,
    email,
    password,
  });
  localStorage.setItem('userInfo', JSON.stringify(response.data));
  return response.data;
};

export const login = async ({ email, password }) => {
  const response = await axios.post('/api/user/login', {
    email,
    password,
  });

  localStorage.setItem('userInfo', JSON.stringify(response.data));
  localStorage.setItem('token', response.data.token);
  return response.data;
};
