import React, { useState, useMemo } from 'react';
import Sidebar from './Accountant_Sidebar';
import Header from './Accountant_Header';
import Accountant_Navigation from './Accountant_Navigation';
import Accountant_EditableInput from './Accountant_EditableInput';
import Accountant_EditButtons from './Accountant_EditButtons';
import { FaLock, FaMoneyBill, FaCalculator, FaChartBar, FaBell, FaHeadset, FaPlus, FaTrash } from 'react-icons/fa';
import { DEMO_IP_PLACEHOLDER } from '../../utils/assetUrls';

const Accountant_Setting = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('security');
    const [settingsData, setSettingsData] = useState({
        security: { password: '', confirmPassword: '', email: 'priya.sharma@example.com', sessions: [{ device: 'Laptop', ip: DEMO_IP_PLACEHOLDER }] },
        feePayment: { categories: ['Tuition', 'Transport'], lateFee: { amount: 500, days: 10 }, discounts: [{ name: 'Merit', percent: 20 }], gateways: ['UPI', 'Stripe'] },
        payroll: { structure: { basic: 50000, bonus: 5000, deductions: 2000 }, cycle: 'Monthly', tax: 10 },
        expense: { categories: ['Stationery', 'Transport'], approval: 'Manager', limit: 10000 },
        notifications: { triggers: ['Low Balance'] },
        support: { requests: [{ id: 1, issue: 'Login Issue', status: 'Open' }] }
    });
    const [tempData, setTempData] = useState(settingsData);
    const [isEditing, setIsEditing] = useState({});

    const navigationItems = useMemo(() => [
        { section: 'security', icon: <FaLock />, label: 'Security & Authentication' },
        { section: 'feePayment', icon: <FaMoneyBill />, label: 'Fee & Payment Settings' },
        { section: 'payroll', icon: <FaCalculator />, label: 'Salary & Payroll Settings' },
        { section: 'expense', icon: <FaChartBar />, label: 'Income & Expense Management Settings' },
        { section: 'notifications', icon: <FaBell />, label: 'Notification & Alerts Settings' },
        { section: 'support', icon: <FaHeadset />, label: 'Support & Help Center' }
    ], []);

    const handlers = {
        navigate: section => setActiveSection(section) || setIsEditing({}),
        edit: section => setIsEditing(prev => ({ ...prev, [section]: true })) || setTempData(settingsData),
        save: section => setSettingsData(tempData) || setIsEditing(prev => ({ ...prev, [section]: false })) || console.log(`${section} Updated:`, tempData[section]),
        cancel: section => setTempData(settingsData) || setIsEditing(prev => ({ ...prev, [section]: false })),
        input: (section, field, value, nestedField) => setTempData(prev => nestedField ? { ...prev, [section]: { ...prev[section], [field]: { ...prev[section][field], [nestedField]: value } } } : { ...prev, [section]: { ...prev[section], [field]: value } }),
        addItem: (section, field, newItem) => setTempData(prev => ({ ...prev, [section]: { ...prev[section], [field]: [...prev[section][field], newItem] } })),
        removeItem: (section, field, index) => setTempData(prev => ({ ...prev, [section]: { ...prev[section], [field]: prev[section][field].filter((_, i) => i !== index) } }))
    };

    const sections = {
        security: {
            title: 'Security & Authentication',
            icon: <FaLock />,
            fields: [
                { label: 'Change Password', name: 'password', type: 'password', value: tempData.security.password },
                { label: 'Confirm Password', name: 'confirmPassword', type: 'password', value: tempData.security.confirmPassword },
                { label: 'Change Email Address', name: 'email', type: 'email', value: tempData.security.email }
            ]
        },
        feePayment: {
            title: 'Fee & Payment Settings',
            icon: <FaMoneyBill />,
            fields: [
                { label: 'Late Fee Amount', name: 'lateFee.amount', type: 'number', value: tempData.feePayment.lateFee.amount, nested: 'amount' },
                { label: 'Late Fee Days', name: 'lateFee.days', type: 'number', value: tempData.feePayment.lateFee.days, nested: 'days' }
            ],
            list: { label: 'Fee Categories', field: 'categories', items: tempData.feePayment.categories }
        },
        payroll: {
            title: 'Salary & Payroll Settings',
            icon: <FaCalculator />,
            fields: [
                { label: 'Basic Salary', name: 'structure.basic', type: 'number', value: tempData.payroll.structure.basic, nested: 'basic' },
                { label: 'Bonus', name: 'structure.bonus', type: 'number', value: tempData.payroll.structure.bonus, nested: 'bonus' },
                { label: 'Deductions', name: 'structure.deductions', type: 'number', value: tempData.payroll.structure.deductions, nested: 'deductions' },
                { label: 'Payroll Cycle', name: 'cycle', value: tempData.payroll.cycle }
            ]
        },
        expense: {
            title: 'Income & Expense Management Settings',
            icon: <FaChartBar />,
            fields: [
                { label: 'Approval Workflow', name: 'approval', value: tempData.expense.approval },
                { label: 'Expense Limit', name: 'limit', type: 'number', value: tempData.expense.limit }
            ],
            list: { label: 'Expense Categories', field: 'categories', items: tempData.expense.categories }
        },
        notifications: {
            title: 'Notification & Alerts Settings',
            icon: <FaBell />,
            list: { label: 'Alert Triggers', field: 'triggers', items: tempData.notifications.triggers }
        },
        support: {
            title: 'Support & Help Center',
            icon: <FaHeadset />,
            list: {
                label: 'Support Requests', field: 'requests', items: tempData.support.requests, customRender: item => (
                    <div className="flex items-center gap-2">
                        <input type="text" value={item.issue} onChange={e => handlers.input('support', 'requests', tempData.support.requests.map((r, i) => i === tempData.support.requests.indexOf(item) ? { ...r, issue: e.target.value } : r))} className="p-2 border rounded-lg w-1/2" disabled={!isEditing.support} />
                        <input type="text" value={item.status} onChange={e => handlers.input('support', 'requests', tempData.support.requests.map((r, i) => i === tempData.support.requests.indexOf(item) ? { ...r, status: e.target.value } : r))} className="p-2 border rounded-lg w-1/4" disabled={!isEditing.support} />
                    </div>
                )
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <main className="flex-1 overflow-y-auto lg:ml-64">
                <Header setIsSidebarOpen={setIsSidebarOpen} />
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-md mx-auto max-w-5xl">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
                        <p className="text-gray-600">Configure your system preferences</p>
                    </header>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-1 bg-gray-50 p-6 rounded-xl shadow-sm">
                            <Accountant_Navigation activeSection={activeSection} onClick={handlers.navigate} items={navigationItems} />
                        </div>
                        <div className="lg:col-span-3">
                            <SectionCard
                                title={sections[activeSection].title}
                                isEditing={isEditing[activeSection]}
                                onEdit={() => handlers.edit(activeSection)}
                                onSave={() => handlers.save(activeSection)}
                                onCancel={() => handlers.cancel(activeSection)}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {sections[activeSection].fields?.map((field, i) => (
                                        <Accountant_EditableInput
                                            key={i}
                                            label={field.label}
                                            name={field.name}
                                            type={field.type || 'text'}
                                            value={field.value}
                                            onChange={e => handlers.input(activeSection, field.nested ? field.name.split('.')[0] : field.name, e.target.value, field.nested)}
                                            isEditing={isEditing[activeSection]}
                                            icon={sections[activeSection].icon}
                                        />
                                    ))}
                                    {sections[activeSection].list && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">{sections[activeSection].list.label}</label>
                                            {sections[activeSection].list.items.map((item, index) => (
                                                <div key={index} className="flex items-center gap-2 mb-2">
                                                    {sections[activeSection].list.customRender ? sections[activeSection].list.customRender(item) : (
                                                        <input
                                                            type="text"
                                                            value={item}
                                                            onChange={e => handlers.input(activeSection, sections[activeSection].list.field, tempData[activeSection][sections[activeSection].list.field].map((v, i) => i === index ? e.target.value : v))}
                                                            className="p-2 border rounded-lg w-full"
                                                            disabled={!isEditing[activeSection]}
                                                        />
                                                    )}
                                                    {isEditing[activeSection] && <button onClick={() => handlers.removeItem(activeSection, sections[activeSection].list.field, index)} className="text-red-600"><FaTrash /></button>}
                                                </div>
                                            ))}
                                            {isEditing[activeSection] && (
                                                <button onClick={() => handlers.addItem(activeSection, sections[activeSection].list.field, sections[activeSection].list.field === 'requests' ? { id: Date.now(), issue: '', status: 'Open' } : '')} className="text-blue-600 flex items-center gap-2">
                                                    <FaPlus /> Add {sections[activeSection].list.field === 'requests' ? 'Request' : sections[activeSection].list.field === 'triggers' ? 'Trigger' : 'Category'}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </SectionCard>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const SectionCard = ({ title, isEditing, onEdit, onSave, onCancel, children }) => (
    <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <Accountant_EditButtons isEditing={isEditing} onEdit={onEdit} onSave={onSave} onCancel={onCancel} />
        </div>
        {children}
    </div>
);

export default Accountant_Setting;