var express = require("express");
require("dotenv").config();
const http = require("http");
const multer = require("multer");
const path = require("path");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 8000;
const uri = "mongodb://127.0.0.1:27017/StudyFinder";
const Message = require("./model/Message");
const { OAuth2Client } = require("google-auth-library");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Import routes
const postRoutes = require("./router/postRoutes");
const AuthRoute = require("./router/AuthRoute");
const messageRoutes = require("./router/messageRoutes");

// Middleware
app.use(
  cors({
    origin: "http://localhost:3500",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files
app.use(express.static("public"));
app.use("/img", express.static(__dirname + "/public/img"));
app.use("/video", express.static(__dirname + "/public/video"));

// Routes
app.use("/api/auth", AuthRoute);
app.use("/api", messageRoutes);
app.use(postRoutes);

// Cấu hình multer để lưu ảnh vào thư mục uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/"); // Thư mục lưu trữ tệp
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Lấy phần mở rộng của tệp
    const fileName = Date.now() + ext; // Tạo tên tệp duy nhất
    cb(null, fileName);
  },
});

const upload = multer({ storage });

app.post("/api/upload-image", upload.array("image", 5), (req, res) => {
  console.log("Files uploaded:", req.files);

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  // Tạo mảng URL cho tất cả các ảnh đã tải lên
  const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);

  // Kiểm tra để đảm bảo mảng URL không rỗng
  console.log("Image URLs:", imageUrls);

  // Trả về mảng URL của các ảnh đã tải lên
  res.status(200).json({ imageUrls });
});

// Connect to MongoDB
mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Tạo server HTTP
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3500",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("sendMessage", async (messageData) => {
    if (!messageData.id_chat) {
      console.error("Invalid message data", messageData);
      return; // Hoặc gửi phản hồi lỗi
    }

    // Nếu message_content không có nhưng image_url có, hãy cho phép gửi tin nhắn
    if (!messageData.message_content && messageData.image_url) {
      messageData.message_content = ""; // Hoặc bạn có thể để nó undefined
    }

    try {
      // Nếu messageData.image_url là một mảng, chuyển thành chuỗi JSON
      if (Array.isArray(messageData.image_url)) {
        messageData.image_url = JSON.stringify(messageData.image_url); // Lưu mảng ảnh dưới dạng chuỗi JSON
      }

      const message = new Message({
        ...messageData, // Lưu tất cả các thuộc tính, bao gồm image_url
      });

      // Lưu tin nhắn vào cơ sở dữ liệu
      await message.save();

      // Gửi thông báo cho phòng chat
      socket.to(messageData.id_chat).emit("messageReceived", message); // Gửi đến tất cả mọi người trong phòng

      // Thông báo cho người gửi
      io.emit("messageSent", message);
    } catch (error) {
      console.error("Error saving message:", error);
      socket.emit("error", { message: "Lỗi khi gửi tin nhắn" }); // Gửi phản hồi lỗi cho client
    }
  });

  socket.on("joinChat", (id_chat) => {
    socket.join(id_chat);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start the server
server.listen(port, () =>
  console.log(`Server listening on http://localhost:${port}`)
);
