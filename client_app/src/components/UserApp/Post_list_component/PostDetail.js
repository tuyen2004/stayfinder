import React, { useEffect, useState } from "react";
import AxiosInstance from "../../../lib/Axiosintance";
import { useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import ChatBubble from "../ChatBubble";
import {  formatCurrency } from "./utils";
import "../../../css/PostDetail.css";
import OpenStreetMap from "../OpenStreetMap";
const socket = io("http://localhost:8000");

function PostDetail() {
  const { id } = useParams();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [toastClass, setToastClass] = useState("");
  const [messageContent, setMessageContent] = useState(""); // Để lưu trữ nội dung tin nhắn
  const [showMessageInput, setShowMessageInput] = useState(false);
  const [messageInputClass, setMessageInputClass] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoginRequired, setIsLoginRequired] = useState(false);
  const [loginToastClass, setLoginToastClass] = useState("");
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [post, setPost] = useState({
    media: [], // Dữ liệu media sẽ chứa các video và hình ảnh
    image: [], // Danh sách hình ảnh
    video: [], // Danh sách video
  });

  const handleStartChat = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Nếu chưa đăng nhập, hiển thị thông báo yêu cầu đăng nhập
      setIsLoginRequired(true);
      setLoginToastClass("show-toast");
      setTimeout(() => {
        setIsLoginRequired(false);
        setLoginToastClass("");
      }, 3500); // Thời gian hiển thị toast
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/create-chat",
        {
          userId: post.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const chatId = response.data.chatId;
      console.log("Chat ID Created:", chatId);

      setSelectedConversation({ id_chat: chatId, userId: post.userId });
      setIsOpen(true);
      socket.emit("joinChat", chatId);

      setShowMessageInput(true);
      setMessageInputClass("");
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };
  useEffect(() => {
    if (post && post.title) {
      console.log("Post title updated:", post.title);
    }
  }, [post]); // Chạy khi post thay đổi


  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Ngăn chặn hành động mặc định của phím Enter
      handleSendMessage(); // Gửi tin nhắn
    }
  };


  const handleSendMessage = async () => {
    console.log("Sending message:", messageContent);
    console.log("Post title:", post.title);
    console.log("Post img:", post.image);

    if (!post.title || post.title.trim() === "") {
      console.error("Post title is missing or empty!");
      return; // Nếu không có title, không gửi tin nhắn
    }
    try {
      const token = localStorage.getItem("token");

      // Gửi tin nhắn
      const response = await axios.post(
        "http://localhost:8000/api/messages",
        {
          id_chat: selectedConversation.id_chat,
          id_receiver: post.userId,
          message_content: messageContent,
          post_title: post.title,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Message sent successfully:", response.data);

      setShowMessageInput(false);

      setMessageContent("");

      // Hiển thị thông báo gửi thành công
      setIsMessageSent(true);

      // Bật spinner
      setTimeout(() => {
        setIsMessageSent(false);
        setToastClass("toast-fade-out");
        window.location.reload();
      }, 2500);

      setTimeout(() => {
        setIsSending(true);
        setTimeout(() => {
          setIsSending(false);
        }, 2000);
      }, 2500);

      setTimeout(() => {
        setToastClass("toast-fade-out");
      }, 2500);

      setTimeout(() => {
        setIsMessageSent(false);
        setToastClass("");
      }, 3500);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleCloseMessageInput = () => {
    setMessageInputClass("slide-up");

    setTimeout(() => {
      setShowMessageInput(false);
      setMessageInputClass("");
    }, 500);
  };
  const fetchRelatedPosts = async (provinceName) => {
    try {
      const result = await AxiosInstance().get(`/posts-by-province?provinceName=${provinceName}`);
      setRelatedPosts(result); // Cập nhật danh sách bài viết cùng tỉnh
    } catch (error) {
      console.error("Lỗi khi lấy bài viết cùng tỉnh:", error);
    }
  };
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const result = await AxiosInstance().get(`/chi-tiet-bai-dang/${id}`);
        setPost(result);
        fetchRelatedPosts(result.province.name);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
      }
    };

    fetchProduct();
  }, [id]);
  
  // Hàm định dạng ngày
  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };
  const renderPostType = (type) => {
    switch (type) {
      case "thuong":
        return "Tin Thường";
      case "vip1":
        return "Tin Vip 1";
      case "vip2":
        return "Tin Vip 2";
      default:
        return "Loại tin không xác định";
    }
  };
  const [currentIndex, setCurrentIndex] = useState(0);
  //chuyển ảnh slide
  useEffect(() => {
    if (post.video.length > 0) {
      setCurrentIndex(0); // Đặt active slide cho video nếu có
    } else if (post.image.length > 0) {
      setCurrentIndex(0); // Đặt active slide cho ảnh nếu không có video
    }
  }, [post]);
  // Xử lý khi người dùng nhấn nút "next"
  const handleNext = () => {
    if (currentIndex < post.video.length + post.image.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Quay lại slide đầu tiên
    }
  };

  // Xử lý khi người dùng nhấn nút "prev"
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(post.video.length + post.image.length - 1); // Quay lại slide cuối
    }
  };
  // Tạo các slide video và ảnh
  const slides = [
    ...post.video.map((vid) => ({ type: "video", content: vid })),
    ...post.image.map((img) => ({ type: "image", content: img })),
  ];



  return (
    <div className="container post-detail-container">
      {showMessageInput && <div className="overlay overlay-visible" />}
      {isSending && (
        <div className="overlay overlay-visible">
          <div className="spinner"></div>
        </div>
      )}
      <div className="">
      <div className="carousel-wrapper">
          <div id="slider" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`carousel-item ${
                    index === currentIndex ? "active" : ""
                  }`}
                >
                  {slide.type === "video" ? (
                    <video controls width="100%" height="auto">
                      <source
                        src={`http://localhost:8000/video/${slide.content}`}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={`http://localhost:8000/img/${slide.content}`}
                      alt={`Slide ${index}`}
                      className="d-block w-100"
                    />
                  )}
                </div>
              ))}
            </div>

            <button
              className="carousel-control-prev"
              type="button"
              onClick={handlePrev}
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">
                <i class="fa fa-arrow-left"></i>
              </span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              onClick={handleNext}
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">
                <i class="fa fa-arrow-right"></i>
              </span>
            </button>
          </div>
        </div>
        <div className="body-information">
          <div class="title-content-post">{post.title}</div>
          <div class="address-post">{post.address}</div>
          <div className="big-information">
            <div className="big-price">
              <div className="big-price-head">Mức giá</div>
              <div className="big-price-body">{post.price}/tháng</div>
            </div>
            <div className="big-acreage">
              <div className="big-acreage-head">Diện tích</div>
              <div className="big-acreage-body">{post.area} m²</div>
            </div>
            <div className="big-bedrrom">
              <div className="big-bedrrom-head">Phòng ngủ</div>
              <div className="big-bedrrom-body">{post.bedroom} PN</div>
            </div>
          </div>
          <div className="description-information">
            <div className="description-information-title">Thông tin mô tả</div>
            <div
              className="description-information-content"
              dangerouslySetInnerHTML={{ __html: post.description }}
            ></div>
          </div>
          <div className="characteristic">
            <div className="characteristic-title">Đặc điểm bất động sản</div>
            <div className="post-type-small">
              Loại tin đăng: {post.rentaltype}
            </div>
            <div className="information-container">
              <div className="column-post">
                <div className="small-acreage">
                  <div className="acreage-icon-group">
                    <div className="acreage-icon">
                      <img src="../images/acreage.png" alt="" />
                    </div>
                    <div className="acreage-icon-name">Diện tích</div>
                  </div>
                  <div className="number-acreage">{post.area} m²</div>
                </div>

                <div className="small-price">
                  <div className="price-icon-group">
                    <div className="price-icon">
                      <img src="../images/price-icon.png" alt="" />
                    </div>
                    <div className="price-icon-name">Mức giá</div>
                  </div>
                  <div className="number-price">{post.price}/tháng</div>
                </div>
                <div className="small-bedroom">
                  <div className="bedroom-icon-group">
                    <div className="bedroom-icon">
                      <img src="../images/bedroom-icon.png" alt="" />
                    </div>
                    <div className="bedroom-icon-name">Số phòng ngủ</div>
                  </div>
                  <div className="number-bedroom">1 phòng</div>
                </div>
              </div>

              <div className="column-post">
                <div className="small-bathroom">
                  <div className="bathroom-icon-group">
                    <div className="bathroom-icon">
                      <img src="../images/bathroom-icon.png" alt="" />
                    </div>
                    <div className="bathroom-icon-name">Số phòng vệ sinh</div>
                  </div>
                  <div className="number-bathroom">{post.bathroom} phòng</div>
                </div>

                <div className="small-floor">
                  <div className="bathroom-icon-group">
                    <div className="floor-icon">
                      <img src="../images/floor-icon.png" alt="" />
                    </div>
                    <div className="floor-icon-name">Số tầng</div>
                  </div>
                  <div className="number-floor">{post.floor} tầng</div>
                </div>

                <div className="small-attic">
                  <div className="attic-icon-group">
                    <div className="attic-icon">
                      <img src="../images/attic-icon.png" alt="" />
                    </div>
                    <div className="attic-icon-name">Gác lửng</div>
                  </div>
                  <div className="number-attic">
                    {post.attic ? "Có" : "Không"}
                  </div>
                </div>
              </div>
            </div>

            <div className="map-post">
            <div className="map-post-title">Xem trên bản đồ</div>
            <OpenStreetMap address={post.address} />
            </div>
            <div className="all-information-post">
              <div className="date-post">
                <div className="date-post-title">Ngày đăng</div>
                <div className="date-post-number">
                  {formatDate(post.createdAt)}
                </div>
              </div>
              <div className="expiration-date">
                <div className="expiration-date-title">Ngày hết hạn</div>
                <div className="expiration-date-number">
                  {post.expireDate
                    ? formatDate(post.expireDate)
                    : "Không giới hạn thời gian"}
                </div>
              </div>
              <div className="news-type-post">
                <div className="news-type-post-title">Loại tin</div>
                <div className="news-type-post-content">
                  {renderPostType(post.posttype)}
                </div>
              </div>
              <div className="news-code-post">
                <div className="news-code-post-title">Mã Tin</div>
                <div className="news-code-post-number">
                  {post && post._id
                    ? post._id.substring(0, 8).toUpperCase()
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="viewed-news">
          <div className="viewed-news-title">Tin dành cho bạn</div>
          <div className="viewed-news-list-post">
          {relatedPosts.map((relatedPost) => (
            <div key={relatedPost._id} className="viewed-news-post">
              <div className="viewed-news-post-img">
                <img src={`http://localhost:8000/img/${relatedPost.image[0]}`} alt={relatedPost.title} />
              </div>
              <div className="viewed-news-post-content">
                <div className="viewed-news-post-title">{relatedPost.title}</div>
                <div className="viewed-news-post-center">
                  <div className="viewed-news-post-price">{formatCurrency(relatedPost.price)}</div>
                  <div className="viewed-news-post-acreage">{relatedPost.area} m²</div>
                </div>
                <div className="viewed-news-post-address">{relatedPost.address}</div>
                <div className="viewed-news-post-footer">
                  <div className="viewed-news-post-date">Hôm nay</div>
                  <div className="viewed-news-post-love">
                    <i className="fa-regular fa-heart"></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
      <div height="50%" className="col-4 user-post">
        <div className="user-information-post">
          <div className="user-information-post-img">
            <img src="/images/anhbd.webp" alt="" />
          </div>
          <div className="user-information-post-contact">
            <div className="user-information-post-phone">
              <i class="bi bi-telephone"></i>

              <div className="user-information-post-phone-number">
                {post.phone}
              </div>

            </div>
            <div
              className="user-information-post-chat"
              onClick={handleStartChat}
            >
              <i class="bi bi-chat"></i>

              <div className="user-information-post-chat-title">
                Nhắn Tin {/* {post.userId} */}
              </div>

              {isMessageSent && (
                <div className={`toast ${toastClass}`}>
                  Gửi tin nhắn thành công!
                </div>
              )}
              {isLoginRequired && (
                <div className={`toast ${loginToastClass}`}>
                  Vui lòng đăng nhập để gửi tin nhắn!
                </div>
              )}
              {showMessageInput && (
                <div className={`message-input-wrapper ${messageInputClass}`}>
                  <a className="close-btn" onClick={handleCloseMessageInput}>
                    <i style={{ width: "12px" }} className="fas fa-times"></i>
                  </a>
                  <div style={{ paddingBottom: "15px" }}>{post.title}</div>
                  <div>
                    <input
                      type="text"
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Nhập tin nhắn..."
                    />
                    <button onClick={handleSendMessage}>Gửi</button>
                  </div>
                </div>
              )}
            </div>
            <div className="user-information-post-zalo">
              <img src="/images/zalo-icon.jpg" alt="" />
              <div className="user-information-post-zalo-nam">
                {post.username}
              </div>
            </div>
          </div>
        </div>
        <div className="suggest-commune-post">
          <div className="suggest-commune-post-title">
            Cho thuê phòng trọ tại Hóc Môn
          </div>
          <ul className="suggest-commune-post-name">
            <li>
              <a href="/xa">Xã A</a>
            </li>
            <li>
              <a href="/xca">Xã Châu Á</a>
            </li>
            <li>
              <a href="/xcau">Xã Châu Âu</a>
            </li>
            <li>
              <a href="xcp">Xã Châu Pha</a>
            </li>
            <li>
              <a href="/xacphi">Xã Châu Phi</a>
            </li>
            <li>
              <a href="/xcm">Xã Châu Mỹ</a>
            </li>
            <li>
              <a href="/xct">Xã Cần Thơ</a>
            </li>
            <li>
              <a href="/xmytho">Xã Mỹ Tho</a>
            </li>
            <div className="suggest-commune-post-continue">
              <a href="/xemthem">Xem thêm</a>
            </div>
          </ul>
        </div>
        {isOpen && selectedConversation && (
          <ChatBubble
            id_chat={selectedConversation.id_chat}
            userId={selectedConversation.userId}
            onClose={() => setIsOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

export default PostDetail;
