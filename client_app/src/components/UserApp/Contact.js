import "../../css/Contact.css";
import React from "react";

function Contact() {
  return (
    <div classNameName="bodybtn">
      <div className="containerpro">
        <div className="contac1">Liên hệ trực tuyến</div>
        <div className="form-info">
          <div className="form-section">
            <form className="btn-formpt">
              <label className="btn-labelpt" for="name">
                Tên của bạn *
              </label>
              <input className="btn-inputlpt" type="text" id="name" />

              <label className="btn-labelpt" for="email">
                Email *
              </label>
              <input className="btn-inputlpt" type="email" id="email" />

              <label className="btn-labelpt" for="phone">
                Điện thoại
              </label>
              <input className="btn-inputlpt" type="tel" id="phone" />

              <label className="btn-labelpt" for="message">
                Nội dung liên hệ *
              </label>
              <textarea className="btn-textareapt" id="message"></textarea>

              <button className="btn-buttonpt" type="submit">
                Gửi liên hệ
              </button>
            </form>
          </div>
          <div className="info-section">
            <div className="contac2">THÔNG TIN LIÊN HỆ</div>
            <p style={{ paddingTop: "10px" }} className="pro">
              Chúng tôi biết bạn có rất nhiều sự lựa chọn. Nhưng cảm ơn vì đã
              chọn StayFinder.com
            </p>
            <p className="pro">
              <b>Điện thoại:</b> 0816.169.506
            </p>
            <p className="pro">
              <b>Email:</b> stayfinder.com.vn@gmail.com
            </p>
            <p className="pro">
              <b>Zalo:</b> 0816.169.506
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
