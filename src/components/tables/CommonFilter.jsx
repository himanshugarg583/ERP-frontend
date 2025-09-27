import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CommonFilter = ({ 
  filterFields, 
  onFilterChange, 
  onClearFilters, 
  title = "Filter Options",
  className = ""
}) => {
  const [filters, setFilters] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onClearFilters();
  };

  return (
    <motion.div
      className={`bg-white shadow-md rounded-lg p-6 mb-6 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {isFilterOpen ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {isFilterOpen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filterFields.map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
              </label>
              {field.type === 'select' ? (
                <select
                  value={filters[field.key] || ''}
                  onChange={(e) => handleFilterChange(field.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All {field.label}</option>
                  {field.options.map((option, optIndex) => (
                    <option key={optIndex} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  placeholder={field.placeholder || `Enter ${field.label}`}
                  value={filters[field.key] || ''}
                  onChange={(e) => handleFilterChange(field.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          ))}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CommonFilter; 