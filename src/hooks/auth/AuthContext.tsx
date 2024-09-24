"use client";

import { createContext, FunctionComponent, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { useMessage, MessageProps } from "../message";
import { ReactNode } from "react";
import CustomLoading from "@/components/layouts/CustomLoading";
import { userInfo as userInfoRecoil } from "@/store/userInfo";
import { useSetRecoilState, useRecoilValue } from "recoil";

export type AuthContextProps = {
  user: any;
  signUp: (payload: SupabaseAuthPayload) => void;
  signIn: (payload: SupabaseAuthPayload) => void;
  signOut: () => void;
  loggedIn: boolean;
  userLoading: boolean;
  setUserLoading: (v: boolean) => void;
};

export type SupabaseAuthPayload = {
  email: string;
  password: string;
};

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  signUp: () => {},
  signIn: () => {},
  signOut: () => {},
  loggedIn: false,
  userLoading: false,
  setUserLoading: () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: FunctionComponent<AuthProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<any | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const { handleMessage } = useMessage();
  const setContent = useSetRecoilState(userInfoRecoil);

  // sign-up a user with provided details
  const signUp = async (payload: SupabaseAuthPayload) => {
    try {
      setUserLoading(true);
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
    } catch (error: any) {
      console.log(error);
      handleMessage({
        message: error.error_description || error,
        type: "error",
      });
    } finally {
      setUserLoading(false);
    }
  };

  // sign-in a user with provided details
  const signIn = async (payload: SupabaseAuthPayload) => {
    try {
      setUserLoading(true);
      const { error } = await supabase.auth.signInWithPassword(payload);
      if (error) {
        console.log(error);
        handleMessage({ message: error.message, type: "error" });
      } else {
        handleMessage({
          message: "Login successful!",
          type: "success",
        });
        checkedLoggedIn();
        window.location.href = "/";
      }
    } catch (error: any) {
      console.log(error);
      handleMessage({
        message: error.error_description || error,
        type: "error",
      });
    } finally {
      setUserLoading(false);
    }
  };
  const signOut = async () => await supabase.auth.signOut();

  const checkedLoggedIn = async () => {
    const userInfo: any = await supabase.auth.getUser();
    if (userInfo?.data?.user) {
      const userData = userInfo.data.user;
      setUser(userInfo);
      setLoggedIn(true);
      const userInfoData = {
        id: userData.id,
        email: userData.email,
        created_at: userData.created_at,
        last_sign: userData.last_sign_in_at,
      };
      setContent(userInfoData);
    }
    setUserLoading(false);
  };
  useEffect(() => {
    checkedLoggedIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        signUp,
        signIn,
        signOut,
        loggedIn,
        userLoading,
        setUserLoading,
      }}
    >
      {userLoading ? <CustomLoading /> : null}
      {children}
    </AuthContext.Provider>
  );
};
