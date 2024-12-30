import React, { useState, useEffect } from "react";
import "../../../css/ManagerPost.css";
import Menu from "./Menu";
import AxiosInstance from "../../../lib/Axiosintance";
import { jwtDecode } from "jwt-decode";
import { formatDate } from "../../UserApp/Post_list_component/utils";
import { Link } from "react-router-dom";
import { message } from "antd";

export default function ManagerPost() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  const [posts, setPosts] = useState([]);

  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const userId = decodedToken ? decodedToken.userId : null;

  const handleToggleMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await AxiosInstance().get("/lay-danh-sach-bai-dang-theo-userid", { params: { userId } });
        if (Array.isArray(response)) {
          const filteredPosts = response.filter((post) => !post.isDeleted);
          setPosts(filteredPosts.map((post) => ({
            ...post,
            expireDate: post.expireDate || null, 
          })));
        }
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };

    if (userId) fetchUserPosts();
    else console.error("User ID not found in token");
  }, [userId]);

  const handleRepost = async (postId, postType) => {
    try {
      const response = await AxiosInstance().put(`/dang-lai-bai-viet/${postId}`);
      console.log("API Response:", response);

      if (postType === "vip1" || postType === "vip2") {
        if (response && response.payUrl) {
          window.location.href = response.payUrl;
        } else {
          console.error("Payment link generation failed:", response);
          message.error("Could not generate payment link.");
        }
      } else {
        if (response && response.post) {
          const { post } = response;
          message.success("Post reposted successfully!");
          setPosts((prevPosts) =>
            prevPosts.map((item) =>
              item._id === postId ? { ...item, expireDate: post.expireDate } : item
            )
          );
        } else {
          message.error("Post information missing.");
        }
      }
    } catch (error) {
      console.error("Error reposting post:", error);
      message.error("Error reposting post: " + error.message);
    }
  };
  const toggleVisibility = async (postId, isVisible) => {
    try {
      const response = await AxiosInstance().put(`/an-hien-bai-dang/${postId}`, { isVisible: !isVisible });
      if (response) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, isVisible: !isVisible } : post
          )
        );
      }
    } catch (error) {
      message.error("Error changing post visibility: " + error.message);
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await AxiosInstance().delete(`/xoa-bai-dang/${postId}`);
      if (response.message === "Bài đăng đã bị xóa.") {
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );
      }
    } catch (error) {
      message.error("Error deleting post: " + error.message);
    }
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="listnewform">
      <aside>
        <Menu />
      </aside>

      <div className="data-table">
        <div className="tab-section">
          <span className="active-tab">Tất cả ({posts.length})</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Loại tin</th>
              <th>Tiêu đề</th>
              <th>Ảnh</th>
              <th>Ngày đăng</th>
              <th>Ngày hết hạn</th>
              <th>Trạng thái</th>
              <th>Nâng cấp tin</th>
              <th>Đăng lại tin</th>
              <th>Chức năng</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.length === 0 ? (
              <tr><td colSpan="10">Không có bài đăng nào của người dùng.</td></tr>
            ) : (
              currentPosts.map((post, index) => (
                <tr key={post._id}>
                  <td>{indexOfFirstPost + index + 1}</td>
                  <td>{post.posttype}</td>
                  <td>{post.title}</td>
                  <td className="img-table">
                    {post.image.length > 0 && (
                      <img src={`http://localhost:8000/img/${post.image[0]}`} alt="" />
                    )}
                  </td>
                  <td>{formatDate(post.createdAt)}</td>
                  <td>{ formatDate(post.expireDate)}</td>
                  <td>
                    <button className="an-hien-button" onClick={() => toggleVisibility(post._id, post.isVisible)}>
                      {post.isVisible ? "Ẩn" : "Hiện"}
                    </button>
                  </td>
                  <td>
                    <Link to={`/nang-cap-tin-dang/${post._id}`}>
                      <button className="upgrade-button"><i className="fa-regular fa-circle-up"></i></button>
                    </Link>
                  </td>
                  <td>
                    {post.expireDate && new Date(post.expireDate) < new Date() ? (
                      <i className="fa-solid fa-rotate-right repost-icon" onClick={() => handleRepost(post._id, post.posttype)} title="Đăng lại bài viết"></i>
                    ) : (
                      <span>Hoạt động</span>
                    )}
                  </td>
                  <td className="action-post" onClick={() => handleToggleMenu(post._id)}>
                    ⋮
                    {activeMenu === post._id && (
                      <div className="action-menu">
                        <Link to={`/chinh-sua-tin-dang/${post._id}`}><button>Sửa</button></Link>
                        <button onClick={() => deletePost(post._id)}>Xóa</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>
            <i className="fa-solid fa-circle-chevron-left"></i>
          </button>
          <span>{currentPage} / {totalPages}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            <i className="fa-solid fa-circle-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
