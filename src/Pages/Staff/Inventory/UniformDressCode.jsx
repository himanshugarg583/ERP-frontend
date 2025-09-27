import React, { useState } from 'react';
import StaffSidebar from '../StaffSidebar';
import StaffHeader from '../StaffHeader';

const UniformsDressCode = () => {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({
        uniformType: '',
        size: '',
        color: '',
        quantity: '',
        supplier: '',
        price: '',
        availability: ''
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setItems([...items, { ...form, id: Date.now() }]);
        setForm({ uniformType: '', size: '', color: '', quantity: '', supplier: '', price: '', availability: '' });
    };

    return (
        <div className="w-full flex bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <StaffSidebar />
            <main className="flex-1 overflow-y-auto p-8">
                <StaffHeader />
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-8 flex items-center gap-3 animate-fade-in mt-3">
                        <span className="text-blue-600">👕</span> Uniforms & Dress Code Management
                    </h1>

                    {/* Form Section */}
                    <div className="bg-white p-6 rounded-xl shadow-md mb-8 transform transition-all hover:shadow-lg">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <span className="text-green-500">➕</span> Add New Uniform
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { name: 'uniformType', placeholder: 'Uniform Type', type: 'text' },
                                { name: 'size', placeholder: 'Size', type: 'text' },
                                { name: 'color', placeholder: 'Color', type: 'text' },
                                { name: 'quantity', placeholder: 'Quantity', type: 'number' },
                                { name: 'supplier', placeholder: 'Supplier Name', type: 'text' },
                                { name: 'price', placeholder: 'Price', type: 'text' },
                                { name: 'availability', placeholder: 'Availability Status', type: 'text' },
                            ].map((field) => (
                                <div key={field.name} className="relative">
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        placeholder={field.placeholder}
                                        value={form[field.name]}
                                        onChange={handleChange}
                                        className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-300 hover:border-blue-300"
                                        required
                                    />
                                </div>
                            ))}
                            <div className="col-span-full">
                                <button
                                    type="submit"
                                    className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transform transition-all duration-300 hover:scale-105 shadow-md"
                                >
                                    Add Uniform
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white p-6 rounded-xl shadow-md overflow-hidden">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <span className="text-purple-500">📋</span> Uniforms List
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                        {['Uniform Type', 'Size', 'Color', 'Quantity', 'Supplier', 'Price', 'Availability'].map((header) => (
                                            <th key={header} className="p-4 text-left font-semibold">{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.length > 0 ? items.map((item, index) => (
                                        <tr 
                                            key={item.id} 
                                            className="border-b border-gray-200 hover:bg-gray-50 transition-all duration-200 animate-fade-in"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <td className="p-4">{item.uniformType}</td>
                                            <td className="p-4">{item.size}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <span 
                                                        className="w-4 h-4 rounded-full inline-block" 
                                                        style={{ backgroundColor: item.color.toLowerCase() }}
                                                    ></span>
                                                    {item.color}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-sm ${item.quantity < 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                    {item.quantity}
                                                </span>
                                            </td>
                                            <td className="p-4">{item.supplier}</td>
                                            <td className="p-4 font-mono">${item.price}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-sm ${item.availability.toLowerCase() === 'yes' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {item.availability}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="7" className="text-center p-8 text-gray-500 italic">
                                                No uniforms added yet. Start by adding some items!
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

export default UniformsDressCode;