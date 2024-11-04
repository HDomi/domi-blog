"use client";

import { createContext, FunctionComponent, useState } from "react";
import MessageItem from "@/components/layouts/MessageItem";
import { IMessageProps, ILayoutContextProps, IProviderProps } from "@/types";
import CustomLoading from "@/components/layouts/CustomLoading";

export const LayoutContext = createContext<ILayoutContextProps>({
  messages: [],
  userLoading: false,
  handleMessage: () => {},
  setUserLoading: () => {},
});

export const LayoutProvider: FunctionComponent<IProviderProps> = ({
  children,
}) => {
  const [messages, setMessages] = useState<IMessageProps[]>([]);
  const [userLoading, setUserLoading] = useState(false);

  const handleMessage = (message: IMessageProps) => {
    setMessages((prevMessages) => prevMessages.concat([message]));
    setTimeout(() => {
      setMessages((prevMessages) => prevMessages.slice(1));
    }, 5000);
  };

  return (
    <LayoutContext.Provider
      value={{
        userLoading,
        messages,
        handleMessage,
        setUserLoading,
      }}
    >
      {messages && (
        <div className="message-wrapper">
          {messages.map((message, index) => (
            <MessageItem
              key={index}
              message={message.message}
              messageType={message.messageType}
            />
          ))}
        </div>
      )}
      {userLoading && <CustomLoading />}
      {children}
    </LayoutContext.Provider>
  );
};
