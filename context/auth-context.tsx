"use client";

import { createContext, useContext, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { REGISTER_MUTATION, LOGIN_MUTATION } from "@/graphql/auth";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);

  const [registerMutation] = useMutation(REGISTER_MUTATION);
  const [loginMutation] = useMutation(LOGIN_MUTATION);

  async function signup(name: string, email: string, password: string) {
    setLoading(true);
    try {
      const res: any = await registerMutation({
        variables: {
          input: { name, email, password }
        }
      });

      const token = res.data.register.token;

      localStorage.setItem("authToken", token);

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
      const res: any = await loginMutation({
        variables: {
          input: { email, password }
        }
      });

      const token = res.data.login.token;
      localStorage.setItem("authToken", token);

      setLoading(false);
      return { success: true };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message };
    }
  }

  function logout() {
    localStorage.removeItem("authToken");
    location.reload();
  }

  return (
    <AuthContext.Provider value={{ signup, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);