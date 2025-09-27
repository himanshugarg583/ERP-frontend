import React from 'react';

const Accountant_LateFeeModal = ({ isOpen, onClose, lateFeeRules, setLateFeeRules, onSave }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-lg sm:text-xl font-semibold mb-4">Configure Late Payment Rules</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Late Fee Percentage (%)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={lateFeeRules.percentage}
                            onChange={(e) => setLateFeeRules((prev) => ({ ...prev, percentage: Number(e.target.value) }))}
                            className="mt-1 w-full p-2 border rounded-md text-sm sm:text-base"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Apply After (Days)</label>
                        <input
                            type="number"
                            min="1"
                            value={lateFeeRules.days}
                            onChange={(e) => setLateFeeRules((prev) => ({ ...prev, days: Number(e.target.value) }))}
                            className="mt-1 w-full p-2 border rounded-md text-sm sm:text-base"
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                    <button
                        className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-sm sm:text-base"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-3 py-1 sm:px-4 sm:py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm sm:text-base"
                        onClick={onSave}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Accountant_LateFeeModal;