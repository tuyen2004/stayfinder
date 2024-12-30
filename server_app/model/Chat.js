// model/Chat.js  
const mongoose = require('mongoose');  

const ChatSchema = new mongoose.Schema({  
    id_chat: { type: Number, unique: true, required: true },  
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],  
});  

module.exports = mongoose.model('Chat', ChatSchema);