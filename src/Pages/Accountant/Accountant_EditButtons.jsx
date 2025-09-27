import React from 'react';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const Accountant_EditButtons = React.memo(({ isEditing, onEdit, onSave, onCancel }) => (
    !isEditing ? (
        <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transform hover:scale-105 transition-all duration-200"
            onClick={onEdit}
        >
            <FaEdit className="text-lg" />
            Edit
        </button>
    ) : (
        <div className="flex gap-4">
            <button
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transform hover:scale-105 transition-all duration-200"
                onClick={onSave}
            >
                <FaSave className="text-lg" />
                Save
            </button>
            <button
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transform hover:scale-105 transition-all duration-200"
                onClick={onCancel}
            >
                <FaTimes className="text-lg" />
                Cancel
            </button>
        </div>
    )
));

export default Accountant_EditButtons;