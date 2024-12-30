// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  amount: { type: String, required: true },
  status: { type: String, default: 'chưa thanh toán' }, // Can be 'chưa thanh toán', 'Đã thanh toán', 'Thất bại', etc.
  orderId: { type: String, required: true },
  orderInfo: {
    type: String, // Dữ liệu orderInfo
    required: true
},
  paymentMethod: { type: String, default: 'MoMo' }, // Can be extended to include other methods
  transactionDate: { type: Date, default: Date.now }, // The date the transaction was created
  transactionDetails: { // Stores detailed information about the MoMo transaction response
    payUrl: { type: String }, // MoMo payment URL (if available)
    paymentResponse: { type: Object } // Full payment response from MoMo
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
