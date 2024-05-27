import React, { createContext, useReducer, useEffect } from 'react';

// Define the shape of the context value
const AuthContext = createContext({
  user: null,
  dispatch: () => {},
});

// Define the shape of an authentication action
const AuthActionType = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT'
};

// Define the reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AuthActionType.LOGIN:
      return { ...state, user: action.payload };
    case AuthActionType.LOGOUT:
      return { ...state, user: null };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  user: null,
  dispatch: () => {},
};

// AuthContextProvider component
const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user && user.email && user._id) {
          dispatch({ type: AuthActionType.LOGIN, payload: user });
        }
      } catch (error) {
        console.error('Error parsing user string from localStorage:', error);
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    dispatch({ type: AuthActionType.LOGOUT });
  };

  return (
    <AuthContext.Provider value={{ user: state.user, dispatch, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider, AuthActionType };
