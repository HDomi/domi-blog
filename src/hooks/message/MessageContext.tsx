"use client";

import classNames from "classnames";
import { createContext, FunctionComponent, useState } from "react";
import MessageItem from "@/components/layouts/MessageItem";

export type MessageType = "info" | "success" | "error";
export type MessageProps = {
  type: MessageType;
  message: string;
};

export type MessageContextProps = {
  messages: MessageProps[];
  handleMessage: (message: MessageProps) => void;
};

export const MessageContext = createContext<MessageContextProps>({
  messages: [],
  handleMessage: () => {},
});

interface MessageProviderProps {
  children: React.ReactNode;
}

export const MessageProvider: FunctionComponent<MessageProviderProps> = ({
  children,
}) => {
  const [messages, setMessages] = useState<MessageProps[]>([]);

  const handleMessage = (message: MessageProps) => {
    setMessages((prevMessages) => prevMessages.concat([message]));
    setTimeout(() => {
      setMessages((prevMessages) => prevMessages.slice(1));
    }, 5000);
  };

  return (
    <MessageContext.Provider
      value={{
        messages,
        handleMessage,
      }}
    >
      {messages &&
        messages.map((message, index) => (
          <MessageItem
            key={index}
            message={message.message}
            messageType={message.type}
          />
        ))}
      {children}
    </MessageContext.Provider>
  );
};
