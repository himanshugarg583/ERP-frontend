import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import { AddContent } from "../../../components/fees/DiscountForm";
import { getAllClassResources, deleteClassResource } from '../../../helper/requests-method/apiMethods';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Download, Eye, FileText, Edit, Trash2 } from 'lucide-react';

const UploadContent = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingResource, setEditingResource] = useState(null);
  const formRef = React.useRef(null);

  useEffect(() => {
    fetchResources();
  }, [refreshKey]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await getAllClassResources();
      if (response.success && response.data) {
        setResources(response.data.resources || []);
      } else {
        toast.error(response.message || 'Failed to fetch resources');
      }
    } catch (error) {
      console.error('Failed to fetch resources:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    // Scroll to form after setting editing resource
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleDelete = async (resourceId) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) {
      return;
    }

    try {
      const response = await deleteClassResource(resourceId);
      if (response.success) {
        toast.success(response.message || 'Resource deleted successfully');
        handleRefresh();
      } else {
        toast.error(response.message || 'Failed to delete resource');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete resource');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
        className=" overflow-auto relative z-1 flex-col"
        style={{ height: "95vh", width: "100vw", gap: "10px", display: "flex", transition: "margin-left 0.3s ease" }}
      >
        <Header />

        <main className="w-full py-6 px-4 md:px-6 space-y-6">
          {/* Upload Form */}
          <div ref={formRef} className={`bg-white shadow-sm border rounded-xl p-4 transition-all duration-300 ${editingResource ? 'border-orange-500 ring-2 ring-orange-200' : 'border-slate-200'}`}>
            <AddContent 
              onUploadSuccess={handleRefresh} 
              editingResource={editingResource}
              onEditComplete={() => {
                setEditingResource(null);
                handleRefresh();
              }}
            />
          </div>

          {/* Resources Table */}
          <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-purple-600" />
                  All Class Resources
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Total Resources: {resources.length}
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
                <p>No resources uploaded yet</p>
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
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
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
                          {getResourceTypeBadge(resource.resource_type)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-xs truncate">
                            {resource.description || '-'}
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

export default UploadContent;


