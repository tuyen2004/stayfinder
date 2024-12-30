import React from 'react'

function Formlistfilter() {
  return (

    <div className='list-filter'>
      <ul className='filters' >
      <li>
          <ul className='filter'>
            <img style={{width:"100%"}} src="/images/1.png" />
          </ul>
        </li>
        <li>
          <ul className='filter'>
            <h5>Lọc Theo Giá Tiền</h5>
            <li>Dưới 1 triệu</li>
            <li>1 - 3 triệu</li>
            <li>3 - 5 triệu</li>
            <li>5 - 10 triệu</li>
            <li>10 - 40 triệu</li>
            <li>40 - 70 triệu</li>
            <li>70 - 100 triệu</li>
            <li>Trên 100 triệu</li>
          </ul>
        </li>
        <li >
            <ul className='filter'>
              <h5>Lọc theo diện tích</h5>
              <li>≤ 30 m²</li>
              <li>30 - 50 m²</li>
              <li>50 - 80 m²</li>
              <li>80 - 100 m²</li>
              <li>100 - 150 m²</li>
              <li>150 - 200 m²</li>
              <li>200 - 250 m²</li>
              <li>250 - 300 m²</li>
              <li>300 - 500 m²</li>
              <li>Trên 500 m²</li>
            </ul>
          </li>
          <li>
            <ul className='filter'>
              <h5>Loại bất động sản</h5>
              <li>Phòng trọ</li>
              <li>Căn hộ</li>
              <li>Tìm người ở ghép</li>
              <li>Nhà ở</li>
            </ul>
          </li>
        <li>
          <ul className='filter'>
            <h5>Lọc Theo Khu Vực</h5>
            <li>TP HỒ CHÍ MINH</li>
            <li>HÀ NỘI</li>
            <li>BÌNH DƯƠNG</li>
            <li>ĐỒNG NAI</li>
            <li>BÀ RIẠ</li>
          </ul>
         
        </li>
      </ul>
    </div>
 
  )
}

export default Formlistfilter