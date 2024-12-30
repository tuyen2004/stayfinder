import { Link, useNavigate } from "react-router-dom";
import "../css/Register.css";
import React, { useState } from "react";
import SignUpGoogle from "./Google/SignUpGoogle";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        localStorage.setItem("username", formData.username); // Lưu tên người dùng vào localStorage
        navigate("/dang-nhap");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.");
    }
  };

  return (
    <div className="login-container">
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
          <div style={{ paddingTop: "159px" }} className="logo-container">
            <Link to={"/"}>
              <img
                className="logopro"
                src="/images/logo-removebg-preview.png"
                alt=""
              />
            </Link>
          </div>
          <div className="form">
            <div className="form_login">Đăng ký</div>
            <div className="form-loginpro">
              Tạo một tài khoản để khám phá những ngôi nhà tuyệt vời của chúng
              tôi
            </div>
            <div className="form-page">
              <div className="segmented">
                <Link to={"/dang-nhap"} className="segmented-btn">
                  Đăng nhập
                </Link>
                <Link to={"/dang-ky"} className="segmented-btn background-btn">
                  Đăng ký
                </Link>
              </div>
              <div className="field padding-field">
                <input
                  placeholder="Tên người dùng"
                  className="input-textbox"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field top-field">
                <input
                  placeholder="Email"
                  className="input-textbox"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field top-field">
                <input
                  placeholder="Mật khẩu"
                  className="input-textbox"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field top-field">
                <input
                  placeholder="Số điện thoại"
                  className="input-textbox"
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="or-pass">
                Bằng cách tạo tài khoản, bạn đồng ý với Điều kiện sử dụng và
                Chính sách quyền riêng tư của chúng tôi.
              </div>
              <SignUpGoogle/>
              <button className="btn" type="submit">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Register;
