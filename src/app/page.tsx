"use client";

import CNJ from "@/utils/classNameJoiner";
import style from "./main.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useRef, useState } from "react";
import { IUserTextChat } from "@/types";
import { motion } from "framer-motion";
import { mainTextArr } from "@/constants";

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

    setBotText();
  };
  const onClickSend = (textParam?: IUserTextChat) => {
    if (userText === "" && !textParam) return;
    const currentText = textParam ? textParam.text : userText;
    const currentIsUser = textParam ? textParam.isUser : true;
    setUserTextArr((prevUserTextArr) => {
      const newUserTextArr = [
        ...prevUserTextArr,
        {
          text: currentText,
          isUser: currentIsUser,
          link: textParam?.link,
        },
      ];
      // 상태가 업데이트된 후에 sessionStorage에 저장
      sessionStorage.setItem("USER_TEXT_ARR", JSON.stringify(newUserTextArr));
      return newUserTextArr;
    });
    setUserText("");
  };

  const setBotText = () => {
    setDoneBotText(false);
    mainTextArr.forEach((item, index) => {
      setTimeout(() => {
        onClickSend(item);
        if (index === mainTextArr.length - 1) {
          setDoneBotText(true);
        }
      }, 1500 * index);
    });
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
      <div className={style["main-content-wrap"]}>
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
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <p>{item.text}</p>
                  )}
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
                    onClickSend({ text: userText, isUser: true });
                  }
                }}
              />
              <button
                className={style["chat-send"]}
                onClick={() => onClickSend()}
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
        <div className={style["project-wrap"]}>tt</div>
      </div>
    </div>
  );
};

export default Home;
