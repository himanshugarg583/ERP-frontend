import React, { useState } from 'react';
import { 
  FaBars, FaSearch, FaBell, FaEnvelope, FaUser, 
  FaCog, FaSignOutAlt, FaBook, FaCalendarAlt, FaBullhorn, FaReply 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const StudentNavbar = ({ setIsSidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false); // New state for compose modal
  const [notificationCount, setNotificationCount] = useState(3);
  const [mailCount, setMailCount] = useState(5);
  const [newMessage, setNewMessage] = useState({ to: '', subject: '', body: '' }); // State for new message
  const [replyTo, setReplyTo] = useState(null); // State for replying to a specific mail
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleNotificationClick = () => {
    setNotificationCount(0);
    setIsNotificationOpen((prev) => !prev);
  };

  const handleMailClick = () => {
    setMailCount(0);
    setIsMailOpen((prev) => !prev);
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    navigate('/student/profile');
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  // Sample notifications
  const notifications = [
    { id: 1, type: 'assignment', icon: <FaBook />, message: 'New Science assignment due on March 20', time: '2 hours ago' },
    { id: 2, type: 'event', icon: <FaCalendarAlt />, message: 'Sports Day scheduled for March 25', time: '1 day ago' },
    { id: 3, type: 'announcement', icon: <FaBullhorn />, message: 'School closed on March 22 for holiday', time: '3 days ago' },
  ];

  // Sample mails with unread status
  const [mails, setMails] = useState([
    { id: 1, sender: 'Professor Smith', subject: 'Assignment Submission', time: '1 hour ago', unread: true },
    { id: 2, sender: 'Admin Office', subject: 'Fee Reminder', time: '5 hours ago', unread: false },
    { id: 3, sender: 'Sports Dept', subject: 'Practice Schedule', time: '1 day ago', unread: true },
  ]);

  // Handle compose button click
  const handleComposeClick = () => {
    setReplyTo(null); // Reset reply state
    setNewMessage({ to: '', subject: '', body: '' }); // Reset message
    setIsComposeOpen(true);
  };

  // Handle reply button click
  const handleReplyClick = (mail) => {
    setReplyTo(mail); // Set the mail being replied to
    setNewMessage({ to: mail.sender, subject: `Re: ${mail.subject}`, body: '' }); // Pre-fill reply
    setIsComposeOpen(true);
  };

  // Handle sending the message
  const handleSendMessage = () => {
    if (!newMessage.to || !newMessage.subject || !newMessage.body) {
      alert('Please fill all fields!');
      return;
    }

    // Simulate sending message (replace with API call in real app)
    console.log('Message Sent:', newMessage);
    alert('Message sent successfully!');

    // Reset states and close compose modal
    setIsComposeOpen(false);
    setNewMessage({ to: '', subject: '', body: '' });
    setReplyTo(null);
  };

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center relative z-50">
      {/* Left Section: Hamburger Menu and Welcome Message */}
      <div className="flex items-center">
        <FaBars
          className="text-2xl cursor-pointer hover:text-indigo-600 transition-colors block md:hidden"
          onClick={() => setIsSidebarOpen(true)}
        />
        <div className="ml-4 md:ml-8 hidden md:block">
          <h2 className="font-semibold text-lg">Welcome, Ms. Riya Sharma</h2>
        </div>
      </div>

      {/* Right Section: Search, Notifications, Mail, Profile */}
      <div className="flex items-center space-x-3 md:space-x-5">
        {/* Search Bar */}
        <div className="relative w-32 md:w-48">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Notification Icon with Popup */}
        <div className="relative">
          <button
            className="text-gray-800 p-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors relative"
            onClick={handleNotificationClick}
          >
            <FaBell size={24} />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
          {isNotificationOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 md:absolute md:inset-auto md:top-12 md:right-0 md:w-96 md:mt-2">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 md:mx-0 md:max-w-none overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                  <button
                    onClick={() => setIsNotificationOpen(false)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    ✕
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <li key={notification.id} className="p-4 flex items-start space-x-3 hover:bg-gray-50">
                      <div className="text-xl text-indigo-600">{notification.icon}</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    </li>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Mail Icon with Popup */}
        <div className="relative">
          <button
            className="text-gray-800 p-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors relative"
            onClick={handleMailClick}
          >
            <FaEnvelope size={24} />
            {mailCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {mailCount}
              </span>
            )}
          </button>

          {/* Enhanced Mail Popup */}
          {isMailOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 md:absolute md:inset-auto md:top-12 md:right-0 md:w-96 md:mt-2">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 md:mx-0 md:max-w-none overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">Messages</h3>
                  <button
                    onClick={() => setIsMailOpen(false)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    ✕
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {mails.length === 0 ? (
                    <p className="p-6 text-gray-500 text-center text-sm">No new messages</p>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {mails.map((mail) => (
                        <li
                          key={mail.id}
                          className={`p-4 flex items-center space-x-4 hover:bg-gray-100 transition-colors ${
                            mail.unread ? 'bg-indigo-50' : ''
                          }`}
                        >
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                              {mail.sender.charAt(0)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`text-sm font-medium truncate ${mail.unread ? 'text-indigo-600' : 'text-gray-800'}`}>
                                {mail.sender}
                              </p>
                              <p className="text-xs text-gray-500 flex-shrink-0 ml-2">{mail.time}</p>
                            </div>
                            <p className="text-sm text-gray-600 truncate">{mail.subject}</p>
                          </div>
                          <button
                            onClick={() => handleReplyClick(mail)}
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            <FaReply />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="p-4 bg-white border-t border-gray-200 flex justify-between items-center">
                  <button
                    onClick={handleComposeClick}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                  >
                    <FaEnvelope className="mr-2" /> Compose
                  </button>
                  <button
                    onClick={() => alert('View all messages clicked!')}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    View All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          >
            <img
              src="images/stu1.jpeg"
              alt="Profile"
              className="h-8 w-8 md:h-10 md:w-10 rounded-full border-2 border-transparent group-hover:border-indigo-500 transition-all"
            />
            <span className="ml-2 text-sm md:text-base group-hover:text-indigo-600 transition-colors hidden md:inline">
              Ms. Riya Sharma
            </span>
          </div>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-10 p-2">
              <ul className="text-sm">
                <li
                  className="flex items-center px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                  onClick={handleProfileClick}
                >
                  <FaUser className="mr-2 text-gray-600" />
                  My Profile
                </li>
                <li className="flex items-center px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                  <FaCog className="mr-2 text-gray-600" />
                  Settings
                </li>
                <li 
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer text-red-600"
                >
                  <FaSignOutAlt className="mr-2 text-red-600" />
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {replyTo ? `Reply to ${replyTo.sender}` : 'New Message'}
              </h3>
              <button
                onClick={() => setIsComposeOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="To"
                value={newMessage.to}
                onChange={(e) => setNewMessage({ ...newMessage, to: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={replyTo !== null} // Disable "To" field if replying
              />
              <input
                type="text"
                placeholder="Subject"
                value={newMessage.subject}
                onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                placeholder="Type your message here..."
                value={newMessage.body}
                onChange={(e) => setNewMessage({ ...newMessage, body: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32"
              />
              <button
                onClick={handleSendMessage}
                className="w-full bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default StudentNavbar;