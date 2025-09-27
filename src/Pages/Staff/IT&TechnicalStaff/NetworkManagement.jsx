import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import StaffSidebar from "../../Staff/StaffSidebar";
import StaffHeader from "../StaffHeader";

// Yup validation schema
const schema = yup.object().shape({
    issueTitle: yup.string().required("Issue Title is required"),
    description: yup.string().required("Issue Description is required"),
    networkType: yup.string().required("Network Type is required"),
    deviceAffected: yup.string().required("Device Affected is required"),
    ipAddress: yup.string().matches(
        /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^$/i,
        "Invalid IP Address format (e.g., 192.168.1.1)"
    ), // Optional, but validated if provided
    macAddress: yup.string().matches(
        /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$|^$/i,
        "Invalid MAC Address format (e.g., 00:14:22:01:23:45)"
    ), // Optional, but validated if provided
    location: yup.string().required("Location is required"),
    internetSpeed: yup.string(), // Optional
    errorCode: yup.string(), // Optional
    issueTime: yup.string().required("Issue Time is required"),
    priorityLevel: yup.string().required("Priority Level is required"),
    affectedUsers: yup
        .number()
        .typeError("Must be a number")
        .positive("Must be a positive number")
        .integer("Must be an integer")
        .nullable()
        .transform((value, originalValue) => (originalValue === "" ? null : value)), // Optional
    networkProvider: yup.string(), // Optional
    reportedBy: yup
        .string()
        .required("Reported By is required")
        .matches(/^[A-Za-z\s]+$/, "Only letters and spaces allowed"),
    department: yup.string().required("Department is required"),
    assignedITStaff: yup.string(), // Optional
    resolutionSteps: yup.string(), // Optional
    status: yup.string().required("Status is required"),
    resolutionDate: yup.string(), // Optional
});

const NetworkManagement = () => {
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
            networkType: "",
            deviceAffected: "",
            ipAddress: "",
            macAddress: "",
            location: "",
            internetSpeed: "",
            errorCode: "",
            issueTime: "",
            priorityLevel: "",
            affectedUsers: "",
            networkProvider: "",
            reportedBy: "",
            department: "",
            assignedITStaff: "",
            resolutionSteps: "",
            status: "",
            resolutionDate: "",
        },
    });

    const onSubmit = (data) => {
        setItems([...items, { ...data, id: Date.now() }]);
        console.log("Submitted Data: ", data);
        alert("Network issue reported successfully!");
        reset();
    };

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            <StaffSidebar />
            <main className="flex-1 p-6">
                <StaffHeader />
                <div className="max-w-5xl mx-auto mt-6">
                    {/* Form Section */}
                    <div className="bg-white p-8 rounded-xl shadow-md transition-all hover:shadow-xl mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
                            <span>🌐</span> Network Management
                        </h1>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    {
                                        name: "issueTitle",
                                        placeholder: "Issue Title",
                                        type: "text",
                                        required: true,
                                    },
                                    {
                                        name: "description",
                                        placeholder: "Issue Description",
                                        type: "textarea",
                                    },
                                    {
                                        name: "networkType",
                                        type: "select",
                                        options: ["", "LAN", "WiFi", "VPN", "Firewall"],
                                        placeholder: "Network Type",
                                        required: true,
                                    },
                                    {
                                        name: "deviceAffected",
                                        placeholder: "Device Affected",
                                        type: "text",
                                        required: true,
                                    },
                                    {
                                        name: "ipAddress",
                                        placeholder: "IP Address",
                                        type: "text",
                                    },
                                    {
                                        name: "macAddress",
                                        placeholder: "MAC Address",
                                        type: "text",
                                    },
                                    {
                                        name: "location",
                                        placeholder: "Location",
                                        type: "text",
                                        required: true,
                                    },
                                    {
                                        name: "internetSpeed",
                                        placeholder: "Internet Speed (e.g., 100 Mbps)",
                                        type: "text",
                                    },
                                    {
                                        name: "errorCode",
                                        placeholder: "Error Code",
                                        type: "text",
                                    },
                                    {
                                        name: "issueTime",
                                        placeholder: "Issue Time",
                                        type: "datetime-local",
                                        required: true,
                                    },
                                    {
                                        name: "priorityLevel",
                                        type: "select",
                                        options: ["", "Low", "Medium", "High", "Critical"],
                                        placeholder: "Priority Level",
                                        required: true,
                                    },
                                    {
                                        name: "affectedUsers",
                                        placeholder: "Number of Affected Users",
                                        type: "number",
                                    },
                                    {
                                        name: "networkProvider",
                                        placeholder: "Network Provider",
                                        type: "text",
                                    },
                                    {
                                        name: "reportedBy",
                                        placeholder: "Reported By",
                                        type: "text",
                                        required: true,
                                    },
                                    {
                                        name: "department",
                                        placeholder: "Department",
                                        type: "text",
                                        required: true,
                                    },
                                    {
                                        name: "assignedITStaff",
                                        placeholder: "Assigned IT Staff",
                                        type: "text",
                                    },
                                    {
                                        name: "resolutionSteps",
                                        placeholder: "Resolution Steps",
                                        type: "textarea",
                                    },
                                    {
                                        name: "status",
                                        type: "select",
                                        options: ["", "Pending", "In Progress", "Resolved"],
                                        placeholder: "Status",
                                        required: true,
                                    },
                                    {
                                        name: "resolutionDate",
                                        placeholder: "Resolution Date",
                                        type: "date",
                                    },
                                ].map(({ name, placeholder, type, options, required }) => (
                                    <div key={name} className="flex flex-col">
                                        <label htmlFor={name} className="text-sm font-medium text-gray-600 mb-1">
                                            {placeholder} {required && <span className="text-red-500">*</span>}
                                        </label>
                                        {type === "textarea" ? (
                                            <textarea
                                                id={name}
                                                {...register(name)}
                                                placeholder={placeholder}
                                                rows="1"
                                                className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 text-gray-700 placeholder-gray-400 ${
                                                    errors[name] ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                        ) : type === "select" ? (
                                            <select
                                                id={name}
                                                {...register(name)}
                                                className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 text-gray-700 placeholder-gray-400 h-14 ${
                                                    errors[name] ? "border-red-500" : "border-gray-300"
                                                }`}
                                            >
                                                {options.map((option) => (
                                                    <option key={option} value={option}>
                                                        {option || `Select ${placeholder}`}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                id={name}
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
                                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 focus:ring-4 focus:ring-indigo-300 transition-all duration-200 font-medium shadow-md"
                                >
                                    Submit Issue
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white p-8 rounded-xl shadow-md overflow-hidden">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <span>📋</span> Network Issues List
                        </h2>
                        <div className="overflow-x-auto max-w-full">
                            <table className="min-w-[1200px] border-collapse text-sm">
                                <thead>
                                    <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white whitespace-nowrap">
                                        {[
                                            "Issue Title",
                                            "Network Type",
                                            "Device Affected",
                                            "IP Address",
                                            "Location",
                                            "Priority Level",
                                            "Reported By",
                                            "Department",
                                            "Status",
                                            "Resolution Date",
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
                                                <td className="p-4">{item.networkType}</td>
                                                <td className="p-4">{item.deviceAffected}</td>
                                                <td className="p-4">{item.ipAddress || "N/A"}</td>
                                                <td className="p-4">{item.location}</td>
                                                <td className="p-4">{item.priorityLevel}</td>
                                                <td className="p-4">{item.reportedBy}</td>
                                                <td className="p-4">{item.department}</td>
                                                <td className="p-4">{item.status}</td>
                                                <td className="p-4">{item.resolutionDate || "N/A"}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="10" className="text-center p-6 text-gray-500">
                                                No network issues added yet.
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

export default NetworkManagement;