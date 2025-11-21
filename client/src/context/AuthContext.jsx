import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null); // will hold { id, email } from backend
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // load token on app start
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);
      // optional: you could decode token or fetch /auth/me here
    }
    setLoading(false);
  }, []);

  const login = (token, userInfo) => {
    localStorage.setItem("accessToken", token);
    setAccessToken(token);
    setUser(userInfo || null);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAccessToken(null);
    setUser(null);
  };

  const value = {
    accessToken,
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
