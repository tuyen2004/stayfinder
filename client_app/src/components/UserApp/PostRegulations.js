import React from "react";

function PostRegulations() {
  return (
    <div className="container">
      <div className="PostRegulations-container">
        <div className="posregulations-title">Quy định đăng tin</div>
        <div className="general-provisions">
          <div className="general-provisions-title">A. QUY ĐỊNH CHUNG:</div>
          <ul className="general-provisions-content">
            <li>
              Không sử dụng bất kỳ thiết bị, phần mềm, quy trình, phương tiện để
              can thiệp hay cố gắng can thiệp vào hoạt động đúng đắn trên
              StayFinder.
            </li>
            <li>
              Không được đăng ký tài khoản và khai báo những thông tin giả mạo;
              nick gây hiểu nhầm với những thành viên khác.
            </li>
            <li>
              Không được phép đăng tin liên quan đến các vấn đề mà Pháp luật
              Việt Nam không cho phép.
            </li>
            <li>
              Không được đăng những bài viết, thông tin có nội dung vi phạm pháp
              luật; đả kích, bôi nhọ, chỉ trích hay bàn luận về chính trị, tôn
              giáo, phản động, kỳ thị văn hóa, dân tộc, cũng như vi phạm khác
              liên quan đến thuần phong mỹ tục của dân tộc Việt Nam.
            </li>
            <li>
              Không được xâm phạm quyền lợi, uy tín, đời tư của các cá nhân hay
              thành viên khác, không được dùng ngôn từ tục tĩu, thóa mạ trong
              các thông tin tham gia.
            </li>
            <li>
              Không được lợi dụng website để tuyên truyền, đề xướng, lôi kéo với
              những nội dung không lành mạnh.
            </li>
            <li>Phải dùng ngôn từ trong sáng, rõ ràng, đúng chính tả.</li>
          </ul>
          <div className="regulations-on-posting">
            <div className="regulations-on-posting-title">
              B. QUY ĐỊNH VỀ TIN ĐĂNG:
            </div>
            <div className="regulations-on-posting-time-title">
              QUY ĐỊNH VỀ THỜI GIAN HIỂN THỊ TIN ĐĂNG:
            </div>
            <ul className="regulations-on-posting-time-content">
              <li>
                Tin VIP1 sẽ hiển thị trong 7 ngày kể từ khi đăng tải. Sau 7 ngày,
                tin sẽ được ẩn cho đến khi được gia hạn hoặc được người dùng chọn
                tiếp tục đăng.
              </li>
              <li>
                Tin VIP2 sẽ hiển thị trong 14 ngày, sau thời gian này tin sẽ tự động
                hết hạn hoặc cần gia hạn để tiếp tục hiển thị.
              </li>
              <li>
                Các tin thường sẽ được đăng ngay lập tức nhưng không có thời gian
                hiển thị cố định. Tin sẽ được ẩn khi có người thuê và có thể hiển
                thị lại khi tin chưa hết hạn.
              </li>
            </ul>
            <div className="regulations-on-posting-type-title">
              QUY ĐỊNH VỀ LOẠI TIN ĐĂNG:
            </div>
            <ul className="regulations-on-posting-type-content">
              <li>
                Tin đăng có thể là loại cho thuê phòng trọ, cho thuê căn hộ, cho thuê
                nhà ở, hoặc tìm người ở ghép.
              </li>
              <li>
                Tin đăng phải bao gồm đầy đủ thông tin về căn hộ, phòng trọ, nhà ở,
                như diện tích, số phòng ngủ, phòng tắm, và các tiện ích đi kèm.
              </li>
              <li>
                Tin đăng có thể bao gồm hình ảnh và video của tài sản, nhưng tổng số
                file không được vượt quá 5, bao gồm tối đa 4 hình ảnh và 1 video.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostRegulations;
