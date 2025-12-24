import React, { useEffect, useState } from 'react'
import { DollarSign, TrendingDown, Package, AlertCircle } from 'lucide-react'
import StandardStatCard from '../../../components/comman_components/StandardStatCard'
import ReusableTable from '../../../components/comman_components/ReusableTable'
import Header from '../../../components/comman_components/Header'
import Sidebar from '../Sidebar'
import { 
    getAllExpense, 
    addExpense, 
    updateExpense, 
    deleteExpense 
} from '../../../helper/requests-method/apiMethods'

const AddExpensePage = () => {
    const [stats, setStats] = useState({
        totalExpense: 0,
        totalAmount: 0,
        thisMonth: 0,
        lastMonth: 0,
    });

    const [expenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Define columns for expense management
    const expenseColumns = [
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
                return value.charAt(0).toUpperCase() + value.slice(1);
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

    // Filter columns for table display (exclude hideInTable columns)
    const displayColumns = expenseColumns.filter(col => !col.hideInTable);

    // API functions for expense management
    const handleCreateExpense = async (expenseData) => {
        try {
            setLoading(true);
            const response = await addExpense(expenseData);
            if (response.success) {
                await fetchExpenses();
                return { 
                    success: true, 
                    message: response.message || 'Expense added successfully!'
                };
            } else {
                return { 
                    success: false, 
                    message: response.message || 'Failed to create expense' 
                };
            }
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Failed to create expense' 
            };
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateExpense = async (id, expenseData) => {
        try {
            setLoading(true);
            const response = await updateExpense(id, expenseData);
            if (response.success) {
                await fetchExpenses();
                return { 
                    success: true, 
                    message: response.message || 'Expense updated successfully!'
                };
            } else {
                return { 
                    success: false, 
                    message: response.message || 'Failed to update expense' 
                };
            }
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Failed to update expense' 
            };
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteExpense = async (id) => {
        try {
            setLoading(true);
            const response = await deleteExpense(id);
            if (response.success) {
                await fetchExpenses();
                return { 
                    success: true, 
                    message: response.message || 'Expense deleted successfully!'
                };
            } else {
                return { 
                    success: false, 
                    message: response.message || 'Failed to delete expense' 
                };
            }
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Failed to delete expense' 
            };
        } finally {
            setLoading(false);
        }
    };

    // Fetch all expenses from API
    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const response = await getAllExpense();
            
            if (response.success && response.data && response.data.expenses) {
                setExpenseData(response.data.expenses);
                
                // Calculate stats
                const expenses = response.data.expenses;
                const totalAmount = expenses.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
                const now = new Date();
                const thisMonth = expenses.filter(item => {
                    const itemDate = new Date(item.entry_date);
                    return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
                }).reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
                const lastMonth = expenses.filter(item => {
                    const itemDate = new Date(item.entry_date);
                    const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
                    const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
                    return itemDate.getMonth() === prevMonth && itemDate.getFullYear() === prevYear;
                }).reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
                
                setStats({
                    totalExpense: expenses.length,
                    totalAmount: totalAmount,
                    thisMonth: thisMonth,
                    lastMonth: lastMonth,
                });
            } else {
                setExpenseData([]);
            }
        } catch (error) {
            setExpenseData([]);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchExpenses();
    }, []);
    
    return (
        <div className="bg-slate-200 flex h-screen overflow-hidden">
            <Sidebar />
            
            <div
                className="overflow-auto relative z-1 flex-col"
                style={{
                    height: "100vh",
                    width: "100vw",
                    gap: "10px",
                    display: "flex",
                    transition: "margin-left 0.3s ease"
                }}
            >
                <Header />
                
                <main className="max-w-full py-4 px-3 sm:px-4 md:px-6 lg:px-8 overflow-x-hidden">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <StandardStatCard name="Total Expense" icon={DollarSign} value={stats.totalExpense.toLocaleString()} color="#ef4444"/>
                        <StandardStatCard name="Total Amount" icon={TrendingDown} value={`₹${stats.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`} color="#f59e0b" />
                        <StandardStatCard name="This Month" icon={Package} value={`₹${stats.thisMonth.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`} color="#ef4444" />
                        <StandardStatCard name="Last Month" icon={AlertCircle} value={`₹${stats.lastMonth.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`} color="#7c3aed" />
        </div>

                    <ReusableTable
                        title="Expense Management"
                        initialData={expenseData}
                        columns={expenseColumns}
                        displayColumns={displayColumns}
                        apiFunction={handleCreateExpense}
                        updateApiFunction={handleUpdateExpense}
                        deleteApiFunction={handleDeleteExpense}
                        searchPlaceholder="Search by category, sub category, transaction ref"
                        addButtonText="Add New Expense"
                        exportFileName="expense"
                        loading={loading}
                        showActions={{
                            add: true,
                            edit: true,
                            delete: true,
                            view: true
                        }}
                    />
      </main>
    </div>
    </div>
  )
}

export default AddExpensePage
