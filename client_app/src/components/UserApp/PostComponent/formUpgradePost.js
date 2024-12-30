import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Menu from "./Menu";
import { message } from "antd";
import AxiosInstance from "../../../lib/Axiosintance";
import '../../../css/Post.css'
function FormUpgradePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setUpgradePost] = useState({});
  const [upgradeOptions, setUpgradeOptions] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log("ID truyền vào:", id);
        const result = await AxiosInstance().get(`/lay-tin-muon-nang-cap/${id}`);
        console.log("Kết quả từ API:", result);

        if (result) {
          setUpgradePost(result);
          if (result.message === "Đây là gói cao cấp nhất. Không thể nâng cấp thêm.") {
            message.warning(result.message);
            navigate("/quan-li-tin-dang");
          } else if (result.posttype === "vip2") {
            message.warning("Đây là gói cao cấp nhất. Không thể nâng cấp thêm!");
            navigate("/quan-li-tin-dang");
          } else if (result.posttype === "vip1") {
            setUpgradeOptions(["vip2"]);
          } else {
            setUpgradeOptions(["vip1", "vip2"]);
          }
        } else {
          message.error("Không tìm thấy bài đăng.");
        }
      } catch (error) {
        console.error("Chi tiết lỗi:", error.response?.data || error.message);
        message.error("Đã xảy ra lỗi khi xử lý yêu cầu!");
      }
    };

    if (id) fetchPost();
    else console.error("ID không hợp lệ!");
  }, [id, navigate]);

  const handleUpgrade = async (option) => {
    try {
      console.log("Sending upgrade request for post ID:", id, "with option:", option);
      const response = await AxiosInstance().put(`/nang-cap-bai-viet/${id}`, { posttype: option });
      console.log("Upgrade response:", response);
  
      if (response.payUrl) {
        message.success("Tạo yêu cầu nâng cấp thành công. Vui lòng thanh toán!");
        window.open(response.payUrl, "_blank");
      } else {
        message.success("Nâng cấp bài đăng thành công!");
        navigate("/quan-li-tin-dang");
      }
    } catch (error) {
      console.error("Lỗi khi nâng cấp bài đăng:", error.response?.data || error.message);
      message.error("Đã xảy ra lỗi khi nâng cấp bài đăng.");
    }
  };
  
  
  return (
    <div className="listnewform">
    <aside>
      <Menu />
    </aside>
    <div className="form-Upgrade">
      <div className="title-form-Upgrade">Nâng Cấp Tin Đăng</div>
      <form>
        <div className="infor-post-present">
          <div className="title-post">
            <div>Tiêu đề của bài đăng</div>
            <div className="infor-name">{post.title}</div>
          </div>
          <div className="posttype-present">
            <div>Loại tin hiện tại của bạn</div>
            <div>{post.posttype}</div>
          </div>
          <div className="option-posttype">
            <div>Chọn gói nâng cấp</div>
            {upgradeOptions.length > 0 ? (
              <div>
                {upgradeOptions.includes("vip1") && (
                  <button
                    className="upgrade-button"
                    type="button"
                    onClick={() => handleUpgrade("vip1")}
                  >
                    Nâng cấp lên VIP1
                  </button>
                )}
                {upgradeOptions.includes("vip2") && (
                  <button
                    className="upgrade-button"
                    type="button"
                    onClick={() => handleUpgrade("vip2")}
                  >
                    Nâng cấp lên VIP2
                  </button>
                )}
              </div>
            ) : (
              <p>Không có gói nâng cấp khả dụng.</p>
            )}
          </div>
        </div>
      </form>
    </div>
  </div>
  );
}

export default FormUpgradePost;
