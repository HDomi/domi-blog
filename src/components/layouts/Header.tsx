"use client";

import styles from "./layout.module.scss";
import { menuItems } from "@/constants/menuItems";
import { useAuth } from "@/hooks/auth";
import Link from "next/link";
import { userInfo as userInfoRecoil } from "@/store/userInfo";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMessage } from "@/hooks/message";
import { IUserInfo } from "@/types";
import { nextTick } from "process";
const Header = ({}) => {
  const { loggedIn, signOut } = useAuth();
  const { handleMessage } = useMessage();
  const router = useRouter();
  const userInfo: IUserInfo = useRecoilValue(userInfoRecoil);
  const [userUpper, setUserUpper] = useState("?");

  useEffect(() => {
    if (userInfo.email) {
      setUserUpper(userInfo.email[0].toUpperCase());
    } else {
      setUserUpper("?");
    }
  }, [userInfo]);

  const authHandler = async () => {
    console.debug("authHandler", loggedIn);
    if (!loggedIn) {
      router.push("/auth");
    } else {
      await signOut();
      handleMessage({
        message: "로그아웃되었습니다.",
        type: "success",
      });
      nextTick(() => {
        router.push("/");
      });
    }
  };
  return (
    <header className={styles["header-wrap"]}>
      <Link href="/">
        <p className="logo">Domi's Blog</p>
      </Link>
      <div className={styles["nav-wrap"]}>
        {menuItems.map((item, idx) => {
          return (
            <div className={styles["nav-item"]} key={idx}>
              <Link href={item.link}>{item.name}</Link>
            </div>
          );
        })}
        <div
          className={styles["profile-icon"]}
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.preventDefault();
            authHandler();
          }}
        >
          {userUpper}
        </div>
      </div>
    </header>
  );
};
export default Header;
