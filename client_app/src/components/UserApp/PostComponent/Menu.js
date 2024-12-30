import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../css/PostNew.css";

const getAvatarUrl = (avatar, username) => {
  if (avatar) {
    return avatar.startsWith("http")
      ? avatar
      : `http://localhost:8000/${avatar
          .replace(/^public[\\/]/, "")
          .replace(/\\/g, "/")}`;
  }
  const firstLetter = username ? username.charAt(0).toUpperCase() : "U";
  const defaultColor = "#999999"; // Màu mặc định
  return {
    firstLetter,
    color: defaultColor,
  };
};
  
export default function Menu() {
  const [avatar, setAvatar] = useState(null);
  const [username, setUsername] = useState(null);
  const [_id, set_id] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:8000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            localStorage.removeItem("token");
            return;
          }
          return res.json();
        })
        .then((data) => {
          if (data && data.username) {
            setUsername(data.username);
            setAvatar(data.avatar || null);
            set_id(data._id);
          }
        })
        .catch((error) =>
          console.error("Lỗi khi fetch thông tin người dùng:", error)
        );
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsername(null);
    setAvatar(null);
    set_id(null);
    localStorage.removeItem("userToken");
    localStorage.removeItem("status");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/");
    window.location.reload();
  };

  const avatarData = getAvatarUrl(avatar, username);

  return (
    <div className="listnewform">
      <aside className="sidebar-tuyen">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {typeof avatarData === "string" ? (
                <img src={avatarData} alt="avatar" />
              ) : (
                <div
                  className="span-color"
                  style={{
                    backgroundColor: avatarData.color,
                  }}
                >
                  {avatarData.firstLetter}
                </div>
              )}
            </div>
            <div className="profile-name">{username}</div>
          </div>
          <div className="profile-content">
            <div className="profile-stats">
              <div className="profile-stat">
                <span>Số lần được đăng:</span>
                <span>15 tin</span>
              </div>
              <div className="profile-stat">
                <span>Loại tin đăng:</span>
                <span>Tin nổi bật</span>
              </div>
              <div className="profile-stat">
                <span>Tin đã đăng:</span>
                <span>5 / 15 tin</span>
              </div>
            </div>

            <div className="account-info">
              <div className="account-code">
                <div className="account-code-title">
                  <span>Mã tài khoản</span>
                </div>
                <div className="account-code-code">
                  <span>{_id ? _id.slice(0, 5) : ""}</span>
                  <button className="copy-button">
                    <i
                      style={{ color: "#000000", fontSize: "20PX" }}
                      className="fa-regular fa-copy"
                    ></i>
                  </button>
                </div>
              </div>
            </div>

            <button className="buy-button">
              Mua Tin{" "}
              <i
                className="fa-solid fa-wallet"
                style={{ color: "#ffffff" }}
              ></i>
            </button>
          </div>
        </div>
        <nav className="sidebar-menu">
          <ul>
            <li>
              <i className="fa-solid fa-list"></i>
              <Link to="/quan-li-tin-dang">Quản lý tin đăng</Link>
            </li>
            <li>
              <i className="fa-solid fa-pen-to-square"></i>
              <Link to="/dang-tin">Đăng tin</Link>
            </li>
            <li>
              <i className="fa-solid fa-calendar-days"></i>
              <Link to="/transaction-history">Lịch sử giao dịch</Link>
            </li>
            <li>
              <i className="fa-solid fa-user"></i>
              <Link to="/tai-khoan">Thông tin cá nhân</Link>
            </li>
            <li>
              <i className="fa-solid fa-lock"></i>
              <Link to="/doi-mat-khau">Đổi mật khẩu</Link>
            </li>
            <li>
              <i className="fa-solid fa-bell"></i>
              <Link to="/notifications">Thông báo</Link>
            </li>
            <li>
              <i className="fa-solid fa-suitcase"></i>
              <Link to="/pricing">Bảng giá dịch vụ</Link>
            </li>
            <li>
              <i className="fa-solid fa-circle-question"></i>
              <Link to="/support">Liên hệ & trợ giúp</Link>
            </li>
            `
            <li>
              <i className="fa-solid fa-right-from-bracket"></i>
              <button className="logout-btn" onClick={handleLogout}>
                Đăng xuất
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
}
