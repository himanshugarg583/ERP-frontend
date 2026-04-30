import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
    deleteIncome,
    getIncomeSummary,
    getIncomeById
} from '../../../helper/requests-method/apiMethods';
import { getAcademicYearsDropdown } from '../../../helper/requests-method/feeV1Api';

const AddIncomePage = () => {
    const [stats, setStats] = useState({
        totalIncome: 0,
        totalAmount: 0,
        thisMonth: 0,
        lastMonth: 0,
    });

    const [incomeData, setIncomeData] = useState([]);
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

    // Define columns for income management
    const incomeColumns = [
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
            key: 'source',
            header: 'Source',
            required: true,
            type: 'text',
            placeholder: 'manual / system'
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
        ...incomeColumns.filter(col => !col.hideInTable),
    ];

    const normalizeAmount = (value) => {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : value;
    };

    const normalizeId = (value) => {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : value;
    };

    const normalizeIncomePayload = (payload) => ({
        academic_year_id: normalizeId(payload.academic_year_id),
        category: payload.category,
        source: payload.source,
        amount: normalizeAmount(payload.amount),
        entry_date: payload.entry_date,
        notes: payload.notes,
    });

    const parseSummaryAmount = (value) => {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
    };

    const applyIncomeSummary = useCallback((summary) => {
        if (!summary) return;
        setStats({
            totalIncome: Number(summary.total_count) || 0,
            totalAmount: parseSummaryAmount(summary.total_amount),
            thisMonth: parseSummaryAmount(summary.this_month),
            lastMonth: parseSummaryAmount(summary.last_month),
        });
    }, []);

    const decorateIncomeRows = (rows = []) => rows.map((row, index) => ({
        ...row,
        s_no: index + 1,
    }));

    const handleCreateIncome = async (incomeData) => {
        try {
            setLoading(true);
            const response = await addIncome(normalizeIncomePayload(incomeData));
            if (response.success) {
                await fetchIncomes();
                await fetchIncomeSummary();
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
            const response = await updateIncome(id, normalizeIncomePayload(incomeData));
            if (response.success) {
                await fetchIncomes();
                await fetchIncomeSummary();
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
                await fetchIncomeSummary();
                return { success: true, message: response.message || 'Income deleted successfully!' };
            }
            return { success: false, message: response.message || 'Failed to delete income' };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to delete income' };
        } finally {
            setLoading(false);
        }
    };

    const handleViewIncome = async (incomeId) => {
        try {
            const response = await getIncomeById(incomeId);
            return response?.data?.data || response?.data || { id: incomeId };
        } catch (error) {
            console.error('Failed to fetch income details', error);
            return { id: incomeId };
        }
    };

    const fetchIncomes = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getAllIncome();

            if (response.success && response.data && response.data.incomes) {
                setIncomeData(decorateIncomeRows(response.data.incomes));

                const incomes = response.data.incomes;
                const apiTotalAmount = Number(response.data.total_income);
                const totalAmount = Number.isFinite(apiTotalAmount)
                    ? apiTotalAmount
                    : incomes.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
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

                if (!summaryLoaded) {
                    setStats({
                        totalIncome: Number.isFinite(Number(response.data.total_records))
                            ? Number(response.data.total_records)
                            : incomes.length,
                        totalAmount: totalAmount,
                        thisMonth: thisMonth,
                        lastMonth: lastMonth,
                    });
                }
            } else {
                setIncomeData([]);
            }
        } catch {
            setIncomeData([]);
        } finally {
            setLoading(false);
        }
    }, [summaryLoaded]);

    const fetchIncomeSummary = useCallback(async () => {
        try {
            const response = await getIncomeSummary();
            if (response.success && response.data) {
                applyIncomeSummary(response.data);
                setSummaryLoaded(true);
            }
        } catch (error) {
            console.error('Failed to fetch income summary', error);
        }
    }, [applyIncomeSummary]);

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
        fetchIncomes();
        fetchIncomeSummary();
        fetchAcademicYears();
    }, [fetchAcademicYears, fetchIncomeSummary, fetchIncomes]);

    return (
        <div className="bg-linear-to-br from-emerald-50 via-teal-50 to-green-50 flex h-screen overflow-hidden">
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
                            <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                                <DollarSign className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                                    Income Management
                                </h1>
                                <p className="text-sm text-slate-600 mt-1">
                                    Track and manage all school income
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                    </div>

                    {/* Table Section */}
                    <div>
                        <ReusableTable
                            title="Income Records"
                            initialData={incomeData}
                            columns={incomeColumns}
                            displayColumns={displayColumns}
                            apiFunction={handleCreateIncome}
                            viewApiFunction={handleViewIncome}
                            updateApiFunction={handleUpdateIncome}
                            deleteApiFunction={handleDeleteIncome}
                            searchPlaceholder="Search by category, source, notes..."
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
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    )
}

export default AddIncomePage;
