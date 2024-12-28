// src/types/index.ts

export interface Message {
  sender: string;
  message: string;
  type: string;
  timestamp: string;
  file?: FileDetails;
}

// export interface FileDetails {
//   originalname: string;
//   buffer: string;
//   mimetype: string;
//   timestamp: string;
//   sender: string;
// }

export interface FileDetails {
  originalname: string;
  mimetype: string;
  buffer: File; // این‌جا فرض می‌کنیم که از نوع `File` استفاده می‌کنید
}

// src/types.ts
export interface Message {
  userName: string;
  message: string;
}


export interface MessageApp {
  sender: string;
  message: string;
  type: string;
  timestamp: string;
  file?: any;
}
