import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/AccountAdmin.css";

function AccountAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8000/api/auth/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
          setIsLoadingUsers(false);
        }, 300);
      }
      const storedUserRole = localStorage.getItem("role");
      setCurrentUser({ role: parseInt(storedUserRole, 10) });
    };

    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa người dùng này?",
      text: "Hành động này không thể hoàn tác!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Có, xóa!",
      cancelButtonText: "Không",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/auth/users/${userId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Token JWT
            },
          }
        );

        if (response.ok) {
          setUsers(users.filter((user) => user._id !== userId));
          toast.success("Người dùng đã được xóa thành công!", {
            position: "top-right",
            style: { backgroundColor: "#28a745", color: "white" },
          });
        } else {
          console.error("Failed to delete user");
          toast.error("Có lỗi xảy ra khi xóa người dùng!", {
            position: "top-right",
          });
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Có lỗi xảy ra khi xóa người dùng!", {
          position: "bottom-right",
        });
      }
    }
  };

  // Hàm tìm kiếm
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Lọc người dùng dựa trên tên hoặc email
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUserRole = async (userId, currentRole) => {
    const newRole = currentRole === 2 ? 1 : 2;
    try {
      const response = await fetch(
        `http://localhost:8000/api/auth/update-role/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ role: newRole }), // Gửi vai trò mới
        }
      );

      if (response.ok) {
        const updatedUsers = users.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        );
        setUsers(updatedUsers);
        toast.success("Vai trò người dùng đã được cập nhật!", {
          position: "top-right",
          style: { backgroundColor: "#28a745", color: "white" },
        });
      } else {
        console.error("Failed to update user role");
        toast.error("Có lỗi xảy ra khi cập nhật vai trò người dùng!", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Có lỗi xảy ra khi cập nhật vai trò người dùng!", {
        position: "bottom-right",
      });
    }
  };

  // Hàm thay đổi trạng thái người dùng
  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 2 ? 0 : 2; // Đổi trạng thái
    try {
      const response = await fetch(
        `http://localhost:8000/api/auth/update-status/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        const updatedUsers = users.map((user) =>
          user._id === userId ? { ...user, status: newStatus } : user
        );
        setUsers(updatedUsers);
        toast.success("Trạng thái người dùng đã được cập nhật!", {
          position: "top-right",
          style: { backgroundColor: "#28a745", color: "white" },
        });
      } else {
        console.error("Failed to update user status");
        toast.error("Có lỗi xảy ra khi cập nhật trạng thái người dùng!", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái người dùng!", {
        position: "bottom-right",
      });
    }
  };

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const pages = [];

    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            className={currentPage === i ? "active" : ""}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      }
    } else {
      if (currentPage < 3) {
        for (let i = 1; i <= 3; i++) {
          pages.push(
            <button
              key={i}
              className={currentPage === i ? "active" : ""}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </button>
          );
        }
        pages.push(<span key="ellipsis">...</span>);
        pages.push(
          <button key={totalPages} onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </button>
        );
      } else if (currentPage > totalPages - 2) {
        pages.push(
          <button key={1} onClick={() => handlePageChange(1)}>
            1
          </button>
        );
        pages.push(<span key="ellipsis">...</span>);
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(
            <button
              key={i}
              className={currentPage === i ? "active" : ""}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </button>
          );
        }
      } else {
        pages.push(
          <button key={1} onClick={() => handlePageChange(1)}>
            1
          </button>
        );
        pages.push(<span key="ellipsis">...</span>);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(
            <button
              key={i}
              className={currentPage === i ? "active" : ""}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </button>
          );
        }
        pages.push(<span key="ellipsis-after">...</span>);
        pages.push(
          <button key={totalPages} onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </button>
        );
      }
    }

    return pages;
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
        {isLoadingUsers && (
          <div className="overlay">
            <div></div>
          </div>
        )}
        <div class="search-bar">
          <input
            type="text"
            placeholder="Nhập tên người dùng cần tìm..."
            value={searchTerm}
            onChange={handleSearch} 
          />
        </div>

        <div class="header">
          <h1 style={{ margin: "0" }}>Quản lí tài khoản</h1>
        </div>
        <ToastContainer />
        {!loading ? (
          <table class="account-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Người dùng</th>
                <th>Trạng Thái</th>
                <th>Khóa</th>
                <th>Ngày tạo</th>
                {currentUser?.role === 0 && <th>Quyền quản trị</th>}
                <th>Chức năng</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <img
                      src={`http://localhost:8000/img/${
                        user.avatar
                          ? user.avatar.replace(/^public\\img\\/, "")
                          : "defaultAvatar.png"
                      }`}
                      alt="Avatar"
                    />
                  </td>
                  <td>
                    {user.username}
                    <br />
                    <span>{user.email}</span>
                  </td>
                  <td
                    className={
                      user.status === 1
                        ? "active"
                        : user.status === 2
                        ? "blocked"
                        : "inactive"
                    }
                  >
                    {user.status === 1
                      ? "Đang hoạt động"
                      : user.status === 2
                      ? "Đang khóa"
                      : "Không hoạt động"}
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={user.status === 2}
                        onChange={() => toggleUserStatus(user._id, user.status)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  {currentUser?.role === 0 && (
                    <td className="chekboxrole">
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={user.role === 1}
                          onChange={() => toggleUserRole(user._id, user.role)}
                        />
                        <span className="slider round"></span>
                      </label>
                      <span>
                        {user.role === 1 ? "Quản trị viên" : "Người dùng"}{" "}
                      </span>
                    </td>
                  )}
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => deleteUser(user._id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ textAlign: "center" }}>Đang tải dữ liệu...</div>
        )}

        <div className="pagination">
          {!loading && (
            <>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1} 
              >
                &lt;
              </button>
              {renderPagination()}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages} 
              >
                &gt;
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default AccountAdmin;
