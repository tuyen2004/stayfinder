import React, { useEffect, useState } from "react";
import "../../css/Home.css";
import "../../css/PostNew.css";
import { Link, useLocation } from "react-router-dom";
import AxiosInstance from "../../lib/Axiosintance";
import { handleLoveClick } from "./handlePost"; // Ensure this is defined and imported correctly
import {
  formatDate,
  formatCurrency,
  renderPostLabel,
} from "../UserApp/Post_list_component/utils";
import axios from "axios"; // Ensure axios is installed

const PEXELS_API_KEY =
  "JN3UwRYIoiSdfLix9UK6Jv6qSRlXQd3KgMZNGFJiHZWhEbuXRk4mIdEi";
const PEXELS_API_URL = "https://api.pexels.com/v1/search";

function Home() {
  const [posts, setPosts] = useState({
    vip2: [],
    vip1: [],
    regular: [],
    suggest: [],
  });
  const [tinh, setTinh] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [provinceImages, setProvinceImages] = useState({});
  const [error, setError] = useState("");
  const location = useLocation();
  const provinceQuery = new URLSearchParams(location.search).get("province");

  // Lấy bài đăng từ API
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await AxiosInstance().get("/lay-danh-sach-bai-dang");
        const currentDate = new Date();
        const filterPosts = (type) =>
          response.filter(
            (post) =>
              post.posttype === type &&
              post.statuspost === "Đã thanh toán" &&
              (!post.expireDate || new Date(post.expireDate) > currentDate) &&
              post.isVisible
          );
        setPosts({
          vip2: filterPosts("vip2"),
          vip1: filterPosts("vip1"),
          regular: response.filter(
            (post) => post.posttype === "thuong" && post.isVisible
          ),
          suggest: [], // Gợi ý sẽ lấy riêng
        });
      } catch (err) {
        console.error("Lỗi khi lấy bài đăng:", err);
      }
    };
    fetchAllPosts();
  }, [provinceQuery]);

  // Lấy bài đăng yêu thích
  useEffect(() => {
    const fetchFavoritePosts = async () => {
      try {
        const response = await AxiosInstance().get("/bai-dang-yeu-thich-nhat");
        setPosts((prev) => ({ ...prev, suggest: response }));
        console.log("dữ liệu tin yêu thích", response);
      } catch (err) {
        console.error("Lỗi khi tải bài đăng yêu thích:", err);
      }
    };
    fetchFavoritePosts();
  }, []);

  // Lấy danh sách tỉnh và ảnh
  useEffect(() => {
    const fetchTopProvinces = async () => {
      try {
        const response = await AxiosInstance().get(
          "/lay-tinh-co-bai-viet-nhieu-nhat"
        );
        setTinh(response);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách tỉnh:", err);
      }
    };
    fetchTopProvinces();
  }, []);

  useEffect(() => {
    tinh.forEach(async (province) => {
      if (!provinceImages[province._id.name]) {
        try {
          const response = await axios.get(PEXELS_API_URL, {
            headers: { Authorization: PEXELS_API_KEY },
            params: { query: province._id.name, per_page: 1 },
          });
          setProvinceImages((prev) => ({
            ...prev,
            [province._id.name]:
              response.data.photos[0]?.src?.medium || "/images/default.jpg",
          }));
        } catch {
          setProvinceImages((prev) => ({
            ...prev,
            [province._id.name]: "/images/default.jpg",
          }));
        }
      }
    });
  }, [tinh]);

  // Component tái sử dụng cho hiển thị bài đăng
  const PostCard = ({ post, type }) => (
    <div className="list-post-container" key={post._id}>
      <div className="img-post-list-home">
        {renderPostLabel(post)}{" "}
        {/* Sử dụng renderPostLabel để hiển thị nhãn bài viết */}
        <img
          src={`http://localhost:8000/img/${post.image[0] || "default.jpg"}`}
          alt={post.title}
        />
      </div>
      <div className="post-content-infor">
        <Link to={`/chi-tiet-bai-dang/${post._id}`}>
          <div className="title-list-post">{post.title}</div>
        </Link>
        <div className="post-number-position">
          <div className="list-post-price">
            {formatCurrency(post.price)}/tháng
          </div>
          <div className="list-post-are">{post.area} m²</div>
        </div>
        <div className="list-post-loaction">{`${post.district.name}, ${post.province.name}`}</div>
        <div className="footer-list-post">
          <div className="date">{formatDate(post.createdAt)}</div>
          <div
            className="love"
            onClick={() => handleLoveClick(post._id, likedPosts, setLikedPosts)}
          >
            <i
              className={
                likedPosts.includes(post._id)
                  ? "fa-solid fa-heart"
                  : "fa-regular fa-heart"
              }
            ></i>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="PostApartment_container">
      <h5 style={{ marginBottom: "15px", fontSize: "20px" }}>Gợi ý khu vực</h5>
      <div className="Main-GYKV">
        {tinh.slice(0, 5).map((province, index) => (
          <div className={`item${index + 1}`} key={province._id.code}>
            <h6>{province._id.name.toUpperCase()}</h6>
            <Link
              to={`/lay-danh-sach-bai-dang-theo-tinh?province=${province._id.name}`}
            >
              <img
                src={provinceImages[province._id.name] || "/images/default.jpg"}
                alt={province._id.name}
                width={index === 0 ? "450px" : "313px"}
                height={index === 0 ? "314px" : "148px"}
              />
            </Link>
            <div className="quantity-post">{province.postCount} tin đăng</div>
          </div>
        ))}
      </div>

      {["vip2", "vip1", "regular"].map((type) => (
        <div className="danh-sach-tin-container" key={type}>
          <div className="name-list-post-title">
            {type === "vip2"
              ? "Tin Vip Cao Cấp"
              : type === "vip1"
              ? "Tin Vip Nổi Bật"
              : "Tin Thường"}
          </div>
          <div className="danh-sach-tip-vip-noi-bat">
            {posts[type]?.length > 0 ? (
              posts[type]
                .slice(0, 10)
                .map((post) => <PostCard post={post} type={type} />)
            ) : (
              <p>Không có tin nào</p>
            )}
          </div>
        </div>
      ))}

      <div className="danh-sach-tin-container">
        <div className="name-list-post-title">
          Tin được nhiều người yêu thích
        </div>
        <div className="danh-sach-tip-vip-noi-bat">
          {posts.suggest.slice(0, 10).length > 0 ? (
            posts.suggest.slice(0, 10).map((post) => (
              <div className="list-post-container" key={post._id}>
                <div className="img-post-list-home">
                  {renderPostLabel(post.postDetails)}
                  {post.postDetails.image.length > 0 && (
                    <img
                      src={`http://localhost:8000/img/${post.postDetails.image[0]}`}
                      alt={post.postDetails.title}
                    />
                  )}
                </div>
                <div className="post-content-infor">
                  <Link to={`/chi-tiet-bai-dang/${post._id}`}>
                    <div className="title-list-post">
                      {post.postDetails.title}
                    </div>
                  </Link>
                  <div className="post-number-position">
                    <div className="list-post-price">
                      {formatCurrency(post.postDetails.price)}
                    </div>
                    <div className="list-post-are">
                      {post.postDetails.area} m²
                    </div>
                  </div>
                  <div className="list-post-loaction">
                    {post.postDetails.district.name},{" "}
                    {post.postDetails.province.name}
                  </div>
                  <div className="footer-list-post">
                    <div className="date">
                      {formatDate(post.postDetails.createdAt)}
                    </div>

                    {/* Hiển thị lượt yêu thích với biểu tượng trái tim */}
                    <div className="like-count">
                      <i className="fa-solid fa-heart"></i> {post.count || 0}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Không có tin yêu thích nào</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
