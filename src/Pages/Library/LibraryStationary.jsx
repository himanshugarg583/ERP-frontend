import React, { useState, useEffect } from 'react';
import LibraryNavbar from './LibraryNavbar';
import LibrarySidebar from './LibrarySidebar';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const LibraryStationary = () => {
  const initialItems = [
    { id: 'ST001', name: 'A4 Notebooks (Set of 10)', category: 'Stationery', quantity: 50, issuedTo: '-', issuedDate: '-', returnDate: '-', status: 'Available' },
    { id: 'ST002', name: 'Ballpoint Pens (Pack of 20)', category: 'Stationery', quantity: 30, issuedTo: 'Mrs. Patel (English)', issuedDate: '01/03/2025', returnDate: '15/04/2025', status: 'Issued' },
    { id: 'ST003', name: 'Pencils (Box of 12)', category: 'Stationery', quantity: 75, issuedTo: '-', issuedDate: '-', returnDate: '-', status: 'Available' },
    { id: 'ST004', name: 'Erasers (Pack of 10)', category: 'Stationery', quantity: 40, issuedTo: '-', issuedDate: '-', returnDate: '-', status: 'Available' },
  ];

const TableRow = memo(({ item, onEdit, onDelete }) => (
  <tr className="hover:bg-gray-50 transition-colors duration-200">
    <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap font-medium text-gray-900 border-r border-gray-200 text-xs sm:text-sm">{item?.id}</td>
    <td className="px-2 py-2 sm:px-4 sm:py-3 text-gray-600 border-r border-gray-200 truncate max-w-[100px] sm:max-w-[150px] md:max-w-[200px] text-xs sm:text-sm">{item?.name}</td>
    <td className="px-2 py-2 sm:px-4 sm:py-3 text-gray-600 border-r border-gray-200 hidden md:table-cell truncate max-w-[100px] md:max-w-[120px] text-xs sm:text-sm">{item?.category}</td>
    <td className="px-2 py-2 sm:px-4 sm:py-3 text-gray-600 border-r border-gray-200 hidden sm:table-cell text-xs sm:text-sm">{item?.quantity}</td>
    <td className="px-2 py-2 sm:px-4 sm:py-3 text-gray-600 border-r border-gray-200 hidden lg:table-cell truncate max-w-[120px] lg:max-w-[150px] text-xs sm:text-sm">{item?.issuedTo}</td>
    <td className="px-2 py-2 sm:px-4 sm:py-3 text-gray-600 border-r border-gray-200 hidden lg:table-cell text-xs sm:text-sm">{item?.issuedDate}</td>
    <td className="px-2 py-2 sm:px-4 sm:py-3 text-gray-600 border-r border-gray-200 hidden lg:table-cell text-xs sm:text-sm">{item?.returnDate}</td>
    <td className="px-2 py-2 sm:px-4 sm:py-3 border-r border-gray-200"><span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${item?.status === 'Available' ? 'bg-green-100 text-green-800' : item?.status === 'Issued' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{item?.status}</span></td>
    <td className="px-2 py-2 sm:px-4 sm:py-3 text-gray-600"><div className="flex space-x-2"><button onClick={() => onEdit?.(item)} className="text-indigo-600 hover:text-indigo-900 transform hover:scale-110 transition-all duration-200" aria-label="Edit"><FaEdit className="text-sm sm:text-lg" /></button><button onClick={() => onDelete?.(item?.id)} className="text-red-600 hover:text-red-900 transform hover:scale-110 transition-all duration-200" aria-label="Delete"><FaTrash className="text-sm sm:text-lg" /></button></div></td>
  </tr>
));

const ItemModal = memo(({ isOpen, isEditing, formData, onClose, onSubmit, onChange }) => isOpen && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2 sm:p-4">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-[90vw] sm:max-w-md md:max-w-lg max-h-[90vh] flex flex-col">
      <div className="flex justify-between items-center p-3 sm:p-4 md:p-6 border-b border-gray-200"><h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">{isEditing ? 'Edit Item' : 'Add New Item'}</h3><button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors duration-200" aria-label="Close"><FaTimes className="text-xl sm:text-2xl" /></button></div>
      <form onSubmit={onSubmit} className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6 overflow-y-auto flex-grow">
        {isEditing && <div><label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Item ID</label><input type="text" name="id" value={formData?.id || ''} className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-xs sm:text-sm" disabled /></div>}
        <div><label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Item Name</label><input type="text" name="name" value={formData?.name || ''} onChange={onChange} placeholder="e.g. Color Pencils" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs sm:text-sm" required /></div>
        <div><label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Category</label><select name="category" value={formData?.category || ''} onChange={onChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs sm:text-sm" required><option value="">Select Category</option><option value="Stationery">Stationery</option><option value="Electronics">Electronics</option></select></div>
        <div><label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Quantity</label><input type="number" name="quantity" value={formData?.quantity || 1} onChange={onChange} min="1" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs sm:text-sm" required /></div>
        {isEditing && (
          <>
            <div><label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Issued To</label><input type="text" name="issuedTo" value={formData?.issuedTo || ''} onChange={onChange} placeholder="e.g. Mr. Smith" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs sm:text-sm" /></div>
            <div><label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Issued Date</label><input type="text" name="issuedDate" value={formData?.issuedDate || ''} onChange={onChange} placeholder="e.g. DD/MM/YYYY" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs sm:text-sm" /></div>
            <div><label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Return Date</label><input type="text" name="returnDate" value={formData?.returnDate || ''} onChange={onChange} placeholder="e.g. DD/MM/YYYY" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs sm:text-sm" /></div>
            <div><label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Status</label><select name="status" value={formData?.status || ''} onChange={onChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs sm:text-sm" required><option value="Available">Available</option><option value="Issued">Issued</option><option value="Under Maintenance">Under Maintenance</option></select></div>
          </>
        )}
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3"><button type="button" onClick={onClose} className="px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-400 text-xs sm:text-sm w-full sm:w-auto">Cancel</button><button type="submit" className="px-3 py-1 sm:px-4 sm:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 hover:scale-105 focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm w-full sm:w-auto transition-all duration-200">{isEditing ? 'Update Item' : 'Add Item'}</button></div>
      </form>
    </div>
  </div>
));

const LibraryStationary = () => {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('libraryItems')) || initialItems);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', category: '', quantity: 1, issuedTo: '-', issuedDate: '-', returnDate: '-', status: 'Available' });

  useEffect(() => localStorage.setItem('libraryItems', JSON.stringify(items)), [items]);

  const toggleModal = useCallback(() => {
    setModalOpen(prev => !prev);
    if (isModalOpen) { setFormData({ id: '', name: '', category: '', quantity: 1, issuedTo: '-', issuedDate: '-', returnDate: '-', status: 'Available' }); setIsEditing(false); }
  }, [isModalOpen]);

  const handleInputChange = useCallback((e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })), []);

  const generateItemId = useCallback(() => `ST${String((items?.reduce((max, item) => Math.max(max, parseInt(item?.id?.replace('ST', '') || '0', 10)), 0) || 0) + 1).padStart(3, '0')}`, [items]);

  const handleAddItem = (e) => {
    e.preventDefault();
    setItems(prev => [...(prev || []), { id: generateItemId(), name: formData?.name || '', category: formData?.category || '', quantity: parseInt(formData?.quantity || 1, 10), issuedTo: '-', issuedDate: '-', returnDate: '-', status: 'Available' }]);
    alert("Item added successfully!");
    toggleModal();
  };

  const handleEditItem = useCallback((item) => { setIsEditing(true); setFormData(item || {}); setModalOpen(true); }, []);

  const handleUpdateItem = (e) => {
    e.preventDefault();
    setItems(prev => prev?.map(item => item?.id === formData?.id ? { ...item, ...formData, quantity: parseInt(formData?.quantity || 1, 10) } : item) || []);
    alert("Item updated successfully!");
    toggleModal();
  };

  const handleDeleteItem = useCallback((id) => { if (window.confirm("Are you sure you want to delete this item?")) { setItems(prev => prev?.filter(item => item?.id !== id) || []); alert("Item deleted successfully!"); } }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex font-sans overflow-x-hidden">
      <div className={`${isModalOpen ? 'blur-sm' : ''} flex-1 flex flex-col`}>
        <header className="fixed top-0 left-0 right-0 z-20 bg-white shadow-md md:left-64"><LibraryNavbar /></header>
        <div className="flex flex-1 pt-16 flex-col md:flex-row">
          <aside className="hidden md:block fixed top-16 left-0 w-64 h-full bg-white shadow-md z-10"><LibrarySidebar /></aside>
          <main className="flex-1 p-2 sm:p-4 md:p-6 lg:p-8 md:ml-64 overflow-x-hidden">
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Stationery Management</h2>
                <button onClick={toggleModal} className="bg-indigo-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg shadow-md hover:bg-indigo-700 hover:scale-105 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto text-sm sm:text-base"><FaPlus className="text-sm sm:text-lg" /> Add New Item</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                  <thead className="bg-gray-200 border-b-2 border-gray-300 text-xs"><tr>{['ID', 'Name', 'Category', 'Qty', 'Issued To', 'Issued', 'Return', 'Status', 'Actions'].map((header, idx) => <th key={header} className={`px-2 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300 ${idx === 2 || idx === 4 || idx === 5 || idx === 6 ? 'hidden md:table-cell' : idx === 3 ? 'hidden sm:table-cell' : ''}`}>{header}</th>)}</tr></thead>
                  <tbody className="divide-y divide-gray-200">{items?.map(item => <TableRow key={item?.id} item={item} onEdit={handleEditItem} onDelete={handleDeleteItem} />)}</tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
      <ItemModal isOpen={isModalOpen} isEditing={isEditing} formData={formData} onClose={toggleModal} onSubmit={isEditing ? handleUpdateItem : handleAddItem} onChange={handleInputChange} />
      <style jsx>{`.blur-sm { filter: blur(4px); }`}</style>
    </div>
  );
};
};
export default LibraryStationary;