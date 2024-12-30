import { useState } from "react";
import { Link } from "react-router-dom";
import "../../../css/Changepassword.css";
import Menu from "./Menu";

export default function Changepassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (newPassword !== confirmNewPassword) {
      setMessage("Mật khẩu mới không khớp.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Bạn cần đăng nhập để thay đổi mật khẩu.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8000/api/auth/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Mật khẩu đã được thay đổi thành công.");
        window.location.reload();
      } else {
        setMessage(data.message || "Đã xảy ra lỗi.");
      }
    } catch (error) {
      setMessage("Lỗi máy chủ, vui lòng thử lại sau.");
    }
  };

  return (
    <div className="listnewform">
      <aside>
        <Menu />
      </aside>

      <div className="password-change-container">
        <h2>ĐỔI MẬT KHẨU</h2>
        <div className="form-group">
          <label>Mật khẩu hiện tại</label>
          <input
            type="password"
            placeholder="Mật khẩu hiện tại"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Mật khẩu mới</label>
          <input
            type="password"
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Nhập lại mật khẩu mới</label>
          <input
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </div>
        <div className="form-text">
          Mật khẩu tối thiểu 8 ký tự <br />
          Chứa ít nhất 1 ký tự viết hoa <br />
          Chứa ít nhất 1 ký tự đặc biệt
        </div>
        <button className="submit-button" onClick={handleSubmit}>
          Thay đổi
        </button>
        {message && <div className="message">{message}</div>}
        <Link to="/dat-lai-mat-khau">
          <div className="forgot-password">Quên mật khẩu?</div>
        </Link>
      </div>
    </div>
  );
}
