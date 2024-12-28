// src/components/MessageList.tsx
import React from "react";
import { processFile } from "../utils/fileUtils"; // وارد کردن تابع

interface Message {
  sender: string;
  message: string;
  type: string;
  timestamp: string;
  file?: any;
}

interface Props {
  messages: Message[];
  name: string;
}

const MessageList: React.FC<Props> = ({ messages, name }) => {
  return (
    <div>
      <h2>Messages:</h2>
      {messages.map((msg, index) => (
        <div key={index}>
          <strong>{msg.sender === name ? "You" : msg.sender}: </strong>
          {msg.type === "file" && msg.file ? (
            <FileDisplay file={msg.file} name={name} />
          ) : (
            msg.message
          )}
          <p>{msg.timestamp}</p>
        </div>
      ))}
    </div>
  );
};

// کامپوننت جداگانه برای نمایش فایل‌ها
const FileDisplay: React.FC<{ file: any; name: string }> = ({ file, name }) => {
  const processedFile = processFile(file);

  if (!processedFile) {
    return <div>Error processing file.</div>;
  }

  const { fileURL, originalname, mimetype, timestamp, sender } = processedFile;

  const displaySender = sender || "Unknown"; // بررسی برای مقدار پیش‌فرض در صورت نبود sender

  if (mimetype.startsWith("image/")) {
    return (
      <div>
        <img
          src={fileURL}
          alt={originalname}
          style={{ maxWidth: "100%", maxHeight: "300px" }}
        />
        {displaySender !== "Unknown" && (
          <p>
            {displaySender === name ? "You" : displaySender} sent an image at{" "}
            {timestamp}
          </p>
        )}
      </div>
    );
  } else if (mimetype.startsWith("video/")) {
    return (
      <div>
        <video controls style={{ maxWidth: "100%" }}>
          <source src={fileURL} type={mimetype} />
          Your browser does not support the video tag.
        </video>
        {displaySender !== "Unknown" && (
          <p>
            {displaySender === name ? "You" : displaySender} sent a video at{" "}
            {timestamp}
          </p>
        )}
      </div>
    );
  } else {
    return (
      <div>
        <a href={fileURL} download={originalname}>
          Download {originalname}
        </a>
        {displaySender !== "Unknown" && (
          <p>
            {displaySender === name ? "You" : displaySender} sent a file at{" "}
            {timestamp}
          </p>
        )}
      </div>
    );
  }
};

export default MessageList;
