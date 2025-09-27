import React from 'react';
import { FaSearch } from 'react-icons/fa';

const Accountant_SearchBar = ({ value, onChange, placeholder }) => (
    <div className="relative w-64">
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm hover:shadow-md transition-all duration-300 text-sm"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
);

export default Accountant_SearchBar;