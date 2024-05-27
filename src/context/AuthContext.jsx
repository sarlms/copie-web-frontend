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
      console.log('LOGIN action payload:', action.payload);
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
  console.log('initialState:', initialState);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    //console.log('userString from localStorage:', userString);
    if (userString) {
      try {
        const user = JSON.parse(userString);
        //console.log('Parsed user object:', user);
        if (user && user.email && user._id) {
          //console.log('Dispatching LOGIN action with user:', user);
          // block
          dispatch({ type: AuthActionType.LOGIN, payload: user });
        } else {
          console.log('User object is missing email or _id:', user);
        }
      } catch (error) {
        console.error('Error parsing user string from localStorage:', error);
      }
    } else {
      console.log('No user string found in localStorage');
    }
  }, []);

  console.log('State in AuthContextProvider:', state);

  return (
    <AuthContext.Provider value={{ user: state.user, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider, AuthActionType };
