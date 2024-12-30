
const Message = require("../model/Message");  
const Chat = require('../model/Chat');
const { io } = require('../server'); 

// Gửi tin nhắn  
exports.sendMessage = async (req, res) => {
  const { id_chat, id_receiver, message_content, post_title, image_url, stickers_url } = req.body;
  const id_sender = req.user.userId;

  // Kiểm tra nếu thiếu nội dung tin nhắn hoặc hình ảnh
  // if (!message_content && !image_url && !stickers_url) { // Cập nhật điều kiện kiểm tra  
  //   return res.status(400).json({ message: "Message content, image, or sticker is required." });  
  // }  

  try {
    const message = new Message({
      id_chat,
      id_sender,
      id_receiver,
      message_content: message_content || "", // Nếu không có nội dung, gán mặc định là chuỗi trống
      post_title: post_title || "", // Lưu post_title vào message
      image_url: image_url || "", 
      stickers_url: stickers_url || "",
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};




exports.getMessagesByChatId = async (req, res) => {  
  const { chat_id } = req.query;  
  try {  
    const messages = await Message.find({ id_chat: chat_id })  
      .populate('id_sender', 'username avatar')  // Lấy username của người gửi  
      .populate('id_receiver', 'username avatar'); // Lấy username và avatar của người nhận (giả sử id_receiver có cấu trúc là mảng các đối tượng)  
  
    res.status(200).json(messages);  
  } catch (error) {  
    res.status(400).json({ message: error.message });  
  }  
};

// Lấy danh sách các người đã nhắn tin với người dùng (chỉ lấy thông tin của người nhận và người gửi)
exports.getConversations = async (req, res) => {
  const userId = req.user.userId; // Lấy userId từ thông tin người dùng đã xác thực

  try {
    // Lấy tất cả các tin nhắn mà người dùng này đã tham gia
    const messages = await Message.find({
      $or: [{ id_sender: userId }, { id_receiver: userId }],
    })
      .populate('id_sender', 'username avatar')  // Lấy username và avatar của người gửi
      .populate('id_receiver', 'username avatar'); // Lấy username và avatar của người nhận

    // Lọc các cuộc trò chuyện (theo id_chat) để loại bỏ tin nhắn trùng lặp
    const conversations = [];

    messages.forEach((message) => {
      // Lọc thông tin người gửi và người nhận và thêm vào danh sách cuộc trò chuyện
      const conversation = {
        //_id: message.id_receiver._id,
        id_chat: message.id_chat,
        username: message.id_sender._id.toString() !== userId.toString() ? message.id_sender.username : message.id_receiver.username,
        avatar: message.id_sender._id.toString() !== userId.toString() ? message.id_sender.avatar : message.id_receiver.avatar,
      };

      // Kiểm tra xem cuộc trò chuyện này đã có trong danh sách chưa
      if (!conversations.some((conv) => conv.id_chat === conversation.id_chat)) {
        conversations.push(conversation);
      }
    });

    res.status(200).json(conversations); // Trả về danh sách các cuộc trò chuyện với `id_chat`
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createChat = async (req, res) => {  
  const { userId } = req.body; // Nhận ID người dùng muốn nhắn tin (người nhận)  
  const senderId = req.user.userId; // ID của người gửi từ req.user  

  try {  
      // Kiểm tra nếu đã tồn tại chat giữa hai người này  
      const existingChat = await Chat.findOne({  
          $or: [  
              { users: [senderId, userId] },  
              { users: [userId, senderId] }  
          ]  
      });  

      if (existingChat) {  
          return res.status(200).json({ chatId: existingChat.id_chat });  
      }  

      // Tạo chat mới nếu chưa tồn tại  
      const latestChat = await Chat.findOne().sort({ id_chat: -1 }).limit(1);  
      const newChatId = latestChat ? latestChat.id_chat + 1 : 1; // Tạo id_chat mới  

      const newChat = new Chat({   
          id_chat: newChatId, // Gán id_chat mới  
          users: [senderId, userId]   
      });  
      await newChat.save();  

      res.status(201).json({ chatId: newChat.id_chat });  
  } catch (error) {  
      res.status(400).json({ message: error.message });  
  }  
}; 

// Xóa tin nhắn  
exports.deleteMessage = async (req, res) => {  
  const { id } = req.params; 
  const userId = req.user.userId; 

  try {  
    // Tìm tin nhắn theo ID  
    const message = await Message.findById(id);  

    if (!message) {  
      return res.status(404).json({ message: "Tin nhắn không tồn tại đâu." }); 
    }  

    if (message.id_sender.toString() !== userId.toString()) {  
      return res.status(403).json({ message: "Token không đúng rồi." }); 
    }  
 
    await Message.findByIdAndDelete(id);  
    res.status(200).json({ message: "Delete được rồi nha." }); 
  } catch (error) {  
    res.status(400).json({ message: error.message });
  }  
};