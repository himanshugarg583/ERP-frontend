import React, { useState } from 'react';
import StaffSidebar from '../StaffSidebar';
import StaffHeader from '../StaffHeader';

const LabScienceEquipment = () => {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({
        equipmentName: '',
        category: '',
        quantity: '',
        supplier: '',
        price: '',
        condition: '',
        location: '',
        datePurchased: ''
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setItems([...items, { ...form, id: Date.now() }]);
        setForm({
            equipmentName: '', category: '', quantity: '', supplier: '',
            price: '', condition: '', location: '', datePurchased: ''
        });
    };

    return (
        <div className="w-full flex bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <StaffSidebar />
            <main className="flex-1 overflow-y-auto p-8">
                <StaffHeader />
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-8 mt-3">
                        🧪 Lab & Science Equipment Management
                    </h1>

                    {/* Form Section */}
                    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">➕ Add New Equipment</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[   
                                { name: 'equipmentName', placeholder: 'Equipment Name', type: 'text' },
                                { name: 'category', placeholder: 'Category', type: 'text' },
                                { name: 'quantity', placeholder: 'Quantity', type: 'number' },
                                { name: 'supplier', placeholder: 'Supplier Name', type: 'text' },
                                { name: 'price', placeholder: 'Price', type: 'text' },
                                { name: 'condition', placeholder: 'Condition (New/Used)', type: 'text' },
                                { name: 'location', placeholder: 'Location in Lab', type: 'text' },
                                { name: 'datePurchased', placeholder: 'Date Purchased', type: 'date' }
                            ].map((field) => (
                                <div key={field.name}>
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        placeholder={field.placeholder}
                                        value={form[field.name]}
                                        onChange={handleChange}
                                        className="w-full p-4 border border-gray-200 rounded-lg bg-gray-50"
                                        required
                                    />
                                </div>
                            ))}
                            <div className="col-span-full">
                                <button
                                    type="submit"
                                    className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Add Equipment
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">📋 Equipment List</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-blue-600 text-white">
                                        {['Equipment Name', 'Category', 'Quantity', 'Supplier', 'Price', 'Condition', 'Location', 'Date Purchased'].map((header) => (
                                            <th key={header} className="p-4 text-left">{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.length > 0 ? items.map((item, index) => (
                                        <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="p-4">{item.equipmentName}</td>
                                            <td className="p-4">{item.category}</td>
                                            <td className="p-4">{item.quantity}</td>
                                            <td className="p-4">{item.supplier}</td>
                                            <td className="p-4 font-mono">${item.price}</td>
                                            <td className="p-4">{item.condition}</td>
                                            <td className="p-4">{item.location}</td>
                                            <td className="p-4">{item.datePurchased}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="8" className="text-center p-8 text-gray-500 italic">
                                                No equipment added yet. Start by adding some items!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LabScienceEquipment;
