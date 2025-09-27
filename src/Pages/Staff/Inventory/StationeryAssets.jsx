import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import StaffSidebar from "../StaffSidebar";
import StaffHeader from "../StaffHeader";

// Yup validation schema
const schema = yup.object().shape({
    itemName: yup.string().required("Item Name is required"),
    itemCode: yup.string().required("Item Code is required"),
    category: yup.string().required("Category is required"),
    quantity: yup
        .number()
        .typeError("Quantity must be a number")
        .required("Quantity is required")
        .positive("Quantity must be positive")
        .integer("Quantity must be an integer"),
    location: yup.string().required("Location is required"),
    purchaseDate: yup.string().required("Purchase Date is required"),
    supplier: yup.string().required("Supplier Name is required"),
});

const StationeryAssets = () => {
    const [items, setItems] = useState([]);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            itemName: "",
            itemCode: "",
            category: "",
            quantity: "",
            location: "",
            purchaseDate: "",
            supplier: "",
        },
    });

    const onSubmit = (data) => {
        setItems([...items, { ...data, id: Date.now() }]);
        console.log("Submitted Data: ", data);
        alert("Item added successfully!");
        reset();
    };

    return (
        <div className="w-full flex bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <StaffSidebar />
            <main className="flex-1 overflow-y-auto p-8">
                <StaffHeader />
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-8 flex items-center gap-3 animate-fade-in">
                        <span className="text-blue-600 mt-3">📌</span> Stationery & Assets Management
                    </h1>

                    {/* Form Section */}
                    <div className="bg-white p-6 rounded-xl shadow-md mb-8 transform transition-all hover:shadow-lg">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <span className="text-green-500">➕</span> Add New Item
                        </h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { name: "itemName", placeholder: "Item Name", type: "text" },
                                { name: "itemCode", placeholder: "Item Code", type: "text" },
                                { name: "category", placeholder: "Category", type: "text" },
                                { name: "quantity", placeholder: "Quantity", type: "number" },
                                { name: "location", placeholder: "Location", type: "text" },
                                { name: "purchaseDate", placeholder: "Purchase Date", type: "date" },
                                { name: "supplier", placeholder: "Supplier Name", type: "text" },
                            ].map((field) => (
                                <div key={field.name} className="relative flex flex-col">
                                    <input
                                        type={field.type}
                                        {...register(field.name)}
                                        placeholder={field.placeholder}
                                        className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-300 hover:border-blue-300 ${
                                            errors[field.name] ? "border-red-500" : "border-gray-200"
                                        }`}
                                    />
                                    {errors[field.name] && (
                                        <p className="mt-1 text-sm text-red-500">{errors[field.name].message}</p>
                                    )}
                                </div>
                            ))}
                            <div className="col-span-full">
                                <button
                                    type="submit"
                                    className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transform transition-all duration-300 hover:scale-105 shadow-md"
                                >
                                    Add Item
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white p-6 rounded-xl shadow-md overflow-hidden">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <span className="text-purple-500">📋</span> Inventory List
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                        {["Item Name", "Item Code", "Category", "Quantity", "Location", "Purchase Date", "Supplier"].map(
                                            (header) => (
                                                <th key={header} className="p-4 text-left font-semibold">
                                                    {header}
                                                </th>
                                            )
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.length > 0 ? (
                                        items.map((item, index) => (
                                            <tr
                                                key={item.id}
                                                className="border-b border-gray-200 hover:bg-gray-50 transition-all duration-200 animate-fade-in"
                                                style={{ animationDelay: `${index * 50}ms` }}
                                            >
                                                <td className="p-4">{item.itemName}</td>
                                                <td className="p-4 font-mono">{item.itemCode}</td>
                                                <td className="p-4">{item.category}</td>
                                                <td className="p-4">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-sm ${
                                                            item.quantity < 5 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                                                        }`}
                                                    >
                                                        {item.quantity}
                                                    </span>
                                                </td>
                                                <td className="p-4">{item.location}</td>
                                                <td className="p-4">{item.purchaseDate}</td>
                                                <td className="p-4">{item.supplier}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center p-8 text-gray-500 italic">
                                                No items added yet. Start by adding some inventory!
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

export default StationeryAssets;