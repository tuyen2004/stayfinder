import "../css/Login.css";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import LoginGoogle from "./Google/LoginGoogle";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // Thêm `useLocation` để nhận thông báo từ `state`
  const message = location.state?.message; // Lấy thông báo từ `state`

  useEffect(() => {
    if (message) {
      toast.success(message, { position: "top-right" });
    }

    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (token && userId) {
        checkAccountStatus(userId, token);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [message]);

  const checkAccountStatus = async (userId, token) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/auth/user-status/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok && data.status === 2) {
        toast.error("Tài khoản của bạn đã bị khóa!", {
          position: "top-right",
          style: { backgroundColor: "#dc3545", color: "white" },
        });
        handleLogout();
      }
    } catch (error) {
      console.error("Lỗi kiểm tra trạng thái tài khoản:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("status");

    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.status === 2) {
          toast.error(
            "Tài khoản của bạn đã bị khóa! Vui lòng liên hệ quản trị viên!",
            { position: "top-right" }
          );
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("role", data.role);
        localStorage.setItem("status", data.status);

        const userId = data.userId;
        await fetch(`http://localhost:8000/api/auth/update-status/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify({ status: 1 }),
        });

        navigate("/");
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      setErrorMessage("Đã xảy ra lỗi trong quá trình đăng nhập.");
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <form className="login" onSubmit={handleSubmit}>
        <div className="column column--bg">
          <div className="headerpro">
            <div className="logo-pro">
              <Link to={"/"}>
                <img className="img-header" src="/images/logo111.png" alt="" />
              </Link>
            </div>
          </div>
          <img
            className="bg-img"
            src="https://codetheworld.io/wp-content/uploads/2024/03/tokyo.jpg"
            alt=""
          />
        </div>
        <div className="column">
          <div className="logo-container">
            <Link to={"/"}>
              <img
                src="/images/logo-removebg-preview.png"
                alt="Logo"
                className="logopro"
              />
            </Link>
          </div>

          <div className="form-btnn">
            <div className="form-login">Đăng nhập</div>
            <div className="form-loginpro">
              Nếu bạn đã có một tài khoản hãy đăng nhập ngay bây giờ
            </div>
            <div className="form-page">
              <div className="segmented">
                <Link
                  className="segmented-btn background-btn"
                  aria-selected="true"
                >
                  Đăng nhập
                </Link>
                <Link to={"/dang-ky"} className="segmented-btn">
                  Đăng ký
                </Link>
              </div>

              <div className="field padding-field">
                <input
                  placeholder="Email"
                  className="input-textbox"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="field top-field">
                <input
                  placeholder="Mật khẩu"
                  className="input-textbox"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <i className="bi bi-eye-slash"></i>
                  ) : (
                    <i className="bi bi-eye"></i>
                  )}
                </span>
              </div>
              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}
              <Link to="/dat-lai-mat-khau">
                <div className="or-pass">Quên mật khẩu?</div>
              </Link>

              <LoginGoogle />
              <button className="btn" type="submit">
                Đăng nhập
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
