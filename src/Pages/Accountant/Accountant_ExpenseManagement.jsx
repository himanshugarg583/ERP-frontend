import React, { useState, useEffect } from 'react';
import Sidebar from './Accountant_Sidebar';
import Header from './Accountant_Header';
import { FaDollarSign, FaFileUpload, FaUsers, FaCreditCard, FaInfoCircle, FaEdit, FaTimes, FaTrash } from 'react-icons/fa';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { addAccountantIncome, getAccountantIncomeList, updateAccountantIncomeExpense, deleteAccountantIncomeExpense, addAccountantExpense, getAccountantExpenseList, getAccountantIncomeExpenseGraph, getAccountantMonthlyExpense } from '../../helper/requests-method/apiMethods';
import { toast } from 'react-toastify';

const ExpenseOverview = () => {
    const [graphData, setGraphData] = useState({
        total_income: 0,
        total_expense: 0,
        net_profit: 0,
        period: 'All Time'
    });
    const [isLoadingGraph, setIsLoadingGraph] = useState(false);
    const [monthlyData, setMonthlyData] = useState({
        year: new Date().getFullYear(),
        monthly_expenses: []
    });
    const [isLoadingMonthly, setIsLoadingMonthly] = useState(false);

    useEffect(() => {
        fetchGraphData();
        fetchMonthlyExpense();
    }, []);

    const fetchGraphData = async () => {
        setIsLoadingGraph(true);
        try {
            const response = await getAccountantIncomeExpenseGraph();
            if (response.success && response.data) {
                setGraphData(response.data);
            }
        } catch (error) {
            console.error('Error fetching graph data:', error);
        } finally {
            setIsLoadingGraph(false);
        }
    };

    const fetchMonthlyExpense = async () => {
        setIsLoadingMonthly(true);
        try {
            const response = await getAccountantMonthlyExpense();
            if (response.success && response.data) {
                setMonthlyData(response.data);
            }
        } catch (error) {
            console.error('Error fetching monthly expense data:', error);
        } finally {
            setIsLoadingMonthly(false);
        }
    };

    const pieData = [
        { id: 0, value: graphData.total_income, label: 'Income', color: '#4caf50' },
        { id: 1, value: graphData.total_expense, label: 'Expense', color: '#f87171' },
    ];

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const expenses = [300000, 320000, 450000, 400000, 420000, 460000];
    const budget = [500000, 480000, 500000, 490000, 510000, 500000];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-md p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base md:text-lg font-semibold flex items-center">
                        <FaDollarSign className="mr-2 text-green-600" /> Income vs Expense
                    </h2>
                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {graphData.period}
                    </span>
                </div>
                {isLoadingGraph ? (
                    <div className="flex justify-center items-center h-48">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-center">
                            <PieChart
                                series={[{ data: pieData ?? [], innerRadius: 40, outerRadius: 80, paddingAngle: 2, cornerRadius: 4 }]}
                                width={300}
                                height={200}
                                slotProps={{ legend: { hidden: true } }}
                            />
                        </div>
                        <div className="space-y-2 text-sm mt-3">
                            <div className="flex justify-between items-center">
                                <span className="flex items-center">
                                    <span className="w-3 h-3 rounded-full bg-[#4caf50] mr-1"></span>
                                    Income:
                                </span>
                                <span className="font-semibold text-green-700">₹{graphData.total_income.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="flex items-center">
                                    <span className="w-3 h-3 rounded-full bg-[#f87171] mr-1"></span>
                                    Expense:
                                </span>
                                <span className="font-semibold text-red-700">₹{graphData.total_expense.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center border-t pt-2">
                                <span className="font-semibold">Net Profit:</span>
                                <span className={`font-bold ${graphData.net_profit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                    ₹{graphData.net_profit.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-md p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base md:text-lg font-semibold flex items-center">
                        <FaDollarSign className="mr-2 text-indigo-600" /> Monthly Expense Trend
                    </h2>
                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {monthlyData.year}
                    </span>
                </div>
                {isLoadingMonthly ? (
                    <div className="flex justify-center items-center h-48">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-center">
                            <LineChart
                                xAxis={[{ 
                                    data: monthlyData.monthly_expenses.map(m => m.month.substring(0, 3)), 
                                    scaleType: 'point' 
                                }]}
                                series={[
                                    { 
                                        data: monthlyData.monthly_expenses.map(m => m.total_expense), 
                                        label: 'Monthly Expenses', 
                                        color: '#f87171', 
                                        curve: 'linear' 
                                    },
                                ]}
                                width={450}
                                height={200}
                                grid={{ horizontal: true, vertical: true }}
                                slotProps={{ legend: { hidden: true } }}
                            />
                        </div>
                        <div className="flex justify-center text-sm mt-3 text-gray-700">
                            <span className="flex items-center">
                                <span className="w-3 h-3 rounded-full bg-[#f87171] mr-1"></span>
                                Monthly Expenses
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const AccountantExpenseManagement = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [infoModal, setInfoModal] = useState({ isOpen: false, category: '', description: '' });
    const [activeTab, setActiveTab] = useState('expense'); // 'expense' or 'income'
    const [incomeForm, setIncomeForm] = useState({
        category: '',
        sub_category: '',
        amount: '',
        payment_mode: 'cash',
        transaction_ref: '',
        description: '',
        entry_date: new Date().toISOString().split('T')[0],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [incomeList, setIncomeList] = useState([]);
    const [isLoadingIncome, setIsLoadingIncome] = useState(false);
    const [editModal, setEditModal] = useState({ isOpen: false, data: null });
    const [editForm, setEditForm] = useState({
        category: '',
        sub_category: '',
        amount: '',
        payment_mode: 'cash',
        transaction_ref: '',
        description: '',
        entry_date: '',
    });
    const [expenseForm, setExpenseForm] = useState({
        category: '',
        sub_category: '',
        amount: '',
        payment_mode: 'bank_transfer',
        transaction_ref: '',
        description: '',
        entry_date: new Date().toISOString().split('T')[0],
    });
    const [expenseList, setExpenseList] = useState([]);
    const [isLoadingExpense, setIsLoadingExpense] = useState(false);

    const categories = [
        'Staff Salaries & Benefits',
        'Utility Bills',
        'Maintenance & Repairs',
        'Classroom & Office Supplies',
        'Transportation Costs',
        'Examination & Event Expenses',
        'Vendor Payments',
    ];

    const categoryDescriptions = {
        'Staff Salaries & Benefits': 'Includes salaries, bonuses, and benefits for teaching and non-teaching staff.',
        'Utility Bills': 'Covers electricity, water, internet, and other utility expenses.',
        'Maintenance & Repairs': 'Expenses for maintaining and repairing school infrastructure.',
        'Classroom & Office Supplies': 'Costs for stationery, teaching aids, and office equipment.',
        'Transportation Costs': 'Fuel, maintenance, and driver salaries for school buses.',
        'Examination & Event Expenses': 'Fees for exams, events, and extracurricular activities.',
        'Vendor Payments': 'Payments to external suppliers and service providers.',
    };

    const categoryPieData = [
        { id: 0, value: 1500000, label: 'Staff Salaries & Benefits', color: '#6366f1' },
        { id: 1, value: 200000, label: 'Utility Bills', color: '#f43f5e' },
        { id: 2, value: 150000, label: 'Maintenance & Repairs', color: '#f59e0b' },
        { id: 3, value: 100000, label: 'Classroom & Office Supplies', color: '#10b981' },
        { id: 4, value: 250000, label: 'Transportation Costs', color: '#3b82f6' },
        { id: 5, value: 120000, label: 'Examination & Event Expenses', color: '#8b5cf6' },
        { id: 6, value: 180000, label: 'Vendor Payments', color: '#ec4899' },
    ];

    const totalExpenses = (categoryPieData ?? []).reduce((sum, item) => sum + (item.value ?? 0), 0);

    // Fetch income list
    const fetchIncomeList = async () => {
        setIsLoadingIncome(true);
        try {
            const response = await getAccountantIncomeList();
            if (response.success && response.data) {
                setIncomeList(response.data.entries || []);
            }
        } catch (error) {
            console.error('Error fetching income list:', error);
            toast.error('Failed to fetch income list');
        } finally {
            setIsLoadingIncome(false);
        }
    };

    // Fetch expense list
    const fetchExpenseList = async () => {
        setIsLoadingExpense(true);
        try {
            const response = await getAccountantExpenseList();
            if (response.success && response.data) {
                setExpenseList(response.data.entries || []);
            }
        } catch (error) {
            console.error('Error fetching expense list:', error);
            toast.error('Failed to fetch expense list');
        } finally {
            setIsLoadingExpense(false);
        }
    };

    // Fetch income list on component mount and when switching to income tab
    useEffect(() => {
        if (activeTab === 'income') {
            fetchIncomeList();
        } else if (activeTab === 'expense') {
            fetchExpenseList();
        }
    }, [activeTab]);

    const handleInfoClick = (category) => {
        setInfoModal({
            isOpen: true,
            category: category ?? '',
            description: categoryDescriptions[category] ?? 'No description available.',
        });
    };

    const closeModal = () => {
        setInfoModal({ isOpen: false, category: '', description: '' });
    };

    const handleIncomeInputChange = (e) => {
        const { name, value } = e.target;
        setIncomeForm(prev => ({ ...prev, [name]: value }));
    };

    const handleExpenseInputChange = (e) => {
        const { name, value } = e.target;
        setExpenseForm(prev => ({ ...prev, [name]: value }));
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const openEditModal = (income) => {
        setEditForm({
            category: income.category,
            sub_category: income.sub_category,
            amount: income.amount,
            payment_mode: income.payment_mode,
            transaction_ref: income.transaction_ref || '',
            description: income.description || '',
            entry_date: income.entry_date,
        });
        setEditModal({ isOpen: true, data: income });
    };

    const closeEditModal = () => {
        setEditModal({ isOpen: false, data: null });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            try {
                const response = await deleteAccountantIncomeExpense(id);
                
                if (response.success || response.message) {
                    toast.success(response.message || 'Entry deleted successfully!');
                    // Refresh the appropriate list
                    if (activeTab === 'income') {
                        fetchIncomeList();
                    } else {
                        fetchExpenseList();
                    }
                } else {
                    toast.error('Failed to delete entry');
                }
            } catch (error) {
                console.error('Error deleting entry:', error);
                toast.error(error.response?.data?.message || 'An error occurred while deleting the entry');
            }
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                category: editForm.category,
                sub_category: editForm.sub_category,
                amount: parseFloat(editForm.amount),
                payment_mode: editForm.payment_mode,
                transaction_ref: editForm.transaction_ref || '',
                description: editForm.description || '',
                entry_date: editForm.entry_date,
            };

            const response = await updateAccountantIncomeExpense(editModal.data.id, payload);
            
            if (response.success || response.message) {
                toast.success(response.message || 'Entry updated successfully!');
                closeEditModal();
                // Refresh the appropriate list
                if (activeTab === 'income') {
                    fetchIncomeList();
                } else {
                    fetchExpenseList();
                }
            } else {
                toast.error('Failed to update entry');
            }
        } catch (error) {
            console.error('Error updating entry:', error);
            toast.error(error.response?.data?.message || 'An error occurred while updating the entry');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleIncomeSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                category: incomeForm.category,
                sub_category: incomeForm.sub_category,
                amount: parseFloat(incomeForm.amount),
                payment_mode: incomeForm.payment_mode,
                transaction_ref: incomeForm.transaction_ref || '',
                description: incomeForm.description || '',
                entry_date: incomeForm.entry_date,
            };

            const response = await addAccountantIncome(payload);
            
            if (response.success || response.message) {
                toast.success(response.message || 'Income added successfully!');
                // Reset form
                setIncomeForm({
                    category: '',
                    sub_category: '',
                    amount: '',
                    payment_mode: 'cash',
                    transaction_ref: '',
                    description: '',
                    entry_date: new Date().toISOString().split('T')[0],
                });
                // Refresh income list
                fetchIncomeList();
            } else {
                toast.error('Failed to add income');
            }
        } catch (error) {
            console.error('Error submitting income:', error);
            toast.error(error.response?.data?.message || 'An error occurred while submitting the income');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleExpenseSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                category: expenseForm.category,
                sub_category: expenseForm.sub_category,
                amount: parseFloat(expenseForm.amount),
                payment_mode: expenseForm.payment_mode,
                transaction_ref: expenseForm.transaction_ref || '',
                description: expenseForm.description || '',
                entry_date: expenseForm.entry_date,
            };

            const response = await addAccountantExpense(payload);
            
            if (response.success || response.message) {
                toast.success(response.message || 'Expense added successfully!');
                // Reset form
                setExpenseForm({
                    category: '',
                    sub_category: '',
                    amount: '',
                    payment_mode: 'bank_transfer',
                    transaction_ref: '',
                    description: '',
                    entry_date: new Date().toISOString().split('T')[0],
                });
                // Refresh expense list
                fetchExpenseList();
            } else {
                toast.error('Failed to add expense');
            }
        } catch (error) {
            console.error('Error submitting expense:', error);
            toast.error(error.response?.data?.message || 'An error occurred while submitting the expense');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex w-full">
                <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <main className="flex-1 overflow-y-auto lg:ml-64">
                    <Header setIsSidebarOpen={setIsSidebarOpen} />
                    <div className="p-3 md:p-4 lg:p-6 h-full">
                        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 md:mb-8 text-center">
                            Income & Expense Management Portal
                        </h1>

                        {/* Tab Switcher */}
                        <div className="flex justify-center mb-6">
                            <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
                                <button
                                    onClick={() => setActiveTab('expense')}
                                    className={`px-6 py-2 rounded-md transition-all ${
                                        activeTab === 'expense'
                                            ? 'bg-indigo-600 text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    Expense Management
                                </button>
                                <button
                                    onClick={() => setActiveTab('income')}
                                    className={`px-6 py-2 rounded-md transition-all ${
                                        activeTab === 'income'
                                            ? 'bg-green-600 text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    Income Management
                                </button>
                            </div>
                        </div>

                        {/* Conditional rendering based on active tab */}
                        {activeTab === 'expense' ? (
                            <>
                                {/* Expense Overview Charts */}
                                <ExpenseOverview />

                                {/* Add New Expense Form */}
                                <div className="mb-6 md:mb-8">
                                    <div className="bg-white rounded-lg border border-gray-200 shadow-md p-4 hover:shadow-lg transition-all duration-300">
                                        <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center">
                                            <FaFileUpload className="mr-2" /> Add New Expense
                                        </h2>
                                        <form onSubmit={handleExpenseSubmit} className="text-sm md:text-base">
                                            <div className="mb-2 md:mb-3">
                                                <label className="block text-sm font-medium mb-1">Category *</label>
                                                <input
                                                    type="text"
                                                    name="category"
                                                    value={expenseForm.category}
                                                    onChange={handleExpenseInputChange}
                                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                                                    placeholder="e.g., Salary"
                                                    required
                                                />
                                            </div>
                                            <div className="mb-2 md:mb-3">
                                                <label className="block text-sm font-medium mb-1">Sub Category *</label>
                                                <input
                                                    type="text"
                                                    name="sub_category"
                                                    value={expenseForm.sub_category}
                                                    onChange={handleExpenseInputChange}
                                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                                                    placeholder="e.g., Teaching Staff"
                                                    required
                                                />
                                            </div>
                                            <div className="mb-2 md:mb-3">
                                                <label className="block text-sm font-medium mb-1">Amount *</label>
                                                <input
                                                    type="number"
                                                    name="amount"
                                                    value={expenseForm.amount}
                                                    onChange={handleExpenseInputChange}
                                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                                                    placeholder="₹0"
                                                    required
                                                />
                                            </div>
                                            <div className="mb-2 md:mb-3">
                                                <label className="block text-sm font-medium mb-1">Payment Mode *</label>
                                                <select
                                                    name="payment_mode"
                                                    value={expenseForm.payment_mode}
                                                    onChange={handleExpenseInputChange}
                                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                                                    required
                                                >
                                                    <option value="bank_transfer">Bank Transfer</option>
                                                    <option value="cash">Cash</option>
                                                    <option value="online">Online</option>
                                                    <option value="cheque">Cheque</option>
                                                    <option value="upi">UPI</option>
                                                </select>
                                            </div>
                                            <div className="mb-2 md:mb-3">
                                                <label className="block text-sm font-medium mb-1">Transaction Reference</label>
                                                <input
                                                    type="text"
                                                    name="transaction_ref"
                                                    value={expenseForm.transaction_ref}
                                                    onChange={handleExpenseInputChange}
                                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                                                    placeholder="TXN789012"
                                                />
                                            </div>
                                            <div className="mb-2 md:mb-3">
                                                <label className="block text-sm font-medium mb-1">Entry Date *</label>
                                                <input
                                                    type="date"
                                                    name="entry_date"
                                                    value={expenseForm.entry_date}
                                                    onChange={handleExpenseInputChange}
                                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                                                    required
                                                />
                                            </div>
                                            <div className="mb-2 md:mb-3">
                                                <label className="block text-sm font-medium mb-1">Description</label>
                                                <textarea
                                                    name="description"
                                                    value={expenseForm.description}
                                                    onChange={handleExpenseInputChange}
                                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                                                    rows="2"
                                                    placeholder="Brief description of expense"
                                                ></textarea>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-all disabled:bg-gray-400"
                                            >
                                                {isSubmitting ? 'Submitting...' : 'Add Expense'}
                                            </button>
                                        </form>
                                    </div>
                                </div>

                                {/* Expense Entries List */}
                                <div className="bg-white rounded-lg border border-gray-200 shadow-md p-4 hover:shadow-lg transition-all duration-300">
                                <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center text-indigo-700">
                                    <FaDollarSign className="mr-2" /> Expense Entries
                                </h2>
                                {isLoadingExpense ? (
                                    <div className="flex justify-center items-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                    </div>
                                ) : expenseList.length > 0 ? (
                                    <div className="overflow-x-auto max-h-96 overflow-y-auto">
                                        <table className="min-w-full text-xs">
                                            <thead className="bg-indigo-50 sticky top-0">
                                                <tr>
                                                    <th className="px-2 py-2 text-left text-xs font-medium text-indigo-800">Category</th>
                                                    <th className="px-2 py-2 text-left text-xs font-medium text-indigo-800">Sub Category</th>
                                                    <th className="px-2 py-2 text-left text-xs font-medium text-indigo-800">Amount</th>
                                                    <th className="px-2 py-2 text-left text-xs font-medium text-indigo-800">Mode</th>
                                                    <th className="px-2 py-2 text-left text-xs font-medium text-indigo-800">Date</th>
                                                    <th className="px-2 py-2 text-left text-xs font-medium text-indigo-800">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {expenseList.map((expense) => (
                                                    <tr key={expense.id} className="hover:bg-indigo-50">
                                                        <td className="px-2 py-2 text-gray-700">{expense.category}</td>
                                                        <td className="px-2 py-2 text-gray-700">{expense.sub_category}</td>
                                                        <td className="px-2 py-2 text-gray-700 font-semibold">₹{parseFloat(expense.amount).toLocaleString('en-IN')}</td>
                                                        <td className="px-2 py-2">
                                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                                expense.payment_mode === 'cash' ? 'bg-blue-100 text-blue-800' :
                                                                expense.payment_mode === 'online' ? 'bg-green-100 text-green-800' :
                                                                expense.payment_mode === 'cheque' ? 'bg-purple-100 text-purple-800' :
                                                                expense.payment_mode === 'bank_transfer' ? 'bg-indigo-100 text-indigo-800' :
                                                                'bg-orange-100 text-orange-800'
                                                            }`}>
                                                                {expense.payment_mode}
                                                            </span>
                                                        </td>
                                                        <td className="px-2 py-2 text-gray-600">{new Date(expense.entry_date).toLocaleDateString('en-IN')}</td>
                                                        <td className="px-2 py-2">
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => openEditModal(expense)}
                                                                    className="text-indigo-600 hover:text-indigo-800 transition-colors"
                                                                    title="Edit"
                                                                >
                                                                    <FaEdit />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(expense.id)}
                                                                    className="text-red-600 hover:text-red-800 transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <FaTrash />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className="mt-3 text-xs text-gray-600 border-t pt-2">
                                            <p className="font-semibold">Total Entries: {expenseList.length}</p>
                                            <p className="font-semibold text-red-700">Total Expense: ₹{expenseList.reduce((sum, expense) => sum + parseFloat(expense.amount), 0).toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>No expense entries found</p>
                                        <p className="text-xs mt-1">Add your first expense entry using the form</p>
                                    </div>
                                )}
                                </div>
                            </>
                        ) : (
                            /* Income Management Tab */
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                                {/* Add Income Form */}
                                <div className="bg-white rounded-lg border border-gray-200 shadow-md p-4 hover:shadow-lg transition-all duration-300">
                                    <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center text-green-700">
                                        <FaFileUpload className="mr-2" /> Add New Income Entry
                                    </h2>
                                    <form onSubmit={handleIncomeSubmit} className="text-sm md:text-base">
                                        <div className="mb-2 md:mb-3">
                                            <label className="block text-sm font-medium mb-1">Category *</label>
                                            <input
                                                type="text"
                                                name="category"
                                                value={incomeForm.category}
                                                onChange={handleIncomeInputChange}
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                                                placeholder="e.g., Fee Collection"
                                                required
                                            />
                                        </div>
                                        <div className="mb-2 md:mb-3">
                                            <label className="block text-sm font-medium mb-1">Sub Category *</label>
                                            <input
                                                type="text"
                                                name="sub_category"
                                                value={incomeForm.sub_category}
                                                onChange={handleIncomeInputChange}
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                                                placeholder="e.g., Tuition Fee"
                                                required
                                            />
                                        </div>
                                        <div className="mb-2 md:mb-3">
                                            <label className="block text-sm font-medium mb-1">Amount *</label>
                                            <input
                                                type="number"
                                                name="amount"
                                                value={incomeForm.amount}
                                                onChange={handleIncomeInputChange}
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                                                placeholder="₹0"
                                                required
                                            />
                                        </div>
                                        <div className="mb-2 md:mb-3">
                                            <label className="block text-sm font-medium mb-1">Payment Mode *</label>
                                            <select
                                                name="payment_mode"
                                                value={incomeForm.payment_mode}
                                                onChange={handleIncomeInputChange}
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                                                required
                                            >
                                                <option value="cash">Cash</option>
                                                <option value="online">Online</option>
                                                <option value="cheque">Cheque</option>
                                                <option value="upi">UPI</option>
                                            </select>
                                        </div>
                                        <div className="mb-2 md:mb-3">
                                            <label className="block text-sm font-medium mb-1">Transaction Reference</label>
                                            <input
                                                type="text"
                                                name="transaction_ref"
                                                value={incomeForm.transaction_ref}
                                                onChange={handleIncomeInputChange}
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                                                placeholder="TXN123456"
                                            />
                                        </div>
                                        <div className="mb-2 md:mb-3">
                                            <label className="block text-sm font-medium mb-1">Entry Date *</label>
                                            <input
                                                type="date"
                                                name="entry_date"
                                                value={incomeForm.entry_date}
                                                onChange={handleIncomeInputChange}
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                                                required
                                            />
                                        </div>
                                        <div className="mb-2 md:mb-3">
                                            <label className="block text-sm font-medium mb-1">Description</label>
                                            <textarea
                                                name="description"
                                                value={incomeForm.description}
                                                onChange={handleIncomeInputChange}
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                                                rows="2"
                                                placeholder="Brief description of income"
                                            ></textarea>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-all disabled:bg-gray-400"
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Add Income'}
                                        </button>
                                    </form>
                                </div>

                                {/* Income Information Card */}
                                <div className="bg-white rounded-lg border border-gray-200 shadow-md p-4 hover:shadow-lg transition-all duration-300">
                                    <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center text-green-700">
                                        <FaDollarSign className="mr-2" /> Income Entries
                                    </h2>
                                    {isLoadingIncome ? (
                                        <div className="flex justify-center items-center py-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                        </div>
                                    ) : incomeList.length > 0 ? (
                                        <div className="overflow-x-auto max-h-96 overflow-y-auto">
                                            <table className="min-w-full text-xs">
                                                <thead className="bg-green-50 sticky top-0">
                                                    <tr>
                                                        <th className="px-2 py-2 text-left text-xs font-medium text-green-800">Category</th>
                                                        <th className="px-2 py-2 text-left text-xs font-medium text-green-800">Sub Category</th>
                                                        <th className="px-2 py-2 text-left text-xs font-medium text-green-800">Amount</th>
                                                        <th className="px-2 py-2 text-left text-xs font-medium text-green-800">Mode</th>
                                                        <th className="px-2 py-2 text-left text-xs font-medium text-green-800">Date</th>
                                                        <th className="px-2 py-2 text-left text-xs font-medium text-green-800">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {incomeList.map((income) => (
                                                        <tr key={income.id} className="hover:bg-green-50">
                                                            <td className="px-2 py-2 text-gray-700">{income.category}</td>
                                                            <td className="px-2 py-2 text-gray-700">{income.sub_category}</td>
                                                            <td className="px-2 py-2 text-gray-700 font-semibold">₹{parseFloat(income.amount).toLocaleString('en-IN')}</td>
                                                            <td className="px-2 py-2">
                                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                                    income.payment_mode === 'cash' ? 'bg-blue-100 text-blue-800' :
                                                                    income.payment_mode === 'online' ? 'bg-green-100 text-green-800' :
                                                                    income.payment_mode === 'cheque' ? 'bg-purple-100 text-purple-800' :
                                                                    'bg-orange-100 text-orange-800'
                                                                }`}>
                                                                    {income.payment_mode}
                                                                </span>
                                                            </td>
                                                            <td className="px-2 py-2 text-gray-600">{new Date(income.entry_date).toLocaleDateString('en-IN')}</td>
                                                            <td className="px-2 py-2">
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => openEditModal(income)}
                                                                        className="text-indigo-600 hover:text-indigo-800 transition-colors"
                                                                        title="Edit"
                                                                    >
                                                                        <FaEdit />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(income.id)}
                                                                        className="text-red-600 hover:text-red-800 transition-colors"
                                                                        title="Delete"
                                                                    >
                                                                        <FaTrash />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <div className="mt-3 text-xs text-gray-600 border-t pt-2">
                                                <p className="font-semibold">Total Entries: {incomeList.length}</p>
                                                <p className="font-semibold text-green-700">Total Income: ₹{incomeList.reduce((sum, income) => sum + parseFloat(income.amount), 0).toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <p>No income entries found</p>
                                            <p className="text-xs mt-1">Add your first income entry using the form</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                {(infoModal.isOpen ?? false) && (
                    <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-md bg-opacity-40 z-50">
                        <div className="bg-white rounded-lg p-6 w-11/12 max-w-md shadow-lg">
                            <h3 className="text-lg font-semibold mb-4">{infoModal.category ?? 'N/A'}</h3>
                            <p className="text-sm text-gray-700 mb-4">{infoModal.description ?? 'N/A'}</p>
                            <button
                                onClick={closeModal}
                                className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* Edit Income Modal */}
                {editModal.isOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-md bg-opacity-40 z-50">
                        <div className="bg-white rounded-lg p-6 w-11/12 max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-green-700">Edit Income Entry</h3>
                                <button
                                    onClick={closeEditModal}
                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <FaTimes size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleUpdateSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Category *</label>
                                        <input
                                            type="text"
                                            name="category"
                                            value={editForm.category}
                                            onChange={handleEditInputChange}
                                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Sub Category *</label>
                                        <input
                                            type="text"
                                            name="sub_category"
                                            value={editForm.sub_category}
                                            onChange={handleEditInputChange}
                                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Amount *</label>
                                        <input
                                            type="number"
                                            name="amount"
                                            value={editForm.amount}
                                            onChange={handleEditInputChange}
                                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Payment Mode *</label>
                                        <select
                                            name="payment_mode"
                                            value={editForm.payment_mode}
                                            onChange={handleEditInputChange}
                                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                                            required
                                        >
                                            <option value="cash">Cash</option>
                                            <option value="online">Online</option>
                                            <option value="cheque">Cheque</option>
                                            <option value="upi">UPI</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Transaction Reference</label>
                                        <input
                                            type="text"
                                            name="transaction_ref"
                                            value={editForm.transaction_ref}
                                            onChange={handleEditInputChange}
                                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Entry Date *</label>
                                        <input
                                            type="date"
                                            name="entry_date"
                                            value={editForm.entry_date}
                                            onChange={handleEditInputChange}
                                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-1">Description</label>
                                        <textarea
                                            name="description"
                                            value={editForm.description}
                                            onChange={handleEditInputChange}
                                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                                            rows="3"
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-all disabled:bg-gray-400"
                                    >
                                        {isSubmitting ? 'Updating...' : 'Update Income'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeEditModal}
                                        className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountantExpenseManagement;