"use client";

import CNJ from "@/utils/classNameJoiner";
import style from "./main.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useRef, useState } from "react";
import { IUserTextChat } from "@/types";
import { motion } from "framer-motion";

const Home = () => {
  const [doneBotText, setDoneBotText] = useState<boolean>(false);
  const [userText, setUserText] = useState<string>("");
  const [userTextArr, setUserTextArr] = useState<IUserTextChat[]>([]);

  const messages = useRef<any>(null);
  const scrollToBottom = () => {
    messages.current.scrollTop = messages.current.scrollHeight;
  };

  const clearAll = () => {
    if (!doneBotText) return;

    setUserTextArr([]);
    sessionStorage.removeItem("USER_TEXT_ARR");
  };

  const onClickSend = () => {
    if (userText === "") return;
    setUserTextArr([
      ...userTextArr,
      {
        text: userText,
        isUser: true,
      },
    ]);
    setUserText("");
    sessionStorage.setItem("USER_TEXT_ARR", JSON.stringify(userTextArr));
  };

  const setBotText = () => {
    setDoneBotText(false);
    const textArr = [
      {
        text: "제 블로그에 오신것을 환영합니다.",
        isUser: false,
      },
      {
        text: "아직 만든지 얼마되지 않아서 별거없지만... 그래도 재밌게 봐주세요.",
        isUser: false,
      },
    ];
    setUserTextArr([...userTextArr, textArr[0]]);
    setTimeout(() => {
      setUserTextArr([...textArr]);
      setDoneBotText(true);
    }, 2500);
  };
  useEffect(() => {
    setUserTextArr([]);
    const sessionTextArr = JSON.parse(
      sessionStorage.getItem("USER_TEXT_ARR") || "[]"
    );
    if (sessionTextArr.length > 0) {
      setUserTextArr(sessionTextArr);
      setDoneBotText(true);
    } else {
      setBotText();
    }
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [userTextArr]);
  return (
    <div className={style["home-wrap"]}>
      <div className="objects">
        <img className="object_rocket" src="/images/rocket.svg" />
        <div className="earth-moon">
          <img
            id="object_earth"
            className="object_earth"
            src="/images/earth.svg"
          />
          <img
            id="object_moon"
            className="object_moon"
            src="/images/moon.svg"
          />
        </div>
        <div className="box_astronaut">
          <img className="object_astronaut" src="/images/astronaut.svg" />
        </div>
      </div>
      <div className={CNJ([style["chat-wrap"], "beauty-box"])}>
        <div className={style["chat-header"]}>
          <p>Domi's Blog</p>
          <button onClick={clearAll}>
            <CloseIcon />
          </button>
        </div>
        <div className={style["chat-body"]}>
          <div className={style["chat-section"]} ref={messages}>
            {userTextArr.map((item, index) => (
              <motion.div
                key={index}
                className={CNJ([
                  style["chat-bubble"],
                  item.isUser ? style["user"] : style["bot"],
                ])}
                animate={{ y: -8 }}
                transition={{ type: "spring" }}
              >
                {item.text}
              </motion.div>
            ))}
          </div>
          <div className={style["chat-action"]}>
            <input
              type="text"
              className={style["chat-input"]}
              value={userText}
              placeholder={
                !doneBotText ? "로딩중입니다." : "메시지를 입력해주세요."
              }
              disabled={!doneBotText}
              onChange={(e) => setUserText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onClickSend();
                }
              }}
            />
            <button className={style["chat-send"]} onClick={onClickSend}>
              <SendIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
