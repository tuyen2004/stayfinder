import React from 'react';  
import '../../css/News.css';  

function News() {  
  return (  
    <div className="news-wrapper col4">  
      <div id="news-container">  
        <div id="news-content">  
          <div id="featured-property">  
            <img src="https://tinyurl.com/26fxcnfp" alt="Featured Property" />  
            <p>  
              Chào mừng đến với bản tin bất động sản của chúng tôi. Tại đây, bạn sẽ tìm thấy những thông tin hữu ích và mới nhất về thị trường bất động sản.  
            </p>  
            <p>  
              Chúng tôi cung cấp những thông tin chính xác về giá cả, xu hướng, và các cơ hội đầu tư trong lĩnh vực bất động sản. Hãy theo dõi để không bỏ lỡ những cơ hội hấp dẫn!  
            </p>  
          </div>  
          <div id="latest-properties">  
            <ul>  
              <li>  
                <img src="images/demo/190x80.gif" alt="Property 1" />  
                <p>Những căn hộ mới ở trung tâm thành phố đang có giá rất hấp dẫn. Đây là cơ hội cho những ai tìm kiếm không gian sống tuyệt vời.</p>  
                <p className="readmore"><a href="#">Đọc tiếp &raquo;</a></p>  
              </li>  
              <li>  
                <img src="images/demo/190x80.gif" alt="Property 2" />  
                <p>Nhà phố thiết kế hiện đại, tọa lạc tại khu vực phát triển, đáng để xem ngay hôm nay!</p>  
                <p className="readmore"><a href="#">Đọc tiếp &raquo;</a></p>  
              </li>  
              <li className="last">  
                <img src="images/demo/190x80.gif" alt="Property 3" />  
                <p>Giá bất động sản tại ven đô đang tăng lên, đây là thời điểm vàng để bạn đầu tư vào đất nền.</p>  
                <p className="readmore"><a href="#">Đọc tiếp &raquo;</a></p>  
              </li>  
            </ul>  
            <br className="clear" />  
          </div>  
        </div>  
        <div id="sidebar">  
          <ul id="latest-news">  
            <li>  
              <img src="images/demo/80x80.gif" alt="News 1" />  
              <p>  
                <strong><a href="#">Thị trường bất động sản trong năm 2024</a></strong>: Dự báo xu hướng và biến động giá.  
              </p>  
            </li>  
            <li>  
              <img src="images/demo/80x80.gif" alt="News 2" />  
              <p>  
                <strong><a href="#">Làm thế nào để chọn lựa bất động sản tốt?</a></strong>: Những yếu tố cần xem xét trước khi đầu tư.  
              </p>  
            </li>  
            <li>  
              <img src="images/demo/80x80.gif" alt="News 3" />  
              <p>  
                <strong><a href="#">Cách phân tích giá trị bất động sản</a></strong>: Hướng dẫn chi tiết cho nhà đầu tư mới.  
              </p>  
            </li>  
            <li>  
              <img src="images/demo/80x80.gif" alt="News 4" />  
              <p>  
                <strong><a href="#">Các dự án nổi bật trong năm 2023</a></strong>: Điểm danh những dự án đáng chú ý.  
              </p>  
            </li>  
            <li className="last">  
              <img src="images/demo/80x80.gif" alt="News 5" />  
              <p>  
                <strong><a href="#">Xu hướng thiết kế nhà ở hiện đại</a></strong>: Những điều cần biết cho năm 2024.  
              </p>  
            </li>  
          </ul>  
        </div>  
        <br className="clear" />  
      </div>  
      <br className="clear" />  
    </div>  
  );  
}  

export default News;