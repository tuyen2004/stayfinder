import React from "react";   
import '../../css/CategoryManagement.css' 
 

const CategoryManagement = () => { 

    return (  
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
                                <a>  
                                    <p>Chưa đăng nhập!</p>  
                                </a>  
                            </li>  
                        <li className="separator hidden-lg hidden-md"></li>  
                    </ul>  
                </div>  
            </div>    
        </nav> 
        <div class="container-tuyen">
      <div class="search-box">
        <input type="text" placeholder="Nhập danh mục cần tìm..." />
        <span class="icon"></span>
       
      </div>

      <div class="title">Quản lí danh mục</div>
      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên danh mục</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Cho thuê phòng trọ</td>
            <td><span class="btn-status">Hiện</span></td>
            <td><button class="btn btn-edit">Sửa</button></td>
            <td><button class="btn btn-delete">Xóa</button></td>
          </tr>
          <tr>
            <td>2</td>
            <td>Cho thuê phòng trọ</td>
            <td><span class="btn-status">Hiện</span></td>
            <td><button class="btn btn-edit">Sửa</button></td>
            <td><button class="btn btn-delete">Xóa</button></td>
          </tr>
          <tr>
            <td>3</td>
            <td>Cho thuê phòng trọ</td>
            <td><span class="btn-status">Hiện</span></td>
            <td><button class="btn btn-edit">Sửa</button></td>
            <td><button class="btn btn-delete">Xóa</button></td>
          </tr>
          <tr>
            <td>4</td>
            <td>Cho thuê phòng trọ</td>
            <td><span class="btn-status">Hiện</span></td>
            <td><button class="btn btn-edit">Sửa</button></td>
            <td><button class="btn btn-delete">Xóa</button></td>
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
    );  
};  

export default CategoryManagement;