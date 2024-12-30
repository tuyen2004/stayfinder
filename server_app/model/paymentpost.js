const mongoose = require('mongoose');

const paymentPostSchema = new mongoose.Schema({
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Liên kết với mô hình User
    },
    id_post: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Post' // Liên kết với mô hình Post
    },
    total_amount: {
        type: Number,
        required: true
    },
    payment_method: {
        type: String,
        enum: ['cash', 'credit_card', 'paypal'], // Danh sách phương thức thanh toán
        required: true
    },
    orderInfo: {
        type: String, // Dữ liệu orderInfo
        required: true
    },
    payment_date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const PaymentPost = mongoose.model('PaymentPost', paymentPostSchema);
module.exports = PaymentPost;
