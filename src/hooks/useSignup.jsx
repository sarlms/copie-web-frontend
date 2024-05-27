import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { AuthActionType } from '../context/AuthContext';
import axios from 'axios';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (pseudo, email, password, nom, prenom) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:3000/api/user/signup', { pseudo, email, password, nom, prenom });

      // No need to parse JSON manually, axios does it for you
      const data = response.data;

      // Save user and token to localStorage
      localStorage.setItem('user', JSON.stringify({ email: data.email, _id: data._id }));
      localStorage.setItem('token', data.token);

      // Dispatch signup action
      dispatch({ type: AuthActionType.LOGIN, payload: { user: { email: data.email, _id: data._id }, token: data.token } });

      return true; // Signup successful
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      return false; // Signup failed
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};
