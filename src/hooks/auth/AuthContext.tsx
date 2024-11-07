"use client";

import { createContext, FunctionComponent, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { useLayout } from "@/hooks/layout";
import { ReactNode } from "react";
import CustomLoading from "@/components/layouts/CustomLoading";
import { userInfo as userInfoRecoil } from "@/store/userInfo";
import { useSetRecoilState, useRecoilValue } from "recoil";
import {
  ISupabaseAuthPayload,
  IAuthContextProps,
  IProviderProps,
} from "@/types";

export const AuthContext = createContext<IAuthContextProps>({
  user: null,
  signUp: () => {},
  signIn: () => {},
  signOut: () => {},
  loggedIn: false,
  isDomi: false,
});

export const AuthProvider: FunctionComponent<IProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<any | null>(null);
  const { setUserLoading, handleMessage } = useLayout();
  const [loggedIn, setLoggedIn] = useState(false);
  const [isDomi, setIsDomi] = useState(false);
  const setContent = useSetRecoilState(userInfoRecoil);

  // sign-up a user with provided details
  const signUp = async (payload: ISupabaseAuthPayload) => {
    try {
      setUserLoading(true);
      const { error } = await supabase.auth.signUp(payload);
      if (error) {
        console.log(error);
        handleMessage({ message: error.message, messageType: "error" });
      } else {
        handleMessage({
          message:
            "Signup successful. Please check your inbox for a confirmation email!",
          messageType: "success",
        });
      }
    } catch (error: any) {
      console.log(error);
      handleMessage({
        message: error.error_description || error,
        messageType: "error",
      });
    } finally {
      setUserLoading(false);
    }
  };

  // sign-in a user with provided details
  const signIn = async (payload: ISupabaseAuthPayload) => {
    try {
      setUserLoading(true);
      const { error } = await supabase.auth.signInWithPassword(payload);
      if (error) {
        console.log(error);
        handleMessage({ message: error.message, messageType: "error" });
      } else {
        handleMessage({
          message: "Login successful!",
          messageType: "success",
        });
        checkedLoggedIn();
        window.location.href = "/";
      }
    } catch (error: any) {
      console.log(error);
      handleMessage({
        message: error.error_description || error,
        messageType: "error",
      });
    } finally {
      setUserLoading(false);
    }
  };
  const signOut = async () => {
    await supabase.auth.signOut();
    checkedLoggedIn();
  };

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
      setIsDomi(userData.id === process.env.NEXT_PUBLIC_USER_ID);
    } else {
      setContent({
        id: null,
        email: null,
        created_at: null,
        last_sign: null,
      });
      setLoggedIn(false);
      setIsDomi(false);
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
        isDomi,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
