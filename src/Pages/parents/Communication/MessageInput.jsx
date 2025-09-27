import React, { useState } from "react";

function MessageInput({ onSend }) {
    const [text, setText] = useState("");
    const [files, setFiles] = useState([]);

    const handleSend = () => {
        if (!text.trim() && !files.length) return;
        onSend(text, files);
        setText("");
        setFiles([]);
    };

    const handleFileChange = (e) => {
        setFiles([...e.target.files].filter((file) =>
            [".pdf", ".jpg", ".jpeg", ".png"].includes(file.name.slice(file.name.lastIndexOf(".")))
        ));
    };

    return (
        <div className="bg-white p-4 border-t flex flex-col sticky bottom-0 z-10 shadow-md">
            {files.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                    {files.map((file, index) => (
                        <span key={index} className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {file.name}
                        </span>
                    ))}
                </div>
            )}
            <div className="flex items-center">
                <label htmlFor="file-upload" className="text-gray-500 mr-3 hover:text-teal-600 cursor-pointer">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h8v4h4v12zm-6-3l-4-4h3V9h2v4h3l-4 4z" />
                    </svg>
                </label>
                <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} multiple />
                <button className="text-gray-500 mr-3 hover:text-teal-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 14v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                    </svg>
                </button>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-400 bg-gray-50 text-gray-800 text-sm"
                    rows="1"
                    style={{ minHeight: "40px", maxHeight: "100px" }}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
                />
                <button
                    onClick={handleSend}
                    className={`ml-3 text-teal-600 ${text.trim() || files.length ? "opacity-100 hover:text-teal-800" : "opacity-50"}`}
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default MessageInput;