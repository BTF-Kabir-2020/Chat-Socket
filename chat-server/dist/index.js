import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import winston from "winston";
dotenv.config(); // بارگذاری متغیرهای محیطی
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});
// تنظیمات Winston Logger برای لاگ کنسولی
const logger = winston.createLogger({
    level: "info", // سطح لاگ، می‌توانید تغییر دهید
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), // رنگی کردن لاگ‌ها برای دید بهتر
            winston.format.simple() // فرمت ساده
            ),
        }),
    ],
});
// تنظیمات آپلود فایل (حافظه موقت)
const storage = multer.memoryStorage(); // ذخیره فایل‌ها در حافظه
const upload = multer({ storage });
app.use(cors({
    origin: "*", // آدرس کلاینت React شما
    methods: ["GET", "POST"],
}));
// ایجاد شی برای ذخیره اسامی کاربران در روم‌ها
const usersInRoom = {};
const lastActivityTime = {}; // زمان آخرین فعالیت هر کاربر
// پیکربندی تایمر برای قطع کردن کاربران بعد از 10 دقیقه بی‌فعالیتی
const checkInactivity = () => {
    const currentTime = Date.now();
    for (const socketId in lastActivityTime) {
        if (currentTime - lastActivityTime[socketId] > 10 * 60 * 1000) {
            // اگر کاربر بیش از 10 دقیقه بی‌فعالیت بود، او را قطع کن
            const socket = io.sockets.sockets.get(socketId);
            if (socket) {
                socket.disconnect();
                logger.info(`User disconnected due to inactivity: ${socketId}`);
            }
            delete lastActivityTime[socketId];
        }
    }
};
setInterval(checkInactivity, 30000); // هر 30 ثانیه یک‌بار چک می‌شود
// تست سرور
app.get("/", (req, res) => {
    res.send("Chat server is running!");
    logger.info("GET request to /");
});
// آپلود فایل و ارسال آن به کاربران دیگر در روم
app.post("/upload", upload.single("file"), (req, res) => {
    // const file: any = req.file;
    const file = req.file;
    const senderName = req.body.senderName; // دریافت نام فرستنده از بدنه درخواست
    if (!file) {
        res.status(400).send("No file uploaded");
        logger.error("File upload failed: No file uploaded");
        return;
    }
    const room = req.body.room;
    if (!room) {
        res.status(400).send("Room is required");
        logger.error("File upload failed: No room specified");
        return;
    }
    // افزودن زمان ارسال
    const timestamp = new Date().toLocaleTimeString();
    const fileData = {
        buffer: file.buffer.toString("base64"), // تبدیل فایل به base64
        originalname: file.originalname,
        mimetype: file.mimetype,
    };
    // ارسال پیام شامل نوع فایل و زمان تنها یکبار
    io.to(room).emit("receive_message", {
        sender: senderName, // به‌جای "server"، نام فرستنده فایل را می‌فرستیم
        message: `File sent at ${timestamp}`, // پیام به‌همراه تایم استمپ
        type: "file", // نوع پیام به عنوان فایل
        file: fileData, // داده‌های فایل به صورت base64
        timestamp, // افزودن تایم استمپ به پیام
    });
    res.json({ message: "File uploaded and broadcasted" });
    logger.info(`File uploaded by ${senderName} to room ${room}`);
});
io.on("connection", (socket) => {
    logger.info(`User connected: ${socket.id}`);
    socket.on("join_room", (room, name) => {
        // ذخیره نام کاربر در روم
        if (!usersInRoom[room]) {
            usersInRoom[room] = {};
        }
        usersInRoom[room][socket.id] = name;
        // ذخیره زمان فعالیت کاربر
        lastActivityTime[socket.id] = Date.now();
        // پیوستن به روم
        socket.join(room);
        logger.info(`${name} joined room: ${room}`);
        // ارسال لیست کاربران به همه اعضای روم
        io.to(room).emit("user_list", Object.values(usersInRoom[room]));
        // ارسال پیام خوشامدگویی
        io.to(room).emit("receive_message", {
            sender: "server",
            message: `${name} has joined the room.`,
            type: "text",
            timestamp: new Date().toLocaleTimeString(),
        });
    });
    socket.on("send_message", ({ room, message, type, senderName }) => {
        // ارسال پیام به همه اعضای روم
        lastActivityTime[socket.id] = Date.now(); // بروزرسانی زمان فعالیت کاربر
        io.to(room).emit("receive_message", {
            sender: senderName,
            message: message,
            type: type,
            timestamp: new Date().toLocaleTimeString(),
        });
        logger.info(`Message sent by ${senderName} to room ${room}: ${message}`);
    });
    socket.on("disconnect", () => {
        // حذف کاربر از لیست
        for (const room in usersInRoom) {
            if (usersInRoom[room][socket.id]) {
                const username = usersInRoom[room][socket.id];
                delete usersInRoom[room][socket.id];
                // ارسال پیام به روم مبنی بر ترک کاربر
                io.to(room).emit("receive_message", {
                    sender: "server",
                    message: `${username} has left the room.`,
                    type: "text",
                    timestamp: new Date().toLocaleTimeString(),
                });
                // ارسال لیست به روز شده کاربران
                io.to(room).emit("user_list", Object.values(usersInRoom[room]));
                break;
            }
        }
        logger.info(`User disconnected: ${socket.id}`);
    });
});
// پورت سرور
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
