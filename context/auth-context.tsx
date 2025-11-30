"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { REGISTER_MUTATION, LOGIN_MUTATION } from "@/graphql/auth";
import { gql } from "@apollo/client";

// Define types for our GraphQL responses
type User = {
  id: string;
  email: string;
  name: string;
};

type RegisterResponse = {
  register: {
    token: string;
    user: User;
  };
};

type LoginResponse = {
  login: {
    token: string;
    user: User;
  };
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

/* ✅ NEW: me query to recover user from token */
const ME_QUERY = gql`
query Me {
  me {
    id
    email
    name
  }
}
`;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [registerMutation] = useMutation<RegisterResponse>(REGISTER_MUTATION);
  const [loginMutation] = useMutation<LoginResponse>(LOGIN_MUTATION);

  const { data, refetch } = useQuery<{ me: User }>(ME_QUERY, {
    skip: typeof window === "undefined" || !localStorage.getItem("authToken"),
    fetchPolicy: "no-cache",
  });

  /* ✅ Restore user from token on refresh */
  useEffect(() => {
    if (data?.me) {
      setUser(data.me);
    }
    setLoading(false);
  }, [data]);

  async function signup(name: string, email: string, password: string) {
    setLoading(true);
    try {
      const res = await registerMutation({
        variables: { input: { name, email, password } }
      });

      if (!res.data?.register?.token) {
        throw new Error("Registration failed: No token received");
      }

      const token = res.data.register.token;
      localStorage.setItem("authToken", token);

      await refetch(); // ✅ Pull user from backend
      setLoading(false);
      return { success: true };

    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message };
    }
  }

  async function login(email: string, password: string) {
    setLoading(true);
    try {
      const res = await loginMutation({
        variables: { input: { email, password } }
      });

      if (!res.data?.login?.token) {
        throw new Error("Login failed: No token received");
      }

      const token = res.data.login.token;
      localStorage.setItem("authToken", token);

      await refetch(); // ✅ Get user after login
      setLoading(false);
      return { success: true };

    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message };
    }
  }

  function logout() {
    localStorage.removeItem("authToken");
    setUser(null);
    location.href = "/";
  }

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be wrapped in AuthProvider");
  return ctx;
};