import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import DataTable from './DataTable';

const ImprovedReusableTable = ({ 
  title, 
  columns, 
  apiFunction, 
  updateApiFunction = null, // Optional update API
  deleteApiFunction = null, // Optional delete API
  fetchApiFunction = null, // Optional fetch API
  initialData = [],
  searchPlaceholder = "Search...",
  addButtonText = "Add New",
  exportFileName = "data",
  showActions = { add: true, edit: true, delete: true, view: false },
  onCustomAction = null // Custom action handler
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialize with provided data or fetch from API
  useEffect(() => {
    if (fetchApiFunction) {
      fetchData();
    } else {
      setData(initialData);
    }
  }, [initialData, fetchApiFunction]);

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchApiFunction();
      if (response && response.success && response.data) {
        setData(response.data);
      } else {
        setData(initialData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
      setData(initialData);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to show toast notifications
  const showToast = (type, message) => {
    const options = {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    };

    if (type === 'success') {
      toast.success(message, options);
    } else {
      toast.error(message, options);
    }
  };

  // Validate form data
  const validateFormData = (formData) => {
    const requiredFields = columns.filter(col => col.required).map(col => col.key);
    const missingFields = requiredFields.filter(field => !formData[field] || formData[field].toString().trim() === '');
    
    if (missingFields.length > 0) {
      const missingFieldNames = missingFields.map(field => 
        columns.find(col => col.key === field)?.header
      ).join(', ');
      throw new Error(`Please fill required fields: ${missingFieldNames}`);
    }

    // Custom validations
    columns.forEach(col => {
      const value = formData[col.key];
      if (value && col.validation) {
        if (col.validation.minLength && value.length < col.validation.minLength) {
          throw new Error(`${col.header} must be at least ${col.validation.minLength} characters`);
        }
        if (col.validation.maxLength && value.length > col.validation.maxLength) {
          throw new Error(`${col.header} must not exceed ${col.validation.maxLength} characters`);
        }
        if (col.validation.pattern && !col.validation.pattern.test(value)) {
          throw new Error(`${col.header} format is invalid`);
        }
      }
    });
  };

  // Process form data for API
  const processFormData = (formData) => {
    const processedData = { ...formData };
    
    columns.forEach(col => {
      if (processedData[col.key] !== undefined && processedData[col.key] !== '') {
        // Type conversions
        if (col.type === 'number') {
          processedData[col.key] = parseInt(processedData[col.key]) || 0;
        } else if (col.type === 'email') {
          processedData[col.key] = processedData[col.key].toLowerCase().trim();
        } else if (typeof processedData[col.key] === 'string') {
          processedData[col.key] = processedData[col.key].trim();
        }
      }
    });
    
    return processedData;
  };

  // Handle add item
  const handleAdd = ({ onClose }) => {
    const AddForm = () => {
      const [formData, setFormData] = useState(
        columns.reduce((acc, col) => {
          acc[col.key] = col.defaultValue || '';
          return acc;
        }, {})
      );

      const [formLoading, setFormLoading] = useState(false);

      const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ 
          ...formData, 
          [name]: type === 'checkbox' ? checked : value
        });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        
        try {
          // Validate form data
          validateFormData(formData);
          
          // Process form data
          const processedData = processFormData(formData);
          
          console.log('Submitting data:', processedData);
          
          // Call API
          const response = await apiFunction(processedData);
          console.log('API Response:', response);
          
          if (response && (response.success || response.status === 'success')) {
            showToast('success', response.message || `${title} added successfully!`);
            
            // Add to local state with proper ID
            const newItem = { 
              id: response.data?.id || Date.now(), 
              ...processedData 
            };
            setData(prev => [...prev, newItem]);
            
            onClose();
          } else {
            throw new Error(response?.message || `Failed to add ${title}`);
          }
        } catch (error) {
          console.error(`Error adding ${title}:`, error);
          showToast('error', error.message || `Failed to add ${title}. Please try again.`);
        } finally {
          setFormLoading(false);
        }
      };

      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          {columns.filter(col => !col.hidden && !col.computed).map((column, index) => (
            <div key={index}>
              <label className="block text-gray-700 mb-1 font-medium">
                {column.header} 
                {column.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {column.type === 'select' ? (
                <select
                  name={column.key}
                  value={formData[column.key]}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  value={formData[column.key]}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={column.placeholder || `Enter ${column.header}`}
                  required={column.required}
                  rows={column.rows || 3}
                />
              ) : column.type === 'checkbox' ? (
                <input
                  type="checkbox"
                  name={column.key}
                  checked={formData[column.key]}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <input
                  type={column.type || 'text'}
                  name={column.key}
                  value={formData[column.key]}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={column.placeholder || `Enter ${column.header}`}
                  required={column.required}
                  min={column.min}
                  max={column.max}
                  minLength={column.validation?.minLength}
                  maxLength={column.validation?.maxLength}
                  pattern={column.validation?.pattern?.source}
                />
              )}
              
              {column.helpText && (
                <p className="text-xs text-gray-500 mt-1">{column.helpText}</p>
              )}
            </div>
          ))}
          
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className={`px-4 py-2 text-white rounded transition-colors ${
                formLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {formLoading ? 'Adding...' : `Add ${title}`}
            </button>
          </div>
        </form>
      );
    };

    return <AddForm />;
  };

  // Handle edit item
  const handleEdit = ({ item, onClose }) => {
    const EditForm = () => {
      const [formData, setFormData] = useState(item);
      const [formLoading, setFormLoading] = useState(false);

      const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ 
          ...formData, 
          [name]: type === 'checkbox' ? checked : value
        });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        
        try {
          // Validate form data
          validateFormData(formData);
          
          // Process form data
          const processedData = processFormData(formData);
          
          // Call update API if available
          if (updateApiFunction) {
            const response = await updateApiFunction(item.id, processedData);
            if (!(response && (response.success || response.status === 'success'))) {
              throw new Error(response?.message || `Failed to update ${title}`);
            }
          }
          
          // Update local state
          setData(prev => prev.map(dataItem => 
            dataItem.id === item.id ? { ...dataItem, ...processedData } : dataItem
          ));
          
          showToast('success', `${title} updated successfully!`);
          onClose();
        } catch (error) {
          console.error(`Error updating ${title}:`, error);
          showToast('error', error.message || `Failed to update ${title}. Please try again.`);
        } finally {
          setFormLoading(false);
        }
      };

      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          {columns.filter(col => !col.hidden && !col.computed).map((column, index) => (
            <div key={index}>
              <label className="block text-gray-700 mb-1 font-medium">
                {column.header} 
                {column.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {column.type === 'select' ? (
                <select
                  name={column.key}
                  value={formData[column.key]}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={column.required}
                  disabled={column.readonly}
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
                  value={formData[column.key]}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={column.required}
                  disabled={column.readonly}
                  rows={column.rows || 3}
                />
              ) : column.type === 'checkbox' ? (
                <input
                  type="checkbox"
                  name={column.key}
                  checked={formData[column.key]}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                  disabled={column.readonly}
                />
              ) : (
                <input
                  type={column.type || 'text'}
                  name={column.key}
                  value={formData[column.key]}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={column.required}
                  disabled={column.readonly}
                  min={column.min}
                  max={column.max}
                  minLength={column.validation?.minLength}
                  maxLength={column.validation?.maxLength}
                  pattern={column.validation?.pattern?.source}
                />
              )}
              
              {column.helpText && (
                <p className="text-xs text-gray-500 mt-1">{column.helpText}</p>
              )}
            </div>
          ))}
          
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className={`px-4 py-2 text-white rounded transition-colors ${
                formLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {formLoading ? 'Updating...' : `Update ${title}`}
            </button>
          </div>
        </form>
      );
    };

    return <EditForm />;
  };

  // Handle delete item
  const handleDelete = async (item) => {
    try {
      // Call delete API if available
      if (deleteApiFunction) {
        const response = await deleteApiFunction(item.id);
        if (!(response && (response.success || response.status === 'success'))) {
          throw new Error(response?.message || `Failed to delete ${title}`);
        }
      }
      
      // Remove from local state
      setData(prev => prev.filter(dataItem => dataItem.id !== item.id));
      showToast('success', `${title} deleted successfully!`);
    } catch (error) {
      console.error(`Error deleting ${title}:`, error);
      showToast('error', error.message || `Failed to delete ${title}`);
    }
  };

  return (
    <DataTable
      title={title}
      data={data}
      columns={columns}
      onAdd={showActions.add ? handleAdd : null}
      onEdit={showActions.edit ? handleEdit : null}
      onDelete={showActions.delete ? handleDelete : null}
      onView={showActions.view ? onCustomAction : null}
      loading={loading}
      searchPlaceholder={searchPlaceholder}
      addButtonText={addButtonText}
      exportFileName={exportFileName}
    />
  );
};

export default ImprovedReusableTable;
