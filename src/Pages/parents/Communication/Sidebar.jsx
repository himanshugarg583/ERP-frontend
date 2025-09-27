import React, { useState } from "react";

const placeholderImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAKlJREFUWMPt1jEKwCAMRNEP///L2Ep2Q8vOQIjDWHh3nUEELzIMnA0IsA6A8u7u7gXAf3j5aWlp6Qngf/j5aWlp6Qngf/j5aWlp6Qngf/j5aWlp6Qngf/j5aWlp6Qngf/j5aWlp6Qngf/j5aWlp6Qngf/j5aWlp6Qngf/j5aWlp6Qngf/j5aWlp6Qngf/j5aWlp6Qngf/j5aWlp6Qngf/j5aWlp6Qngf/j5aWlp6QnAAV2kB3eGcvYgAAAABJRU5ErkJggg==";

function CommSidebar({ conversations, onSelectChat, onNewConversation }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [newRecipient, setNewRecipient] = useState("");

    const filteredConversations = conversations
        .filter((conv) => conv.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const handleNewConversation = () => {
        if (newRecipient.trim()) {
            onNewConversation(newRecipient);
            setNewRecipient("");
        }
    };

    return (
        <div className="h-full p-4 flex flex-col bg-white">
            <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm text-gray-800"
            />
            <div className="mb-4 flex space-x-2">
                <input
                    type="text"
                    placeholder="New recipient (e.g., Teacher Name)"
                    value={newRecipient}
                    onChange={(e) => setNewRecipient(e.target.value)}
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm text-gray-800"
                />
                <button
                    onClick={handleNewConversation}
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition shadow-md"
                >
                    +
                </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
                {filteredConversations.map((conv) => (
                    <div
                        key={conv.id}
                        className="flex items-center p-3 hover:bg-gray-100 cursor-pointer rounded-lg transition-all duration-200"
                        onClick={() => onSelectChat(conv)}
                    >
                        <div className="relative">
                            <img
                                src={placeholderImage}
                                alt="profile"
                                className="w-10 h-10 rounded-full mr-3 border-2 border-gray-200"
                            />
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between">
                                <span className="font-semibold text-gray-800 text-sm">{conv.name}</span>
                                <span className="text-xs text-gray-500">{conv.timestamp}</span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">{conv.preview}</p>
                        </div>
                        {conv.unread > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-2">{conv.unread}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CommSidebar;