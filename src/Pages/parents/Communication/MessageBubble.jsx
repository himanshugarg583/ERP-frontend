function MessageBubble({ message }) {
    const isParent = message.sender === "parent";

    return (
        <div className={`flex ${isParent ? "justify-start" : "justify-end"} mb-4`}>
            <div
                className={`max-w-[70%] p-3 rounded-xl shadow-md text-white ${isParent ? "bg-blue-500" : "bg-green-500"}`}
            >
                <p className="text-sm leading-relaxed">{message.text}</p>
                {message.files?.map((file, index) => (
                    <div key={index} className="mt-2">
                        {file.type.startsWith("image/") ? (
                            <img
                                src={URL.createObjectURL(file)}
                                alt="attachment"
                                className="w-20 h-20 rounded-lg cursor-pointer"
                                onClick={() => window.open(URL.createObjectURL(file), "_blank")}
                            />
                        ) : (
                            <a
                                href={URL.createObjectURL(file)}
                                download={file.name}
                                className="text-xs underline hover:text-gray-200"
                            >
                                {file.name}
                            </a>
                        )}
                    </div>
                ))}
                <div className="flex justify-between items-center mt-1 text-xs opacity-80">
                    <span>{message.timestamp}</span>
                    <span>
                        {message.status === "read" ? "✓✓" : message.status === "delivered" ? "✓✓" : "✓"}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default MessageBubble;