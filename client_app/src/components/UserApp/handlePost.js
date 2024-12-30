import AxiosInstance from "../../../src/lib/Axiosintance";

//nhấn để yêu thích bài viết
export const handleLoveClick = async (postId, likedPosts, setLikedPost) => {
  try {
    const response = await AxiosInstance().post("/luu-bai-dang", { postId });
    console.log(response); // Xem phản hồi từ server
    setLikedPost((prevLiked) =>
      prevLiked.includes(postId)
        ? prevLiked.filter((id) => id !== postId)
        : [...prevLiked, postId]
    );
  } catch (error) {
    console.log(
      "Lỗi khi thích bài viết này nhó:",
      error.response ? error.response : error.message
    );
  }
};

export const handleSortChange = async (sortOption, post, setPosts) => {
  try {
    const response = await AxiosInstance().get(
      `/filtersort?sortOption=${sortOption}`
    );
    if (Array.isArray(response) && response.length > 0) {
      setPosts(response);
    } else {
      console.error("Dữ liệu không hợp lệ hoặc không có dữ liệu:", response);
      setPosts([]);
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu sắp xếp:", error);
    setPosts([]);
  }
};
//tạo phân trang cho bài post
export const Pagination = ({
  currentPage,
  totalPages,
  onNextPage,
  onPreviousPage,
}) => {
  return (
    <div className="pagination">
      <button onClick={onPreviousPage} disabled={currentPage === 1}>
        Trang trước
      </button>
      <span>
        Trang {currentPage} / {totalPages}
      </span>
      <button onClick={onNextPage} disabled={currentPage === totalPages}>
        Trang sau
      </button>
    </div>
  );
};
