import React, { useMemo, useState } from 'react';
import Sidebar from './Accountant_Sidebar';
import Header from './Accountant_Header';
import ExpenseBreakdown from './Accountant_ExpenseBreakdown';

const sampleExpenses = [
    { id: 1, date: '2026-04-01', category: 'Salaries', amount: 500000, note: 'Monthly staff salaries' },
    { id: 2, date: '2026-04-08', category: 'Maintenance', amount: 200000, note: 'Grounds repair' },
    { id: 3, date: '2026-04-15', category: 'Bills', amount: 150000, note: 'Electricity and water' },
];

const AccountantExpenseManagement = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [expenses, setExpenses] = useState(sampleExpenses);
    const [form, setForm] = useState({ date: '', category: '', amount: '', note: '' });

    const totals = useMemo(() => {
        const expenseTotal = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
        return { expenseTotal };
    }, [expenses]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleAdd = (e) => {
        e.preventDefault();
        if (!form.date || !form.category || !form.amount) {
            alert('Please fill date, category and amount');
            return;
        }
        const next = {
            id: Date.now(),
            date: form.date,
            category: form.category,
            amount: Number(form.amount),
            note: form.note,
        };
        setExpenses((s) => [next, ...s]);
        setForm({ date: '', category: '', amount: '', note: '' });
    };

    const handleDelete = (id) => {
        if (!confirm('Delete this expense?')) return;
        setExpenses((s) => s.filter((x) => x.id !== id));
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <main className="flex-1 min-w-0 min-h-0 overflow-y-auto">
                <Header setIsSidebarOpen={setIsSidebarOpen} />

                <div className="p-4 md:p-6">
                    <h1 className="text-2xl md:text-3xl font-bold mb-6">Income & Expense</h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white rounded-lg p-4 shadow">
                            <h3 className="text-sm text-gray-500">Total Expense</h3>
                            <div className="text-2xl font-bold text-red-600">₹{totals.expenseTotal.toLocaleString()}</div>
                        </div>
                        <div className="md:col-span-2">
                            <ExpenseBreakdown />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 bg-white rounded-lg p-4 shadow">
                            <h2 className="font-semibold mb-3">Add Expense</h2>
                            <form onSubmit={handleAdd} className="space-y-3">
                                <div>
                                    <label className="text-sm text-gray-600">Date</label>
                                    <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full mt-1 p-2 border rounded" />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">Category</label>
                                    <input name="category" value={form.category} onChange={handleChange} placeholder="Salaries / Maintenance" className="w-full mt-1 p-2 border rounded" />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">Amount (₹)</label>
                                    <input name="amount" type="number" value={form.amount} onChange={handleChange} className="w-full mt-1 p-2 border rounded" />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">Note</label>
                                    <input name="note" value={form.note} onChange={handleChange} className="w-full mt-1 p-2 border rounded" />
                                </div>
                                <div className="flex justify-end">
                                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Add</button>
                                </div>
                            </form>
                        </div>

                        <div className="lg:col-span-2 bg-white rounded-lg p-4 shadow">
                            <h2 className="font-semibold mb-3">Recent Expenses</h2>
                            {expenses.length === 0 ? (
                                <div className="text-gray-500">No expenses recorded.</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Category</th>
                                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Amount</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Note</th>
                                                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {expenses.map((ex) => (
                                                <tr key={ex.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-2 text-sm text-gray-700">{new Date(ex.date).toLocaleDateString('en-IN')}</td>
                                                    <td className="px-4 py-2 text-sm text-gray-800">{ex.category}</td>
                                                    <td className="px-4 py-2 text-sm text-right font-medium text-green-600">₹{Number(ex.amount).toLocaleString()}</td>
                                                    <td className="px-4 py-2 text-sm text-gray-600">{ex.note}</td>
                                                    <td className="px-4 py-2 text-center">
                                                        <button onClick={() => handleDelete(ex.id)} className="text-sm text-red-500 hover:underline">Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AccountantExpenseManagement;