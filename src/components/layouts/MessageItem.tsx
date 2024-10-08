import styles from "./layout.module.scss";
import { IMessageProps } from "@/types";

const MessageItem = ({ message, messageType }: IMessageProps) => {
  return (
    <div className={`${styles["message-item"]} beauty-box ${messageType}`}>
      {message}
    </div>
  );
};

export default MessageItem;
