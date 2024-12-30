const mongoose = require("mongoose");
const category = require("./rentaltype");
const posttype = require("./posttype");
const user = require("./user");
const RentalType = require("./rentaltype");
const setExpireDate = require("../middleware/setExpireDate"); // Import middleware

const postSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Tiêu đề bài đăng
  description: { type: String }, // Mô tả chi tiết phòng trọ
  price: { type: String, required: true }, // Giá thuê phòng
  area: { type: Number, required: true }, // Diện tích phòng
  province: {
    code: { type: String, required: true },
    name: { type: String, required: true },
  },
  district: {
    code: { type: String, required: true },
    name: { type: String, required: true },
  },
  ward: {
    code: { type: String, required: true },
    name: { type: String, required: true },
  },
  address: { type: String, required: true }, // Địa chỉ cụ thể
  bathroom: { type: Number, default: 0 }, // Số phòng tắm
  bedroom: { type: Number, default: 0 }, // Số phòng ngủ
  attic: { type: Boolean, default: 0 }, // Có tầng trệt hay không
  floor: { type: Number, default: 0 }, // Số tầng
  image: [String], // Link hình ảnh phòng trọ
  video: [String], // Link video

  rentaltype: {
    type: String,
    enum: [
      "cho-thue-phong-tro",
      "tim-nguoi-o-ghep",
      "cho-thue-can-ho",
      "cho-thue-nha-o",
    ], // Các loại tin có thể
    default: "cho-thue-phong-tro",
  }, // Tham chiếu đến danh mục tin

  posttype: {
    type: String,
    enum: ["thuong", "vip1", "vip2"], // Các loại tin có thể, thêm các loại tin VIP
    default: "thuong",
  }, // Tham chiếu đến thể loại tin

  createdAt: { type: Date, default: Date.now }, // Ngày tạo bài đăng
  expireDate: { type: Date }, // Ngày hết hạn của bài đăng
  statuspost: {
    type: String,
    enum: ["chưa thanh toán", "Đã thanh toán", "...other statuses"],
    default: "chưa thanh toán",
  },
  orderId: String, // Add this line to store MoMo's order ID                                       // Trạng thái bài đăng
  isDeleted: { type: Boolean, default: false }, // Đánh dấu xóa bài viết, dễ khôi phục
  isVisible: { type: Boolean, default: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Tham chiếu đến người dùng
  phone: { type: String, required: true },
  username: { type: String, required: true },
  postCount: { type: Number, default: 0 },
});
postSchema.pre("save", setExpireDate);

module.exports = mongoose.model("Post", postSchema);
