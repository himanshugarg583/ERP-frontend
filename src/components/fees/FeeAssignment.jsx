import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Users, Calendar, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  getAllFeeStructures,
  getAllClassSections,
  getStudentsByClassSection,
  assignFeeToStudents
} from '../../helper/requests-method/apiMethods';

const FeeAssignment = () => {
  const [feeStructures, setFeeStructures] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    fee_structure_id: '',
    class_id: '',
    section_id: '',
    selected_students: [],
    select_all: false,
    installments: [
      {
        installment_number: 1,
        due_date: '',
        amount: '',
        description: ''
      }
    ]
  });

  useEffect(() => {
    fetchFeeStructures();
    fetchClasses();
  }, []);

  const fetchFeeStructures = async () => {
    try {
      const response = await getAllFeeStructures();
      if (response.success) {
        setFeeStructures(Array.isArray(response.data?.feeStructures) ? response.data.feeStructures : 
                         Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error fetching fee structures:', error);
      toast.error('Failed to fetch fee structures');
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await getAllClassSections();
      if (response.success) {
        setClasses(Array.isArray(response.data?.classes) ? response.data.classes : 
                   Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to fetch classes');
    }
  };

  const fetchStudents = async (classId, sectionId) => {
    if (!classId || !sectionId) return;
    
    setLoading(true);
    try {
      const response = await getStudentsByClassSection(classId, sectionId);
      if (response.success) {
        setStudents(Array.isArray(response.data?.students) ? response.data.students : 
                   Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setFormData({ 
      ...formData, 
      class_id: classId, 
      section_id: '',
      selected_students: [],
      select_all: false
    });
    setStudents([]);
  };

  const handleSectionChange = (e) => {
    const sectionId = e.target.value;
    setFormData({ ...formData, section_id: sectionId, selected_students: [], select_all: false });
    fetchStudents(formData.class_id, sectionId);
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setFormData({
      ...formData,
      select_all: isChecked,
      selected_students: isChecked ? students.map(s => s._id || s.id) : []
    });
  };

  const handleStudentSelect = (studentId) => {
    const isSelected = formData.selected_students.includes(studentId);
    const newSelected = isSelected
      ? formData.selected_students.filter(id => id !== studentId)
      : [...formData.selected_students, studentId];
    
    setFormData({
      ...formData,
      selected_students: newSelected,
      select_all: newSelected.length === students.length
    });
  };

  const addInstallment = () => {
    const newInstallment = {
      installment_number: formData.installments.length + 1,
      due_date: '',
      amount: '',
      description: ''
    };
    setFormData({
      ...formData,
      installments: [...formData.installments, newInstallment]
    });
  };

  const removeInstallment = (index) => {
    if (formData.installments.length === 1) {
      toast.warning('At least one installment is required');
      return;
    }
    const newInstallments = formData.installments.filter((_, i) => i !== index);
    // Renumber installments
    const renumbered = newInstallments.map((inst, idx) => ({
      ...inst,
      installment_number: idx + 1
    }));
    setFormData({ ...formData, installments: renumbered });
  };

  const updateInstallment = (index, field, value) => {
    const newInstallments = [...formData.installments];
    newInstallments[index] = {
      ...newInstallments[index],
      [field]: value
    };
    setFormData({ ...formData, installments: newInstallments });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.fee_structure_id) {
      toast.error('Please select a fee structure');
      return;
    }
    if (!formData.class_id || !formData.section_id) {
      toast.error('Please select class and section');
      return;
    }
    if (formData.selected_students.length === 0) {
      toast.error('Please select at least one student');
      return;
    }
    
    // Validate installments
    for (let inst of formData.installments) {
      if (!inst.due_date || !inst.amount) {
        toast.error('Please fill all installment details');
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        fee_structure_id: formData.fee_structure_id,
        class_id: formData.class_id,
        section_id: formData.section_id,
        student_ids: formData.selected_students,
        installments: formData.installments
      };

      const response = await assignFeeToStudents(payload);
      
      if (response.success) {
        toast.success('Fee assigned successfully!');
        // Reset form
        setFormData({
          fee_structure_id: '',
          class_id: '',
          section_id: '',
          selected_students: [],
          select_all: false,
          installments: [
            {
              installment_number: 1,
              due_date: '',
              amount: '',
              description: ''
            }
          ]
        });
        setStudents([]);
      } else {
        toast.error(response.message || 'Failed to assign fee');
      }
    } catch (error) {
      console.error('Error assigning fee:', error);
      toast.error(error.response?.data?.message || 'Failed to assign fee');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.roll_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admission_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSelectedFeeStructure = () => {
    return feeStructures.find(fs => fs._id === formData.fee_structure_id);
  };

  const selectedStructure = getSelectedFeeStructure();
  const totalAmount = selectedStructure?.total_amount || 0;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-8 w-8 text-violet-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Assign Fee to Students</h2>
              <p className="text-gray-600 text-sm">Select class, students, and create installments</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Fee Structure Selection */}
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-violet-600" />
                Fee Structure
              </h3>
              <select
                value={formData.fee_structure_id}
                onChange={(e) => setFormData({ ...formData, fee_structure_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                required
              >
                <option value="">Select Fee Structure</option>
                {feeStructures.map((structure) => (
                  <option key={structure._id} value={structure._id}>
                    {structure.structure_name} - {structure.academic_year} - ₹{structure.total_amount}
                  </option>
                ))}
              </select>
              
              {selectedStructure && (
                <div className="mt-3 p-3 bg-white rounded border border-violet-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Total Amount:</span>
                      <p className="font-semibold text-violet-600">₹{selectedStructure.total_amount}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Academic Year:</span>
                      <p className="font-semibold">{selectedStructure.academic_year}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Due Date:</span>
                      <p className="font-semibold">{new Date(selectedStructure.due_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        selectedStructure.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedStructure.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Class and Section Selection */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.class_id}
                  onChange={handleClassChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.className || cls.class_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.section_id}
                  onChange={handleSectionChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  required
                  disabled={!formData.class_id}
                >
                  <option value="">Select Section</option>
                  {formData.class_id && classes
                    .find(c => c._id === formData.class_id)?.sections?.map((section) => (
                      <option key={section._id} value={section._id}>
                        {section.sectionName || section.section_name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Student Selection */}
            {students.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Users className="h-5 w-5 text-violet-600" />
                    Select Students ({formData.selected_students.length} selected)
                  </h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.select_all}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Select All</span>
                  </label>
                </div>

                <div className="mb-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto bg-white rounded-lg border border-gray-200">
                  <div className="grid gap-2 p-3">
                    {filteredStudents.map((student) => (
                      <label
                        key={student._id || student.id}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.selected_students.includes(student._id || student.id)}
                          onChange={() => handleStudentSelect(student._id || student.id)}
                          className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{student.name}</p>
                          <p className="text-sm text-gray-600">
                            Roll No: {student.roll_number || student.admission_number || 'N/A'}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Installments Section */}
            {formData.selected_students.length > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-violet-600" />
                    Create Installments
                  </h3>
                  <button
                    type="button"
                    onClick={addInstallment}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Installment
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.installments.map((installment, index) => (
                    <div key={installment.installment_number || index} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-800">Installment {installment.installment_number}</h4>
                        {formData.installments.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeInstallment(index)}
                            className="text-red-600 hover:text-red-700 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Due Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            value={installment.due_date}
                            onChange={(e) => updateInstallment(index, 'due_date', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount (₹) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={installment.amount}
                            onChange={(e) => updateInstallment(index, 'amount', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            placeholder="0"
                            min="0"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <input
                            type="text"
                            value={installment.description}
                            onChange={(e) => updateInstallment(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            placeholder="Optional description"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Total Installment Amount:</span>
                    <span className="text-xl font-bold text-violet-600">
                      ₹{formData.installments.reduce((sum, inst) => sum + (parseFloat(inst.amount) || 0), 0)}
                    </span>
                  </div>
                  {totalAmount > 0 && (
                    <div className="flex justify-between items-center mt-2 pt-2 border-t">
                      <span className="text-gray-700">Fee Structure Total:</span>
                      <span className="font-semibold text-gray-800">₹{totalAmount}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    fee_structure_id: '',
                    class_id: '',
                    section_id: '',
                    selected_students: [],
                    select_all: false,
                    installments: [
                      {
                        installment_number: 1,
                        due_date: '',
                        amount: '',
                        description: ''
                      }
                    ]
                  });
                  setStudents([]);
                  setSearchTerm('');
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={loading || formData.selected_students.length === 0}
                className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {loading ? 'Assigning...' : 'Assign Fee'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeeAssignment;
