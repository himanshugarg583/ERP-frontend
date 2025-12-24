import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Package, AlertCircle, PlusCircle, CreditCard } from 'lucide-react';
import StandardStatCard from '../../../components/comman_components/StandardStatCard';
import ReusableTable from '../../../components/comman_components/ReusableTable';
import Header from '../../../components/comman_components/Header';
import Footer from '../../../components/comman_components/Footer';
import Sidebar from '../Sidebar';
import {
    getAllIncome,
    addIncome,
    updateIncome,
    deleteIncome
} from '../../../helper/requests-method/apiMethods';

const AddIncomePage = () => {
    const [stats, setStats] = useState({
        totalIncome: 0,
        totalAmount: 0,
        thisMonth: 0,
        lastMonth: 0,
    });

    const [incomeData, setIncomeData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Define columns for income management
    const incomeColumns = [
        {
            key: 'category',
            header: 'Category',
            required: true,
            type: 'text',
            placeholder: 'Enter category'
        },
        {
            key: 'sub_category',
            header: 'Sub Category',
            required: true,
            type: 'text',
            placeholder: 'Enter sub category'
        },
        {
            key: 'amount',
            header: 'Amount',
            required: true,
            type: 'number',
            placeholder: 'Enter amount',
            render: (value) => {
                return `₹${parseFloat(value || 0).toFixed(2)}`;
            }
        },
        {
            key: 'payment_mode',
            header: 'Payment Mode',
            required: true,
            type: 'select',
            options: [
                { value: 'cash', label: 'Cash' },
                { value: 'online', label: 'Online' },
                { value: 'cheque', label: 'Cheque' },
                { value: 'bank_transfer', label: 'Bank Transfer' }
            ],
            render: (value) => {
                if (!value) return 'N/A';
                return value.charAt(0).toUpperCase() + value.slice(1).replace('_', ' ');
            }
        },
        {
            key: 'transaction_ref',
            header: 'Transaction Reference',
            required: false,
            type: 'text',
            placeholder: 'Enter transaction reference',
            hideInTable: true
        },
        {
            key: 'entry_date',
            header: 'Entry Date',
            required: true,
            type: 'date',
            render: (value) => {
                if (!value) return 'N/A';
                try {
                    const date = new Date(value);
                    if (isNaN(date.getTime())) return 'Invalid Date';
                    return date.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });
                } catch {
                    return 'Invalid Date';
                }
            }
        },
        {
            key: 'recorded_by',
            header: 'Recorded By',
            required: true,
            type: 'text',
            placeholder: 'Enter recorded by'
        },
        {
            key: 'description',
            header: 'Description',
            required: false,
            type: 'textarea',
            placeholder: 'Enter description',
            hideInTable: true
        }
    ];

    const displayColumns = incomeColumns.filter(col => !col.hideInTable);

    const handleCreateIncome = async (incomeData) => {
        try {
            setLoading(true);
            const response = await addIncome(incomeData);
            if (response.success) {
                await fetchIncomes();
                return { success: true, message: response.message || 'Income added successfully!' };
            }
            return { success: false, message: response.message || 'Failed to create income' };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to create income' };
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateIncome = async (id, incomeData) => {
        try {
            setLoading(true);
            const response = await updateIncome(id, incomeData);
            if (response.success) {
                await fetchIncomes();
                return { success: true, message: response.message || 'Income updated successfully!' };
            }
            return { success: false, message: response.message || 'Failed to update income' };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to update income' };
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteIncome = async (id) => {
        try {
            setLoading(true);
            const response = await deleteIncome(id);
            if (response.success) {
                await fetchIncomes();
                return { success: true, message: response.message || 'Income deleted successfully!' };
            }
            return { success: false, message: response.message || 'Failed to delete income' };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to delete income' };
        } finally {
            setLoading(false);
        }
    };

    const fetchIncomes = async () => {
        try {
            setLoading(true);
            const response = await getAllIncome();

            if (response.success && response.data && response.data.incomes) {
                setIncomeData(response.data.incomes);

                const incomes = response.data.incomes;
                const totalAmount = incomes.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
                const now = new Date();
                const thisMonth = incomes.filter(item => {
                    const itemDate = new Date(item.entry_date);
                    return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
                }).reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
                const lastMonth = incomes.filter(item => {
                    const itemDate = new Date(item.entry_date);
                    const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
                    const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
                    return itemDate.getMonth() === prevMonth && itemDate.getFullYear() === prevYear;
                }).reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

                setStats({
                    totalIncome: incomes.length,
                    totalAmount: totalAmount,
                    thisMonth: thisMonth,
                    lastMonth: lastMonth,
                });
            } else {
                setIncomeData([]);
            }
        } catch (error) {
            setIncomeData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncomes();
    }, []);

    return (
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 flex h-screen overflow-hidden">
            <Sidebar />

            <div
                className="overflow-auto relative z-1 flex-col"
                style={{
                    height: "100vh",
                    width: "100vw",
                    display: "flex",
                    transition: "margin-left 0.3s ease"
                }}
            >
                <Header />

                <main className="flex-1 overflow-auto w-full py-6 px-4 md:px-6">
                    {/* Page Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                                <DollarSign className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                                    Income Management
                                </h1>
                                <p className="text-sm text-slate-600 mt-1">
                                    Track and manage all school income
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
                    >
                        <StandardStatCard
                            name="Total Income"
                            icon={DollarSign}
                            value={stats.totalIncome.toLocaleString()}
                            color="#10b981"
                        />
                        <StandardStatCard
                            name="Total Amount"
                            icon={TrendingUp}
                            value={`₹${stats.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
                            color="#059669"
                        />
                        <StandardStatCard
                            name="This Month"
                            icon={Package}
                            value={`₹${stats.thisMonth.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
                            color="#34d399"
                        />
                        <StandardStatCard
                            name="Last Month"
                            icon={AlertCircle}
                            value={`₹${stats.lastMonth.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
                            color="#6ee7b7"
                        />
                    </motion.div>

                    {/* Table Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <ReusableTable
                            title="Income Records"
                            initialData={incomeData}
                            columns={incomeColumns}
                            displayColumns={displayColumns}
                            apiFunction={handleCreateIncome}
                            updateApiFunction={handleUpdateIncome}
                            deleteApiFunction={handleDeleteIncome}
                            searchPlaceholder="Search by category, sub category..."
                            addButtonText="Add New Income"
                            exportFileName="income_records"
                            loading={loading}
                            showActions={{
                                add: true,
                                edit: true,
                                delete: true,
                                view: true
                            }}
                        />
                    </motion.div>
                </main>

                <Footer />
            </div>
        </div>
    )
}

export default AddIncomePage;
