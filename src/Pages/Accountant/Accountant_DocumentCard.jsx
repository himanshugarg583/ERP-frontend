import React from 'react';
import { FaFileAlt, FaTrash } from 'react-icons/fa';

const Accountant_DocumentCard = ({ label, docType, fileName, fileDisplayName, isEditing, onFileChange, onRemove }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    <FaFileAlt />
                </div>
                <div>
                    <h3 className="font-semibold">{label ?? 'N/A'}</h3>
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <label className="cursor-pointer text-blue-600 hover:underline">
                                <input type="file" className="hidden" onChange={(e) => onFileChange(e, docType)} />
                                Choose File
                            </label>
                            {fileDisplayName && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">{fileDisplayName}</span>
                                    <button
                                        className="text-red-600 hover:text-red-800"
                                        onClick={() => onRemove(docType, fileName)}
                                        title="Remove File"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-600">{fileDisplayName ?? 'No file uploaded'}</p>
                    )}
                </div>
            </div>
        </div>
    </div>
);

export default Accountant_DocumentCard;