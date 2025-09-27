import React, { useState } from 'react';
import StaffSidebar from '../StaffSidebar';
import StaffHeader from '../StaffHeader';

const LostAndFound = () => {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({
        itemName: '',
        category: '',
        location: '',
        date: '',
        status: 'Lost',
        description: '',
        claimedBy: ''
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setItems([...items, { ...form, id: Date.now() }]);
        setForm({ itemName: '', category: '', location: '', date: '', status: 'Lost', description: '', claimedBy: '' });
    };

    return (
        <div className="w-full flex bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <StaffSidebar />
            <main className="flex-1 overflow-y-auto p-8">
                <StaffHeader />
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-8 flex items-center gap-3 mt-3">
                        🛠️ Lost and Found Inventory
                    </h1>

                    {/* Form Section */}
                    <div className="bg-white p-6 rounded-xl shadow-md mb-8 hover:shadow-lg">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Lost/Found Item</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[{ name: 'itemName', placeholder: 'Item Name', type: 'text' },
                                { name: 'category', placeholder: 'Category', type: 'text' },
                                { name: 'location', placeholder: 'Last Seen Location', type: 'text' },
                                { name: 'date', placeholder: 'Date (YYYY-MM-DD)', type: 'date' },
                                { name: 'description', placeholder: 'Description', type: 'text' }
                            ].map((field) => (
                                <div key={field.name}>
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        placeholder={field.placeholder}
                                        value={form[field.name]}
                                        onChange={handleChange}
                                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:border-blue-300"
                                        required
                                    />
                                </div>
                            ))}

                            <div>
                                <select name="status" value={form.status} onChange={handleChange} className="w-full p-4 border border-gray-300 rounded-lg">
                                    <option value="Lost">Lost</option>
                                    <option value="Found">Found</option>
                                </select>
                            </div>
                            {form.status === 'Found' && (
                                <div>
                                    <input
                                        type="text"
                                        name="claimedBy"
                                        placeholder="Claimed By (if applicable)"
                                        value={form.claimedBy}
                                        onChange={handleChange}
                                        className="w-full p-4 border border-gray-300 rounded-lg"
                                    />
                                </div>
                            )}
                            <div className="col-span-full">
                                <button type="submit" className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Item</button>
                            </div>
                        </form>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Lost and Found List</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-blue-600 text-white">
                                        {['Item Name', 'Category', 'Location', 'Date', 'Status', 'Claimed By', 'Description'].map((header) => (
                                            <th key={header} className="p-4 text-left font-semibold">{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.length > 0 ? items.map((item, index) => (
                                        <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="p-4">{item.itemName}</td>
                                            <td className="p-4">{item.category}</td>
                                            <td className="p-4">{item.location}</td>
                                            <td className="p-4">{item.date}</td>
                                            <td className={`p-4 ${item.status === 'Lost' ? 'text-red-600' : 'text-green-600'}`}>{item.status}</td>
                                            <td className="p-4">{item.status === 'Found' ? item.claimedBy || 'Not Claimed' : '-'}</td>
                                            <td className="p-4">{item.description}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="7" className="text-center p-8 text-gray-500 italic">No items recorded yet.</td>
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

export default LostAndFound;