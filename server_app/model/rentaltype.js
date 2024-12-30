const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rentalTypeSchema = new Schema({
    name: { type: String, required: true } // Tên loại hình
}, {
    timestamps: true, // Tự động thêm trường createdAt và updatedAt
});

const rentalType = mongoose.model('RentalType', rentalTypeSchema);
module.exports = rentalType;

