// src\App.tsx
import { useState, useEffect } from "react";
import io from "socket.io-client";
import JoinRoomForm from "./components/JoinRoomForm";
import MessageForm from "./components/MessageForm";
import FileForm from "./components/FileForm";
import UserList from "./components/UserList";
import MessageList from "./components/MessageList";
import { sendFile } from "./utils/fileUtils"; // وارد کردن تابع جدید
import { MessageApp } from "./types";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "./redux/theme/actions";
import "./App.css";

const socket = io("https://chat-socket-express-js.onrender.com");

function App() {
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageApp[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: data.message,
          timestamp: data.timestamp,
          senderName: data.senderName,
          sender: data.sender,
          type: data.type || "text",
          file: data.file || null,
        },
      ]);
    });

    socket.on("user_list", (userList) => {
      setUsers(userList);
    });

    return () => {
      socket.off("receive_message");
      socket.off("user_list");
    };
  }, []);


  const dispatch = useDispatch();
  const theme = useSelector((state: any) => state.theme.theme);

  // استفاده از useEffect برای اعمال تم از localStorage در صورت موجود بودن
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      dispatch(setTheme(savedTheme));
    }
  }, [dispatch]);

  // تغییر تم
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "darklite" : "light";
    console.log("🚀 ~ toggleTheme ~ newTheme:", newTheme)
    dispatch(setTheme(newTheme));
  };

  // اعمال کلاس تم به بدنه
  useEffect(() => {
    console.log("🚀 ~ useEffect ~ theme:", theme)
    document.body.className = theme;
  }, [theme]);

  const joinRoom = () => {
    if (room && name) {
      socket.emit("join_room", room, name);
    }
  };

  const sendMessage = () => {
    if (room && message) {
      const timestamp = new Date().toLocaleTimeString();
      socket.emit("send_message", {
        room,
        message,
        timestamp,
        senderName: name,
      });
      setMessage("");
    }
  };

  // استفاده از تابع sendFile از utils
  const handleSendFile = () => {
    sendFile(file, room, name, socket).then(() => {
      setFile(null); // فایل پس از ارسال پاک می‌شود
    });
  };

  return (
    <div className="App">
      <h1>Chat Application</h1>
      <JoinRoomForm
        name={name}
        room={room}
        setName={setName}
        setRoom={setRoom}
        joinRoom={joinRoom}
      />
      <MessageForm
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
      <FileForm setFile={setFile} sendFile={handleSendFile} />
      <UserList users={users} />
      <MessageList messages={messages} name={name} />
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}

export default App;
