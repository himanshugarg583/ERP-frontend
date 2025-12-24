import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import DataTable from './DataTable';

const ReusableTable = ({ 
  title, 
  columns, 
  displayColumns,
  apiFunction, 
  updateApiFunction,
  deleteApiFunction,
  initialData = [],
  searchPlaceholder = "Search...",
  addButtonText = "Add New",
  exportFileName = "data",
  showActions = { view: true, edit: true, delete: true }
}) => {
  const [data, setData] = useState([]);
  const [loading] = useState(false);
  const [formData, setFormData] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [refreshData, setRefreshData] = useState(false);

  // Initialize with provided data or empty array
  useEffect(() => {
    setData(initialData);
  }, [initialData, refreshData]);

  // Initialize form data
  useEffect(() => {
    const initialFormData = columns.reduce((acc, col) => {
      acc[col.key] = '';
      return acc;
    }, {});
    setFormData(initialFormData);
  }, [columns]);

  // Update form data when editing item changes
  useEffect(() => {
    if (editingItem) {
      // Format date fields for input[type="date"]
      const formattedData = { ...editingItem };
      columns.forEach(column => {
        if (column.type === 'date' && formattedData[column.key]) {
          // Convert date to YYYY-MM-DD format for input[type="date"]
          const date = new Date(formattedData[column.key]);
          if (!isNaN(date.getTime())) {
            formattedData[column.key] = date.toISOString().split('T')[0];
          }
        }
      });
      console.log('Setting form data for editing:', formattedData); // Debug log
      setFormData(formattedData);
    }
  }, [editingItem, columns]);

  // Helper function to show toast notifications
  const showToast = (response, defaultMessage) => {
    if (response && response.success) {
      toast.success(response.message || defaultMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.error(response?.message || defaultMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    console.log('Input change:', { name, value, type }); // Debug log
    setFormData({ 
      ...formData, 
      [name]: type === 'number' ? parseInt(value) || '' : value 
    });
  };

  const resetForm = () => {
    const initialFormData = columns.reduce((acc, col) => {
      acc[col.key] = '';
      return acc;
    }, {});
    setFormData(initialFormData);
    setEditingItem(null); // Clear editing item when resetting form
  };

  // Handle add item
  const handleAdd = ({ onClose }) => {
    const handleSubmit = async (e) => {
      e.preventDefault();
      setFormLoading(true);
      
      // Validation
      const requiredFields = columns.filter(col => col.required).map(col => col.key);
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        toast.error('Please fill all required fields');
        setFormLoading(false);
        return;
      }
      
      try {
        const payload = { ...formData };
        
        // Convert number fields to string if needed
        columns.forEach(col => {
          if (col.type === 'number' && payload[col.key]) {
            payload[col.key] = payload[col.key].toString();
          }
        });
        
        // Call the API function passed from parent component
        const response = await apiFunction(payload);
        
        if (response && response.success) {
          showToast(response, `${title} added successfully!`);
          // Trigger data refresh
          setRefreshData(prev => !prev);
          resetForm();
          onClose();
        } else {
          showToast(response, `Failed to add ${title}`);
        }
      } catch (error) {
        console.error(`Error adding ${title}:`, error);
        toast.error(error.response?.data?.message || `Failed to add ${title}. Please try again.`);
      } finally {
        setFormLoading(false);
      }
    };

    return (
      <div className="space-y-4">
        {/* Colorful Header */}
        <div className="bg-gradient-to-r from-violet-600 to-violet-500 rounded-lg p-3 text-center">
          <h4 className="text-white text-lg font-bold mb-1">Add New {title}</h4>
          <p className="text-violet-100 text-xs">Fill in the details below to create a new {title.toLowerCase()}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form Fields in 3-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {columns.map((column, index) => (
              <div key={index} className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {column.header} {column.required && <span className="text-red-500">*</span>}
                </label>
                {column.type === 'select' ? (
                  <select
                    name={column.key}
                    value={formData[column.key] || ''}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-violet-500 focus:outline-none transition-colors duration-200"
                    required={column.required}
                  >
                    <option value="">Select {column.header}</option>
                    {column.options?.map((option, optIndex) => (
                      <option key={optIndex} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : column.type === 'textarea' ? (
                  <textarea
                    name={column.key}
                    value={formData[column.key] || ''}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-violet-500 focus:outline-none transition-colors duration-200"
                    placeholder={column.placeholder || `Enter ${column.header}`}
                    required={column.required}
                    rows={3}
                  />
                ) : (
                  <input
                    type={column.type || 'text'}
                    name={column.key}
                    value={formData[column.key] || ''}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-violet-500 focus:outline-none transition-colors duration-200"
                    placeholder={column.placeholder || `Enter ${column.header}`}
                    required={column.required}
                    min={column.min}
                    max={column.max}
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border-2 border-violet-300 rounded-lg text-violet-700 hover:bg-violet-50 transition-colors duration-200 font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className={`px-4 py-2 text-white rounded-lg font-medium transition-colors duration-200 text-sm ${
                formLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600'
              }`}
            >
              {formLoading ? 'Adding...' : `Add ${title}`}
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Handle edit item
  const handleEdit = ({ item, onClose }) => {
    // Set the editing item to trigger useEffect
    setEditingItem(item);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setFormLoading(true);
      
      try {
        // Call the update API function if provided
        if (updateApiFunction) {
          const response = await updateApiFunction(item.id, formData);
          
          if (response && response.success) {
            showToast(response, `${title} updated successfully!`);
            // Trigger data refresh
            setRefreshData(prev => !prev);
            setEditingItem(null); // Clear editing item
            onClose();
          } else {
            showToast(response, `Failed to update ${title}`);
          }
        } else {
          // Fallback to local state update if no API function provided
          setData(prev => prev.map(dataItem => 
            dataItem.id === item.id ? { ...dataItem, ...formData } : dataItem
          ));
          toast.success(`${title} updated successfully!`);
          setEditingItem(null); // Clear editing item
          onClose();
        }
      } catch (error) {
        console.error(`Error updating ${title}:`, error);
        toast.error(error.response?.data?.message || `Failed to update ${title}. Please try again.`);
      } finally {
        setFormLoading(false);
      }
    };

    return (
      <div className="space-y-4">
        {/* Colorful Header */}
        <div className="bg-gradient-to-r from-violet-600 to-violet-500 rounded-lg p-3 text-center">
          <h4 className="text-white text-lg font-bold mb-1">Edit {title}</h4>
          <p className="text-violet-100 text-xs">Update the details below to modify this {title.toLowerCase()}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form Fields in 3-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {columns.map((column, index) => (
              <div key={index} className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {column.header} {column.required && <span className="text-red-500">*</span>}
                </label>
                {column.type === 'select' ? (
                  <select
                    name={column.key}
                    value={formData[column.key] || ''}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-violet-500 focus:outline-none transition-colors duration-200"
                    required={column.required}
                  >
                    <option value="">Select {column.header}</option>
                    {column.options?.map((option, optIndex) => (
                      <option key={optIndex} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : column.type === 'textarea' ? (
                  <textarea
                    name={column.key}
                    value={formData[column.key] || ''}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-violet-500 focus:outline-none transition-colors duration-200"
                    required={column.required}
                    rows={3}
                  />
                ) : (
                  <input
                    type={column.type || 'text'}
                    name={column.key}
                    value={formData[column.key] || ''}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-violet-500 focus:outline-none transition-colors duration-200"
                    required={column.required}
                    min={column.min}
                    max={column.max}
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setEditingItem(null); // Clear editing item
                onClose();
              }}
              className="px-4 py-2 border-2 border-violet-300 rounded-lg text-violet-700 hover:bg-violet-50 transition-colors duration-200 font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className={`px-4 py-2 text-white rounded-lg font-medium transition-colors duration-200 text-sm ${
                formLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600'
              }`}
            >
              {formLoading ? 'Updating...' : `Update ${title}`}
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Handle delete item
  const handleDelete = async (item) => {
    try {
      // Call the delete API function if provided
      if (deleteApiFunction) {
        const response = await deleteApiFunction(item.id);
        
        if (response && response.success) {
          showToast(response, `${title} deleted successfully!`);
          // Trigger data refresh
          setRefreshData(prev => !prev);
        } else {
          showToast(response, `Failed to delete ${title}`);
        }
      } else {
        // Fallback to local state update if no API function provided
        setData(prev => prev.filter(dataItem => dataItem.id !== item.id));
        toast.success(`${title} deleted successfully!`);
      }
    } catch (error) {
      console.error(`Error deleting ${title}:`, error);
      toast.error(error.response?.data?.message || `Failed to delete ${title}. Please try again.`);
    }
  };

  // Handle view item
  const handleView = (item) => {
    // For now, this will be handled by the DataTable component's built-in view modal
    // You can customize this to call a parent component's view handler if needed
    console.log('Viewing item:', item);
  };

  return (
    <DataTable
      title={title}
      data={data}
      columns={displayColumns || columns}
      allColumns={columns} // Pass all original columns for view modal
      onAdd={showActions.add !== false ? handleAdd : null}
      onEdit={showActions.edit !== false ? handleEdit : null}
      onDelete={showActions.delete !== false ? handleDelete : null}
      onView={showActions.view !== false ? handleView : null}
      loading={loading}
      searchPlaceholder={searchPlaceholder}
      addButtonText={addButtonText}
      exportFileName={exportFileName}
    />
  );
};

export default ReusableTable;
