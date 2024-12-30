import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Menu from "../PostComponent/Menu";
import { Pagination } from "../handlePost";
const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 7;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = transactions.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(transactions.length / postsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  useEffect(() => {
    const fetchTransactionHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Bạn cần đăng nhập để xem lịch sử giao dịch');
        setLoading(false);
        return;
      }

      try {
        const decodedToken = jwtDecode(token);  // Sử dụng jwtDecode thay vì jwt_decode
        const userId = decodedToken.userId;  // Lấy userId từ token

        if (!userId) {
          setError('Không tìm thấy userId trong token');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:8000/transaction-history/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response.data); // Kiểm tra cấu trúc dữ liệu trả về
        setTransactions(response.data.transactions); // Đảm bảo `transactions` là đúng key trong response
      } catch (err) {
        setError('Lỗi khi lấy lịch sử giao dịch');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionHistory();
  }, []);

  // Render trạng thái loading, error, hoặc bảng giao dịch
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="listnewform">
      <aside>
        <Menu />
      </aside>
      <div className="transaction-history-container">
        <h2>Lịch sử giao dịch</h2>

        <table className="transaction-table">
          <thead>
            <tr>
              <th>Ngày giao dịch</th>
              <th>Tiêu đề bài đăng</th>
              <th>Số tiền</th>
              <th>Trạng thái</th>
              <th>Nội dung thanh toán</th>
              <th>Phương thức thanh toán</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              currentPosts.map((transaction) => (
                <tr key={transaction._id}>
                  <td>{new Date(transaction.transactionDate).toLocaleDateString()}</td>
                  <td>{transaction.postId?.title || 'Không xác định'}</td>
                  <td>{transaction.amount} VND</td>
                  <td>{transaction.status}</td>
                  <td>{transaction.orderInfo}</td>
                  <td>{transaction.paymentMethod}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">Không có lịch sử giao dịch</td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
        />
      </div>
    </div>
  );
};

export default TransactionHistory;
