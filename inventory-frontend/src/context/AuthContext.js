import { createContext, useContext, useEffect, useState } from "react";
import { getToken, getUserFromToken, removeToken } from "../services/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUserFromToken());

  useEffect(() => {
    const currentUser = getUserFromToken();
    if (currentUser) setUser(currentUser);
  }, []);

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
