import axios from 'axios';
import ApiConfig from '../config';

export const signup = async ({ name, email, password }) => {
  const response = await axios.post(`${ApiConfig.API_ENDPOINT}/api/user`, {
    name,
    email,
    password,
  });
  localStorage.setItem('userInfo', JSON.stringify(response.data));
  return response.data;
};

export const login = async ({ email, password }) => {
  console.log('Login', `${ApiConfig.API_ENDPOINT}/api/user/login`);
  const response = await axios.post(
    `${ApiConfig.API_ENDPOINT}/api/user/login`,
    {
      email,
      password,
    }
  );

  localStorage.setItem('userInfo', JSON.stringify(response.data));
  localStorage.setItem('token', response.data.token);
  return response.data;
};
