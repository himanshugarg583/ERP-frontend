import React from 'react';
import { FaPhone } from 'react-icons/fa';

// Reusable Contact Card Component
const Parent_ContactCard = React.memo(({ role, name, contact }) => (
    <div className="mb-4">
        <span className="text-gray-600 block mb-1">{role}</span>
        <div className="flex items-center">
            <span className="font-medium text-lg mr-2">{name || contact}</span>
            {contact && (
                <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-all duration-300 transform hover:scale-105">
                    <FaPhone />
                </button>
            )}
        </div>
    </div>
));

export default Parent_ContactCard;