import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AxiosInstance from "../../../lib/Axiosintance";
import { useParams } from "react-router-dom";
import OpenStreetMap from "../OpenStreetMap";
function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState({
    media: [], // Dữ liệu media sẽ chứa các video và hình ảnh
    image: [], // Danh sách hình ảnh
    video: [], // Danh sách video
  });
  const formatCurrency = (value) => {
    // Kiểm tra nếu value không phải là chuỗi, trả về giá trị mặc định
    if (typeof value !== "string") {
      return "0"; // Hoặc một giá trị khác mà bạn muốn
    }
    // Chuyển đổi chuỗi giá trị thành số
    const numericValue = parseFloat(value.replace(/\./g, "").replace(",", "."));

    if (isNaN(numericValue)) {
      // Kiểm tra nếu numericValue không phải là số
      return "0"; // Hoặc một giá trị khác mà bạn muốn
    }

    if (numericValue >= 1000000000) {
      // Nếu số lớn hơn hoặc bằng 1 tỷ
      return (numericValue / 1000000000).toFixed(0) + " tỷ"; // Định dạng tỷ
    } else if (numericValue >= 1000000) {
      // Nếu số lớn hơn hoặc bằng 1 triệu
      return (numericValue / 1000000).toFixed(0) + " triệu"; // Định dạng triệu
    } else if (numericValue >= 1000) {
      // Nếu số lớn hơn hoặc bằng 1 ngàn
      return (numericValue / 1000).toFixed(0) + " ngàn"; // Định dạng ngàn
    } else {
      return numericValue.toString(); // Nếu số nhỏ hơn 1000, trả về như một chuỗi
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const result = await AxiosInstance().get(`/chi-tiet-bai-dang/${id}`);
        setPost(result);
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
    <div className="post-detail-container">
      <div className="post-right-container">
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
              <div className="big-price-body">
                {formatCurrency(post.price)}/tháng
              </div>
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
                  <div className="number-price">
                    {formatCurrency(post.price)}/tháng
                  </div>
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
            <div className="viewed-news-post">
              <div className="viewed-news-post-img">
                <img src="/images/anhbd.webp" alt="" />
              </div>
              <div className="viewed-news-post-content">
                <div className="viewed-news-post-title">
                  Nhà lầu 2 tầng ba xe,có đầy đủ nội thất, 2 phòng ngủ, 2 phòng
                  iyfkftgfuf6
                </div>
                <div className="viewed-news-post-center">
                  <div className="viewed-news-post-price">10 triệu</div>
                  <div className="viewed-news-post-acreage">20 m²</div>
                </div>
                <div className="viewed-news-post-address">
                  Hóc Môn, Hồ Chí Minh
                </div>
                <div className="viewed-news-post-footer">
                  <div className="viewed-news-post-date">Hôm Nay</div>
                  <div className="viewed-news-post-love">
                    <i class="fa-regular fa-heart"></i>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div className="user-post">
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
            <div className="user-information-post-chat">
              <i class="bi bi-chat"></i>
              <Link to></Link>
              <div className="user-information-post-chat-title">
                Nhắn Tin {post.userId}
              </div>
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
      </div>
    </div>
  );
}

export default PostDetail;
