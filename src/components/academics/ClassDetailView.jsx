import React from 'react';
import { motion } from 'framer-motion';
import { X, Users, Home, User, Hash, Calendar, MapPin } from 'lucide-react';

const ClassDetailView = ({ isOpen, onClose, classData }) => {
  if (!isOpen || !classData) return null;

  // Handle click outside to close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
      }}
      onClick={handleOverlayClick}
    >
      <motion.div
        className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl mx-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-purple-900 text-white text-lg font-semibold p-4 rounded-t-lg flex justify-between items-center">
          <span>Class Details</span>
          <button 
            onClick={onClose} 
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Main Class Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-2xl font-bold text-gray-800 flex items-center">
                <Hash className="mr-2 text-purple-600" size={24} />
                {classData.class_name} - Section {classData.section_name}
              </h4>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                Active
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center text-gray-600">
                <MapPin className="mr-2 text-blue-500" size={20} />
                <span className="font-medium">Room:</span>
                <span className="ml-1 text-gray-800">{classData.room_No}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="mr-2 text-green-500" size={20} />
                <span className="font-medium">Capacity:</span>
                <span className="ml-1 text-gray-800">{classData.capacity} students</span>
              </div>
              <div className="flex items-center text-gray-600">
                <User className="mr-2 text-purple-500" size={20} />
                <span className="font-medium">Teacher ID:</span>
                <span className="ml-1 text-gray-800">{classData.teacher_name || classData.teacher_id}</span>
              </div>
            </div>
          </div>

          {/* Detailed Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <Hash className="text-blue-600" size={20} />
                </div>
                <h5 className="font-semibold text-gray-700">Class Information</h5>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Class Name:</span> {classData.class_name}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Section:</span> {classData.section_name}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Full Name:</span> {classData.class_name} - {classData.section_name}
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <MapPin className="text-green-600" size={20} />
                </div>
                <h5 className="font-semibold text-gray-700">Location Details</h5>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Room Number:</span> {classData.room_No}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Building:</span> Main Building
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Floor:</span> {Math.floor(parseInt(classData.room_No) / 100) || 1}
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <Users className="text-purple-600" size={20} />
                </div>
                <h5 className="font-semibold text-gray-700">Capacity & Enrollment</h5>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Total Capacity:</span> {classData.capacity}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Current Enrollment:</span> {classData.enrolled || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Available Seats:</span> {classData.capacity - (classData.enrolled || 0)}
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className="bg-orange-100 p-2 rounded-lg mr-3">
                  <User className="text-orange-600" size={20} />
                </div>
                <h5 className="font-semibold text-gray-700">Teacher Information</h5>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Teacher ID:</span> {classData.teacher_id}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Teacher Name:</span> {classData.teacher_name || 'To be assigned'}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Subject:</span> {classData.subject || 'Multiple subjects'}
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className="bg-red-100 p-2 rounded-lg mr-3">
                  <Calendar className="text-red-600" size={20} />
                </div>
                <h5 className="font-semibold text-gray-700">Schedule Information</h5>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Academic Year:</span> {new Date().getFullYear()}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Class Hours:</span> 9:00 AM - 3:00 PM
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Days:</span> Monday - Friday
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                  <Hash className="text-indigo-600" size={20} />
                </div>
                <h5 className="font-semibold text-gray-700">Additional Details</h5>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Class ID:</span> {classData.id}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Status:</span> 
                  <span className="ml-1 text-green-600 font-medium">Active</span>
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Created:</span> {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar for Capacity */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Class Capacity Utilization</span>
              <span className="text-sm text-gray-500">
                {Math.round(((classData.enrolled || 0) / classData.capacity) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(((classData.enrolled || 0) / classData.capacity) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0 students</span>
              <span>{classData.capacity} students</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleString()}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-purple-900 text-white rounded-lg hover:bg-purple-800 transition-colors shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ClassDetailView;
