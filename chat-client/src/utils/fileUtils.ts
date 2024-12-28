// src/utils/fileUtils.ts

export const processFile = (file: any) => {
  try {
    const { buffer, originalname, mimetype, timestamp } = file;
    const byteCharacters = atob(buffer);
    const byteArray = new Uint8Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }

    const fileBlob = new Blob([byteArray], { type: mimetype });
    const fileURL = URL.createObjectURL(fileBlob);

    return { fileURL, originalname, mimetype, timestamp, sender: file.sender };
  } catch (error) {
    console.error("Error processing file:", error);
    return null;
  }
};



export const sendFile = async (
  file: File | null,
  room: string,
  name: string,
  socket: any
) => {
  if (room && file && name) {
    if (file.size > 1048576 * 10) {
      alert("File size exceeds the 10MB limit!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("room", room);
    formData.append("senderName", name);

    try {
      const response = await fetch("https://chat-socket-express-js.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.statusText}`);
      }

      const data = await response.json();
      const timestamp = new Date().toLocaleTimeString();

      // ارسال پیام فقط از سمت سرور
      if (data.file) {
        socket.emit("send_message", {
          room,
          message: `${data.file.originalname} sent a file at ${timestamp}`,
          type: "file",
          file: data.file,
          timestamp,
          senderName: name,
        });
      }

      // بعد از ارسال فایل، نباید دوباره پیام اضافی ارسال شود
      return null; // فایل پس از ارسال پاک می‌شود
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("File upload failed!");
    }
  }
};
