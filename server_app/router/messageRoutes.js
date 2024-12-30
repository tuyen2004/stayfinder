const express = require('express');  
const { sendMessage, getMessagesByChatId, deleteMessage, getConversations, createChat } = require('../controllers/messageController');  
const authenticateToken = require('../middleware/auth'); // Import middleware  
const router = express.Router();  

// Sử dụng middleware authenticateToken để bảo vệ các route  
router.post('/messages', authenticateToken, sendMessage);  
router.get('/messages', authenticateToken, getMessagesByChatId);  
router.delete('/messages/:id', authenticateToken, deleteMessage);
router.get('/conversations', authenticateToken, getConversations);
router.post('/create-chat', authenticateToken, createChat); 

module.exports = router;