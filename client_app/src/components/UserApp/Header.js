import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "antd";

function Header() {
  const [username, setUsername] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  // Hàm tạo avatar ngẫu nhiên theo chữ cái đầu tiên của username
  const generateRandomAvatar = (username) => {
    if (!username) {
      return {
        firstLetter: "U", // Nếu username không có, dùng chữ cái 'U' mặc định
        color: "#999999", // Màu sắc mặc định
      };
    }

    const firstLetter = username.charAt(0).toUpperCase(); // Lấy chữ cái đầu tiên và viết hoa
    // const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Tạo màu ngẫu nhiên
    return {
      firstLetter,
      // color,
    };
  };

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
            // Token không hợp lệ, xóa token và reset state
            localStorage.removeItem("token");
            setUsername(null);
            setAvatar(null);
            setRole(null);
            throw new Error("Không thể xác thực người dùng");
          }
          return res.json();
        })
        .then((data) => {
          if (data) {
            setUsername(data.username);
            setAvatar(data.avatar || null); // Nếu không có avatar, sẽ lấy giá trị null
            setRole(data.role);
          }
        })
        .catch((error) =>
          console.error("Lỗi khi fetch thông tin người dùng:", error)
        );
    }
  }, []);
  const avatarData = avatar
    ? avatar.startsWith("http") // Kiểm tra nếu avatar là URL đầy đủ
      ? avatar // Nếu là URL, sử dụng trực tiếp
      : `http://localhost:8000/${avatar
          .replace(/^public[\\/]/, "")
          .replace(/\\/g, "/")}` // Nếu không, tạo đường dẫn từ server
    : generateRandomAvatar(username); // Tạo avatar ngẫu nhiên từ chữ cái đầu tiên của username nếu không có avatar

  return (
    <header>
      <div className="Header">
        <Link to={"/"}>
          <img
            width="145px"
            height="auto"
            style={{ marginRight: "20px" }}
            src="/images/logo111.png"
            alt="Logo"
          />
        </Link>
        <div className="Header-link">
          <Link to={"/cho-thue-phong-tro"}>Cho thuê phòng trọ</Link>
          <Link to={"/cho-thue-can-ho"}>Cho thuê căn hộ</Link>
          <Link to={"/cho-thue-nha-o"}>Cho thuê nhà ở</Link>
          <Link to={"/tim-nguoi-o-ghep"}>Tìm người ở ghép</Link>
          <Link to={"/tin-tuc"}>Tin Tức</Link>
          <Link to={"/gioi-thieu"}>Về chúng tôi</Link>
        </div>

        <div className="Header-jtf">
          {username ? (
            <div className="header-username-container">
              <div className="avataruser">
                {typeof avatarData === "string" &&
                avatarData.startsWith("http") ? (
                  <Avatar size="small">
                    <img src={avatarData} alt="avatar" />
                  </Avatar>
                ) : (
                  <Avatar
                    style={{
                      backgroundColor: avatarData.color,
                      width: "40px!",
                    }}
                    size="small"
                  >
                    {avatarData.firstLetter}
                  </Avatar>
                )}
              </div>
              <Link to={"/tai-khoan"}>
                <span className="header-username">{username}</span>
              </Link>
              {role === 0 || role === 1 ? (
                <div className="header-admin-tooltip-container">
                  <div className="header-admin-tooltip">
                    <Link to="/admin">Vào admin</Link>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Link className="header-login" to={"/dang-nhap"}>
                <div className="Header-link-login">
                  <div>Đăng nhập</div>
                </div>
              </Link>
              <p
                style={{
                  marginLeft: "5px",
                  marginRight: "5px",
                  marginTop: "6px",
                }}
              >
                |
              </p>
              <Link className="header-login" to={"/dang-ky"}>
                <div className="Header-link-login">
                  <div>Đăng ký</div>
                </div>
              </Link>
            </>
          )}

          <Link className="header-login" to="/dang-tin">
            <div className="Header-link-dangtin">
              <div className="Header-dangtin">Đăng tin</div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
