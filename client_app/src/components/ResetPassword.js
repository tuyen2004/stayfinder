import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/ResetPassword.css";

const ResetPassword = () => {
  const { token } = useParams(); // Lấy token từ URL
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu mật khẩu mới và mật khẩu nhập lại không khớp
    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu mới và mật khẩu nhập lại không khớp.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword, confirmPassword }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Mật khẩu đã được cập nhật!");
        setTimeout(() => navigate("/dang-nhap"), 3000);
      } else {
        setMessage(data.message || "Không thể đặt lại mật khẩu.");
      }
    } catch (err) {
      setMessage("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="reset-password-container">
      <form onSubmit={handleSubmit} className="reset-password-form">
        <h2>ĐẶT LẠI MẬT KHẨU</h2>
        <h4>Đặt lại mật khẩu mới cho tài khoản.</h4>
        <label className="reset-password-label">Nhập mật khẩu mới*</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Mật khẩu mới"
          required
          className="reset-password-input"
        />
        <label className="reset-password-label">Nhập lại mật khẩu mới*</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Nhập lại mật khẩu"
          required
          className="reset-password-input"
        />
        <button type="submit" className="reset-password-button">
          Cập nhật mật khẩu
        </button>
        {message && <p className="reset-password-message">{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
