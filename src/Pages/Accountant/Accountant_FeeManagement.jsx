import React, { useState, useMemo, useEffect } from 'react';
import { FaMoneyBillWave, FaUsers, FaLayerGroup, FaSchool, FaCalendarAlt, FaClock, FaEnvelope, FaHistory, FaMoneyCheckAlt, FaChartLine, FaPlus, FaEdit, FaTrash, FaEye, FaUserCheck, FaClipboardList } from 'react-icons/fa';
import Sidebar from './Accountant_Sidebar';
import Header from './Accountant_Header';
import Accountant_Section from './Accountant_Section';
import Accountant_Table from './Accountant_Table';
import Accountant_PieChartCard from './Accountant_PieChartCard';
import Accountant_SearchInput from './Accountant_SearchInput';
import Accountant_LateFeeModal from './Accountant_LateFeeModal';
import { addAccountantFeeHead, getAccountantFeeHeads, updateAccountantFeeHead, deleteAccountantFeeHead, addAccountantFeeStructure, getAccountantFeeStructures, getAccountantFeeStructureById, updateAccountantFeeStructure, deleteAccountantFeeStructure, getClassSectionDropdown, assignFee, getAssignedFeesByClass } from '../../helper/requests-method/apiMethods';
import { toast } from 'react-toastify';

const AccountantFeeManagement = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [studentFeeSearchQuery, setStudentFeeSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lateFeeRules, setLateFeeRules] = useState({ percentage: 5, days: 5 });
    const [tempLateFeeRules, setTempLateFeeRules] = useState(lateFeeRules);
    const [formData, setFormData] = useState({
        studentId: '', studentName: '', classSection: '', parentName: '', parentContact: '', email: '',
        feeType: '', feeAmount: 0, discount: 0, lateFee: 0, totalPayable: 0,
        paymentMode: '', transactionRef: '', chequeNumber: '', bankName: '', chequeDate: '', receivedAmount: 0, balanceDue: 0, paymentStatus: 'Pending',
        remarks: '', attachments: null, dueAmount: 0 // Added dueAmount to formData
    });
    const [feeRecords, setFeeRecords] = useState([]);

    // Fee Head Form State
    const [feeHeadForm, setFeeHeadForm] = useState({
        name: '',
        description: '',
        is_mandatory: false,
        status: 'active'
    });
    const [isSubmittingFeeHead, setIsSubmittingFeeHead] = useState(false);
    const [feeHeadsList, setFeeHeadsList] = useState([]);
    const [isLoadingFeeHeads, setIsLoadingFeeHeads] = useState(false);
    const [editModal, setEditModal] = useState({ isOpen: false, feeHead: null });
    const [editForm, setEditForm] = useState({ name: '', description: '', is_mandatory: false, status: 'active' });
    const [isUpdating, setIsUpdating] = useState(false);

    // Fee Structure Form State
    const [feeStructureForm, setFeeStructureForm] = useState({
        name: '',
        class_section_id: '',
        academic_start_year: new Date().getFullYear(),
        academic_end_year: new Date().getFullYear() + 1,
        due_date: '',
        late_fee_amount: 0,
        late_fee_type: 'flat',
        fee_details: [{ fee_head_id: '', amount: 0, is_mandatory: true }]
    });
    const [isSubmittingFeeStructure, setIsSubmittingFeeStructure] = useState(false);
    const [feeStructuresList, setFeeStructuresList] = useState([]);
    const [isLoadingFeeStructures, setIsLoadingFeeStructures] = useState(false);
    const [viewFeeStructureModal, setViewFeeStructureModal] = useState({ isOpen: false, data: null });
    const [editFeeStructureModal, setEditFeeStructureModal] = useState({ isOpen: false, structure: null });
    const [editFeeStructureForm, setEditFeeStructureForm] = useState({
        name: '',
        class_section_id: '',
        academic_start_year: 2025,
        academic_end_year: 2026,
        due_date: '',
        late_fee_amount: 0,
        late_fee_type: 'flat',
        fee_details: []
    });
    const [isUpdatingFeeStructure, setIsUpdatingFeeStructure] = useState(false);

    // Class Sections Dropdown
    const [classSectionsList, setClassSectionsList] = useState([]);

    // Assign Fee Form State
    const [assignFeeForm, setAssignFeeForm] = useState({
        class_section_id: '',
        fee_structure_id: '',
        apply_discount: false,
        discount_amount: 0,
        discount_reason: '',
        installments: [{ installment_number: 1, amount: 0, due_date: '' }]
    });
    const [isAssigningFee, setIsAssigningFee] = useState(false);
    const [selectedFeeStructureDetails, setSelectedFeeStructureDetails] = useState(null);

    // View Assigned Fees State
    const [selectedClassForView, setSelectedClassForView] = useState('');
    const [assignedFeesList, setAssignedFeesList] = useState([]);
    const [isLoadingAssignedFees, setIsLoadingAssignedFees] = useState(false);
    const [viewAssignedFeeModal, setViewAssignedFeeModal] = useState({ isOpen: false, data: null });

    // Fetch fee heads on component mount
    useEffect(() => {
        fetchFeeHeads();
        fetchFeeStructures();
        fetchClassSections();
    }, []);

    const fetchClassSections = async () => {
        try {
            const response = await getClassSectionDropdown();
            if (response?.success) {
                setClassSectionsList(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching class sections:', error);
        }
    };

    const fetchFeeStructures = async () => {
        setIsLoadingFeeStructures(true);
        try {
            const response = await getAccountantFeeStructures();
            if (response?.success) {
                setFeeStructuresList(response.data.fee_structures || []);
            }
        } catch (error) {
            console.error('Error fetching fee structures:', error);
            toast.error('Failed to fetch fee structures');
        } finally {
            setIsLoadingFeeStructures(false);
        }
    };

    const fetchFeeHeads = async () => {
        setIsLoadingFeeHeads(true);
        try {
            const response = await getAccountantFeeHeads();
            if (response?.success) {
                setFeeHeadsList(response.data.fee_heads || []);
            }
        } catch (error) {
            console.error('Error fetching fee heads:', error);
            toast.error('Failed to fetch fee heads');
        } finally {
            setIsLoadingFeeHeads(false);
        }
    };

    const feeData = useMemo(() => ({
        students: [
            { id: 1, name: 'John Doe', class: '10A', due: 5000, paid: 3000, dueDate: '2025-03-15', parentName: 'Robert Doe', parentContact: '9876543210', email: 'robert.doe@example.com' },
            { id: 2, name: 'Jane Smith', class: '9B', due: 4500, paid: 0, dueDate: '2025-03-10', parentName: 'Mary Smith', parentContact: '8765432109', email: 'mary.smith@example.com' },
            { id: 3, name: 'Alice Johnson', class: '10A', due: 6000, paid: 2000, dueDate: '2025-03-20', parentName: 'James Johnson', parentContact: '7654321098', email: 'james.j@example.com' },
            { id: 4, name: 'Bob Brown', class: '9B', due: 4000, paid: 1500, dueDate: '2025-03-25', parentName: 'Sarah Brown', parentContact: '6543210987', email: 'sarah.b@example.com' },
            { id: 5, name: 'Charlie Davis', class: '10C', due: 5500, paid: 3000, dueDate: '2025-03-30', parentName: 'Emma Davis', parentContact: '5432109876', email: 'emma.d@example.com' },
            { id: 6, name: 'Diana Prince', class: '9A', due: 5000, paid: 0, dueDate: '2025-03-12', parentName: 'William Prince', parentContact: '4321098765', email: 'william.p@example.com' }
        ],
        feeCategories: [
            { name: 'Tuition', amount: 3000, type: 'Recurring', frequency: 'Monthly' },
            { name: 'Transport', amount: 1500, type: 'Recurring', frequency: 'Quarterly' },
            { name: 'Library', amount: 500, type: 'Recurring', frequency: 'Yearly' },
            { name: 'Sports', amount: 1000, type: 'One-time', frequency: 'Annually' }
        ],
        transactions: [
            { id: 'TXN001', student: 'John Doe', amount: 3000, status: 'Success', date: '2025-03-01' },
            { id: 'TXN002', student: 'Jane Smith', amount: 4500, status: 'Failed', date: '2025-03-02' },
            { id: 'TXN003', student: 'Alice Johnson', amount: 2000, status: 'Success', date: '2025-03-05' },
            { id: 'TXN004', student: 'Bob Brown', amount: 1500, status: 'Success', date: '2025-03-06' },
            { id: 'TXN005', student: 'Charlie Davis', amount: 3000, status: 'Pending', date: '2025-03-07' },
            { id: 'TXN006', student: 'Diana Prince', amount: 5000, status: 'Success', date: '2025-03-08' }
        ]
    }), []);

    const chartData = useMemo(() => ({
        q1_2025: [{ label: 'Paid', value: 75000, color: '#4caf50' }, { label: 'Pending', value: 25000, color: '#f44336' }],
        q4_2024: [{ label: 'Paid', value: 65000, color: '#4caf50' }, { label: 'Pending', value: 35000, color: '#f44336' }],
        q3_2024: [{ label: 'Paid', value: 80000, color: '#4caf50' }, { label: 'Pending', value: 20000, color: '#f44336' }]
    }), []);

    const filteredStudentDetails = useMemo(() => feeData.students.filter(s => s.name.toLowerCase().includes(studentFeeSearchQuery.toLowerCase())), [studentFeeSearchQuery, feeData.students]);

    const updatedStudents = useMemo(() => {
        const studentsMap = new Map(feeData.students.map(s => [s.id, { ...s }]));
        feeRecords.forEach(record => {
            const student = studentsMap.get(parseInt(record.studentId));
            if (student) {
                student.paid += parseFloat(record.receivedAmount);
                student.due += parseFloat(record.balanceDue);
            }
        });
        return Array.from(studentsMap.values());
    }, [feeRecords, feeData.students]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };

            if (name === 'studentId') {
                const student = updatedStudents.find(s => s.id === parseInt(value));
                if (student) {
                    updated.studentName = student.name;
                    updated.classSection = student.class;
                    updated.parentName = student.parentName;
                    updated.parentContact = student.parentContact;
                    updated.email = student.email;
                    updated.dueAmount = student.due - student.paid; // Set dueAmount from updatedStudents
                } else {
                    updated.studentName = '';
                    updated.classSection = '';
                    updated.parentName = '';
                    updated.parentContact = '';
                    updated.email = '';
                    updated.feeAmount = 0;
                    updated.totalPayable = 0;
                    updated.dueAmount = 0;
                }
            }

            if (name === 'feeType') {
                const feeCategory = feeData.feeCategories.find(c => c.name === value);
                if (feeCategory) {
                    updated.feeAmount = feeCategory.amount;
                } else {
                    updated.feeAmount = 0;
                }
                updated.totalPayable = (parseFloat(updated.feeAmount) || 0) - (parseFloat(updated.discount) || 0) + (parseFloat(updated.lateFee) || 0);
            }

            if (['discount', 'lateFee'].includes(name)) {
                updated.totalPayable = (parseFloat(updated.feeAmount) || 0) - (parseFloat(updated.discount) || 0) + (parseFloat(updated.lateFee) || 0);
            }

            if (name === 'receivedAmount') {
                updated.balanceDue = updated.totalPayable - (parseFloat(value) || 0);
                updated.paymentStatus = updated.balanceDue === 0 ? 'Paid' : updated.balanceDue < updated.totalPayable ? 'Partially Paid' : 'Pending';
            }

            return updated;
        });
    };

    const isFormValid = () => {
        const requiredFields = [
            formData.studentId,
            formData.feeType,
            formData.paymentMode,
            formData.receivedAmount > 0 ? String(formData.receivedAmount) : ''
        ];

        if (formData.paymentMode === 'Cheque') {
            requiredFields.push(formData.chequeNumber, formData.bankName, formData.chequeDate);
        }
        if (['UPI', 'Net Banking', 'Cheque'].includes(formData.paymentMode)) {
            requiredFields.push(formData.transactionRef);
            if (!formData.attachments) requiredFields.push('');
        }

        return requiredFields.every(field => field && field.trim() !== '');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid()) {
            alert('Please fill all required fields before submitting.');
            return;
        }

        setFeeRecords(prev => [...prev, { ...formData, date: new Date().toISOString().split('T')[0] }]);
        setFormData({
            studentId: '', studentName: '', classSection: '', parentName: '', parentContact: '', email: '',
            feeType: '', feeAmount: 0, discount: 0, lateFee: 0, totalPayable: 0,
            paymentMode: '', transactionRef: '', chequeNumber: '', bankName: '', chequeDate: '', receivedAmount: 0, balanceDue: 0, paymentStatus: 'Pending',
            remarks: '', attachments: null, dueAmount: 0
        });
        alert('Fee collected successfully! Receipt generated and sent.');
    };

    const sendNotification = (type, studentName) => alert({ reminder: `Reminder sent to the parent of ${studentName} for due fees.`, action: `Action notification sent to admin for ${studentName}.` }[type]);
    const handleSaveRules = () => setLateFeeRules(tempLateFeeRules) || setIsModalOpen(false);

    // Fee Head Form Handlers
    const handleFeeHeadInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFeeHeadForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFeeHeadSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingFeeHead(true);
        
        try {
            const response = await addAccountantFeeHead(feeHeadForm);
            if (response?.success) {
                toast.success('Fee head added successfully!');
                setFeeHeadForm({
                    name: '',
                    description: '',
                    is_mandatory: false,
                    status: 'active'
                });
                // Refresh fee heads list
                fetchFeeHeads();
            } else {
                toast.error('Failed to add fee head');
            }
        } catch (error) {
            console.error('Error submitting fee head:', error);
            toast.error(error.response?.data?.message || 'An error occurred while adding fee head');
        } finally {
            setIsSubmittingFeeHead(false);
        }
    };

    // Open edit modal
    const openEditModal = (feeHead) => {
        setEditForm({
            name: feeHead.name,
            description: feeHead.description || '',
            is_mandatory: feeHead.is_mandatory,
            status: feeHead.status
        });
        setEditModal({ isOpen: true, feeHead });
    };

    // Close edit modal
    const closeEditModal = () => {
        setEditModal({ isOpen: false, feeHead: null });
        setEditForm({ name: '', description: '', is_mandatory: false, status: 'active' });
    };

    // Handle edit form change
    const handleEditInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle update submit
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        
        try {
            const response = await updateAccountantFeeHead(editModal.feeHead.id, editForm);
            if (response?.success) {
                toast.success('Fee head updated successfully!');
                closeEditModal();
                fetchFeeHeads();
            } else {
                toast.error('Failed to update fee head');
            }
        } catch (error) {
            console.error('Error updating fee head:', error);
            toast.error(error.response?.data?.message || 'An error occurred while updating fee head');
        } finally {
            setIsUpdating(false);
        }
    };

    // Handle delete
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this fee head?')) {
            return;
        }
        
        try {
            const response = await deleteAccountantFeeHead(id);
            if (response?.success) {
                toast.success('Fee head deleted successfully!');
                fetchFeeHeads();
            } else {
                toast.error('Failed to delete fee head');
            }
        } catch (error) {
            console.error('Error deleting fee head:', error);
            toast.error(error.response?.data?.message || 'An error occurred while deleting fee head');
        }
    };

    // Fee Structure Form Handlers
    const handleFeeStructureInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFeeStructureForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
        }));
    };

    const addFeeDetail = () => {
        setFeeStructureForm(prev => ({
            ...prev,
            fee_details: [...prev.fee_details, { fee_head_id: '', amount: 0, is_mandatory: true }]
        }));
    };

    const removeFeeDetail = (index) => {
        setFeeStructureForm(prev => ({
            ...prev,
            fee_details: prev.fee_details.filter((_, i) => i !== index)
        }));
    };

    const handleFeeDetailChange = (index, field, value) => {
        setFeeStructureForm(prev => ({
            ...prev,
            fee_details: prev.fee_details.map((detail, i) => 
                i === index ? { ...detail, [field]: field === 'amount' ? Number(value) : field === 'fee_head_id' ? Number(value) : value } : detail
            )
        }));
    };

    const handleFeeStructureSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingFeeStructure(true);
        
        try {
            const response = await addAccountantFeeStructure(feeStructureForm);
            if (response?.success) {
                toast.success('Fee structure added successfully!');
                setFeeStructureForm({
                    name: '',
                    class_section_id: '',
                    academic_start_year: new Date().getFullYear(),
                    academic_end_year: new Date().getFullYear() + 1,
                    due_date: '',
                    late_fee_amount: 0,
                    late_fee_type: 'flat',
                    fee_details: [{ fee_head_id: '', amount: 0, is_mandatory: true }]
                });
                fetchFeeStructures();
            } else {
                toast.error('Failed to add fee structure');
            }
        } catch (error) {
            console.error('Error submitting fee structure:', error);
            toast.error(error.response?.data?.message || 'An error occurred while adding fee structure');
        } finally {
            setIsSubmittingFeeStructure(false);
        }
    };

    // View Fee Structure
    const handleViewFeeStructure = async (id) => {
        try {
            const response = await getAccountantFeeStructureById(id);
            if (response?.success) {
                setViewFeeStructureModal({ isOpen: true, data: response.data });
            }
        } catch (error) {
            console.error('Error fetching fee structure:', error);
            toast.error('Failed to fetch fee structure details');
        }
    };

    const closeViewModal = () => {
        setViewFeeStructureModal({ isOpen: false, data: null });
    };

    // Edit Fee Structure
    const openEditFeeStructureModal = async (id) => {
        try {
            const response = await getAccountantFeeStructureById(id);
            if (response?.success) {
                const structure = response.data;
                setEditFeeStructureForm({
                    name: structure.name,
                    class_section_id: structure.class_section_id || '',
                    academic_start_year: structure.academic_start_year,
                    academic_end_year: structure.academic_end_year,
                    due_date: structure.due_date,
                    late_fee_amount: parseFloat(structure.late_fee_amount),
                    late_fee_type: structure.late_fee_type || 'flat',
                    fee_details: structure.feeDetails?.map(d => ({
                        fee_head_id: d.fee_head_id,
                        amount: parseFloat(d.amount),
                        is_mandatory: d.is_mandatory
                    })) || []
                });
                setEditFeeStructureModal({ isOpen: true, structure });
            }
        } catch (error) {
            console.error('Error fetching fee structure:', error);
            toast.error('Failed to load fee structure for editing');
        }
    };

    const closeEditFeeStructureModal = () => {
        setEditFeeStructureModal({ isOpen: false, structure: null });
        setEditFeeStructureForm({
            name: '',
            class_section_id: '',
            academic_start_year: 2025,
            academic_end_year: 2026,
            due_date: '',
            late_fee_amount: 0,
            late_fee_type: 'flat',
            fee_details: []
        });
    };

    const handleEditFeeStructureInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditFeeStructureForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
        }));
    };

    const handleEditFeeDetailChange = (index, field, value) => {
        setEditFeeStructureForm(prev => ({
            ...prev,
            fee_details: prev.fee_details.map((detail, i) => 
                i === index ? { ...detail, [field]: field === 'amount' ? Number(value) : field === 'fee_head_id' ? Number(value) : value } : detail
            )
        }));
    };

    const addEditFeeDetail = () => {
        setEditFeeStructureForm(prev => ({
            ...prev,
            fee_details: [...prev.fee_details, { fee_head_id: '', amount: 0, is_mandatory: true }]
        }));
    };

    const removeEditFeeDetail = (index) => {
        setEditFeeStructureForm(prev => ({
            ...prev,
            fee_details: prev.fee_details.filter((_, i) => i !== index)
        }));
    };

    const handleUpdateFeeStructure = async (e) => {
        e.preventDefault();
        setIsUpdatingFeeStructure(true);
        try {
            const response = await updateAccountantFeeStructure(editFeeStructureModal.structure.id, editFeeStructureForm);
            if (response?.success) {
                toast.success('Fee structure updated successfully!');
                closeEditFeeStructureModal();
                fetchFeeStructures();
            } else {
                toast.error('Failed to update fee structure');
            }
        } catch (error) {
            console.error('Error updating fee structure:', error);
            toast.error(error.response?.data?.message || 'An error occurred while updating fee structure');
        } finally {
            setIsUpdatingFeeStructure(false);
        }
    };

    // Delete Fee Structure
    const handleDeleteFeeStructure = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                const response = await deleteAccountantFeeStructure(id);
                if (response?.success) {
                    toast.success('Fee structure deleted successfully!');
                    fetchFeeStructures();
                } else {
                    toast.error('Failed to delete fee structure');
                }
            } catch (error) {
                console.error('Error deleting fee structure:', error);
                toast.error(error.response?.data?.message || 'An error occurred while deleting fee structure');
            }
        }
    };

    // Assign Fee Handlers
    const handleAssignFeeInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAssignFeeForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
        }));
        
        // When fee structure is selected, show its details
        if (name === 'fee_structure_id' && value) {
            const selectedStructure = feeStructuresList.find(fs => fs.id === Number(value));
            setSelectedFeeStructureDetails(selectedStructure || null);
        } else if (name === 'fee_structure_id') {
            setSelectedFeeStructureDetails(null);
        }
    };

    const addInstallment = () => {
        setAssignFeeForm(prev => ({
            ...prev,
            installments: [...prev.installments, { 
                installment_number: prev.installments.length + 1, 
                amount: 0, 
                due_date: '' 
            }]
        }));
    };

    const removeInstallment = (index) => {
        setAssignFeeForm(prev => ({
            ...prev,
            installments: prev.installments.filter((_, i) => i !== index).map((inst, idx) => ({
                ...inst,
                installment_number: idx + 1
            }))
        }));
    };

    const handleInstallmentChange = (index, field, value) => {
        setAssignFeeForm(prev => ({
            ...prev,
            installments: prev.installments.map((inst, i) => 
                i === index ? { ...inst, [field]: field === 'amount' ? Number(value) : value } : inst
            )
        }));
    };

    const handleAssignFeeSubmit = async (e) => {
        e.preventDefault();
        setIsAssigningFee(true);
        try {
            const response = await assignFee(assignFeeForm);
            if (response?.success) {
                toast.success('Fee assigned successfully!');
                setAssignFeeForm({
                    class_section_id: '',
                    fee_structure_id: '',
                    apply_discount: false,
                    discount_amount: 0,
                    discount_reason: '',
                    installments: [{ installment_number: 1, amount: 0, due_date: '' }]
                });
            } else {
                toast.error('Failed to assign fee');
            }
        } catch (error) {
            console.error('Error assigning fee:', error);
            toast.error(error.response?.data?.message || 'An error occurred while assigning fee');
        } finally {
            setIsAssigningFee(false);
        }
    };

    // View Assigned Fees Handlers
    const handleClassSelectionForView = async (e) => {
        const class_section_id = e.target.value;
        setSelectedClassForView(class_section_id);
        
        if (class_section_id) {
            setIsLoadingAssignedFees(true);
            try {
                const response = await getAssignedFeesByClass(class_section_id);
                if (response?.success) {
                    setAssignedFeesList(response.data || []);
                } else {
                    setAssignedFeesList([]);
                }
            } catch (error) {
                console.error('Error fetching assigned fees:', error);
                toast.error('Failed to fetch assigned fees');
                setAssignedFeesList([]);
            } finally {
                setIsLoadingAssignedFees(false);
            }
        } else {
            setAssignedFeesList([]);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <main className="flex-1 overflow-y-auto lg:ml-64">
                <Header setIsSidebarOpen={setIsSidebarOpen} />
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8">Fee Management Dashboard</h1>

                <Accountant_Section title="Fee Head Management" icon={FaLayerGroup} defaultOpen bgColor="green">
                    <div className="bg-green-50 p-4 md:p-6 rounded-lg max-w-3xl mx-auto">
                        <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2 text-green-700">
                            <FaPlus className="text-green-600" />Add New Fee Head
                        </h3>
                        <form onSubmit={handleFeeHeadSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Fee Head Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={feeHeadForm.name}
                                    onChange={handleFeeHeadInputChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="e.g., Tuition Fee"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={feeHeadForm.description}
                                    onChange={handleFeeHeadInputChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    rows="3"
                                    placeholder="Brief description of fee head (e.g., Monthly tuition fee for students)"
                                ></textarea>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                                <input
                                    type="checkbox"
                                    name="is_mandatory"
                                    id="is_mandatory"
                                    checked={feeHeadForm.is_mandatory}
                                    onChange={handleFeeHeadInputChange}
                                    className="w-4 h-4 text-green-600 focus:ring-2 focus:ring-green-500 rounded"
                                />
                                <label htmlFor="is_mandatory" className="text-sm font-medium text-gray-700 cursor-pointer">
                                    Mark as Mandatory Fee
                                </label>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="status"
                                    value={feeHeadForm.status}
                                    onChange={handleFeeHeadInputChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    required
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmittingFeeHead || !feeHeadForm.name}
                                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${
                                    isSubmittingFeeHead || !feeHeadForm.name
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg'
                                }`}
                            >
                                {isSubmittingFeeHead ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Adding Fee Head...
                                    </span>
                                ) : (
                                    'Add Fee Head'
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Fee Heads List */}
                    <div className="bg-green-50 p-4 md:p-6 rounded-lg max-w-6xl mx-auto mt-6">
                        <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2 text-green-700">
                            <FaLayerGroup className="text-green-600" />Fee Heads List
                        </h3>
                        {isLoadingFeeHeads ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                            </div>
                        ) : feeHeadsList.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                    <thead className="bg-green-100">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">S.No</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Fee Head Name</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Description</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Mandatory</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Created At</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {feeHeadsList.map((feeHead, index) => (
                                            <tr key={feeHead.id} className="hover:bg-green-50 transition-colors">
                                                <td className="px-4 py-3 text-sm text-gray-700">{index + 1}</td>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{feeHead.name}</td>
                                                <td className="px-4 py-3 text-sm text-gray-700">{feeHead.description || 'N/A'}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        feeHead.is_mandatory 
                                                            ? 'bg-red-100 text-red-800' 
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {feeHead.is_mandatory ? 'Yes' : 'No'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        feeHead.status === 'active' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {feeHead.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                    {new Date(feeHead.createdAt).toLocaleDateString('en-IN')}
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => openEditModal(feeHead)}
                                                            className="text-blue-600 hover:text-blue-800 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <FaEdit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(feeHead.id)}
                                                            className="text-red-600 hover:text-red-800 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <FaTrash className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="mt-4 text-sm text-gray-600">
                                    Total Fee Heads: <span className="font-semibold">{feeHeadsList.length}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p className="text-lg">No fee heads found</p>
                                <p className="text-sm mt-1">Add your first fee head using the form above</p>
                            </div>
                        )}
                    </div>

                    {/* Edit Modal */}
                    {editModal.isOpen && (
                        <div className="fixed inset-0 bg-transparent backdrop-blur-md bg-opacity-30 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-semibold text-gray-900">Edit Fee Head</h3>
                                        <button
                                            onClick={closeEditModal}
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <form onSubmit={handleUpdateSubmit} className="space-y-4">
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                                Fee Head Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={editForm.name}
                                                onChange={handleEditInputChange}
                                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="e.g., Tuition Fee"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                                Description
                                            </label>
                                            <textarea
                                                name="description"
                                                value={editForm.description}
                                                onChange={handleEditInputChange}
                                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                rows="3"
                                                placeholder="Brief description of fee head"
                                            ></textarea>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <input
                                                type="checkbox"
                                                name="is_mandatory"
                                                id="edit_is_mandatory"
                                                checked={editForm.is_mandatory}
                                                onChange={handleEditInputChange}
                                                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500 rounded"
                                            />
                                            <label htmlFor="edit_is_mandatory" className="text-sm font-medium text-gray-700 cursor-pointer">
                                                Mark as Mandatory Fee
                                            </label>
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                                Status <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="status"
                                                value={editForm.status}
                                                onChange={handleEditInputChange}
                                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </div>
                                        <div className="flex gap-3 pt-4">
                                            <button
                                                type="button"
                                                onClick={closeEditModal}
                                                className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isUpdating || !editForm.name}
                                                className={`flex-1 py-2.5 px-4 rounded-lg text-white font-medium transition-all ${
                                                    isUpdating || !editForm.name
                                                        ? 'bg-gray-400 cursor-not-allowed'
                                                        : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                                                }`}
                                            >
                                                {isUpdating ? 'Updating...' : 'Update Fee Head'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </Accountant_Section>

                <Accountant_Section title="Fee Structure Management" icon={FaSchool} bgColor="blue">
                    <div className="bg-blue-50 p-4 md:p-6 rounded-lg max-w-4xl mx-auto">
                        <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2 text-blue-700">
                            <FaPlus className="text-blue-600" />Add Fee Structure
                        </h3>
                        <form onSubmit={handleFeeStructureSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Structure Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={feeStructureForm.name}
                                        onChange={handleFeeStructureInputChange}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., Class 6 Annual Fee Structure"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Class/Section <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="class_section_id"
                                        value={feeStructureForm.class_section_id}
                                        onChange={handleFeeStructureInputChange}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select Class/Section</option>
                                        {classSectionsList.map((cs) => (
                                            <option key={cs.id} value={cs.id}>
                                                {cs.class_name} - {cs.section_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Academic Start Year <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="academic_start_year"
                                        value={feeStructureForm.academic_start_year}
                                        onChange={handleFeeStructureInputChange}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Academic End Year <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="academic_end_year"
                                        value={feeStructureForm.academic_end_year}
                                        onChange={handleFeeStructureInputChange}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Due Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="due_date"
                                        value={feeStructureForm.due_date}
                                        onChange={handleFeeStructureInputChange}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Late Fee Amount <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="late_fee_amount"
                                        value={feeStructureForm.late_fee_amount}
                                        onChange={handleFeeStructureInputChange}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="0"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Late Fee Type <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="late_fee_type"
                                        value={feeStructureForm.late_fee_type}
                                        onChange={handleFeeStructureInputChange}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="flat">Flat</option>
                                        <option value="percentage">Percentage</option>
                                    </select>
                                </div>
                            </div>

                            {/* Fee Details Section */}
                            <div className="border-t pt-4 mt-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-base font-semibold text-gray-700">Fee Details</h4>
                                    <button
                                        type="button"
                                        onClick={addFeeDetail}
                                        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-all"
                                    >
                                        + Add Fee Head
                                    </button>
                                </div>
                                {feeStructureForm.fee_details.map((detail, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 p-3 bg-white rounded-lg border border-gray-200">
                                        <div>
                                            <label className="block mb-1 text-xs font-medium text-gray-700">
                                                Fee Head ID <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={detail.fee_head_id}
                                                onChange={(e) => handleFeeDetailChange(index, 'fee_head_id', e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                required
                                            >
                                                <option value="">Select Fee Head</option>
                                                {feeHeadsList.map((fh) => (
                                                    <option key={fh.id} value={fh.id}>
                                                        {fh.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-xs font-medium text-gray-700">
                                                Amount <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={detail.amount}
                                                onChange={(e) => handleFeeDetailChange(index, 'amount', e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                placeholder="0"
                                                required
                                            />
                                        </div>
                                        <div className="flex items-end">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={detail.is_mandatory}
                                                    onChange={(e) => handleFeeDetailChange(index, 'is_mandatory', e.target.checked)}
                                                    className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500 rounded"
                                                />
                                                <span className="text-xs font-medium text-gray-700">Mandatory</span>
                                            </label>
                                        </div>
                                        <div className="flex items-end">
                                            {feeStructureForm.fee_details.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeFeeDetail(index)}
                                                    className="w-full px-2 py-2 bg-red-100 text-red-600 text-sm rounded-lg hover:bg-red-200 transition-all"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmittingFeeStructure || !feeStructureForm.name}
                                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${
                                    isSubmittingFeeStructure || !feeStructureForm.name
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                                }`}
                            >
                                {isSubmittingFeeStructure ? 'Adding Fee Structure...' : 'Add Fee Structure'}
                            </button>
                        </form>
                    </div>

                    {/* Fee Structures List */}
                    <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow">
                        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Fee Structures List</h3>
                        {isLoadingFeeStructures ? (
                            <div className="text-center py-8">
                                <p className="text-gray-600">Loading fee structures...</p>
                            </div>
                        ) : feeStructuresList.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-blue-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">S.No</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Class/Section</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Academic Year</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Total Amount</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Due Date</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Late Fee</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Fee Heads</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {feeStructuresList.map((structure, index) => (
                                            <tr key={structure.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{structure.name}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                                    {structure.classSection ? (
                                                        <div>
                                                            <div>{structure.classSection.class_name}</div>
                                                            <div className="text-xs text-gray-500">Section: {structure.classSection.section_name}</div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">N/A</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                                    {structure.academic_start_year} - {structure.academic_end_year}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-green-600">
                                                    ₹{parseFloat(structure.total_amount).toLocaleString('en-IN')}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                                    {new Date(structure.due_date).toLocaleDateString('en-IN')}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                                    <div>₹{parseFloat(structure.late_fee_amount).toLocaleString('en-IN')}</div>
                                                    <div className="text-xs text-gray-500">{structure.late_fee_type || 'N/A'}</div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {structure.feeDetails && structure.feeDetails.length > 0 ? (
                                                        <div className="space-y-1">
                                                            {structure.feeDetails.map((detail) => (
                                                                <div key={detail.id} className="text-xs">
                                                                    <span className="font-medium">{detail.feeHead?.name}:</span>
                                                                    <span className="text-green-600 ml-1">₹{parseFloat(detail.amount).toLocaleString('en-IN')}</span>
                                                                    {detail.is_mandatory && (
                                                                        <span className="ml-1 px-1 bg-red-100 text-red-600 rounded text-xs">M</span>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">No fee heads</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleViewFeeStructure(structure.id)}
                                                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                                                            title="View Details"
                                                        >
                                                            <FaEye className="text-sm" />
                                                        </button>
                                                        <button
                                                            onClick={() => openEditFeeStructureModal(structure.id)}
                                                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all"
                                                            title="Edit"
                                                        >
                                                            <FaEdit className="text-sm" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteFeeStructure(structure.id, structure.name)}
                                                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                                                            title="Delete"
                                                        >
                                                            <FaTrash className="text-sm" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p className="text-lg">No fee structures found</p>
                                <p className="text-sm mt-1">Add your first fee structure using the form above</p>
                            </div>
                        )}
                    </div>

                    {/* View Modal */}
                    {viewFeeStructureModal.isOpen && viewFeeStructureModal.data && (
                        <div className="fixed inset-0 bg-transparent backdrop-blur-md bg-opacity-30 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4 border-b pb-4">
                                        <h3 className="text-2xl font-semibold text-gray-900">Fee Structure Details</h3>
                                        <button
                                            onClick={closeViewModal}
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-blue-50 p-4 rounded-lg">
                                                <label className="block text-sm font-medium text-gray-600">Structure Name</label>
                                                <p className="text-lg font-semibold text-gray-900 mt-1">{viewFeeStructureModal.data.name}</p>
                                            </div>
                                            <div className="bg-blue-50 p-4 rounded-lg">
                                                <label className="block text-sm font-medium text-gray-600">Class/Section</label>
                                                <p className="text-lg font-semibold text-gray-900 mt-1">
                                                    {viewFeeStructureModal.data.classSection ? (
                                                        `${viewFeeStructureModal.data.classSection.class_name} - ${viewFeeStructureModal.data.classSection.section_name}`
                                                    ) : 'N/A'}
                                                </p>
                                            </div>
                                            <div className="bg-green-50 p-4 rounded-lg">
                                                <label className="block text-sm font-medium text-gray-600">Academic Year</label>
                                                <p className="text-lg font-semibold text-gray-900 mt-1">
                                                    {viewFeeStructureModal.data.academic_start_year} - {viewFeeStructureModal.data.academic_end_year}
                                                </p>
                                            </div>
                                            <div className="bg-green-50 p-4 rounded-lg">
                                                <label className="block text-sm font-medium text-gray-600">Total Amount</label>
                                                <p className="text-lg font-bold text-green-600 mt-1">
                                                    ₹{parseFloat(viewFeeStructureModal.data.total_amount).toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                            <div className="bg-yellow-50 p-4 rounded-lg">
                                                <label className="block text-sm font-medium text-gray-600">Due Date</label>
                                                <p className="text-lg font-semibold text-gray-900 mt-1">
                                                    {new Date(viewFeeStructureModal.data.due_date).toLocaleDateString('en-IN')}
                                                </p>
                                            </div>
                                            <div className="bg-yellow-50 p-4 rounded-lg">
                                                <label className="block text-sm font-medium text-gray-600">Late Fee</label>
                                                <p className="text-lg font-semibold text-gray-900 mt-1">
                                                    ₹{parseFloat(viewFeeStructureModal.data.late_fee_amount).toLocaleString('en-IN')}
                                                    <span className="text-sm ml-2 text-gray-600">({viewFeeStructureModal.data.late_fee_type})</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="border-t pt-4">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Fee Details</h4>
                                            <div className="space-y-3">
                                                {viewFeeStructureModal.data.feeDetails?.map((detail) => (
                                                    <div key={detail.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                                                        <div>
                                                            <p className="font-semibold text-gray-900">{detail.feeHead?.name}</p>
                                                            <p className="text-sm text-gray-600">{detail.feeHead?.description}</p>
                                                            <div className="flex gap-2 mt-2">
                                                                {detail.is_mandatory && (
                                                                    <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-medium">Mandatory</span>
                                                                )}
                                                                <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs font-medium">
                                                                    Sequence: {detail.sequence_order}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-2xl font-bold text-green-600">
                                                                ₹{parseFloat(detail.amount).toLocaleString('en-IN')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Edit Modal */}
                    {editFeeStructureModal.isOpen && (
                        <div className="fixed inset-0 bg-transparent backdrop-blur-md bg-opacity-30 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-semibold text-gray-900">Edit Fee Structure</h3>
                                        <button
                                            onClick={closeEditFeeStructureModal}
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <form onSubmit={handleUpdateFeeStructure} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                                    Structure Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={editFeeStructureForm.name}
                                                    onChange={handleEditFeeStructureInputChange}
                                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                                    Class/Section <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    name="class_section_id"
                                                    value={editFeeStructureForm.class_section_id}
                                                    onChange={handleEditFeeStructureInputChange}
                                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    required
                                                >
                                                    <option value="">Select Class/Section</option>
                                                    {classSectionsList.map((cs) => (
                                                        <option key={cs.id} value={cs.id}>
                                                            {cs.class_name} - {cs.section_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                                    Academic Start Year <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    name="academic_start_year"
                                                    value={editFeeStructureForm.academic_start_year}
                                                    onChange={handleEditFeeStructureInputChange}
                                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                                    Academic End Year <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    name="academic_end_year"
                                                    value={editFeeStructureForm.academic_end_year}
                                                    onChange={handleEditFeeStructureInputChange}
                                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                                    Due Date <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    name="due_date"
                                                    value={editFeeStructureForm.due_date}
                                                    onChange={handleEditFeeStructureInputChange}
                                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                                    Late Fee Amount <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    name="late_fee_amount"
                                                    value={editFeeStructureForm.late_fee_amount}
                                                    onChange={handleEditFeeStructureInputChange}
                                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                                    Late Fee Type <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    name="late_fee_type"
                                                    value={editFeeStructureForm.late_fee_type}
                                                    onChange={handleEditFeeStructureInputChange}
                                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    required
                                                >
                                                    <option value="flat">Flat</option>
                                                    <option value="percentage">Percentage</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Fee Details Section */}
                                        <div className="border-t pt-4 mt-4">
                                            <div className="flex justify-between items-center mb-3">
                                                <h4 className="text-base font-semibold text-gray-700">Fee Details</h4>
                                                <button
                                                    type="button"
                                                    onClick={addEditFeeDetail}
                                                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-all"
                                                >
                                                    + Add Fee Head
                                                </button>
                                            </div>
                                            {editFeeStructureForm.fee_details.map((detail, index) => (
                                                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                    <div>
                                                        <label className="block mb-1 text-xs font-medium text-gray-700">
                                                            Fee Head ID <span className="text-red-500">*</span>
                                                        </label>
                                                        <select
                                                            value={detail.fee_head_id}
                                                            onChange={(e) => handleEditFeeDetailChange(index, 'fee_head_id', e.target.value)}
                                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                            required
                                                        >
                                                            <option value="">Select Fee Head</option>
                                                            {feeHeadsList.map((fh) => (
                                                                <option key={fh.id} value={fh.id}>
                                                                    {fh.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block mb-1 text-xs font-medium text-gray-700">
                                                            Amount <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={detail.amount}
                                                            onChange={(e) => handleEditFeeDetailChange(index, 'amount', e.target.value)}
                                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                            placeholder="0"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex items-end">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={detail.is_mandatory}
                                                                onChange={(e) => handleEditFeeDetailChange(index, 'is_mandatory', e.target.checked)}
                                                                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500 rounded"
                                                            />
                                                            <span className="text-xs font-medium text-gray-700">Mandatory</span>
                                                        </label>
                                                    </div>
                                                    <div className="flex items-end">
                                                        {editFeeStructureForm.fee_details.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeEditFeeDetail(index)}
                                                                className="w-full px-2 py-2 bg-red-100 text-red-600 text-sm rounded-lg hover:bg-red-200 transition-all"
                                                            >
                                                                Remove
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex gap-3 pt-4">
                                            <button
                                                type="button"
                                                onClick={closeEditFeeStructureModal}
                                                className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isUpdatingFeeStructure}
                                                className={`flex-1 py-2.5 px-4 rounded-lg text-white font-medium transition-all ${
                                                    isUpdatingFeeStructure
                                                        ? 'bg-gray-400 cursor-not-allowed'
                                                        : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                                                }`}
                                            >
                                                {isUpdatingFeeStructure ? 'Updating...' : 'Update Fee Structure'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </Accountant_Section>

                <Accountant_Section title="Assign Fee" icon={FaUserCheck} bgColor="purple">
                    <div className="bg-purple-50 p-4 md:p-6 rounded-lg max-w-4xl mx-auto">
                        <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2 text-purple-700">
                            <FaPlus className="text-purple-600" />Assign Fee to Class
                        </h3>
                        <form onSubmit={handleAssignFeeSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Class/Section <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="class_section_id"
                                        value={assignFeeForm.class_section_id}
                                        onChange={handleAssignFeeInputChange}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        required
                                    >
                                        <option value="">Select Class/Section</option>
                                        {classSectionsList.map((cs) => (
                                            <option key={cs.id} value={cs.id}>
                                                {cs.class_name} - {cs.section_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Fee Structure <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="fee_structure_id"
                                        value={assignFeeForm.fee_structure_id}
                                        onChange={handleAssignFeeInputChange}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        required
                                    >
                                        <option value="">Select Fee Structure</option>
                                        {feeStructuresList.map((fs) => (
                                            <option key={fs.id} value={fs.id}>
                                                {fs.name} ({fs.classSection ? `${fs.classSection.class_name} - ${fs.classSection.section_name}` : 'N/A'})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Selected Fee Structure Details */}
                            {selectedFeeStructureDetails && (
                                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
                                    <h4 className="text-sm font-semibold text-purple-800 mb-3">Fee Structure Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="bg-white p-3 rounded-lg shadow-sm">
                                            <p className="text-xs text-gray-500 mb-1">Structure Name</p>
                                            <p className="text-sm font-semibold text-gray-900">{selectedFeeStructureDetails.name}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg shadow-sm">
                                            <p className="text-xs text-gray-500 mb-1">Class/Section</p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {selectedFeeStructureDetails.classSection 
                                                    ? `${selectedFeeStructureDetails.classSection.class_name} - ${selectedFeeStructureDetails.classSection.section_name}` 
                                                    : 'N/A'}
                                            </p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg shadow-sm">
                                            <p className="text-xs text-gray-500 mb-1">Academic Year</p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {selectedFeeStructureDetails.academic_start_year} - {selectedFeeStructureDetails.academic_end_year}
                                            </p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg shadow-sm">
                                            <p className="text-xs text-gray-500 mb-1">Due Date</p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {new Date(selectedFeeStructureDetails.due_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg shadow-sm">
                                            <p className="text-xs text-gray-500 mb-1">Late Fee</p>
                                            <p className="text-sm font-semibold text-orange-600">
                                                ₹{parseFloat(selectedFeeStructureDetails.late_fee_amount).toLocaleString()} 
                                                <span className="text-xs text-gray-500"> ({selectedFeeStructureDetails.late_fee_type})</span>
                                            </p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg shadow-sm">
                                            <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                                            <p className="text-sm font-semibold text-green-600">
                                                ₹{selectedFeeStructureDetails.feeDetails?.reduce((sum, detail) => sum + parseFloat(detail.amount || 0), 0).toLocaleString() || '0'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Fee Details Breakdown */}
                                    {selectedFeeStructureDetails.feeDetails && selectedFeeStructureDetails.feeDetails.length > 0 && (
                                        <div className="mt-4">
                                            <h5 className="text-xs font-semibold text-purple-700 mb-2">Fee Breakdown</h5>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                                {selectedFeeStructureDetails.feeDetails.map((detail, index) => (
                                                    <div key={index} className="bg-white p-2 rounded border border-gray-200 flex justify-between items-center">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-medium text-gray-700">
                                                                {detail.FeeHead?.name || `Fee ${index + 1}`}
                                                            </span>
                                                            {detail.is_mandatory && (
                                                                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">Mandatory</span>
                                                            )}
                                                        </div>
                                                        <span className="text-sm font-bold text-green-600">₹{parseFloat(detail.amount).toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                                    <input
                                        type="checkbox"
                                        name="apply_discount"
                                        id="apply_discount"
                                        checked={assignFeeForm.apply_discount}
                                        onChange={handleAssignFeeInputChange}
                                        className="w-4 h-4 text-purple-600 focus:ring-2 focus:ring-purple-500 rounded"
                                    />
                                    <label htmlFor="apply_discount" className="text-sm font-medium text-gray-700 cursor-pointer">
                                        Apply Discount
                                    </label>
                                </div>
                            </div>

                            {assignFeeForm.apply_discount && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded-lg border border-purple-200">
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            Discount Amount <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="discount_amount"
                                            value={assignFeeForm.discount_amount}
                                            onChange={handleAssignFeeInputChange}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                            placeholder="Enter discount amount"
                                            required={assignFeeForm.apply_discount}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            Discount Reason <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="discount_reason"
                                            value={assignFeeForm.discount_reason}
                                            onChange={handleAssignFeeInputChange}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                            placeholder="e.g., Merit scholarship"
                                            required={assignFeeForm.apply_discount}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Installments Section */}
                            <div className="border-t pt-4 mt-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-base font-semibold text-gray-700">Installments</h4>
                                    <button
                                        type="button"
                                        onClick={addInstallment}
                                        className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-all"
                                    >
                                        + Add Installment
                                    </button>
                                </div>
                                {assignFeeForm.installments.map((installment, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 p-3 bg-white rounded-lg border border-gray-200">
                                        <div>
                                            <label className="block mb-1 text-xs font-medium text-gray-700">
                                                Installment # <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={installment.installment_number}
                                                readOnly
                                                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-xs font-medium text-gray-700">
                                                Amount <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={installment.amount}
                                                onChange={(e) => handleInstallmentChange(index, 'amount', e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                                placeholder="0"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-xs font-medium text-gray-700">
                                                Due Date <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                value={installment.due_date}
                                                onChange={(e) => handleInstallmentChange(index, 'due_date', e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                                required
                                            />
                                        </div>
                                        <div className="flex items-end">
                                            {assignFeeForm.installments.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeInstallment(index)}
                                                    className="w-full px-2 py-2 bg-red-100 text-red-600 text-sm rounded-lg hover:bg-red-200 transition-all"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-700">
                                        <strong>Total Installments:</strong> {assignFeeForm.installments.length} | 
                                        <strong className="ml-2">Total Amount:</strong> ₹{assignFeeForm.installments.reduce((sum, inst) => sum + (inst.amount || 0), 0).toLocaleString('en-IN')}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isAssigningFee || !assignFeeForm.class_section_id || !assignFeeForm.fee_structure_id}
                                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${
                                    isAssigningFee || !assignFeeForm.class_section_id || !assignFeeForm.fee_structure_id
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg'
                                }`}
                            >
                                {isAssigningFee ? 'Assigning Fee...' : 'Assign Fee'}
                            </button>
                        </form>
                    </div>
                </Accountant_Section>

                <Accountant_Section title="View Assigned Fees" icon={FaClipboardList} bgColor="indigo">
                    <div className="bg-indigo-50 p-4 md:p-6 rounded-lg">
                        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-indigo-700">
                            View Assigned Fees by Class
                        </h3>
                        
                        {/* Class Section Selector */}
                        <div className="mb-6 max-w-md">
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Select Class/Section <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={selectedClassForView}
                                onChange={handleClassSelectionForView}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                            >
                                <option value="">-- Select Class/Section --</option>
                                {classSectionsList.map((cs) => (
                                    <option key={cs.id} value={cs.id}>
                                        {cs.class_name} - {cs.section_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Assigned Fees List */}
                        {selectedClassForView && (
                            <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow">
                                <h4 className="text-lg font-semibold mb-4 text-gray-800">Assigned Fees Details</h4>
                                {isLoadingAssignedFees ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-600">Loading assigned fees...</p>
                                    </div>
                                ) : assignedFeesList.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-indigo-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">S.No</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Student Name</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Roll Number</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Fee Structure</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Academic Year</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Final Amount</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Paid</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Due</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Installments</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {assignedFeesList.map((fee, index) => (
                                                    <tr key={fee.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {fee.student?.User?.name || 'N/A'}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                                            {fee.student?.roll_number || 'N/A'}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                            {fee.feeStructure?.name || 'N/A'}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                                            {fee.academic_year}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-indigo-600">
                                                            ₹{parseFloat(fee.final_amount).toLocaleString('en-IN')}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600">
                                                            ₹{parseFloat(fee.paid_amount).toLocaleString('en-IN')}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-red-600">
                                                            ₹{parseFloat(fee.due_amount).toLocaleString('en-IN')}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                fee.status === 'paid' 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : fee.status === 'partial'
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {fee.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">
                                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                                {fee.installments?.length || 0} Installments
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                            <button
                                                                onClick={() => setViewAssignedFeeModal({ isOpen: true, data: fee })}
                                                                className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-all"
                                                                title="View Details"
                                                            >
                                                                <FaEye className="text-sm" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <p className="text-lg">No assigned fees found for this class</p>
                                        <p className="text-sm mt-1">Try selecting a different class or assign fees first</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </Accountant_Section>

                {/* View Assigned Fee Details Modal */}
                {viewAssignedFeeModal.isOpen && viewAssignedFeeModal.data && (
                    <div className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900">Assigned Fee Details</h3>
                                    <button
                                        onClick={() => setViewAssignedFeeModal({ isOpen: false, data: null })}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Student & Fee Structure Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-600">Student Name</label>
                                        <p className="text-lg font-semibold text-gray-900 mt-1">
                                            {viewAssignedFeeModal.data.student?.User?.name || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-600">Roll Number</label>
                                        <p className="text-lg font-semibold text-gray-900 mt-1">
                                            {viewAssignedFeeModal.data.student?.roll_number || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-600">Email</label>
                                        <p className="text-lg font-semibold text-gray-900 mt-1">
                                            {viewAssignedFeeModal.data.student?.User?.email || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-600">Fee Structure</label>
                                        <p className="text-lg font-semibold text-gray-900 mt-1">
                                            {viewAssignedFeeModal.data.feeStructure?.name || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-600">Academic Year</label>
                                        <p className="text-lg font-semibold text-gray-900 mt-1">
                                            {viewAssignedFeeModal.data.academic_year}
                                        </p>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-600">Status</label>
                                        <p className="text-lg font-semibold mt-1">
                                            <span className={`px-3 py-1 rounded-full text-sm ${
                                                viewAssignedFeeModal.data.status === 'paid' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : viewAssignedFeeModal.data.status === 'partial'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {viewAssignedFeeModal.data.status}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {/* Amount Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <label className="block text-sm font-medium text-gray-600">Original Amount</label>
                                        <p className="text-xl font-bold text-gray-900 mt-1">
                                            ₹{parseFloat(viewAssignedFeeModal.data.original_amount).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                        <label className="block text-sm font-medium text-gray-600">Discount</label>
                                        <p className="text-xl font-bold text-orange-600 mt-1">
                                            -₹{parseFloat(viewAssignedFeeModal.data.discount_amount).toLocaleString('en-IN')}
                                        </p>
                                        {viewAssignedFeeModal.data.discount_reason && (
                                            <p className="text-xs text-gray-500 mt-1">{viewAssignedFeeModal.data.discount_reason}</p>
                                        )}
                                    </div>
                                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                                        <label className="block text-sm font-medium text-gray-600">Final Amount</label>
                                        <p className="text-xl font-bold text-indigo-600 mt-1">
                                            ₹{parseFloat(viewAssignedFeeModal.data.final_amount).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                        <label className="block text-sm font-medium text-gray-600">Paid Amount</label>
                                        <p className="text-xl font-bold text-green-600 mt-1">
                                            ₹{parseFloat(viewAssignedFeeModal.data.paid_amount).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
                                    <label className="block text-sm font-medium text-gray-600">Due Amount</label>
                                    <p className="text-2xl font-bold text-red-600 mt-1">
                                        ₹{parseFloat(viewAssignedFeeModal.data.due_amount).toLocaleString('en-IN')}
                                    </p>
                                </div>

                                {/* Installments Details */}
                                <div className="border-t pt-4">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Installment Details</h4>
                                    {viewAssignedFeeModal.data.installments && viewAssignedFeeModal.data.installments.length > 0 ? (
                                        <div className="space-y-3">
                                            {viewAssignedFeeModal.data.installments.map((installment, index) => (
                                                <div key={installment.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
                                                                    Installment #{installment.installment_number}
                                                                </span>
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                    installment.status === 'paid'
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : 'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                    {installment.status}
                                                                </span>
                                                            </div>
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                                                                <div>
                                                                    <p className="text-xs text-gray-500">Amount</p>
                                                                    <p className="text-sm font-bold text-gray-900">
                                                                        ₹{parseFloat(installment.amount).toLocaleString('en-IN')}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-gray-500">Paid</p>
                                                                    <p className="text-sm font-bold text-green-600">
                                                                        ₹{parseFloat(installment.paid_amount).toLocaleString('en-IN')}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-gray-500">Due Date</p>
                                                                    <p className="text-sm font-semibold text-gray-900">
                                                                        {new Date(installment.due_date).toLocaleDateString('en-IN')}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-gray-500">Due Amount</p>
                                                                    <p className="text-sm font-bold text-red-600">
                                                                        ₹{(parseFloat(installment.amount) - parseFloat(installment.paid_amount)).toLocaleString('en-IN')}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-gray-500 py-4">No installments found</p>
                                    )}
                                </div>

                                {/* Close Button */}
                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={() => setViewAssignedFeeModal({ isOpen: false, data: null })}
                                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AccountantFeeManagement;