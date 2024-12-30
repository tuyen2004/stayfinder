import React, { useState, useEffect } from "react";
import "../../css/ManagePosts.css";
import { Link } from "react-router-dom";
import AxiosInstance from "../../lib/Axiosintance";
import { formatDate } from "../../components/UserApp/Post_list_component/utils";

function ManagePost() {
  const [post, setPosts] = useState([]);
  const postsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await AxiosInstance().get("/lay-danh-sach-bai-dang");
        if (Array.isArray(response)) {
          const filteredPosts = response.filter((post) => !post.isDeleted);
          setPosts(filteredPosts);
        } else {
          console.error(
            "Phản hồi từ API không hợp lệ hoặc không có dữ liệu:",
            response
          );
        }
      } catch (error) {
        console.error("Lỗi khi lấy bài đăng của người dùng:", error);
      }
    };
    fetchPosts();
  },[]);
  const toggleVisibility = async (postId, isVisible) => {
    try {
      const response = await AxiosInstance().put(`/an-hien-bai-dang/${postId}`, {
        isVisible: !isVisible,
      });
      if (response) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, isVisible: !post.isVisible } : post
          )
        );
      }
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái bài đăng:", error);
    }
  };
  
  // Tính toán bài đăng hiển thị cho trang hiện tại
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = post.slice(indexOfFirstPost, indexOfLastPost);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  // Tính số lượng trang
  const totalPages = Math.ceil(post.length / postsPerPage);
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  return (
    <div className="main-panel">
      <nav className="navbar navbar-default navbar-fixed">
        <div className="container-fluid">
          <div className="navbar-header">
            <button
              type="button"
              className="navbar-toggle"
              data-toggle="collapse"
              data-target="#navigation-example-2"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="/#">
              Trang chủ
            </a>
          </div>
          <div className="collapse navbar-collapse">
            <ul className="nav navbar-nav navbar-left">
              <li>
                <a href="/#" className="dropdown-toggle" data-toggle="dropdown">
                  <i className="fa fa-dashboard"></i>
                  <p className="hidden-lg hidden-md">Dashboard</p>
                </a>
              </li>
              <li className="dropdown">
                <a href="/#" className="dropdown-toggle" data-toggle="dropdown">
                  <i className="fa fa-globe"></i>
                  <b className="caret hidden-sm hidden-xs"></b>
                  <span className="notification hidden-sm hidden-xs">0</span>
                  <p className="hidden-lg hidden-md">
                    5 Notifications
                    <b className="caret"></b>
                  </p>
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a href="/#">Notification 1</a>
                  </li>
                  <li>
                    <a href="/#">Notification 2</a>
                  </li>
                  <li>
                    <a href="/#">Notification 3</a>
                  </li>
                  <li>
                    <a href="/#">Notification 4</a>
                  </li>
                  <li>
                    <a href="/#">Another notification</a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="/#">
                  <i className="fa fa-search"></i>
                  <p className="hidden-lg hidden-md">Search</p>
                </a>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li>
                <Link>
                  <p>Chưa đăng nhập!</p>
                </Link>
              </li>
              <li className="separator hidden-lg hidden-md"></li>
            </ul>
          </div>
        </div>
      </nav>
      <div class="container-tuyen">
        <div class="filter-buttons">
          <button>Tìm theo ngày đăng</button>
          <button>Tìm theo danh mục</button>
          <button>Tìm theo loại tin</button>
        </div>

        <div class="search-box">
          <input type="text" placeholder="Nhập bài đăng cần tìm..." />
          <span class="icon"></span>
        </div>

        <div class="title">Quản lí bài đăng</div>

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
              <th>Người dùng</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.length === 0 ? (
              <tr>
                <td>Không có bài viết nào có trong dữ liệu</td>
              </tr>
            ) : (
              currentPosts.map((post, index) => (
                <tr key={post._id}>
                  <td>{indexOfFirstPost + index + 1}</td>
                  <td>{post.posttype}</td>
                  <td>{post.title}</td>
                  <td class="img-table">
                    {post.image.length > 0 && (
                      <img
                        src={`http://localhost:8000/img/${post.image[0]}`}
                        alt=""
                      />
                    )}
                  </td>
                  <td>{formatDate(post.createdAt)}</td>
                  <td>{formatDate(post.expireDate)}</td>
                  <td>
                    <button
                      className="an-hien-button"
                      onClick={() => toggleVisibility(post._id, post.isVisible)}
                    >
                      {post.isVisible ? "Ẩn" : "Hiện"}
                    </button>
                  </td>

                  <td>{post.username}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="pagination">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={currentPage === 1 ? "disabled" : ""}
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={currentPage === totalPages ? "disabled" : ""}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
export default ManagePost;
