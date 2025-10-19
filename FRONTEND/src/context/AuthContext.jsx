import { createContext } from 'react';

// Create AuthContext to store and access authentication state globally
const AuthContext = createContext({
  token: null,              // JWT or session token
  user: null,               // User object
  login: () => {},          // function to login
  logout: () => {}          // function to logout
});

export default AuthContext;
