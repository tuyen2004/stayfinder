import React from "react";
import '../../css/OrderManagement.css'
import { Link } from "react-router-dom";


function OrderManagement(){
     


    return(
        <div className="main-panel">
            <nav className="navbar navbar-default navbar-fixed">  
            <div className="container-fluid">  
                    <div className="navbar-header">  
                        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navigation-example-2">  
                            <span className="sr-only">Toggle navigation</span>  
                            <span className="icon-bar"></span>  
                            <span className="icon-bar"></span>  
                            <span className="icon-bar"></span>  
                        </button>  
                        <a className="navbar-brand" href="/#">Trang chủ</a>  
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
                                    <li><a href="/#">Notification 1</a></li>  
                                    <li><a href="/#">Notification 2</a></li>  
                                    <li><a href="/#">Notification 3</a></li>  
                                    <li><a href="/#">Notification 4</a></li>  
                                    <li><a href="/#">Another notification</a></li>  
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
    
                <div class="search-box">
                    <input type="text" placeholder="Nhập bài đăng cần tìm..." />
                    <span class="icon"></span>
                </div>

            
                <div class="title">Quản lí hóa đơn</div>

            
                <table>
                    <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã giao dịch</th>
                        <th>Tên người dùng</th>
                        <th>Số tiền</th>
                        <th>Ngày</th>
                        <th>Loại giao dịch</th>
                        <th>Phương thức thanh toán</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>1</td>
                        <td>FD234M1</td>
                        <td>User1</td>
                        <td>100.000 VNĐ</td>
                        <td>28/09/2024</td>
                        <td>Đăng bài</td>
                        <td>Zalo Pay</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>FD234M2</td>
                        <td>User6</td>
                        <td>200.000 VNĐ</td>
                        <td>28/09/2024</td>
                        <td>Gói bài đăng</td>
                        <td>MoMo</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>FD234M3</td>
                        <td>User2</td>
                        <td>50.000 VNĐ</td>
                        <td>28/09/2024</td>
                        <td>Gói bài đăng</td>
                        <td>MoMo</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>FD234M4</td>
                        <td>User3</td>
                        <td>100.000 VNĐ</td>
                        <td>28/09/2024</td>
                        <td>Đăng bài</td>
                        <td>Zalo Pay</td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td>FD234M5</td>
                        <td>User4</td>
                        <td>100.000 VNĐ</td>
                        <td>28/09/2024</td>
                        <td>Gói bài đăng</td>
                        <td>Zalo Pay</td>
                    </tr>
                    <tr>
                        <td>6</td>
                        <td>FD234M6</td>
                        <td>User5</td>
                        <td>100.000 VNĐ</td>
                        <td>28/09/2024</td>
                        <td>Đăng bài</td>
                        <td>MoMo</td>
                    </tr>
                    </tbody>
                </table>

                
                <div class="pagination">
                    <a href="/#">&lt;</a>
                    <a href="/#" class="active">1</a>
                    <a href="/#">2</a>
                    <a href="/#">3</a>
                    <a href="/#">&gt;</a>
                </div>
                </div>

        </div>
  
    )
}
export default OrderManagement;