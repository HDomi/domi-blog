"use client";

import React, { useState, useRef } from "react";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { supabase } from "@/utils/supabase";
import { useFormFields } from "@/utils/util";
import { useLayout } from "@/hooks/layout";
import { useAuth } from "@/hooks/auth";
import { IFormFieldProps, SupabaseAuthPayload } from "@/types";
import style from "./auth.module.scss";
import CNJ from "@/utils/classNameJoiner";
import CustomInput from "@/components/inputs/CustomInput";
import CustomButton from "@/components/inputs/CustomButton";

const FORM_VALUES: IFormFieldProps = {
  email: "",
  password: "",
};

const returnMsgTypes = (code: string | any) => {
  if (!code) return "알 수 없는 오류가 발생했습니다.";
  const msgTypes: any = {
    email_address_not_authorized:
      "승인 이메일이 발송되었습니다. 이메일을 확인해주세요.",
    invalid_credentials:
      "이메일 또는 비밀번호가 올바르지 않거나 등록되지 않았습니다.",
  };
  return msgTypes[code] || "알 수 없는 오류가 발생했습니다.";
};

const Auth = () => {
  const { signIn, loggedIn } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  const [values, handleChange, resetFormFields] =
    useFormFields<IFormFieldProps>(FORM_VALUES);

  const { setUserLoading, handleMessage } = useLayout();

  // sign-up a user with provided details
  const signUpHandler = async (payload: SupabaseAuthPayload) => {
    try {
      setUserLoading(true);
      const { error } = await supabase.auth.signUp(payload);
      if (error) {
        console.log(error);
        handleMessage({
          message: returnMsgTypes(error.code),
          messageType: "error",
        });
      } else {
        handleMessage({
          message: returnMsgTypes("email_address_not_authorized"),
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
  const signInHandler = async (payload: SupabaseAuthPayload) => {
    try {
      setUserLoading(true);
      signIn(payload);
    } catch (error: any) {
      console.log(error);
      console.debug("error", error);
      handleMessage({
        message: returnMsgTypes(error.error_description || error),
        messageType: "error",
      });
    } finally {
      setUserLoading(false);
    }
  };

  // Form submit handler to call the above function
  const handleSumbit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isLogin) {
      signInHandler(values);
    } else {
      signUpHandler(values);
    }
    resetFormFields();
  };

  return (
    <div className={style["sign-wrap"]}>
      <div className={style["login-logo"]}>
        {loggedIn ? (
          <FaLockOpen className="logo w-6 h-6" />
        ) : (
          <FaLock className="logo w-6 h-6" />
        )}
        <h1 className="logo">Login</h1>
      </div>
      <form
        onSubmit={handleSumbit}
        className={CNJ([style["sign-in-form"], "beauty-box"])}
      >
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <div className={style["input-wrapper"]}>
            <CustomInput
              id="email"
              name="email"
              type="email"
              placeholder="Your Email"
              required
              value={values.email}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mb-6">
          <label htmlFor="password">Password</label>
          <div className={style["input-wrapper"]}>
            <CustomInput
              id="password"
              name="password"
              type="password"
              placeholder="Your password"
              required
              value={values.password}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <CustomButton
            type="submit"
            onClick={(e) => {
              setIsLogin(true);
            }}
          >
            Log In
          </CustomButton>
          <CustomButton
            type="submit"
            onClick={(e) => {
              setIsLogin(true);
            }}
          >
            Sign Up
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

export default Auth;
