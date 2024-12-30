import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faAngleLeft, faAngleRight, faImage } from '@fortawesome/free-solid-svg-icons';
import '../../css/Home.css';
import moment from 'moment';
import 'moment/locale/vi';

function HotPost() {
  const [listpost, setPost] = useState([]);
  const [currentIndexes, setCurrentIndexes] = useState([]); // Mảng lưu trữ chỉ số hiện tại của mỗi bài đăng
  const [districts, setdistricts] = useState([])

  useEffect(() => {
    fetch(`http://localhost:3000/listpost/2`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        // Khởi tạo mảng currentIndexes với giá trị 0 cho mỗi bài đăng
        setCurrentIndexes(new Array(data.length).fill(0));
      });
  }, []);

  useEffect(() => {
    fetch(`http://localhost:3000/post_location`)
      .then((res) => res.json())
      .then((data) => {
        setdistricts(data);
      });
  }, []);
  
  const getDistrict = (id_district) => {
  
    const district = districts.find(d => d.id_district === id_district);
    return district ? `${district.district_name}, ${district.city_name}` : 'Không xác định';
  };



  const nextImage = (postIndex) => {
    setCurrentIndexes((prevIndexes) => {
      const newIndexes = [...prevIndexes];
      const images = listpost[postIndex].images ? listpost[postIndex].images.split(',') : [];
      newIndexes[postIndex] = (newIndexes[postIndex] + 1) % images.length; // Chuyển đến ảnh tiếp theo
      return newIndexes;
    });
  };

  const prevImage = (postIndex) => {
    setCurrentIndexes((prevIndexes) => {
      const newIndexes = [...prevIndexes];
      const images = listpost[postIndex].images ? listpost[postIndex].images.split(',') : [];
      newIndexes[postIndex] = (newIndexes[postIndex] - 1 + images.length) % images.length; // Chuyển đến ảnh trước đó
      return newIndexes;
    });
  };

  return (
    <div >
      {/* Tin nổi bật */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ marginBottom: '15px', fontWeight:'bold', fontSize:'20px' }}>TIN NỔI BẬT</p>
        <div className="Products">
          {listpost.map((post, index) => {
            const images = post.images ? post.images.split(',') : [];
            const currentIndex = currentIndexes[index] || 0; // Lấy chỉ số ảnh hiện tại của bài đăng
            const countimages = images.length;
            console.log(countimages)
            return (
              <div className="Product" key={index}>
                <div style={{ position: 'relative'}}>
                  {images.length > 0 && (
                    <img
                      src={images[currentIndex]}
                      style={{ width: '275px', height: '160px' }}
                      alt={`${post.title}-${currentIndex}`}
                    />
                  )}
                  <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', display: 'flex', justifyContent: 'space-between' }}>
                    <button onClick={() => prevImage(index)} style={{ background: 'none', border: 'none' }}>
                    <FontAwesomeIcon icon={faAngleLeft} style={{color: 'white', fontSize:'20px'}} />
                    </button>
                    <button onClick={() => nextImage(index)} style={{ background: 'none', border: 'none' }}>
                    <FontAwesomeIcon icon={faAngleRight} style={{color: 'white', fontSize:'20px'}} />
                    </button>
                  </div>
                  <div className='Product_lenght_img'>
              <FontAwesomeIcon icon={faImage}  /> 
             <p> {countimages} </p>
              </div>
                </div>
                <div style={{ padding: '0px 10px' }}>
                  <p style={{ color: '#F7293D', fontWeight: 'bold', overflowWrap: 'break-word', marginTop: '10px', textTransform:'uppercase', fontSize:'15px' }}>{post.title}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p style={{color:'#F7293D'}}>{post.room_price} triệu/tháng</p>
                    <p style={{ marginRight: '17px' }}>{post.room_size} m²</p>
                  </div>
                  <p style={{ overflowWrap: 'break-word' }}>{getDistrict(post.id_district)}</p>
                  <p >Ngày: {moment(post.date_create).locale('vi').format('DD/MM/YYYY')}</p>
                  <div className="btn-heartproduct">
                    <FontAwesomeIcon className="btn_heart" icon={faHeart} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HotPost;
