import React, { useState } from 'react';
import StaffSidebar from '../StaffSidebar';
import StaffHeader from '../StaffHeader';

const ITInventory = () => {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({
        equipmentName: '',
        equipmentCode: '',
        category: '',
        brandModel: '',
        quantity: '',
        // location: '',
        purchaseDate: '',
        supplier: '',
        warrantyExpiry: '',
        condition: '',
        assignedTo: '',
        maintenanceSchedule: ''
    });
    // abx 

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setItems([...items, { ...form, id: Date.now() }]);
        setForm({
            equipmentName: '', equipmentCode: '', category: '', brandModel: '', quantity: '', location: '',
            purchaseDate: '', supplier: '', warrantyExpiry: '', condition: '', assignedTo: '', maintenanceSchedule: ''
        });
    };

    return (
        <div className="w-full flex bg-gray-100 min-h-screen font-sans">
            <StaffSidebar />
            <main className="flex-1 overflow-y-auto p-8">
                <StaffHeader />
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-8 flex items-center gap-2 mt-3">
                        <span>💻</span> IT & Electronic Equipment Inventory
                    </h1>

                    {/* Form Section */}
                    <div className="bg-white p-8 rounded-xl shadow-md mb-8 transform transition-all hover:shadow-xl">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <span>➕</span> Add New Equipment
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { name: "equipmentName", placeholder: "Equipment Name", type: "text" },
                                { name: "equipmentCode", placeholder: "Equipment Code", type: "text" },
                                { name: "category", placeholder: "Category", type: "text" },
                                { name: "brandModel", placeholder: "Brand & Model", type: "text" },
                                { name: "quantity", placeholder: "Quantity", type: "number" },
                                { name: "location", placeholder: "Location", type: "text" },
                                { name: "purchaseDate", type: "date" },
                                { name: "supplier", placeholder: "Supplier", type: "text" },
                                { name: "warrantyExpiry", type: "date" },
                                { name: "condition", placeholder: "Condition (New, Good, Repair)", type: "text" },
                                { name: "assignedTo", placeholder: "Assigned To / Department", type: "text" },
                                { name: "maintenanceSchedule", type: "date" },
                            ].map(({ name, placeholder, type }) => (
                                <input
                                    key={name}
                                    type={type}
                                    name={name}
                                    placeholder={placeholder}
                                    value={form[name]}
                                    onChange={handleChange}
                                    className="p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 text-gray-700 placeholder-gray-400"
                                    required={type !== "date" && name !== "assignedTo" && name !== "maintenanceSchedule"}
                                />
                            ))}
                            <button
                                type="submit"
                                className="mt-4 col-span-full md:col-span-1 lg:col-span-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:bg-blue-800 cursor-pointer focus:ring-4 focus:ring-indigo-300 transition-all duration-200 font-medium"
                            >
                                Add Equipment
                            </button>
                        </form>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white p-8 rounded-xl shadow-md overflow-hidden">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <span>📋</span> Equipment List
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-sm">
                                <thead>
                                    <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                        {["Equipment Name", "Code", "Category", "Brand & Model", "Quantity", "Location", "Purchase Date", "Supplier", "Warranty Expiry", "Condition"].map((header) => (
                                            <th key={header} className="p-4 text-left font-medium">{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.length > 0 ? items.map((item) => (
                                        <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors duration-150">
                                            <td className="p-4">{item.equipmentName}</td>
                                            <td className="p-4">{item.equipmentCode}</td>
                                            <td className="p-4">{item.category}</td>
                                            <td className="p-4">{item.brandModel}</td>
                                            <td className="p-4">{item.quantity}</td>
                                            <td className="p-4">{item.location}</td>
                                            <td className="p-4">{item.purchaseDate}</td>
                                            <td className="p-4">{item.supplier}</td>
                                            <td className="p-4">{item.warrantyExpiry}</td>
                                            <td className="p-4">{item.condition}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="10" className="text-center p-6 text-gray-500">No equipment added yet.</td>
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

export default ITInventory;