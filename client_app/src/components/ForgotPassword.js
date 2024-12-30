import React, { useState } from "react";
import "../css/ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage(
          data.message || "Đã gửi liên kết đặt lại mật khẩu đến email của bạn."
        );
        setIsEmailSent(true); // Đánh dấu email đã được gửi
        
        // Reload trang sau 3 giây
        setTimeout(() => {
          window.location.reload();
        }, 15000);
      } else {
        setMessage(data.message || "Không thể gửi liên kết đặt lại mật khẩu.");
        setIsEmailSent(false); // Email chưa gửi thành công
      }
    } catch (err) {
      setMessage("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      setIsEmailSent(false);
    }
  };
  
  return (
    <div className="forgot-password-container">
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <h2>QUÊN MẬT KHẨU</h2>
        <label className="forgot-password-label">Nhập email của bạn:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Nhập email của bạn"
          required
          className="forgot-password-input"
        />
        <button type="submit" className="forgot-password-button">
          Gửi email
        </button>
        {message && <p className="forgot-password-message">{message}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
