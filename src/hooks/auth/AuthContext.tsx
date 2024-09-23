"use client";

import { createContext, FunctionComponent, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { useMessage, MessageProps } from "../message";
import { User } from "@supabase/supabase-js";

export type AuthContextProps = {
  user: User;
  signUp: (payload: SupabaseAuthPayload) => void;
  signIn: (payload: SupabaseAuthPayload) => void;
  signOut: () => void;
  loading: boolean;
  loggedIn: boolean;
  userLoading: boolean;
};

export type SupabaseAuthPayload = {
  email: string;
  password: string;
};

export const AuthContext = createContext<Partial<AuthContextProps>>({});
export const AuthProvider: FunctionComponent = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const { handleMessage } = useMessage();

  // sign-up a user with provided details
  const signUp = async (payload: SupabaseAuthPayload) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp(payload);
      if (error) {
        console.log(error);
        handleMessage({ message: error.message, type: "error" });
      } else {
        handleMessage({
          message:
            "Signup successful. Please check your inbox for a confirmation email!",
          type: "success",
        });
      }
    } catch (error) {
      console.log(error);
      handleMessage({
        message: error.error_description || error,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // sign-in a user with provided details
  const signIn = async (payload: SupabaseAuthPayload) => {
    try {
      setLoading(true);
      const { error, user } = await supabase.auth.signInWithPassword(payload);
      if (error) {
        console.log(error);
        handleMessage({ message: error.message, type: "error" });
      } else {
        handleMessage({
          message: "Log in successful. I'll redirect you once I'm done",
          type: "success",
        });
        handleMessage({ message: `Welcome, ${user.email}`, type: "success" });
      }
    } catch (error) {
      console.log(error);
      handleMessage({
        message: error.error_description || error,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  const signOut = async () => await supabase.auth.signOut();

  const checkedLoggedIn = async () => {
    const user: any = await supabase.auth.getUser();
    if (user?.data?.user) {
      const userData = user.data.user;
      setUser(user);
      setLoggedIn(true);
      const userInfo = {
        email: userData.email,
        created_at: userData.created_at,
        last_sign: userData.last_sign_in_at,
      };
      console.debug("User is logged in", userInfo);
    }
    setUserLoading(false);
  };
  useEffect(() => {
    checkedLoggedIn();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        signUp,
        signIn,
        signOut,
        loading,
        loggedIn,
        userLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
