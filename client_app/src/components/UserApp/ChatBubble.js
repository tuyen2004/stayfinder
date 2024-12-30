import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import "../../css/Messinger.css";

const ChatBubble = () => {
  const [showInput, setShowInput] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTime, setShowTime] = useState({});
  const [zoom, setZoom] = useState(2); // Tỷ lệ zoom
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [recipient, setRecipient] = useState(null);
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageIcon, setShowImageIcon] = useState(true);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [stickers, setStickers] = useState([]);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const socket = useRef(null);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const fetchStickers = async () => {
    try {
      const response = await axios.get(
        "https://api.giphy.com/v1/stickers/trending?api_key=a7BnU0qEWvKRlmxLPimgWv2makfF6NaQ&limit=100"
      );
      setStickers(response.data.data); // Lưu nhãn dán vào state
    } catch (error) {
      console.error("Error fetching stickers:", error);
    }
  };
  useEffect(() => {
    if (showStickerPicker) {
      fetchStickers(); // Gọi API khi bảng nhãn dán cần hiển thị
    }
  }, [showStickerPicker]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleImageChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      // Tạo URL tạm thời cho mỗi ảnh
      const imageUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );

      // Lưu lại vào state
      setSelectedImage(imageUrls);
      setSelectedImageFile(files);

      // blob cleanup
      return () => {
        imageUrls.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  };

  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/upload-image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Upload response:", response);

      if (
        response.data &&
        response.data.imageUrls &&
        response.data.imageUrls.length > 0
      ) {
        return response.data.imageUrls;
      } else {
        console.error("Không có imageUrls trong phản hồi từ server.");
        return [];
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return [];
    }
  };

  const handleRemoveImage = (index) => {
    setSelectedImage((prevImages) => {
      const newImages = prevImages.filter((_, i) => i !== index);
      setSelectedImageFile((prevFiles) => {
        // Loại bỏ ảnh đã bị xóa khỏi selectedImageFile
        const newFiles = Array.from(prevFiles).filter((_, i) => i !== index);
        return newFiles;
      });
      return newImages;
    });
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setShowImageModal(true); // Mở modal
  };

  const handleEmojiClick = (emoji) => {
    setNewMessage((prevMessage) => prevMessage + emoji.emoji);
    setShowEmojiPicker(false);
  };

  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.5, 1));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    socket.current = io("http://localhost:8000", {
      query: { token: token },
    });

    // Clean up khi component unmounted
    return () => {
      socket.current.disconnect(); // Ngắt kết nối khi component rời khỏi
    };
  }, []);
  useEffect(() => {
    socket.current.on("messageReceived", (message) => {
      console.log("Received message: ", message);
      if (message.id_sender._id !== userId) {
        setMessages((prevMessages) => {
          const exists = prevMessages.some((msg) => msg._id === message._id);
          if (!exists) {
            return [...prevMessages, message];
          }
          return prevMessages;
        });
        // Tăng unreadCount chỉ khi tin nhắn mới được thêm
        setUnreadCount((prevCount) => prevCount + 1);
      }
    });
  }, [userId]);

  const handleStickerClick = async (stickerUrl) => {
    setSelectedSticker(stickerUrl);

    // Tạo một tin nhắn chứa nhãn dán
    const messageData = {
      id_chat: selectedConversation?.id_chat,
      id_sender: userId,
      id_receiver: recipient?._id,
      stickers_url: stickerUrl,
      time_send: new Date(),
    };

    // Tạo một tin nhắn giả lập để hiển thị
    const sentMessage = {
      ...messageData,
      _id: new Date().getTime(),
      sendingStatus: "Đang gửi",
      id_sender: { _id: userId },
    };

    // Thêm tin nhắn vào danh sách hiển thị
    setMessages((prevMessages) => [...prevMessages, sentMessage]);

    socket.current.emit("sendMessage", messageData);

    // Đặt lại trạng thái bảng nhãn dán
    setShowStickerPicker(false);
    setSelectedSticker(null);

    // Cuộn xuống dưới cùng sau khi gửi
    scrollToBottom();
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !selectedImageFile && !selectedSticker) {
      return; // Điều kiện không gửi
    }

    const messageData = {
      id_chat: selectedConversation.id_chat,
      id_sender: userId,
      id_receiver: recipient._id,
      message_content: newMessage,
      stickers_url: selectedSticker,
      time_send: new Date(),
    };

    // Tạo một tin nhắn giả lập để hiển thị
    const sentMessage = {
      ...messageData,
      _id: new Date().getTime(),
      sendingStatus: "Đang gửi",
      id_sender: { _id: userId },
    };

    // Thêm tin nhắn vào danh sách tin nhắn
    setMessages((prevMessages) => [...prevMessages, sentMessage]);

    // Nếu có hình ảnh
    if (selectedImageFile && selectedImageFile.length > 0) {
      try {
        // Upload tất cả các ảnh & lấy các URL
        const uploadPromises = Array.from(selectedImageFile).map((file) =>
          uploadImage(file)
        );
        const imageUrls = await Promise.all(uploadPromises); // Chờ tất cả ảnh được tải lên

        if (imageUrls.length > 0) {
          // Cập nhật lại dữ liệu tin nhắn với mảng hình ảnh
          messageData.image_url = JSON.stringify(imageUrls);

          // Cập nhật lại tin nhắn đã gửi với hình ảnh
          const updatedSentMessage = {
            ...sentMessage,
            image_url: messageData.image_url,
            sendingStatus: "Đã gửi",
          };

          // Cập nhật lại tin nhắn đã gửi với hình ảnh vào danh sách
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg._id === sentMessage._id ? updatedSentMessage : msg
            )
          );

          // Gửi tin nhắn
          socket.current.emit("sendMessage", messageData);
        }
      } catch (error) {
        console.error("Error uploading images:", error);
      }
    } else {
      // Nếu không có hình ảnh, chỉ cần thay đổi trạng thái gửi
      sentMessage.sendingStatus = "Đã gửi";
      socket.current.emit("sendMessage", messageData);
    }

    // Reset input và cuộn xuống dưới
    setNewMessage("");
    setSelectedImage(null);
    setSelectedSticker(null);
    setSelectedImageFile(null);
    setShowImageIcon(true);
    scrollToBottom();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Ngăn chặn hành động của phím Enter
      handleSendMessage(); // Gửi tin nhắn
    }
  };

  useEffect(() => {
    if (selectedConversation && selectedConversation.id_chat) {
      setIsLoading(true);
      fetchMessages(selectedConversation.id_chat);
      setUnreadCount(0);
    } else {
      console.error("Null chat_id.");
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!showInput) {
      fetchConversations();
    }
  }, [showInput]);

  const fetchMessages = async (chatId) => {
    if (!chatId) {
      console.error("No valid chat_id provided");
      return; // Nếu không có chatId hợp lệ thì không làm gì thêm
    }

    setLoading(true);
    setIsLoadingAvatar(true);

    try {
      console.log("Fetching messages for chat_id:", chatId);
      const response = await axios.get(
        `http://localhost:8000/api/messages?chat_id=${chatId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const filteredMessages = response.data.filter(
        (message) =>
          message.id_sender._id === userId || message.id_receiver._id === userId
      );

      let recipientInfo = null;

      if (filteredMessages.length > 0) {
        const lastMessage = filteredMessages[filteredMessages.length - 1];
        recipientInfo =
          lastMessage.id_sender._id === userId
            ? lastMessage.id_receiver
            : lastMessage.id_sender;
      }

      setMessages(filteredMessages);
      setRecipient(recipientInfo);
      setIsLoadingAvatar(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/conversations",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setConversations(response.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };
  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    setShowInput(true);
    setIsVisible(true);
    setIsLoading(true);

    setUnreadCount(0); // Reset khi chọn cuộc hội thoại
    socket.current.emit("joinChat", conversation.id_chat);
    fetchMessages(conversation.id_chat);
  };

  const handleMessageClick = (messageId) => {
    setShowTime((prevShowTime) => ({
      ...prevShowTime,
      [messageId]: !prevShowTime[messageId],
    }));
  };

  const handleCloseChat = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShowInput(false); // Đóng input

      setSelectedConversation(null); // Reset selectedConversation về null khi đóng chat
    }, 300);
  };

  const handleBackToConversations = () => {
    setSelectedConversation(null); // Đặt lại cuộc hội thoại đã chọn
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleBackToConversations(); //Esc
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup function để xóa lắng nghe khi component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div>
      {!showInput ? (
        <div className="chat-bubble" onClick={() => setShowInput(true)}>
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          <div className="chat-icon">💬</div>
        </div>
      ) : selectedConversation ? (
        <div
          className="chat-container"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          <div className="header-chat">
            <div className="chat-avt-name">
              {isLoadingAvatar ? (
                <div className="spinner"></div>
              ) : recipient && recipient.avatar ? (
                <img
                  className="avatar"
                  src={`http://localhost:8000/img/${recipient.avatar.replace(
                    /^public\\img\\/,
                    ""
                  )}`}
                  alt="Avatar"
                />
              ) : (
                <img
                  className="avatar"
                  src="/images/none_img.png"
                  alt="Avatar"
                />
              )}
              <div className="username">
                {isLoadingAvatar
                  ? "..."
                  : recipient
                  ? recipient.username
                  : "Loading..."}
              </div>
            </div>
            <button onClick={handleCloseChat} className="close-button">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="message-container">
            {isLoading ? (
              <div className="spinner"></div>
            ) : loading ? (
              <div>Loading...</div>
            ) : messages.length > 0 ? (
              messages.map((message) => {
                const isSentByUser = message.id_sender._id === userId;
                const imageUrls = message.image_url
                  ? JSON.parse(message.image_url)
                  : [];

                const hasTextContent =
                  message.message_content &&
                  message.message_content.trim() !== "";
                const hasImages = imageUrls.length > 0;
                return (
                  <>
                    <div className="post-title-message">
                      {message.post_title}
                    </div>
                    {hasImages && (
                      <div
                        className={`message-image ${
                          isSentByUser ? "sent-images" : "received-images"
                        }`}
                      >
                        {imageUrls.map((url, index) => (
                          <img
                            key={index}
                            src={`http://localhost:8000${url}`}
                            alt={`Message Attachment ${index + 1}`}
                            className="message-image-send-messager"
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "0",
                              objectFit: "cover",
                              marginRight: "0",
                              marginBottom: "10px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleImageClick(`http://localhost:8000${url}`)
                            }
                          />
                        ))}
                      </div>
                    )}
                    <div
                      key={message._id}
                      className={`message ${
                        isSentByUser ? "sent" : "received"
                      }`}
                      onClick={() => handleMessageClick(message._id)}
                    >
                      <div
                        className={
                          isSentByUser ? "sent-message" : "received-message"
                        }
                      >
                        {message.stickers_url && (
                          <img
                            src={message.stickers_url}
                            alt="Sticker"
                            className="sticker-image"
                          />
                        )}
                        {showImageModal && (
                          <div
                            className="image-modal"
                            onClick={() => setShowImageModal(false)}
                          >
                            <div
                              className="image-modal-content"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <img
                                style={{
                                  width: "34%",
                                  height: "24%",
                                  borderRadius: "0",
                                  marginRight: "0",
                                  transform: `scale(${zoom})`,
                                  transition: "transform 0.3s ease",
                                }}
                                src={selectedImageUrl}
                                alt="Expanded View"
                                className="image-modal-img"
                              />
                              <button
                                className="image-modal-close"
                                onClick={() => setShowImageModal(false)}
                              >
                                <i
                                  style={{ width: "12px" }}
                                  className="fas fa-times"
                                ></i>
                              </button>
                              <div className="zoom-controls">
                                <button
                                  onClick={handleZoomIn}
                                  className="zoom-in"
                                >
                                  <i className="fas fa-plus"></i>{" "}
                                </button>
                                <button
                                  onClick={handleZoomOut}
                                  className="zoom-out"
                                >
                                  <i className="fas fa-minus"></i>{" "}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {hasTextContent && (
                          <div className="text">{message.message_content}</div>
                        )}
                        {showTime[message._id] && (
                          <span className="time">
                            {new Date(message.time_send).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                );
              })
            ) : (
              <div>No messages to display.</div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <>
            <div className="input-container">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="image-input"
                style={{ display: "none" }}
                id="imageInput"
                multiple
              />
              <label
                htmlFor="imageInput"
                className="image-input-label"
                style={{ display: showImageIcon ? "inline" : "none" }}
              >
                <svg
                  viewBox="0 0 12 13"
                  width="20"
                  height="20"
                  fill="currentColor"
                  class="xfx01vb x1lliihq x1tzjh5l x1k90msu x2h7rmj x1qfuztq"
                >
                  <g fill-rule="evenodd" transform="translate(-450 -1073)">
                    <g>
                      <path
                        d="M99.825 918.322a2.55 2.55 0 0 1 .18-.712l-.489.043a1.601 1.601 0 0 0-.892.345 1.535 1.535 0 0 0-.557 1.321l.636 7.275c.01.12.186.123.199.003l.923-8.275zm4.67 1.591a1 1 0 1 1-1.991.175 1 1 0 0 1 1.991-.175m3.099 1.9a.422.422 0 0 0-.597-.05l-1.975 1.69a.288.288 0 0 0-.032.404l.442.526a.397.397 0 0 1-.606.51l-1.323-1.576a.421.421 0 0 0-.58-.063l-1.856 1.41-.265 2.246c-.031.357.173 1.16.53 1.19l6.345.397c.171.014.395-.02.529-.132.132-.111.38-.49.396-.661l.405-4.239-1.413-1.652z"
                        transform="translate(352 156.5)"
                      ></path>
                      <path
                        fill-rule="nonzero"
                        d="m107.589 928.97-6.092-.532a1.56 1.56 0 0 1-1.415-1.687l.728-8.328a1.56 1.56 0 0 1 1.687-1.416l6.091.533a1.56 1.56 0 0 1 1.416 1.687l-.728 8.328a1.56 1.56 0 0 1-1.687 1.415zm.087-.996.06.002a.561.561 0 0 0 .544-.508l.728-8.328a.56.56 0 0 0-.507-.604l-6.09-.533a.56.56 0 0 0-.605.507l-.728 8.328a.56.56 0 0 0 .506.604l6.092.532z"
                        transform="translate(352 156.5)"
                      ></path>
                    </g>
                  </g>
                </svg>
                <span className="tooltip-text">Đính kèm file</span>
              </label>
              <label
                onClick={() => setShowStickerPicker(!showStickerPicker)}
                className="sticker-button"
                style={{ display: showImageIcon ? "inline" : "none" }}
              >
                <svg
                  viewBox="0 0 12 13"
                  width="20"
                  height="20"
                  fill="currentColor"
                  class="xfx01vb x1lliihq x1tzjh5l x1k90msu x2h7rmj x1qfuztq"
                >
                  <g fill-rule="evenodd" transform="translate(-450 -1073)">
                    <g>
                      <path
                        d="M106.617 923.049c-1.583.777-2.986 2.756-3.063 4.32a2.962 2.962 0 0 1-.554 1.6 6.977 6.977 0 0 0 3.76-2.66 6.62 6.62 0 0 0 1.224-4.31c-.335.414-.792.768-1.367 1.05"
                        transform="translate(354 156)"
                      ></path>
                      <path
                        d="M101.685 926.713a.513.513 0 0 1-.454.287.495.495 0 0 1-.25-.07 3.42 3.42 0 0 1-1.44-1.657c-.112-.282.011-.609.275-.729.263-.12.567.012.68.294.179.45.529.848.987 1.12.25.149.34.487.202.755M99 922.5c0-.551.449-1 1-1 .551 0 1 .449 1 1a1.001 1.001 0 0 1-2 0m5.5-2c.551 0 1 .449 1 1a1.001 1.001 0 1 1-1-1m-1.908 6.813c.094-1.923 1.704-4.25 3.59-5.188 1.14-.568 1.605-1.391 1.423-2.512l-.015-.084c-.24-1.332-1.533-2.228-2.889-1.992l-6.137 1.062a2.479 2.479 0 0 0-1.622 1.025 2.413 2.413 0 0 0-.403 1.824l1.082 6.023c.214 1.19 1.269 2.029 2.455 2.029.08 0 .161-.013.242-.021 1.37-.267 2.221-1.07 2.274-2.166"
                        transform="translate(354 156)"
                      ></path>
                    </g>
                  </g>
                </svg>
                <span className="tooltip-text-icon-sticker">Chọn nhãn dán</span>
              </label>

              {!showImageIcon && (
                <label
                  onClick={() => setShowImageIcon(true)}
                  className="image-input-label true-label"
                >
                  <div
                    aria-expanded="false"
                    aria-haspopup="menu"
                    aria-label="Mở hành động khác"
                    class="x1i10hfl xjqpnuy xa49m3k xqeqjp1 x2hbi6w x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi x1ypdohk xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x87ps6o x1lku1pv x1a2a7pz x6s0dn4 xzolkzo x12go9s9 x1rnf11y xprq8jg x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x78zum5 xl56j7k xexx8yu x4uap5 x18d9i69 xkhd6sd x1n2onr6 xc9qbxq x14qfxbe xjbqb8w"
                    role="button"
                    tabindex="0"
                  >
                    <svg
                      viewBox="0 0 12 13"
                      width="20"
                      height="20"
                      fill="currentColor"
                      class="xfx01vb x1lliihq x1tzjh5l x1k90msu x2h7rmj x1qfuztq"
                    >
                      <g fill-rule="evenodd" transform="translate(-450 -1073)">
                        <path d="M459 1080.25h-2.25v2.25c0 .412-.337.75-.75.75a.752.752 0 0 1-.75-.75v-2.25H453a.752.752 0 0 1-.75-.75c0-.412.337-.75.75-.75h2.25v-2.25c0-.412.337-.75.75-.75s.75.338.75.75v2.25H459c.413 0 .75.338.75.75s-.337.75-.75.75m-3-6.75c-3.308 0-6 2.691-6 6s2.692 6 6 6 6-2.691 6-6-2.692-6-6-6"></path>
                      </g>
                    </svg>
                    <div
                      class="x1ey2m1c xds687c x17qophe xg01cxk x47corl x10l6tqk x13vifvy x1ebt8du x19991ni x1dhq9h xzolkzo x12go9s9 x1rnf11y xprq8jg"
                      role="none"
                      data-visualcompletion="ignore"
                    ></div>
                  </div>
                </label>
              )}

              <label
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="emoji-button"
              >
                <svg
                  viewBox="0 0 12 13"
                  width="20"
                  height="20"
                  fill="currentColor"
                  class="xfx01vb x1lliihq x1tzjh5l x1k90msu x2h7rmj x1qfuztq"
                >
                  <g fill-rule="evenodd" transform="translate(-450 -1073)">
                    <path d="M458.508 1078.5a1 1 0 1 1-.015-2.002 1 1 0 0 1 .015 2.002m-.037 1.668c-.324.91-1.273 1.832-2.46 1.832h-.002c-1.2 0-2.157-.922-2.48-1.832a.5.5 0 1 1 .942-.335c.204.573.835 1.167 1.538 1.167h.001c.692 0 1.315-.593 1.519-1.168a.5.5 0 0 1 .942.335m-5.971-2.667a1 1 0 1 1 2 0 1 1 0 0 1-2 0m3.5-3.5a5.506 5.506 0 0 0-5.5 5.5c0 3.033 2.467 5.5 5.5 5.5s5.5-2.467 5.5-5.5-2.467-5.5-5.5-5.5"></path>
                  </g>
                </svg>
                <span className="tooltip-text-icon">
                  Chọn biểu tượng cảm xúc
                </span>
              </label>

              {selectedImage && selectedImage.length > 0 && (
                <div className="selected-image-preview">
                  {selectedImage.map((url, index) => (
                    <div
                      key={index}
                      className="selected-image-container"
                      style={{ position: "relative" }}
                    >
                      <img
                        src={url}
                        alt={`Selected Image ${index + 1}`}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="remove-image-btn"
                        style={{
                          position: "absolute",
                          top: "0",
                          right: "5px",
                          background: "none",
                          border: "none",
                          color: "white",
                          fontSize: "16px",
                          cursor: "pointer",
                          padding: "0",
                          zIndex: 1,
                        }}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                className="message-input"
                value={newMessage}
                onChange={(e) => {
                  const messageContent = e.target.value;
                  setNewMessage(messageContent);

                  if (messageContent.trim() === "") {
                    setShowImageIcon(true);
                  } else {
                    setShowImageIcon(false);
                  }
                }}
                onKeyDown={handleKeyDown}
              />

              <label
                style={{ paddingLeft: "8px" }}
                className="btn-button"
                onClick={handleSendMessage}
              >
                <svg
                  viewBox="0 0 12 13"
                  width="20"
                  height="20"
                  fill="currentColor"
                  class="xfx01vb x1lliihq x1tzjh5l x1k90msu x2h7rmj x1qfuztq"
                  style={{ color: "rgba(0, 153, 255, 0.6)" }}
                >
                  <g fill-rule="evenodd" transform="translate(-450 -1073)">
                    <path d="m458.371 1079.75-6.633.375a.243.243 0 0 0-.22.17l-.964 3.255c-.13.418-.024.886.305 1.175a1.08 1.08 0 0 0 1.205.158l8.836-4.413c.428-.214.669-.677.583-1.167-.06-.346-.303-.633-.617-.79l-8.802-4.396a1.073 1.073 0 0 0-1.183.14c-.345.288-.458.77-.325 1.198l.963 3.25c.03.097.118.165.22.17l6.632.375s.254 0 .254.25-.254.25-.254.25"></path>
                  </g>
                </svg>
              </label>
            </div>
            <div style={{ position: "absolute", top: "60px" }}>
              {showEmojiPicker && (
                <EmojiPicker
                  style={{ width: "400px" }}
                  onEmojiClick={handleEmojiClick}
                />
              )}
            </div>
            {showStickerPicker && (
              <div className="sticker-picker">
                <div className="sticker-container">
                  {stickers.map((sticker, index) => (
                    <img
                      key={index}
                      src={sticker.images.fixed_height.url}
                      alt={`Sticker ${index}`}
                      className="sticker"
                      onClick={() =>
                        handleStickerClick(sticker.images.fixed_height.url)
                      } // Chọn nhãn dán
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        </div>
      ) : (
        <div className="conversations-list show">
          <div className="conversations-list-message">
            <div>Đoạn chat của bạn</div>
            <button
              onClick={handleCloseChat}
              className="close-button close-clone"
            >
              <i style={{ width: "12px" }} className="fas fa-times"></i>
            </button>
          </div>
          {conversations.length === 0 ? (
            <div>Không có tin nhắn nào!</div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id_chat}
                className="conversation-item"
                onClick={() => handleConversationSelect(conversation)}
              >
                <div>
                  <img
                    className="conversation-avatar"
                    src={
                      conversation.avatar
                        ? `http://localhost:8000/img/${conversation.avatar.replace(
                            /^public\\img\\/,
                            ""
                          )}`
                        : "/images/none_img.png"
                    }
                    alt="Avatar"
                  />
                </div>
                <div className="conversation-user">{conversation.username}</div>
                {conversation.unreadCount > 0 && (
                  <span className="badge">{conversation.unreadCount}</span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
