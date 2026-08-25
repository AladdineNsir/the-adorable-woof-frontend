import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { getProfile } from "../services/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getProfile();

setUser(data.user);

localStorage.setItem(
  "user",
  JSON.stringify(data.user)
);
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setUser(userData);
  };

  const updateUser = (updatedUser) => {
  localStorage.setItem(
    "user",
    JSON.stringify(updatedUser)
  );

  setUser(updatedUser);
};

const logout = () => {
  localStorage.removeItem("token");

  localStorage.removeItem("user");

  setUser(null);
};

  return (
   <AuthContext.Provider
  value={{
    user,
    loading,
    login,
    updateUser,
    logout,
    isAuthenticated: !!user,
  }}
>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);