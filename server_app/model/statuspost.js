const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const statuspostSchema = new Schema({
    code: { type: Number, required: true, unique: true }, // Mã trạng thái
    name: { type: String, required: true } // Tên trạng thái
}, {
    timestamps: true // Tự động thêm trường createdAt và updatedAt
});

// Mô hình StatusPost
const StatusPost = mongoose.model('StatusPost', statuspostSchema);

// Xuất mô hình
module.exports = StatusPost;

