"use client";

import { createContext, FunctionComponent, useState } from "react";

export type MessageType = "default" | "success" | "error";
export type MessageProps = {
  type: MessageType;
  message: string;
};

export type MessageContextProps = {
  messages: MessageProps[];
  handleMessage: (message: MessageProps) => void;
};

export const MessageContext = createContext<MessageContextProps>({});

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
      {children}
    </MessageContext.Provider>
  );
};
