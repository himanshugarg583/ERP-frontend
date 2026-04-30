import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DollarSign, TrendingDown, Package, AlertCircle, ShoppingBag } from 'lucide-react';
import StandardStatCard from '../../../components/comman_components/StandardStatCard';
import ReusableTable from '../../../components/comman_components/ReusableTable';
import Header from '../../../components/comman_components/Header';
import Footer from '../../../components/comman_components/Footer';
import Sidebar from '../Sidebar';
import {
    getAllExpense,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpenseSummary,
    getExpenseById
} from '../../../helper/requests-method/apiMethods';
import { getAcademicYearsDropdown } from '../../../helper/requests-method/feeV1Api';

const AddExpensePage = () => {
    const [stats, setStats] = useState({
        totalExpense: 0,
        totalAmount: 0,
        thisMonth: 0,
        lastMonth: 0,
    });

    const [expenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summaryLoaded, setSummaryLoaded] = useState(false);
    const [academicYears, setAcademicYears] = useState([]);
    const [defaultAcademicYearId, setDefaultAcademicYearId] = useState('');

    const formatAcademicYearLabel = (year) => {
        if (year?.name) return year.name;
        const start = year?.start_date || year?.start_year || '';
        const end = year?.end_date || year?.end_year || '';
        if (start && end) return `${start}-${end}`;
        if (start) return String(start);
        return String(year?.id ?? 'N/A');
    };

    const academicYearOptions = useMemo(
        () => (academicYears || []).map((year) => ({
            value: String(year.id),
            label: formatAcademicYearLabel(year),
        })),
        [academicYears]
    );

    const academicYearMap = useMemo(() => {
        const map = new Map();
        (academicYears || []).forEach((year) => {
            map.set(String(year.id), formatAcademicYearLabel(year));
        });
        return map;
    }, [academicYears]);

    // Define columns for expense management
    const expenseColumns = [
        {
            key: 'academic_year_id',
            header: 'Academic Year',
            required: true,
            type: 'select',
            options: academicYearOptions,
            defaultValue: defaultAcademicYearId,
            render: (value, row) => academicYearMap.get(String(value || row?.academic_year_id || row?.academic_year)) || row?.academic_year || value || 'N/A'
        },
        {
            key: 'category',
            header: 'Category',
            required: true,
            type: 'text',
            placeholder: 'Enter category'
        },
        {
            key: 'vendor_name',
            header: 'Vendor Name',
            required: true,
            type: 'text',
            placeholder: 'Enter vendor name'
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
            key: 'amount',
            header: 'Amount',
            required: true,
            type: 'number',
            placeholder: 'Enter amount',
            render: (value) => `₹${parseFloat(value || 0).toFixed(2)}`
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
            key: 'notes',
            header: 'Notes',
            required: false,
            type: 'textarea',
            placeholder: 'Enter notes',
            hideInTable: true
        }
    ];

    const displayColumns = [
        {
            key: 's_no',
            header: 'S No',
            render: (value) => value,
        },
        ...expenseColumns.filter(col => !col.hideInTable),
    ];

    const normalizeAmount = (value) => {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : value;
    };

    const normalizeId = (value) => {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : value;
    };

    const normalizeExpensePayload = (payload) => ({
        academic_year_id: normalizeId(payload.academic_year_id),
        category: payload.category,
        vendor_name: payload.vendor_name,
        payment_mode: payload.payment_mode,
        amount: normalizeAmount(payload.amount),
        entry_date: payload.entry_date,
        notes: payload.notes,
    });

    const parseSummaryAmount = (value) => {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
    };

    const applyExpenseSummary = useCallback((summary) => {
        if (!summary) return;
        setStats({
            totalExpense: Number(summary.total_count) || 0,
            totalAmount: parseSummaryAmount(summary.total_amount),
            thisMonth: parseSummaryAmount(summary.this_month),
            lastMonth: parseSummaryAmount(summary.last_month),
        });
    }, []);

    const decorateExpenseRows = (rows = []) => rows.map((row, index) => ({
        ...row,
        s_no: index + 1,
    }));

    const handleCreateExpense = async (expenseData) => {
        try {
            setLoading(true);
            const response = await addExpense(normalizeExpensePayload(expenseData));
            if (response.success) {
                await fetchExpenses();
                await fetchExpenseSummary();
                return { success: true, message: response.message || 'Expense added successfully!' };
            }
            return { success: false, message: response.message || 'Failed to create expense' };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to create expense' };
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateExpense = async (id, expenseData) => {
        try {
            setLoading(true);
            const response = await updateExpense(id, normalizeExpensePayload(expenseData));
            if (response.success) {
                await fetchExpenses();
                await fetchExpenseSummary();
                return { success: true, message: response.message || 'Expense updated successfully!' };
            }
            return { success: false, message: response.message || 'Failed to update expense' };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to update expense' };
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
                await fetchExpenseSummary();
                return { success: true, message: response.message || 'Expense deleted successfully!' };
            }
            return { success: false, message: response.message || 'Failed to delete expense' };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to delete expense' };
        } finally {
            setLoading(false);
        }
    };

    const handleViewExpense = async (expenseId) => {
        try {
            const response = await getExpenseById(expenseId);
            return response?.data?.data || response?.data || { id: expenseId };
        } catch (error) {
            console.error('Failed to fetch expense details', error);
            return { id: expenseId };
        }
    };

    const fetchExpenses = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getAllExpense();

            if (response.success && response.data && response.data.expenses) {
                setExpenseData(decorateExpenseRows(response.data.expenses));

                const expenses = response.data.expenses;
                const apiTotalAmount = Number(response.data.total_expense);
                const totalAmount = Number.isFinite(apiTotalAmount)
                    ? apiTotalAmount
                    : expenses.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
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

                if (!summaryLoaded) {
                    setStats({
                        totalExpense: Number.isFinite(Number(response.data.total_records))
                            ? Number(response.data.total_records)
                            : expenses.length,
                        totalAmount: totalAmount,
                        thisMonth: thisMonth,
                        lastMonth: lastMonth,
                    });
                }
            } else {
                setExpenseData([]);
            }
        } catch {
            setExpenseData([]);
        } finally {
            setLoading(false);
        }
    }, [summaryLoaded]);

    const fetchExpenseSummary = useCallback(async () => {
        try {
            const response = await getExpenseSummary();
            if (response.success && response.data) {
                applyExpenseSummary(response.data);
                setSummaryLoaded(true);
            }
        } catch (error) {
            console.error('Failed to fetch expense summary', error);
        }
    }, [applyExpenseSummary]);

    const fetchAcademicYears = useCallback(async () => {
        try {
            const response = await getAcademicYearsDropdown();
            const years = response?.data || [];
            setAcademicYears(years);
            const currentYear = years.find((year) => year.is_current);
            if (currentYear?.id !== undefined && currentYear?.id !== null) {
                setDefaultAcademicYearId(String(currentYear.id));
            }
        } catch (error) {
            console.error('Failed to fetch academic years', error);
        }
    }, []);

    useEffect(() => {
        fetchExpenses();
        fetchExpenseSummary();
        fetchAcademicYears();
    }, [fetchAcademicYears, fetchExpenseSummary, fetchExpenses]);

    return (
        <div className="bg-linear-to-br from-rose-50 via-orange-50 to-red-50 flex h-screen overflow-hidden">
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
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-linear-to-br from-rose-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                                <ShoppingBag className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
                                    Expense Management
                                </h1>
                                <p className="text-sm text-slate-600 mt-1">
                                    Track and manage all school expenses
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <StandardStatCard
                            name="Total Expense"
                            icon={ShoppingBag}
                            value={stats.totalExpense.toLocaleString()}
                            color="#ef4444"
                        />
                        <StandardStatCard
                            name="Total Amount"
                            icon={TrendingDown}
                            value={`₹${stats.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
                            color="#f97316"
                        />
                        <StandardStatCard
                            name="This Month"
                            icon={Package}
                            value={`₹${stats.thisMonth.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
                            color="#f43f5e"
                        />
                        <StandardStatCard
                            name="Last Month"
                            icon={AlertCircle}
                            value={`₹${stats.lastMonth.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
                            color="#dc2626"
                        />
                    </div>

                    {/* Table Section */}
                    <div>
                        <ReusableTable
                            title="Expense Records"
                            initialData={expenseData}
                            columns={expenseColumns}
                            displayColumns={displayColumns}
                            apiFunction={handleCreateExpense}
                            viewApiFunction={handleViewExpense}
                            updateApiFunction={handleUpdateExpense}
                            deleteApiFunction={handleDeleteExpense}
                            searchPlaceholder="Search by category, vendor, notes..."
                            addButtonText="Add New Expense"
                            exportFileName="expense_records"
                            loading={loading}
                            showActions={{
                                add: true,
                                edit: true,
                                delete: true,
                                view: true
                            }}
                        />
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    )
}

export default AddExpensePage;
