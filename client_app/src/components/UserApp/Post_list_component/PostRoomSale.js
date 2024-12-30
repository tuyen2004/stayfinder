import React, { useState, useEffect } from "react";
import "../../../css/Post.css";
import AxiosInstance from "../../../lib/Axiosintance";
import { Link } from "react-router-dom";
import FilterMenu from "../FilterMenu";
import Formlistfilter from "./Formlistfilter";
import { formatDate, formatCurrency, isExpired, renderPostLabel } from "./utils";
import { handleSortChange,handleLoveClick } from "../handlePost";
function PostRoomSale() {
  const [viewMode, setViewMode] = useState("row");
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };
  const [post, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  useEffect(() => {
    const fetchRoomSale = async () => {
      try {
        const response = await AxiosInstance().get("/lay-danh-sach-bai-dang");
        if (Array.isArray(response)) {
          let roomPosts = response.filter(
            (post) =>
              post.rentaltype === "cho-thue-phong-tro" &&
              post.statuspost === "Đã thanh toán" &&
              post.isVisible
          );
          // Tách các bài đăng đã hết hạn và chưa hết hạn
          const expiredPosts = roomPosts.filter((post) =>
            isExpired(post.expireDate)
          );
          const activePosts = roomPosts.filter(
            (post) => !isExpired(post.expireDate)
          );
          // Sắp xếp bài đăng chưa hết hạn
          activePosts.sort((a, b) => {
            const postTypeOrder = { vip2: 1, vip1: 2, thuong: 3 };
            const typeComparison =
              postTypeOrder[a.posttype] - postTypeOrder[b.posttype];
            if (typeComparison !== 0) {
              return typeComparison;
            } else {
              const dateComparison = new Date(b.date) - new Date(a.date);
              if (dateComparison !== 0) {
                return dateComparison;
              } else {
                const timeA = a.time
                  ? new Date(`1970-01-01T${a.time}`)
                  : new Date(0);
                const timeB = b.time
                  ? new Date(`1970-01-01T${b.time}`)
                  : new Date(0);
                return timeB - timeA;
              }
            }
          });

          // Kết hợp các bài chưa hết hạn và đã hết hạn lại
          const sortedPosts = [...activePosts, ...expiredPosts];

          if (sortedPosts.length > 0) {
            setPosts(sortedPosts);
          } else {
            console.error("Không có bài đăng cho thuê phòng trọ.");
          }
        } else {
          console.error(
            "Phản hồi từ API không hợp lệ hoặc không có dữ liệu:",
            response
          );
        }
      } catch (error) {
        console.error("Lỗi khi lấy bài đăng cho thuê phòng trọ:", error);
      }
    };
    fetchRoomSale();
  }, []);
  const handleFilter = (filteredPosts) => {
    setPosts(filteredPosts);
  };
  return (
    <div className="Post_list_container">
      <FilterMenu onFilter={handleFilter} />
      <div class="container-post">
        <div className="post-list-render">
        <div className="post-option">
            <div className="two-option">
            <div className="path option-1">
              <ol>
                <li className="href">
                  <a href="/">Trang chủ</a>
                </li>
                <li>
                  <a href="/cho-thue-can-ho" className="dsch">
                    Danh sách phòng trọ
                  </a>
                </li>
              </ol>
              <div className="title-list">Danh sách phòng trọ trên Toàn Quốc</div>
            </div>
            <div className="option-2">
              <div className="grid-row">
                <button
                  className={`grid-post ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => handleViewModeChange("grid")}
                >
                  <i class="bi bi-grid"></i>
                </button>
                <button
                  className={`row-post ${viewMode === "row" ? "active" : ""}`}
                  onClick={() => handleViewModeChange("row")}
                >
                  <i class="bi bi-layout-text-sidebar"></i>
                </button>
              </div>
              <select
                className="select-option"
                onChange={(e) =>
                  handleSortChange(e.target.value, post, setPosts)
                }
              >
                <option value="">Thông thường</option>
                <option value="newest">Tin mới nhất</option>
                <option value="priceAsc">Giá thấp đến cao</option>
                <option value="priceDesc">Giá cao đến thấp</option>
                <option value="pricePerSquareMeterDesc">
                  Giá trên m² cao đến thấp
                </option>
                <option value="pricePerSquareMeterAsc">
                  Giá trên m² thấp đến cao
                </option>
                <option value="areaAsc">Diện tích bé đến lớn</option>
                <option value="areaDesc">Diện tích lớn đến bé</option>
              </select>
            </div>
            </div>
            
          </div>
          <div className="filter-menu row mt-3 ">
            <div className="col-md-6">
              <p>Hiện có {post.length} có trên toàn quốc</p>
            </div>

          </div>
          <div
            className={`list-home ${
              viewMode === "grid" ? "grid-view" : "row-view"
            }`}
          >
            {post.length === 0 ? (
              <p>Không có bài đăng nào cho thuê phòng trọ.</p>
            ) : (
              post.map((post) => (
                <div
                  className={`row post-row ${post.posttype} ${
                    isExpired(post.expireDate) ? "post-expired" : ""
                  }`}
                  key={post._id}
                >
                  <div className="img-post">{renderPostLabel(post)}
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
                        <div
                          className="love"
                          onClick={() =>
                            handleLoveClick(
                              post._id,
                              likedPosts || [],
                              setLikedPosts
                            )
                          } // Sử dụng mảng rỗng nếu likedPosts là undefined
                        >
                          <i
                            className={
                              likedPosts && likedPosts.includes(post._id)
                                ? "fa-solid fa-heart"
                                : "fa-regular fa-heart"
                            }
                          ></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="form-list-filter">
          <Formlistfilter />
        </div>
      </div>
    </div>
  );
}

export default PostRoomSale;
