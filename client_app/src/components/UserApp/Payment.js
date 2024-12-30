import React, { useState, useEffect } from 'react';

function Payment() {
  const [qrCode, setQrCode] = useState(null);

  useEffect(() => {
    // Giả sử bạn nhận được phản hồi từ server và lưu qrcode vào state
    const responseFromServer = {
      qrcode: '00020101021226530010vn.zalopay01061800050203001031810244067552133503438620010A00000072701320006970454011899ZP24311O006201230208QRIBFTTA5204739953037045405300005802VN6304A9BA'
    };

    // Cập nhật mã QR vào state khi nhận được dữ liệu
    setQrCode(responseFromServer.qrcode);
  }, []); // Chạy effect chỉ một lần khi component mount

  return (
    <div>
      <h2>Thanh toán qua ZaloPay</h2>
      {qrCode && (
        <img
          src={`data:image/png;base64,${qrCode}`}
          alt="ZaloPay QR Code"
        />
      )}
    </div>
  );
}

export default Payment;
