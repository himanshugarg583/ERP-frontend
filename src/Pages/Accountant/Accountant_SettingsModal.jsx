import React from 'react';

const Accountant_SettingsModal = ({ isOpen, onClose, settings, onSettingsChange, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Payment Settings</h3>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.upi ?? false}
                onChange={(e) => onSettingsChange({ ...settings, upi: e.target.checked ?? false })}
              />
              Enable UPI
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.cards ?? false}
                onChange={(e) => onSettingsChange({ ...settings, cards: e.target.checked ?? false })}
              />
              Enable Cards
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.netBanking ?? false}
                onChange={(e) => onSettingsChange({ ...settings, netBanking: e.target.checked ?? false })}
              />
              Enable Net Banking
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.wallets ?? false}
                onChange={(e) => onSettingsChange({ ...settings, wallets: e.target.checked ?? false })}
              />
              Enable Wallets
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Transaction Fee (%)</label>
            <input
              type="number"
              min="0"
              value={settings.transactionFee ?? 0}
              onChange={(e) => onSettingsChange({ ...settings, transactionFee: Number(e.target.value ?? 0) })}
              className="mt-1 w-full p-2 border rounded-md text-sm sm:text-base"
            />
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.reminders ?? false}
              onChange={(e) => onSettingsChange({ ...settings, reminders: e.target.checked ?? false })}
            />
            Enable Payment Reminders
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-sm sm:text-base"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base"
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Accountant_SettingsModal;