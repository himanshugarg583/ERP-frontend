import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';

const StudentSearchFilter = ({
  onFilterChange,
  classes = [],
  sections = [],
  className = ""
}) => {
  const [filters, setFilters] = useState({
    selectedClass: '',
    selectedSection: '',
    selectedStatus: ''
  });

  const [isFilterOpen, setIsFilterOpen] = useState(true); // Default open

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters = {
      selectedClass: '',
      selectedSection: '',
      selectedStatus: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  // Get sections based on selected class
  const getSectionsForClass = () => {
    if (!filters.selectedClass) return sections;
    // You can implement logic here to filter sections based on class
    return sections;
  };

  return (
    <motion.div
      className={`bg-white shadow-lg backdrop-blur-md rounded-xl p-5 mb-6 relative z-1 ${className}`}
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        {/* Filter Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Filter size={18} />
            {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
          
          {(filters.selectedClass || filters.selectedSection || filters.selectedStatus) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <X size={16} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter Options */}
      {isFilterOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 pt-4 border-t border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Class Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class
              </label>
              <select
                value={filters.selectedClass}
                onChange={(e) => handleFilterChange('selectedClass', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Classes</option>
                {classes.map((cls, index) => (
                  <option key={index} value={cls.value || cls}>
                    {cls.label || cls}
                  </option>
                ))}
              </select>
            </div>

            {/* Section Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section
              </label>
              <select
                value={filters.selectedSection}
                onChange={(e) => handleFilterChange('selectedSection', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!filters.selectedClass}
              >
                <option value="">All Sections</option>
                {getSectionsForClass().map((section, index) => (
                  <option key={index} value={section.value || section}>
                    {section.label || section}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.selectedStatus}
                onChange={(e) => handleFilterChange('selectedStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(filters.selectedClass || filters.selectedSection || filters.selectedStatus) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-700">Active Filters:</span>
                {filters.selectedClass && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Class: {classes.find(cls => (cls.value || cls) === filters.selectedClass)?.label || filters.selectedClass}
                  </span>
                )}
                {filters.selectedSection && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Section: {sections.find(sec => (sec.value || sec) === filters.selectedSection)?.label || filters.selectedSection}
                  </span>
                )}
                {filters.selectedStatus && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    Status: {filters.selectedStatus}
                  </span>
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default StudentSearchFilter; 