import React from "react";
import styles from "./Message.module.css";

const Message = ({ text, author, timestamp }) => {
  return (
    <div className={styles.messageContainer}>
      <div className={author === "User" ? styles.animalLeft : styles.animalRight}>
        {text}
      </div>
      <div className={styles.subtext}>
        {timestamp} - {author}
      </div>
    </div>
  );
};

export default Message;
