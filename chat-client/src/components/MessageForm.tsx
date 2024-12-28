import React from "react";

interface Props {
  message: string;
  setMessage: (value: string) => void;
  sendMessage: () => void;
}

const MessageForm: React.FC<Props> = ({ message, setMessage, sendMessage }) => {
  return (
    <div>
      <textarea
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
};

export default MessageForm;
