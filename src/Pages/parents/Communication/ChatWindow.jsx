import React, { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

const placeholderImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAKlJREFUWMPt1jEKwCAMRNEP///L2Ep2Q8vOQIjDWHh3nUEELzIMnA0IsA6A8u7u7gXAf3j5aWlp6Qngf/j5aWlp6Qngf/j5aWlp6Qngf/j5aWlp6Qngf/j5aWlp6Qngf/j5aWlp6Qngf/j5aWlp6Qngf/j5aWlp6Qngf/j5aWlp6Qngf/j5aWlp6Qngf/j5aWlp6Qngf/j5aWlp6Qngf/j5aWlp6Qngf/j5aWlp6QnAAV2kB3eGcvYgAAAABJRU5ErkJggg==";

function ChatWindow({ chat, onSendMessage, onExit }) {
    const [filter, setFilter] = useState("All");
    const messagesEndRef = useRef(null);

    const filteredMessages = chat.messages.filter((msg) => {
        if (filter === "All") return true;
        if (filter === "Homework" && msg.text.toLowerCase().includes("homework")) return true;
        if (filter === "Events" && msg.text.toLowerCase().includes("event")) return true;
        if (filter === "Grades" && msg.text.toLowerCase().includes("grade")) return true;
        return false;
    });

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [filteredMessages]);

    const handleEscalate = () => {
        alert(`Escalating issue with ${chat.name} to administration.`);
    };

    const handleScheduleMeeting = () => {
        alert(`Scheduling a meeting with ${chat.name}. Select a time from the calendar.`);
        // Integrate with a calendar API here
    };

    return (
        <div className="flex-1 flex flex-col">
            <div className="bg-white p-4 shadow-md flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center">
                    <img src={placeholderImage} alt="profile" className="w-10 h-10 rounded-full mr-3 border-2 border-teal-200" />
                    <h2 className="text-lg font-semibold text-gray-800">{chat.name}</h2>
                </div>
                <div className="flex space-x-2">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="p-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-800"
                    >
                        <option value="All">All Messages</option>
                        <option value="Homework">Homework</option>
                        <option value="Events">Events</option>
                        <option value="Grades">Grades</option>
                    </select>
                    <button onClick={handleEscalate} className="text-red-500 hover:text-red-700" title="Escalate to Admin">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                        </svg>
                    </button>
                    <button onClick={handleScheduleMeeting} className="text-teal-600 hover:text-teal-800" title="Schedule Meeting">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                        </svg>
                    </button>
                    <button onClick={onExit} className="text-gray-500 hover:text-gray-700" title="Exit Chat">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">
                {filteredMessages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
            </div>
            <MessageInput onSend={onSendMessage} />
        </div>
    );
}

export default ChatWindow;