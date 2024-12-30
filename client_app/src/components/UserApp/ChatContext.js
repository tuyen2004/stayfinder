import React, { createContext, useContext, useState } from 'react';  

const ChatContext = createContext();  

const ChatProvider = ({ children }) => {  
    const [isOpen, setIsOpen] = useState(false);  
    const [selectedConversation, setSelectedConversation] = useState(null);  

    return (  
        <ChatContext.Provider value={{ isOpen, setIsOpen, selectedConversation, setSelectedConversation }}>  
            {children}  
        </ChatContext.Provider>  
    );  
};  

export const useChat = () => useContext(ChatContext);  
export default ChatProvider;