import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import StaffSidebar from "../StaffSidebar";
import StaffHeader from "../StaffHeader";

// Yup validation schema with all fields required
const schema = yup.object().shape({
    issueTitle: yup.string().required("Issue Title is required"),
    description: yup.string().required("Issue Description is required"),
    category: yup.string().required("Category is required"),
    priority: yup.string().required("Priority is required"),
    reporterName: yup
        .string()
        .required("Reporter Name is required")
        .matches(/^[A-Za-z\s]+$/, "Only letters and spaces allowed"),
    role: yup.string().required("Reporter Role is required"),
    department: yup.string().required("Department is required"),
    deviceType: yup.string().required("Device Type is required"),
    serialNumber: yup.string().required("Serial Number is required"), // Added validation
    operatingSystem: yup.string().required("Operating System is required"),
    softwareIssue: yup.string().required("Software Issue is required"), // Added validation
    resolution: yup.string().required("Resolution Steps are required"), // Added validation
    itStaff: yup.string().required("IT Staff Name is required"), // Added validation
});

const ITSupport = () => {
    const [items, setItems] = useState([]);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            issueTitle: "",
            description: "",
            category: "",
            priority: "",
            reporterName: "",
            role: "",
            department: "",
            deviceType: "",
            serialNumber: "",
            operatingSystem: "",
            softwareIssue: "",
            resolution: "",
            itStaff: "",
        },
    });

    const onSubmit = (data) => {
        setItems([...items, { ...data, id: Date.now() }]);
        console.log("Submitted Data: ", data);
        alert("Issue submitted successfully!");
        reset();
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <StaffSidebar />
            <main className="flex-1 p-6">
                <StaffHeader />
                <div className="max-w-5xl mx-auto mt-6">
                    {/* Form Section */}
                    <div className="bg-white p-8 rounded-xl shadow-md transition-all hover:shadow-xl mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
                            <span>🛠️</span> IT Support Management
                        </h1>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    {
                                        name: "issueTitle",
                                        placeholder: "Issue Title",
                                        type: "text",
                                    },
                                    {
                                        name: "description",
                                        placeholder: "Issue Description",
                                        type: "textarea",
                                    },
                                    {
                                        name: "category",
                                        type: "select",
                                        options: ["", "Hardware", "Software"],
                                        placeholder: "Category",
                                    },
                                    {
                                        name: "priority",
                                        type: "select",
                                        options: ["", "Low", "Medium", "High"],
                                        placeholder: "Priority",
                                    },
                                    {
                                        name: "reporterName",
                                        placeholder: "Reporter Name",
                                        type: "text",
                                    },
                                    {
                                        name: "role",
                                        placeholder: "Reporter Role",
                                        type: "text",
                                    },
                                    {
                                        name: "department",
                                        placeholder: "Department",
                                        type: "text",
                                    },
                                    {
                                        name: "deviceType",
                                        placeholder: "Device Type",
                                        type: "text",
                                    },
                                    {
                                        name: "serialNumber",
                                        placeholder: "Serial Number",
                                        type: "text",
                                    },
                                    {
                                        name: "operatingSystem",
                                        type: "select",
                                        options: ["", "Windows", "macOS", "Linux", "Other"],
                                        placeholder: "Operating System",
                                    },
                                    {
                                        name: "softwareIssue",
                                        placeholder: "Software Issue",
                                        type: "text",
                                    },
                                    {
                                        name: "resolution",
                                        placeholder: "Resolution Steps",
                                        type: "textarea",
                                    },
                                    {
                                        name: "itStaff",
                                        placeholder: "IT Staff Name",
                                        type: "text",
                                    },
                                ].map(({ name, placeholder, type, options }) => (
                                    <div key={name} className="flex flex-col">
                                        {type === "textarea" ? (
                                            <textarea
                                                {...register(name)}
                                                placeholder={placeholder}
                                                rows="1"
                                                className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 text-gray-700 placeholder-gray-400 ${
                                                    errors[name] ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                        ) : type === "select" ? (
                                            <select
                                                {...register(name)}
                                                className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 text-gray-700 placeholder-gray-400 h-14 ${
                                                    errors[name] ? "border-red-500" : "border-gray-300"
                                                }`}
                                            >
                                                {options.map((option) => (
                                                    <option key={option} value={option}>
                                                        {option || placeholder}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type={type}
                                                {...register(name)}
                                                placeholder={placeholder}
                                                className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 text-gray-700 placeholder-gray-400 h-14 ${
                                                    errors[name] ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                        )}
                                        {errors[name] && (
                                            <p className="mt-1 text-sm text-red-500">{errors[name].message}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-indigo-300 transition-all duration-200 font-medium"
                                >
                                    Submit Issue
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white p-8 rounded-xl shadow-md overflow-hidden">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <span>📋</span> IT Support Issues List
                        </h2>
                        <div className="overflow-x-auto max-w-full">
                            <table className="min-w-[1200px] border-collapse text-sm">
                                <thead>
                                    <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white whitespace-nowrap">
                                        {[
                                            "Issue Title",
                                            "Category",
                                            "Priority",
                                            "Reporter Name",
                                            "Department",
                                            "Device Type",
                                            "Operating System",
                                            "IT Staff",
                                        ].map((header) => (
                                            <th key={header} className="p-4 text-left font-medium">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.length > 0 ? (
                                        items.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="border-b hover:bg-gray-50 transition-colors duration-150"
                                            >
                                                <td className="p-4">{item.issueTitle}</td>
                                                <td className="p-4">{item.category}</td>
                                                <td className="p-4">{item.priority}</td>
                                                <td className="p-4">{item.reporterName}</td>
                                                <td className="p-4">{item.department}</td>
                                                <td className="p-4">{item.deviceType || "N/A"}</td>
                                                <td className="p-4">{item.operatingSystem}</td>
                                                <td className="p-4">{item.itStaff || "N/A"}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="text-center p-6 text-gray-500">
                                                No IT support issues added yet.
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

export default ITSupport;