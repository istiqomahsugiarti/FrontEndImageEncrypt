"use client"
import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { fetchUser } from "@/utils/api";

type User = {
  username: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  loading: true,
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }
        const userData = await fetchUser();
        setUser(userData);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
