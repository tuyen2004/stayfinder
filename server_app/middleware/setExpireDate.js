// setExpireDateMiddleware.js

module.exports = function(next) {
  const postTypeDuration = {
    thường: 0,    // Không có hạn sử dụng cho loại "thường"
    vip1: 7,      // Tin VIP1 có hạn 7 ngày
    vip2: 14      // Tin VIP2 có hạn 14 ngày
  };

  // Kiểm tra loại tin và tính toán ngày hết hạn
  if (this.posttype in postTypeDuration) {
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + postTypeDuration[this.posttype]);

    // Nếu bài viết đã có ngày hết hạn và được nâng cấp, cần tính toán lại ngày hết hạn cho loại mới
    if (this.expireDate && this.posttype !== 'thường') {
      // Nếu đã có ngày hết hạn, cộng thêm ngày mới vào thay vì ghi đè
      expireDate.setDate(expireDate.getDate() + postTypeDuration[this.posttype]);
    }
    
    this.expireDate = expireDate; // Lưu ngày hết hạn vào trường expireDate
  }

  next();
};
