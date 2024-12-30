import React, { useEffect, useState } from "react";
import AxiosInstance from "../../lib/Axiosintance";

function SavedPosts() {
  const [save, setSavedPosts] = useState([]);
  useEffect(() => {
    const fetchSavePost = async () => {
      try {
        const response = await AxiosInstance().get("/bai-dang-da-luu");
        console.log(response);
        // Trích xuất dữ liệu từ `postId`
        const posts = response.map((item) => item.postId);
        setSavedPosts(posts);
      } catch (error) {
        console.error("Lỗi khi tải bài đăng đã lưu:", error);
      }
    };

    fetchSavePost();
  }, []);
  return (
    <div className="post-saved-container ">
      <div className="post-saved-title"> Tin đã lưu</div>
      <div className="number-post-saved">
        Hiện bạn có {save.length} bài đăng đã lưu
      </div>
      <div className="saved-post-list">
        {save.map((post) => (
          <div key={post._id} className="saved-post">
            {post.image.length > 0 && (
              <div className="saved-post-img">
                <img
                  src={`http://localhost:8000/img/${post.image[0]}`}
                  alt=""
                />
              </div>
            )}
            <div className="saved-post-content">
              <div className="saved-post-title">{post.title}</div>
              <div className="saved-post-center">
                <div className="saved-post-price">{post.price}</div>
                <div className="saved-post-acreage">{post.province.name}</div>
              </div>
              <div className="saved-post-address">
                {post.ward.name}, {post.province.name}
              </div>
              <div className="saved-post-footer">
                <div className="saved-post-date">{post.date}</div>
                <div className="saved-post-love">
                  <i class="fa-regular fa-heart"></i>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SavedPosts;
