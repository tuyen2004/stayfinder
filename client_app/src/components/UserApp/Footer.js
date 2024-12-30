import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer style={{ backgroundColor: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <img
            width="160px"
            height="160px"
            style={{ marginTop: "-20px" }}
            src="/images/logo-removebg-preview.png"
            alt=""
          />

          <div className="Footer-info">
            <i
              className="fa-solid fa-location-dot"
              style={{ marginRight: "10px" }}
            ></i>
            <p>Công Viên Phần Mền Quang Trung Quận 12</p>
          </div>

          <div className="Footer-info">
            <i
              className="fa-solid fa-phone"
              style={{ marginRight: "10px" }}
            ></i>
            <p>0123456789</p>
          </div>

          <div className="Footer-info">
            <i
              className="fa-solid fa-envelope"
              style={{ marginRight: "10px" }}
            ></i>
            <p>trotot.com.vn@gmail.com</p>
          </div>
        </div>

        <div className="Footer-vct">
          <h3>VỀ CHÚNG TÔI</h3>
          <Link>Giới thiệu</Link>
          <Link>Quy chế hoạt động</Link>
          <Link>Chính sách bảo mật</Link>
          <Link>Quy định sử dụng</Link>
          <Link>Liên hệ</Link>
        </div>

        <div className="Footer-vct">
          <h3>THÔNG TIN</h3>
          <Link>Bảng giá dịch vụ</Link>
          <Link>Hướng dẫn đăng tin</Link>
          <Link>Quy định đăng tin</Link>
          <Link>Cơ chế giải quyết tranh chấp</Link>
          <Link>Tin tức</Link>
        </div>

        <div>
          <h3>PHƯƠNG THỨC THANH TOÁN</h3>
          <img width="60px" height="60px" src="/images/logomomo.webp" alt="" />
          <img
            style={{ objectFit: "cover" }}
            width="95px"
            height="60px"
            src="/images/zalopay.png"
            alt=""
          />
        </div>
      </div>

      <div>
        <h2>BẢN ĐỒ</h2>
        <hr />
        <iframe
          title="Google Maps Embed"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4436614899205!2d106.6252534745119!3d10.85382108929969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752bee0b0ef9e5%3A0x5b4da59e47aa97a8!2zQ8O0bmcgVmnDqm4gUGjhuqduIE3hu4FtIFF1YW5nIFRydW5n!5e0!3m2!1svi!2s!4v1684984988242!5m2!1svi!2s"
          width="100%"
          height="450"
          style={{ border: "0" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          frameBorder="0"
        ></iframe>
      </div>

      <div style={{ textAlign: "center", opacity: "60%", margin: "0px" }}>
        <p>Copyright © 2024 Team DATN (Vương, Thái, Phú, Tuyến).</p>
      </div>
    </footer>
  );
}

export default Footer;
