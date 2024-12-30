import React, { useState, useEffect } from 'react';
import { Select, Input, Button, message } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
const { Option } = Select;

const FilterMenu = ({ onFilter }) => {
  const [price, setPrice] = useState('');
  const [area, setArea] = useState('');
  const [rentalType, setRentalType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');

  const handleReset = () => {
    setPrice('');
    setArea('');
    setRentalType('');
    setSearchTerm('');
    setSelectedProvince('');
    onFilter([]); // Gọi onFilter với dữ liệu trống để reset danh sách bài đăng
  };

  const handleFilter = async () => {
    try {
      const response = await fetch(`http://localhost:8000/filter?price=${price}&area=${area}&selectedProvince=${selectedProvince}&rentalType=${rentalType}&searchTerm=${searchTerm}`, {
        method: 'GET',
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      onFilter(data); // Gọi hàm onFilter được truyền từ cha
    } catch (error) {
      console.error('Error fetching filtered data:', error.message);
    }
  };
  
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('https://provinces.open-api.vn/api/?depth=1');
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setProvinces(data);
        } else {
          console.error('Data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };
    fetchProvinces();
  }, []);

  return (
    <div className='form-menu'>
      <div className="form-search">
        <i className='fa-solid fa-magnifying-glass'></i>
        <Input
          placeholder='Tìm nhanh. VD: Vinhomes Central Park'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <Select
        value={rentalType}
        onChange={setRentalType}
        placeholder="Chọn loại hình"
      >
        <Option value="">Loại hình cho thuê</Option>
        <Option value="cho-thue-phong-tro">Cho thuê phòng trọ</Option>
        <Option value="tim-nguoi-o-ghep">Tìm người ở ghép</Option>
        <Option value="cho-thue-can-ho">Cho thuê căn hộ</Option>
        <Option value="cho-thue-nha-o">Cho thuê nhà ở</Option>
      </Select>
      <Select
        value={selectedProvince}
        onChange={setSelectedProvince}
        placeholder="Chọn tỉnh/thành phố"
      >
        <Option value="">Chọn tỉnh để lọc</Option>
        {provinces.map((province) => (
          <Option key={province.code} value={province.code}>
            {province.name}
          </Option>
        ))}
      </Select>

      <Select
        value={price}
        onChange={setPrice}
        placeholder="Chọn giá"
      >
        <Option value="">Lọc theo giá</Option>
        <Option value="0-2000000">Dưới 2 triệu</Option>
        <Option value="2000000-5000000">2 triệu - 5 triệu</Option>
        <Option value="5000000-10000000">5 triệu - 10 triệu</Option>
        <Option value="10000000">Trên 10 triệu</Option>
      </Select>

      <Select
        value={area}
        onChange={setArea}
        placeholder="Chọn diện tích"
      >
        <Option value="">Loại theo diện tích</Option>
        <Option value="0-25">Dưới 25 m²</Option>
        <Option value="25-50">25 m² - 50 m²</Option>
        <Option value="50-100">50 m² - 100 m²</Option>
        <Option value="100">Trên 100 m²</Option>
      </Select>

      <Button type="primary" onClick={handleFilter}>Lọc</Button>
      <Button icon={<RedoOutlined />} onClick={handleReset} className='button-reset' /> 
    </div>
  );
};

export default FilterMenu;
