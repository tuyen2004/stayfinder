import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AxiosInstance from "../../../lib/Axiosintance";
import { Link } from "react-router-dom";
import { formatDate, formatCurrency, isExpired } from "./utils";
function PostProvince() {
  const [posts, setPosts] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const province = queryParams.get("province");
  const fetchPostsByProvince = async () => {
    try {
      console.log(`Requesting posts for province: ${province}`); // In ra tỉnh đang yêu cầu
      const response = await AxiosInstance().get(
        `/lay-danh-sach-bai-dang?province=${province}`
      );
      console.log(response); // In kết quả trả về của API
      if (Array.isArray(response)) {
        // Kiểm tra dữ liệu trả về
        setPosts(response); // Lưu kết quả vào state
      } else {
        console.error("Không có bài đăng phù hợp");
        setPosts([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy bài đăng:", error);
    }
  };
  useEffect(() => {
    if (province) {
      fetchPostsByProvince();
    }
  }, [province]);

  return (
    <div className="PostList">
      <h5 className="danh-sach-tinh">Danh sách bài viết tại {province}</h5>
      <div className="posts-container">
        {posts.length === 0 ? (
          <p>Không có bài đăng nào tại {province}</p>
        ) : (
          posts.map((post) => (
            <div
              className={`row post-row ${post.posttype} ${
                isExpired(post.expireDate) ? "post-expired" : ""
              }`}
              key={post._id}
            >
              <div className="img-post">
                {isExpired(post.expireDate) ? (
                  <div className="post-label expired">
                    <i
                      className="fa fa-exclamation-circle"
                      aria-hidden="true"
                    ></i>{" "}
                    Tin đã hết hạn
                  </div>
                ) : post.posttype === "vip2" ? (
                  <div className="post-label">
                    <i className="fa fa-crown" aria-hidden="true"></i> Tin Vip
                    Cao Cấp
                  </div>
                ) : post.posttype === "vip1" ? (
                  <div className="post-label">
                    <i className="fa fa-star" aria-hidden="true"></i> Tin Vip
                    Nổi Bật
                  </div>
                ) : post.posttype === "thuong" ? (
                  <div className="post-label">
                    <i className="fa fa-circle" aria-hidden="true"></i> Tin
                    thường
                  </div>
                ) : null}

                {post.image.length > 0 && (
                  <img
                    src={`http://localhost:8000/img/${post.image[0]}`}
                    alt=""
                  />
                )}
              </div>
              <div className="col-7 information">
                <div className="item-name">
                  <Link to={`/chi-tiet-bai-dang/${post._id}`}>
                    <a href="" className="text-decoration-none">
                      {post.title}
                    </a>
                  </Link>
                  <div className="list-infor">
                    <li className="list-infor-price">
                      {formatCurrency(post.price)}/tháng
                    </li>
                    <li className="list-infor-acreage">{post.area} m²</li>
                    <li className="item">
                      <div className="number">{post.bedroom}</div>
                      <div className="icon">
                        <i className="fa fa-bed"></i>
                      </div>
                    </li>
                    <li className="item">
                      <div className="number">{post.bathroom}</div>
                      <div className="icon">
                        <i className="fa fa-bath"></i>
                      </div>
                    </li>
                  </div>
                  <div className="location">
                    <i className="fa-solid fa-map-location-dot"></i>
                    <div className="name-location">
                      <div>
                        {post.district.name}, {post.province.name}
                      </div>
                    </div>
                  </div>
                  <div
                    className="content"
                    dangerouslySetInnerHTML={{ __html: post.description }}
                  ></div>
                  <div className="footer-post">
                    <div className="date">{formatDate(post.createdAt)}</div>
                    <div className="love border-black border-5 w-10 h-10">
                      <i className="fa-regular fa-heart"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PostProvince;
