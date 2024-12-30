// utils.js
import '../../../css/PostNew.css'
// Định dạng ngày
export const formatDate = (dateString) => {
  if (!dateString) {
    return "Vĩnh viễn"; // Trả về "Vĩnh viễn" nếu không có giá trị ngày
  }
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('vi-VN', options);
};

  
  // Định dạng tiền tệ
  export const formatCurrency = (value) => {
    const numericValue = parseFloat(value.replace(/\./g, '').replace(',', '.'));
    
    if (numericValue >= 1000000000) { 
      return (numericValue / 1000000000).toFixed(0) + " tỷ";
    } else if (numericValue >= 1000000) {
      return (numericValue / 1000000).toFixed(0) + " triệu";
    } else if (numericValue >= 1000) {
      return (numericValue / 1000).toFixed(0) + " ngàn";
    } else {
      return numericValue.toString();
    }
  };
  
  // Kiểm tra bài đăng hết hạn
  export const isExpired = (expireDate) => {
    const currentDate = new Date();
    const postExpireDate = new Date(expireDate);
    return postExpireDate < currentDate;
  };
  
  export const renderPostLabel = (post) => {
    if (isExpired(post.expireDate)) {
      return (
        <div className="post-label expired">
          <i className="fa fa-exclamation-circle"></i> Tin đã hết hạn
        </div>
      );
    }
    switch (post.posttype) {
      case "vip2":
        return (
          <div className="post-label vip2">
            <i className="fa fa-crown"></i> Tin Vip Cao Cấp
          </div>
        );
      case "vip1":
        return (
          <div className="post-label vip1">
            <i className="fa fa-star"></i> Tin Vip Nổi Bật
          </div>
        );
      default:
        return (
          <div className="post-label default">
            <i className="fa fa-circle"></i> Tin thường
          </div>
        );
    }
  };
  
