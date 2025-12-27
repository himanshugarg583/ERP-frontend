import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import { getAllSubjectResources, deleteSubjectResource, getAllClassesDropdown, getSubjectsByClass, uploadSubjectResource, updateSubjectResource } from '../../../helper/requests-method/apiMethods';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Download, Eye, FileText, Edit, Trash2, X } from 'lucide-react';

const Assignment = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingResource, setEditingResource] = useState(null);
  const formRef = React.useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    class_section_id: '',
    subject_id: '',
    title: '',
    description: '',
    resource_type: 'assignment',
    due_date: '',
    file: null
  });
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchResources();
    fetchClasses();
  }, [refreshKey]);

  useEffect(() => {
    if (editingResource) {
      setFormData({
        class_section_id: editingResource.class_section_id,
        subject_id: editingResource.subject_id || '',
        title: editingResource.title,
        description: editingResource.description || '',
        resource_type: editingResource.resource_type || 'assignment',
        due_date: editingResource.due_date ? editingResource.due_date.split('T')[0] : '',
        file: null
      });
      if (editingResource.class_section_id) {
        fetchSubjects(editingResource.class_section_id);
      }
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [editingResource]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await getAllSubjectResources();
      if (response.success && response.data) {
        setResources(response.data.resources || []);
      } else {
        toast.error(response.message || 'Failed to fetch assignments');
      }
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await getAllClassesDropdown();
      if (response.success && response.data) {
        setClasses(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    }
  };

  const fetchSubjects = async (classId) => {
    try {
      const response = await getSubjectsByClass(classId);
      if (response.success && response.data) {
        setSubjects(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
      toast.error('Failed to fetch subjects');
      setSubjects([]);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
  };

  const handleDelete = async (resourceId) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) {
      return;
    }

    try {
      const response = await deleteSubjectResource(resourceId);
      if (response.success) {
        toast.success(response.message || 'Assignment deleted successfully');
        handleRefresh();
      } else {
        toast.error(response.message || 'Failed to delete assignment');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete assignment');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'class_section_id' && value) {
      fetchSubjects(value);
      setFormData(prev => ({
        ...prev,
        class_section_id: value,
        subject_id: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.class_section_id || !formData.subject_id || !formData.title || !formData.resource_type) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setFormLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('class_section_id', formData.class_section_id);
      formDataToSend.append('subject_id', formData.subject_id);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('resource_type', formData.resource_type);
      if (formData.due_date) {
        formDataToSend.append('due_date', formData.due_date);
      }
      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }

      let response;
      if (editingResource) {
        response = await updateSubjectResource(editingResource.resource_id, formDataToSend);
      } else {
        response = await uploadSubjectResource(formDataToSend);
      }
      
      if (response.success) {
        toast.success(response.message || (editingResource ? 'Assignment updated successfully' : 'Assignment uploaded successfully'));
        resetForm();
        handleRefresh();
      } else {
        toast.error(response.message || (editingResource ? 'Failed to update assignment' : 'Failed to upload assignment'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload assignment');
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      class_section_id: '',
      subject_id: '',
      title: '',
      description: '',
      resource_type: 'assignment',
      due_date: '',
      file: null
    });
    setSubjects([]);
    setEditingResource(null);
    const fileInput = document.getElementById('assignment-file');
    if (fileInput) fileInput.value = '';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getResourceTypeBadge = (type) => {
    const colors = {
      assignment: 'bg-blue-100 text-blue-800',
      study_material: 'bg-green-100 text-green-800',
      syllabus: 'bg-purple-100 text-purple-800',
      notes: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type] || colors.other}`}>
        {type.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  return (
    <div className="bg-slate-200 flex AddStudent">
      <Sidebar />

      <div
        className="overflow-auto relative z-1 flex-col"
        style={{ height: "95vh", width: "100vw", gap: "10px", display: "flex", transition: "margin-left 0.3s ease" }}
      >
        <Header />

        <main className="w-full py-6 px-4 md:px-6 space-y-6">
          {/* Assignment Form */}
          <div ref={formRef} className={`bg-white shadow-sm border rounded-xl p-4 transition-all duration-300 ${editingResource ? 'border-orange-500 ring-2 ring-orange-200' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {editingResource ? 'Edit Assignment' : 'Add New Assignment'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1" htmlFor="class_section_id">
                      Class <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="class_section_id"
                      name="class_section_id"
                      value={formData.class_section_id}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    >
                      <option value="">Select Class</option>
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.class_name} - {cls.section_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1" htmlFor="subject_id">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="subject_id"
                      name="subject_id"
                      value={formData.subject_id}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                      disabled={!formData.class_section_id}
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((sub) => (
                        <option key={sub.subject_id} value={sub.subject_id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                    {!formData.class_section_id && (
                      <p className="text-xs text-gray-500 mt-1">Please select a class first</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1" htmlFor="title">
                      Assignment Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      placeholder="e.g., Math Homework - Chapter 5"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1" htmlFor="resource_type">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="resource_type"
                      name="resource_type"
                      value={formData.resource_type}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    >
                      <option value="assignment">Assignment</option>
                      <option value="study_material">Study Material</option>
                      <option value="syllabus">Syllabus</option>
                      <option value="notes">Notes</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1" htmlFor="due_date">
                      Due Date
                    </label>
                    <input
                      type="date"
                      id="due_date"
                      name="due_date"
                      value={formData.due_date}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1" htmlFor="assignment-file">
                      File {editingResource && <span className="text-sm text-gray-500">(Optional - keep current)</span>}
                    </label>
                    <input
                      type="file"
                      id="assignment-file"
                      onChange={handleFileChange}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                    {editingResource && editingResource.file_url && (
                      <p className="text-xs text-gray-500 mt-1">
                        Current: <a href={editingResource.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View</a>
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-gray-700 font-medium mb-1" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    rows="3"
                  ></textarea>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:opacity-50"
                  >
                    {formLoading ? (editingResource ? 'Updating...' : 'Uploading...') : (editingResource ? 'Update' : 'Save')}
                  </button>
                </div>
              </form>
            </div>

          {/* Assignments Table */}
          <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-purple-600" />
                  All Assignments
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Total: {resources.length}
                </p>
              </div>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : resources.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No assignments uploaded yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Class
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Uploaded By
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Upload Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {resources.map((resource) => (
                      <tr key={resource.resource_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{resource.class_display}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{resource.subject_name || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getResourceTypeBadge(resource.resource_type)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {resource.due_date ? formatDate(resource.due_date) : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{resource.uploaded_by}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{formatDate(resource.created_at)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <a
                              href={resource.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                            <a
                              href={resource.file_url}
                              download
                              className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => handleEdit(resource)}
                              className="text-orange-600 hover:text-orange-800 p-1 rounded hover:bg-orange-50"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(resource.resource_id)}
                              className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Assignment;
