import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { AuthActionType } from '../context/AuthContext';
import axios from 'axios';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      //console.log('Attempting login with email:', email);
      // Sending login request
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/user/login`, { email, password });
      //console.log('Login response:', response);

      // No need to parse JSON manually, axios does it for you
      const data = response.data;

      // Save user and token to localStorage
      localStorage.setItem('user', JSON.stringify({ email: data.email, _id: data._id , token: data.token}));

      // Dispatch login action
      dispatch({ type: AuthActionType.LOGIN, payload: { email: data.email, _id: data._id, token: data.token } });

      //console.log('Login successful');
      return true; // Login successful
    } catch (err) {
      console.error('Error during login:', err);
      setError(err.response?.data?.error || err.message);
      console.log('Login failed');
      return false; // Login failed
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};

