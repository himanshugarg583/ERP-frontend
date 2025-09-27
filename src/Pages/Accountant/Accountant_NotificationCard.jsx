import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';

const Accountant_NotificationCard = () => {
  const notifications = [
    'Fee Due: ₹10,000 by 12 Mar 2025',
    'Low Balance Warning: ₹50,000 remaining',
    'Recent Payment: ₹5,000 received on 10 Mar 2025',
  ];

  return (
    <div className="bg-red-50 rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 mb-8">
      <h2 className="text-lg font-semibold mb-3 flex items-center">
        <FaExclamationCircle className="mr-2" /> Notifications & Alerts
      </h2>
      <ul className="space-y-2 text-sm">
        {notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
    </div>
  );
};

export default Accountant_NotificationCard;