import React, { useState } from 'react';
import { FaWallet, FaUsers, FaChartLine, FaFileDownload, FaUniversity } from 'react-icons/fa';
import Sidebar from './Accountant_Sidebar';
import Header from './Accountant_Header';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const AccountantSalary = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const schoolData = {
        name: "Sunrise International School",
        contact: "+91-98765-43210",
        email: "contact@sunriseschool.edu.in",
        address: "456 Knowledge Park, Education City, IN 567890"
    };

    const payrollData = {
        totalMonthlySalary: "₹5,00,000",
        totalYearlySalary: "₹60,00,000",
        employeesPaid: 50,
        upcomingPayrollDate: "20 Mar 2025",
    };

    const employees = [
        { id: "EMP001", name: "Amit Patel", designation: "Teacher", department: "Teaching", salary: 50000, halfDays: 1, paidLeaves: 2, status: "Paid", mode: "Bank Transfer" },
        { id: "EMP002", name: "Priya Sharma", designation: "Admin", department: "Admin", salary: 35000, halfDays: 0, paidLeaves: 1, status: "Pending", mode: "UPI" },
        { id: "EMP003", name: "Ravi Kumar", designation: "Support", department: "Support Staff", salary: 20000, halfDays: 2, paidLeaves: 0, status: "Paid", mode: "Cash" },
    ];

    const calculateDeductions = (salary, halfDays, paidLeaves) => {
        const halfDayDeduction = (salary / 30) / 2;
        const paidLeaveDeduction = (salary / 30) * paidLeaves;
        return {
            halfDay: halfDayDeduction * halfDays,
            paidLeave: paidLeaveDeduction,
        };
    };

    const calculateNetSalary = (salary, deductions) => {
        const totalDeductions = Object.values(deductions).reduce((acc, curr) => acc + curr, 0);
        return salary - totalDeductions;
    };

    const calculateYearlyNetSalary = (salary, halfDays, paidLeaves) => {
        const monthlyDeductions = calculateDeductions(salary, halfDays, paidLeaves);
        const monthlyNetSalary = calculateNetSalary(salary, monthlyDeductions);
        return monthlyNetSalary * 12; // Assuming 12 months in a year
    };

    const exportMonthlyReport = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Employee Records', {
                properties: { defaultRowHeight: 20 }
            });

            const borderStyle = { style: 'thin', color: { argb: 'FF000000' } };
            const headerStyle = {
                font: { bold: true },
                alignment: { horizontal: 'center', vertical: 'middle' },
                border: { top: borderStyle, left: borderStyle, bottom: borderStyle, right: borderStyle }
            };
            const dataStyle = {
                alignment: { horizontal: 'center', vertical: 'middle' },
                border: { top: borderStyle, left: borderStyle, bottom: borderStyle, right: borderStyle }
            };

            worksheet.columns = [
                { width: 5 }, { width: 10 }, { width: 15 }, { width: 25 }, { width: 15 },
                { width: 15 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 15 },
                { width: 10 }, { width: 15 }
            ];

            const applyBorderToMergedCells = (startCell, endCell) => {
                const [startCol, startRow] = startCell.split(/(\d+)/);
                const [endCol, endRow] = endCell.split(/(\d+)/);
                for (let row = parseInt(startRow); row <= parseInt(endRow); row++) {
                    for (let col = startCol.charCodeAt(0); col <= endCol.charCodeAt(0); col++) {
                        const cell = worksheet.getCell(`${String.fromCharCode(col)}${row}`);
                        cell.border = { top: borderStyle, left: borderStyle, bottom: borderStyle, right: borderStyle };
                    }
                }
            };

            const addHeaderRow = (cellRange, value, style) => {
                worksheet.mergeCells(cellRange);
                const cell = worksheet.getCell(cellRange.split(':')[0]);
                cell.value = value;
                cell.style = style;
                applyBorderToMergedCells(cellRange.split(':')[0], cellRange.split(':')[1]);
            };

            addHeaderRow('B2:L2', schoolData.name, { ...headerStyle, font: { size: 14 } });
            addHeaderRow('B3:L3', schoolData.address, dataStyle);
            addHeaderRow('B4:J4', schoolData.email, dataStyle);
            addHeaderRow('K4:L4', schoolData.contact, dataStyle);
            addHeaderRow('B5:L5', 'Monthly Salary Report', headerStyle);

            const headerRow = worksheet.addRow([
                "", "S.No.", "Employee ID", "Name", "Designation",
                "Department", "Gross Salary", "Half Days", "Paid Leaves",
                "Net Salary", "Status", "Payment Mode"
            ]);
            headerRow.eachCell((cell, colNumber) => {
                if (colNumber > 1) cell.style = headerStyle;
            });
            headerRow.height = 25;

            employees.forEach((employee, index) => {
                const deductions = calculateDeductions(employee.salary, employee.halfDays, employee.paidLeaves);
                const netSalary = calculateNetSalary(employee.salary, deductions);

                const row = worksheet.addRow([
                    "", index + 1, employee.id, employee.name,
                    employee.designation, employee.department,
                    `₹${employee.salary}`, employee.halfDays,
                    employee.paidLeaves, `₹${netSalary.toFixed(2)}`,
                    employee.status, employee.mode
                ]);
                row.eachCell((cell, colNumber) => {
                    if (colNumber > 1) cell.style = dataStyle;
                });
            });

            worksheet.autoFilter = 'B6:L6';

            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }), `${schoolData.name}_Monthly_Salary_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
        } catch (error) {
            console.error("Error generating Excel file:", error);
            alert("Error generating Excel file. Please try again.");
        }
    };

    const exportYearlyReport = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Yearly Employee Records', {
                properties: { defaultRowHeight: 20 }
            });

            const borderStyle = { style: 'thin', color: { argb: 'FF000000' } };
            const headerStyle = {
                font: { bold: true },
                alignment: { horizontal: 'center', vertical: 'middle' },
                border: { top: borderStyle, left: borderStyle, bottom: borderStyle, right: borderStyle }
            };
            const dataStyle = {
                alignment: { horizontal: 'center', vertical: 'middle' },
                border: { top: borderStyle, left: borderStyle, bottom: borderStyle, right: borderStyle }
            };

            worksheet.columns = [
                { width: 5 }, { width: 10 }, { width: 15 }, { width: 25 }, { width: 15 },
                { width: 15 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 15 },
                { width: 10 }, { width: 15 }
            ];

            const applyBorderToMergedCells = (startCell, endCell) => {
                const [startCol, startRow] = startCell.split(/(\d+)/);
                const [endCol, endRow] = endCell.split(/(\d+)/);
                for (let row = parseInt(startRow); row <= parseInt(endRow); row++) {
                    for (let col = startCol.charCodeAt(0); col <= endCol.charCodeAt(0); col++) {
                        const cell = worksheet.getCell(`${String.fromCharCode(col)}${row}`);
                        cell.border = { top: borderStyle, left: borderStyle, bottom: borderStyle, right: borderStyle };
                    }
                }
            };

            const addHeaderRow = (cellRange, value, style) => {
                worksheet.mergeCells(cellRange);
                const cell = worksheet.getCell(cellRange.split(':')[0]);
                cell.value = value;
                cell.style = style;
                applyBorderToMergedCells(cellRange.split(':')[0], cellRange.split(':')[1]);
            };

            addHeaderRow('B2:L2', schoolData.name, { ...headerStyle, font: { size: 14 } });
            addHeaderRow('B3:L3', schoolData.address, dataStyle);
            addHeaderRow('B4:J4', schoolData.email, dataStyle);
            addHeaderRow('K4:L4', schoolData.contact, dataStyle);
            addHeaderRow('B5:L5', 'Yearly Salary Report', headerStyle);

            const headerRow = worksheet.addRow([
                "", "S.No.", "Employee ID", "Name", "Designation",
                "Department", "Monthly Gross Salary", "Half Days", "Paid Leaves",
                "Yearly Net Salary", "Status", "Payment Mode"
            ]);
            headerRow.eachCell((cell, colNumber) => {
                if (colNumber > 1) cell.style = headerStyle;
            });
            headerRow.height = 25;

            employees.forEach((employee, index) => {
                const yearlyNetSalary = calculateYearlyNetSalary(employee.salary, employee.halfDays, employee.paidLeaves);

                const row = worksheet.addRow([
                    "", index + 1, employee.id, employee.name,
                    employee.designation, employee.department,
                    `₹${employee.salary}`, employee.halfDays,
                    employee.paidLeaves, `₹${yearlyNetSalary.toFixed(2)}`,
                    employee.status, employee.mode
                ]);
                row.eachCell((cell, colNumber) => {
                    if (colNumber > 1) cell.style = dataStyle;
                });
            });

            worksheet.autoFilter = 'B6:L6';

            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }), `${schoolData.name}_Yearly_Salary_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
        } catch (error) {
            console.error("Error generating Excel file:", error);
            alert("Error generating Excel file. Please try again.");
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex w-full">
                <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <main className="flex-1 overflow-y-auto lg:ml-64">
                    <Header setIsSidebarOpen={setIsSidebarOpen} />
                    <div className="p-4 md:p-6">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 text-center">Salary & Payroll Management</h1>

                        <div className="grid grid-cols-1 gap-6">
                            {/* Payroll Overview */}
                            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <FaWallet className="mr-2 text-indigo-500" />
                                    Payroll Overview
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="border-l-4 border-indigo-500 pl-3 py-1">
                                        <p className="text-sm text-gray-500">Total Salary (Monthly)</p>
                                        <p className="font-medium text-indigo-700">{payrollData.totalMonthlySalary}</p>
                                    </div>
                                    <div className="border-l-4 border-indigo-500 pl-3 py-1">
                                        <p className="text-sm text-gray-500">Total Salary (Yearly)</p>
                                        <p className="font-medium text-indigo-700">{payrollData.totalYearlySalary}</p>
                                    </div>
                                    <div className="border-l-4 border-indigo-500 pl-3 py-1">
                                        <p className="text-sm text-gray-500">Employees Paid</p>
                                        <p className="font-medium">{payrollData.employeesPaid}</p>
                                    </div>
                                    <div className="border-l-4 border-indigo-500 pl-3 py-1">
                                        <p className="text-sm text-gray-500">Upcoming Payroll Date</p>
                                        <p className="font-medium">{payrollData.upcomingPayrollDate}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Employee Salary Details */}
                            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <FaUsers className="mr-2 text-indigo-500" />
                                    Employee Salary Details
                                </h2>
                                <div className="overflow-hidden rounded-lg border border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Salary</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {employees.map((emp) => {
                                                const deductions = calculateDeductions(emp.salary, emp.halfDays, emp.paidLeaves);
                                                const netSalary = calculateNetSalary(emp.salary, deductions);
                                                return (
                                                    <tr key={emp.id} className="hover:bg-indigo-50 transition-colors duration-150">
                                                        <td className="px-6 py-4 whitespace-nowrap">{emp.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{emp.id}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{emp.designation}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{emp.department}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">₹{emp.salary}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div>
                                                                <p>Half Day Deduction: ₹{deductions.halfDay.toFixed(2)}</p>
                                                                <p>Paid Leave Deduction: ₹{deductions.paidLeave.toFixed(2)}</p>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">₹{netSalary.toFixed(2)}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 py-1 text-xs rounded-full ${emp.status === "Paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                                                {emp.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{emp.mode}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Employee Payroll Reports */}
                            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <FaFileDownload className="mr-2 text-indigo-500" />
                                    Employee Payroll Reports
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <button
                                        onClick={exportMonthlyReport}
                                        className="bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 flex items-center justify-center"
                                    >
                                        <FaFileDownload className="mr-2" />
                                        Monthly Report
                                    </button>
                                    <button
                                        onClick={exportYearlyReport}
                                        className="bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 flex items-center justify-center"
                                    >
                                        <FaFileDownload className="mr-2" />
                                        Yearly Report
                                    </button>
                                    <button className="bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 flex items-center justify-center">
                                        <FaFileDownload className="mr-2" />
                                        Salary Breakdown
                                    </button>
                                </div>
                            </div>

                            {/* Payment Logs & Transaction Status */}
                            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <FaUniversity className="mr-2 text-indigo-500" />
                                    Payment Logs & Transaction Status
                                </h2>
                                <div className="overflow-hidden rounded-lg border border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {[
                                                { id: "TXN001", date: "05 Mar 2025", amount: "₹50,000", mode: "Bank Transfer", status: "Successful" },
                                                { id: "TXN002", date: "06 Mar 2025", amount: "₹35,000", mode: "UPI", status: "Pending" },
                                                { id: "TXN003", date: "07 Mar 2025", amount: "₹20,000", mode: "Cash", status: "Failed" },
                                            ].map((log) => (
                                                <tr key={log.id} className="hover:bg-indigo-50 transition-colors duration-150">
                                                    <td className="px-6 py-4 whitespace-nowrap">{log.id}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{log.date}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{log.amount}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{log.mode}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 text-xs rounded-full ${log.status === "Successful" ? "bg-green-100 text-green-800" : log.status === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
                                                            {log.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AccountantSalary;