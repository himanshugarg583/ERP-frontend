import React from 'react';

// Reusable Input Component
const Parent_EditableInput = React.memo(({ label, name, value, onChange, isEditing, type = 'text', isTextarea = false, icon }) => (
    <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="flex items-center gap-2">
            {icon && <span className="text-gray-500">{icon}</span>}
            {isTextarea ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={isEditing ? onChange : undefined}
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 h-28 ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                    readOnly={!isEditing}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={isEditing ? onChange : undefined}
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                    readOnly={!isEditing}
                />
            )}
        </div>
    </div>
));

export default Parent_EditableInput;