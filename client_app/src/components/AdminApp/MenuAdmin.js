import React, { useEffect, useState } from "react";  
import { Link, useLocation } from 'react-router-dom';   
 

const MenuAdmin = () => { 

 
    const location = useLocation();  
    const [activeLink, setActiveLink] = useState(location.pathname);  

    useEffect(() => {  
        setActiveLink(location.pathname);  
    }, [location]);   

   
    return (  
        <div style={{width: '260px', padding: '0', position: 'fixed'}} className="sidebar" data-color="blue">  
            <div style={{background: 'black'}} className="sidebar-wrapper">  
                <div className="logo">  
                    <Link to="/" className="simple-text">  
                        ADMIN  
                    </Link>  
                </div>  

                <ul className="nav"> 
                    <li>  
                        <Link to={"/admin"} className={activeLink === '/admin' ? "wpro" : ""}>  
                            <i className="fa fa-pie-chart"></i>
                            <p>Thống kê</p>  
                        </Link>  
                    </li> 
                    <li>  
                        <Link to={"/admin/quan-ly-danh-muc"} className={activeLink === '/admin/quan-ly-danh-muc' ? "wpro" : ""}>  
                        <i className="fa fa-list-alt"></i> 
                            <p>Quản lý danh mục</p>  
                        </Link>  
                    </li>  
                    <li>  
                        <Link to={"/admin/quan-ly-bai-dang"} className={activeLink === '/admin/quan-ly-bai-dang' ? "wpro" : ""}>  
                        <i className="fa fa-file-alt"></i>  
                            <p>Quản lý bài đăng</p>  
                        </Link>  
                    </li>  
                    <li>  
                        <Link to={"/admin/quan-ly-tai-khoan"} className={activeLink === '/admin/quan-ly-tai-khoan' ? "wpro" : ""}>  
                            <i className="fa fa-user"></i>
                            <p>Người dùng</p>  
                        </Link>  
                    </li>  
                    <li>  
                        <Link to={"/admin/don-hang"} className={activeLink === '/admin/don-hang' ? "wpro" : ""}>  
                            <i className="fa fa-shopping-cart"></i>
                            <p>Đơn hàng</p>  
                        </Link>  
                    </li>  
                    <li>  
                        <Link to={"/admin"} className={activeLink === '/thongbao' ? "wpro" : ""}>  
                            <i className="fa fa-bell"></i> 
                            <p>Thông báo</p>  
                        </Link>  
                    </li>

                </ul>  
            </div>  
        </div>  
    );  
};  

export default MenuAdmin;