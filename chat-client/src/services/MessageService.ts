// src/services/MessageService.ts
import { io, Socket } from "socket.io-client";
import { Message, FileDetails } from "../types"; // فرض بر اینکه `Message` و `FileDetails` در types تعریف شده‌اند

class MessageService {
  public socket: Socket;

  constructor() {
    this.socket = io("http://localhost:5000"); // اتصال به سرور
  }

    public sendMessage(room: string, message: string, userName: string) {
      if (!message.trim()) {
        console.error("Empty message attempted to be sent");
        return; // پیام خالی ارسال نخواهد شد
      }
    this.socket.emit("send_message", { room, message, userName });
  }

  // در MessageService
  // اصلاح برای استفاده از تایپ مناسب به جای any
  public sendFile(
    room: string,
    file: FileDetails,
    userName: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.socket.emit(
        "send_file",
        { room, file, userName },
        (response: { success: boolean; error?: string }) => {
          if (response.error) {
            reject(response.error);
          } else {
            resolve(response);
          }
        }
      );

    });
  }

  public receiveMessages(callback: (message: Message) => void) {
    this.socket.on("receive_message", (data: Message) => {
      callback(data);
    });
  }

  public joinRoom(room: string, userName: string) {
    this.socket.emit("join_room", { room, userName });
  }
}

export default new MessageService();
