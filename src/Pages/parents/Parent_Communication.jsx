import React, { useState, useEffect } from "react";
import Sidebar from "./Parent_Sidebar"; // Main app sidebar
import Header from "./Parent_Header"; // App header
import CommSidebar from "./Communication/Sidebar"; // Messages sidebar
import ChatWindow from "./Communication/ChatWindow"; // Chat window

const initialConversations = [
  {
    id: 1,
    name: "Ms. Smith (Teacher)",
    preview: "Can we discuss Tim's homework?",
    timestamp: "2 hours ago",
    messages: [
      { id: 1, sender: "teacher", text: "Hi, can we discuss Tim's homework?", timestamp: "10:15 AM", status: "read" },
      { id: 2, sender: "parent", text: "Sure, what’s the issue?", timestamp: "10:17 AM", status: "delivered" },
    ],
    unread: 1,
  },
  {
    id: 2,
    name: "John Doe (Parent)",
    preview: "Meeting tomorrow?",
    timestamp: "1 day ago",
    messages: [],
    unread: 0,
  },
];

const Communication = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Main sidebar
  const [isCommSidebarOpen, setIsCommSidebarOpen] = useState(false); // Messages sidebar
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedChat, setSelectedChat] = useState(null);

  // Simulate real-time teacher messages (optional, can be replaced with WebSocket)
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedChat) {
        const newMessage = {
          id: Date.now(),
          sender: "teacher",
          text: "Just following up on this.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          status: "delivered",
        };
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === selectedChat.id
              ? { ...conv, messages: [...conv.messages, newMessage], preview: newMessage.text, timestamp: "Just now", unread: conv.unread + 1 }
              : conv
          )
        );
        setSelectedChat((prev) => (prev ? { ...prev, messages: [...prev.messages, newMessage] } : prev));
      }
    }, 15000); // Every 15 seconds
    return () => clearInterval(interval);
  }, [selectedChat]);

  const handleSendMessage = (text, files = []) => {
    if (!selectedChat || (!text.trim() && !files.length)) return;

    const newMessage = {
      id: Date.now(),
      sender: "parent",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
      files,
    };

    const updatedConversations = conversations.map((conv) =>
      conv.id === selectedChat.id
        ? { ...conv, messages: [...conv.messages, newMessage], preview: text || "File sent", timestamp: "Just now" }
        : conv
    );
    setConversations(updatedConversations);
    setSelectedChat({ ...selectedChat, messages: [...selectedChat.messages, newMessage] });

    // Simulate status updates
    setTimeout(() => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedChat.id
            ? {
                ...conv,
                messages: conv.messages.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg)),
              }
            : conv
        )
      );
      setSelectedChat((prev) => ({
        ...prev,
        messages: prev.messages.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg)),
      }));
    }, 1000);
    setTimeout(() => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedChat.id
            ? {
                ...conv,
                messages: conv.messages.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "read" } : msg)),
              }
            : conv
        )
      );
      setSelectedChat((prev) => ({
        ...prev,
        messages: prev.messages.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "read" } : msg)),
      }));
    }, 2000);
  };

  const handleNewConversation = (recipient) => {
    const newConversation = {
      id: Date.now(),
      name: recipient,
      preview: "",
      timestamp: "Just now",
      messages: [],
      unread: 0,
    };
    setConversations([newConversation, ...conversations]);
    setSelectedChat(newConversation);
  };

  const handleExitChat = () => {
    setSelectedChat(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
      <div className="flex w-full">
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1 overflow-auto lg:ml-64">
          <Header setIsSidebarOpen={setIsSidebarOpen} />
          <div className="flex h-[calc(100vh-64px)]">
            <button
              className="md:hidden p-4 text-teal-600"
              onClick={() => setIsCommSidebarOpen(!isCommSidebarOpen)}
            >
              ☰
            </button>
            <div
              className={`fixed inset-y-0 left-64 z-10 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
                isCommSidebarOpen ? "translate-x-0" : "-translate-x-full"
              } md:left-0`}
            >
              <CommSidebar
                conversations={conversations}
                onSelectChat={(chat) => {
                  setSelectedChat({ ...chat, unread: 0 });
                  setConversations((prev) =>
                    prev.map((conv) => (conv.id === chat.id ? { ...conv, unread: 0 } : conv))
                  );
                  setIsCommSidebarOpen(false);
                }}
                onNewConversation={handleNewConversation}
              />
            </div>
            <div className="flex-1 flex flex-col bg-gray-50">
              {selectedChat ? (
                <ChatWindow chat={selectedChat} onSendMessage={handleSendMessage} onExit={handleExitChat} />
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
                  Select a conversation to start chatting
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Communication;