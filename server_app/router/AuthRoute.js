const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const User = require("../model/user");
const authMiddleware = require("../middleware/auth");
const router = express.Router();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Cấu hình transporter để gửi email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "stayfinder333@gmail.com",
    pass: "wgjq yhfe jvxw kqrk",
  },
});

const generateRandomAvatar = (name) => {
  const baseUrl = "https://api.dicebear.com/5.x/identicon/svg";
  const seed = encodeURIComponent(name);
  return `${baseUrl}?seed=${seed}`;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Bảo vệ route /admin
router.get("/admin", authMiddleware, (req, res) => {
  res.send("Chào mừng bạn đến trang Admin!");
});

// Route đăng ký
router.post("/register", async (req, res) => {
  const { username, email, password, phone } = req.body;

  try {
    // Kiểm tra xem email đã tồn tại chưa
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email đã được sử dụng!" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    user = new User({
      username,
      email,
      password: hashedPassword,
      phone,
    });

    // Lưu người dùng vào DB
    await user.save();

    // Tạo token JWT
    const token = jwt.sign({ userId: user._id }, "your_jwt_secret_key", {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "Đăng ký thành công!", token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi đăng ký" });
  }
});

// dang nhap
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không đúng!" });
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Mật khẩu bạn nhập không chính xác!" });
    }

    // Kiểm tra trạng thái tài khoản
    if (user.status === 2) {
      // Kiểm tra nếu trạng thái là 2
      return res.status(403).json({ message: "Tài khoản của bạn đã bị khóa!" });
    }

    // Tạo token JWT
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        phone: user.phone,
        role: user.role,
      },
      "your_jwt_secret_key",
      {
        expiresIn: "12h",
      }
    );

    res.json({
      message: "Đăng nhập thành công!",
      token,
      userId: user._id,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi đăng nhập" });
  }
});

// xem toàn bộ thông tin người dùng
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server!" });
  }
});

// đổi mật khẩu
router.post("/change-password", authMiddleware, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Current password is incorrect." });
    }

    // Kiểm tra độ mạnh của mật khẩu mới
    if (new_password.length < 8) {
      return res
        .status(400)
        .json({ message: "Mật khẩu mới phải dài ít nhất 8 ký tự." });
    }

    // Mã hóa và cập nhật mật khẩu mới
    const hashedPassword = await bcrypt.hash(new_password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Mật khẩu đã được thay đổi thành công." });
  } catch (error) {
    console.error("Error in change-password route:", error.message); // Thêm lỗi chi tiết
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
});
router.put(
  "/update",
  authMiddleware,
  upload.single("avatar"),
  async (req, res) => {
    const { username, email, phone } = req.body;
    try {
      const user = await User.findById(req.user.userId);

      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng!" });
      }

      if (email && email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "Email đã được sử dụng!" });
        }
      }

      user.username = username || user.username;
      user.email = email || user.email;
      user.phone = phone || user.phone;

      if (req.file) {
        user.avatar = req.file.path; // Lưu avatar từ file upload
      } else if (!user.avatar) {
        user.avatar = generateRandomAvatar(user.username); // Tạo avatar ngẫu nhiên nếu không có avatar
      }

      await user.save();

      // Trả về thông tin người dùng đã cập nhật, bao gồm avatar mới
      res.json({ message: "Cập nhật thông tin thành công!", user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi server!", error: err.message });
    }
  }
);

// Route lấy tất cả người dùng
router.get("/users", authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const currentUser = await User.findById(currentUserId);

    let users;
    if (currentUser.role === 0) {
      users = await User.find({ _id: { $ne: currentUserId } }).select(
        "-password"
      );
    } else if (currentUser.role === 1) {
      users = await User.find({ role: 2, _id: { $ne: currentUserId } }).select(
        "-password"
      );
    } else {
      return res.status(403).json({ message: "Bạn không có quyền truy cập!" });
    }

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server!" });
  }
});

router.delete("/users/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    // Tìm người dùng theo ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    // if (req.user.userId !== id && req.user.role !== 1) {
    //   return res.status(403).json({ message: "Bạn không có quyền xóa người dùng này!" });
    // }

    // Xóa người dùng
    await User.findByIdAndDelete(id);
    res.json({ message: "Xóa người dùng thành công!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server!", error: err.message });
  }
});

// Cập nhật trạng thái tài khoản
router.put("/update-status/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Kiểm tra xem trạng thái có hợp lệ không
    if (status !== 0 && status !== 1 && status !== 2) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ!" });
    }

    // Tìm người dùng theo ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    user.status = status;
    await user.save();

    res.json({ message: "Cập nhật trạng thái thành công!", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server!", error: err.message });
  }
});

// Cập nhật trạng thái tài khoản
router.put("/update-status/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Kiểm tra xem trạng thái có hợp lệ không
    if (status !== 0 && status !== 1 && status !== 2) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ!" });
    }

    // Tìm người dùng theo ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    // Kiểm tra quyền chỉnh sửa (nếu cần)
    // Ví dụ: chỉ cho phép admin (role = 1) chỉnh sửa trạng thái của người dùng khác
    // if (req.user.role !== 1 && req.user.userId !== id) {
    //   return res.status(403).json({ message: "Bạn không có quyền chỉnh sửa trạng thái người dùng này!" });
    // }

    // Cập nhật trạng thái người dùng
    user.status = status;
    await user.save();

    res.json({ message: "Cập nhật trạng thái thành công!", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server!", error: err.message });
  }
});

// Cập nhật vai trò người dùng
router.put("/update-role/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    // Kiểm tra vai trò có hợp lệ không
    if (role !== 0 && role !== 1 && role !== 2) {
      return res.status(400).json({ message: "Vai trò không hợp lệ!" });
    }

    // Tìm người dùng theo ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    if (req.user.role !== 0) {
      return res.status(403).json({
        message: "Bạn không có quyền chỉnh sửa vai trò người dùng này!",
      });
    }

    // Cập nhật vai trò người dùng
    user.role = role; // Cập nhật vai trò
    await user.save();

    res.json({ message: "Cập nhật vai trò thành công!", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server!", error: err.message });
  }
});

// Route tính tổng số người dùng
router.get("/count", authMiddleware, async (req, res) => {
  try {
    // Tính tổng số người dùng
    const userCount = await User.countDocuments(); // Sử dụng countDocuments để đếm số lượng tài liệu trong collection

    res.json({ totalUsers: userCount }); // Trả về tổng số người dùng
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server!" });
  }
});

router.get("/new-users-count", authMiddleware, async (req, res) => {
  try {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const newUserCount = await User.countDocuments({
      createdAt: { $gte: oneDayAgo },
    });

    res.json({ newUsersCount: newUserCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server!" });
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    // Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại!" });
    }

    // Tạo token xác thực cho phép thay đổi mật khẩu
    const token = jwt.sign({ userId: user._id }, "your_jwt_secret_key", {
      expiresIn: "12h", // Token sẽ hết hạn sau 12 giờ
    });

    // Lưu token vào database (hoặc lưu trữ ở nơi bạn muốn)
    user.resetPasswordToken = token;
    await user.save();

    // Tạo liên kết để người dùng thay đổi mật khẩu
    const resetPasswordLink = `http://localhost:3500/cap-nha-lai-mat-khau/${token}`;

    // Cấu hình email
    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "Đặt lại mật khẩu của bạn",
      text: `Bạn đã yêu cầu thay đổi mật khẩu. Vui lòng nhấn vào liên kết sau để đặt lại mật khẩu của bạn: ${resetPasswordLink}`,
    };

    // Gửi email
    await transporter.sendMail(mailOptions);

    res.json({
      message: "Email đã được gửi! Vui lòng kiểm tra email của bạn.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server!" });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  try {
    // Xác thực token
    const decoded = jwt.verify(token, "your_jwt_secret_key");

    // Tìm người dùng dựa trên ID trong token
    const user = await User.findById(decoded.userId);
    if (!user || user.resetPasswordToken !== token) {
      return;
    }

    // Kiểm tra mật khẩu mới và mật khẩu xác nhận có khớp không
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Mật khẩu nhập lại không khớp." });
    }

    // Kiểm tra độ mạnh của mật khẩu mới
    const passwordRegex = /^(?=[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Mật khẩu mới phải có ít nhất 8 ký tự và chữ cái đầu viết hoa.",
      });
    }

    // Cập nhật mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null; // Xóa token sau khi sử dụng
    await user.save();

    res.json({ message: "Mật khẩu đã được cập nhật thành công!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server!" });
  }
});

let DB = [];

async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    return { payload: ticket.getPayload() };
  } catch (error) {
    return { error: "Invalid user detected. Please try again" };
  }
}

function generateRandomPassword(length = 12) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += characters[Math.floor(Math.random() * characters.length)];
  }
  return password;
}

router.post("/signupGoogle", async (req, res) => {
  try {
    if (req.body.credential) {
      const verificationResponse = await verifyGoogleToken(req.body.credential);

      if (verificationResponse.error) {
        return res.status(400).json({
          message: verificationResponse.error,
        });
      }

      const profile = verificationResponse?.payload;
      const existingUser = await User.findOne({ email: profile?.email });

      if (existingUser) {
        return res.status(400).json({
          message: "User already exists",
        });
      }
      const password = generateRandomPassword();
      const newUser = new User({
        username: `${profile?.given_name} ${profile?.family_name}`,
        email: profile?.email,
        avatar: profile?.picture,
        role: 2,
        status: 1,
        lastLogin: new Date(),
        password,
      });

      await newUser.save();

      res.status(201).json({
        message: "Signup successful",
        user: {
          username: `${profile?.given_name} ${profile?.family_name}`,
          firstName: profile?.given_name,
          lastName: profile?.family_name,
          email: profile?.email,
          token: jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
          }),
        },
      });
    } else {
      return res.status(400).json({
        message: "Missing credentials",
      });
    }
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({
      message: error.message,
    });
  }
});

router.post("/loginGoogle", async (req, res) => {
  try {
    if (req.body.credential) {
      const verificationResponse = await verifyGoogleToken(req.body.credential);
      if (verificationResponse.error) {
        return res.status(400).json({
          message: verificationResponse.error,
        });
      }
      const profile = verificationResponse?.payload;

      const existsInDB = await User.findOne({ email: profile?.email });

      if (!existsInDB) {
        return res.status(400).json({
          message: "Bạn chưa đăng ký. Hãy đăng ký",
        });
      }

      res.status(201).json({
        message: "Email hoặc thông tin tài khoản không chính xác.",
        user: {
          username: `${profile?.given_name} ${profile?.family_name}`,
          firstName: profile?.given_name,
          lastName: profile?.family_name,
          picture: profile?.picture,
          email: profile?.email,
          token: jwt.sign({ userId: existsInDB._id }, process.env.JWT_SECRET, {
            expiresIn: "12h",
          }),
        },
      });
    } else {
      return res.status(400).json({
        message: "Missing credentials",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error?.message || error,
    });
  }
});

module.exports = router;
