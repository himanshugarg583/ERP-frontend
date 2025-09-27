import React from 'react';
import { FaCamera } from 'react-icons/fa';

const Accountant_ProfileImage = ({ imageUrl, isEditing, onChange, onSave, onCancel }) => (
    <div className="flex flex-col items-center mb-6">
        <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 mb-4">
                <img src={imageUrl ?? ''} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <label className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 cursor-pointer shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    <FaCamera />
                    <input type="file" accept="image/*" className="hidden" onChange={onChange} />
                </label>
            </div>
        </div>
        {isEditing && (
            <div className="flex gap-4 mt-2">
                <button
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-lg transform hover:scale-105 transition-all duration-200"
                    onClick={onSave}
                >
                    <FaSave />
                    Save
                </button>
                <button
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-lg transform hover:scale-105 transition-all duration-200"
                    onClick={onCancel}
                >
                    <FaTimes />
                    Cancel
                </button>
            </div>
        )}
    </div>
);

export default Accountant_ProfileImage;