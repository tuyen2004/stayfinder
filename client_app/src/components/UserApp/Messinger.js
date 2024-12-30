import '../../css/Messinger.css';
import React from 'react'

function Messinger() {
  return (
    <div className="body-pro-abc">
        <div className="container-pro-abc">  
            <div className="sidebar-thai">  
                <input type="text" placeholder="Nhập ít nhất 3 ký tự để tìm kiếm" className="search-input"/> 
                <div className="seltect">
                    <select className="filterpropt">  
                        <option>Tất cả</option> 
                        <option>Tin nhắn</option> 
                    </select>
                    <div>
                        <img src="/img/setting.svg" alt="ảnh"/> 
                    </div> 
                </div> 
                <div className="user">  
                    <a href="/#">
                        <div className="user-info"> 
                            <img src="/img/1509529.jfif" alt="User" className="user-avatar"/>
                            <div className="pham">   
                                <span className="user-name">Phạm Mạnh - <span>26 phút trước</span></span>  
                                <span className="user-time">14 phòng trọ 7,87x25 mặt tiền Đ...</span>
                            </div> 
                        </div>
                    </a>
                    <img src="/img/077d225e8913e945383f7d1248a61d51-2813172508294858820.jpg" className="room-avatar" alt="User" />  
                </div>  <hr/>
                <a href='/#' className="bottomproptn">
                    <img className='hidei-img' src='/img/hide.svg' alt=''/>
                    Ẩn hội thoại
                </a>
            </div>   
            <div className="chat-window">  
                <div className="chat-header">
                    <div className="space-betweenpt">
                        <div className="space-betweenptptt">
                            <div className="chat-header-imgpro-margin"><img className="chat-header-imgpro" src="/img/1509529.jfif" alt=""/></div> 
                            <div className="colum">
                                <span className="chat-name">Phạm Mạnh</span>  
                                <span className="chat-status"><span className="background-colorr"></span>Hoạt động 26 phút trước</span>
                            </div> 
                        </div>
                        <div className="settingpt">
                            <img src="/img/moreVertical.svg" alt=""/>
                        </div>  
                    </div>
                </div>
                <div className="chat-room">
                    <img className="chat-room-with" src="/img/077d225e8913e945383f7d1248a61d51-2813172508294858820.jpg" alt=""/>
                    <div className="chat-room-receivedd">
                        <div className="chat-room-receivedd-room">14 phòng trọ 7,87x25 mặt tiền Đông Thạnh 1-3 ấp 6</div>
                        <div className="chat-room-receivedd-dola">8,2 tỷ</div>
                    </div>
                </div>
                <div className="chat-time">
                    <div className="chat-time-category">
                        Thứ 6, 27/09/2024
                    </div>
                </div>  
                <div className="chat-messages">  
                    <div className="message received">
                        <span className="message-text">Nhà này còn không ạ?</span>
                        <span className="message-time">13:55</span>  
                    </div>  
                    <div className="message sent">     
                        <span className="message-text">Còn anh nhé.</span> 
                        <span className="message-time">14:01</span> 
                    </div>  
                </div>
                <div className="display-flexpro"> 
                    <img className="display-flexpro-marginpro" src="/img/gallery.svg" alt=""/>
                    <input type="text" placeholder="Nhập tin nhắn" className="message-input"/>
                    <button className='btn-buttonpro'><img className="send-graypt" src="/img/send-gray.svg" alt=""/></button> 
                </div> 
            </div>  
        </div>  
    </div>  
  )
}

export default Messinger;