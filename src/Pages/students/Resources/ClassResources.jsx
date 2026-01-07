import React, { useState, useEffect } from 'react';
import { fetchStudentClassResources } from '../../../helper/requests-method/apiMethods';
import StudentSidebar from '../StudentSidebar';
import Header from '../../../components/comman_components/Header';
import { FaChevronDown, FaCalendarAlt, FaFileAlt, FaUser, FaDownload, FaBook } from 'react-icons/fa';

const ClassResources = () => {
  const [filter, setFilter] = useState('All');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchStudentClassResources();
        if (res?.data?.resources) {
          setResources(res.data.resources);
        }
      } catch (err) {
        setError('Failed to load class resources');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDownload = (fileUrl) => {
    window.open(fileUrl, '_blank');
  };

  const filteredResources = resources.filter(resource => {
    if (filter === 'All') return true;
    return resource.resource_type === filter.toLowerCase();
  });

  const getResourceTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'syllabus':
        return 'blue';
      case 'notes':
        return 'green';
      case 'assignment':
        return 'purple';
      case 'study_material':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const buttonClasses = "w-full flex justify-center items-center px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer shadow-md";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-lg font-semibold">Loading class resources...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-lg font-semibold text-red-600">{error}</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 flex AddStudent">
      <StudentSidebar />

      <div
        className="overflow-auto relative z-1 flex-col"
        style={{
          height: "95vh",
          width: "100vw",
          gap: "10px",
          display: "flex",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Header />

        <main className="w-full px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Class Resources</h1>
              <p className="text-gray-600">Access study materials, syllabus, and other resources shared by your teachers</p>
            </div>

            {/* Filter Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
              <div className="mb-4 sm:mb-0">
                <p className="text-sm text-gray-600">
                  Total Resources: <span className="font-semibold text-indigo-600">{resources.length}</span>
                </p>
              </div>
              <div className="relative">
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="appearance-none w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                >
                  <option value="All">All Resources</option>
                  <option value="Syllabus">Syllabus</option>
                  <option value="Notes">Notes</option>
                  <option value="Assignment">Assignment</option>
                  <option value="Study_Material">Study Material</option>
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Resources Grid */}
            {filteredResources.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <FaBook className="text-gray-300 text-6xl mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No resources available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredResources.map(resource => {
                  const color = getResourceTypeColor(resource.resource_type);
                  return (
                    <div 
                      key={resource.resource_id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                    >
                      <div className={`p-1 bg-${color}-500`}></div>
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                              {resource.title}
                            </h3>
                            {resource.resource_type && (
                              <span className={`inline-block bg-${color}-100 text-${color}-800 text-xs font-medium px-3 py-1 rounded-full capitalize`}>
                                {resource.resource_type.replace('_', ' ')}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 space-y-3">
                          <div className="flex items-start text-sm">
                            <FaFileAlt className="text-gray-400 mr-2 mt-1 flex-shrink-0" />
                            <p className="text-gray-600 line-clamp-2">{resource.description}</p>
                          </div>
                          
                          <div className="flex items-center text-sm">
                            <FaUser className="text-gray-400 mr-2 flex-shrink-0" />
                            <p className="text-gray-600">
                              <span className="font-medium">By:</span> {resource.uploaded_by}
                            </p>
                          </div>

                          <div className="flex items-center text-sm">
                            <FaCalendarAlt className="text-gray-400 mr-2 flex-shrink-0" />
                            <p className="text-gray-600">
                              <span className="font-medium">Uploaded:</span> {formatDate(resource.created_at)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-6">
                          <button
                            onClick={() => handleDownload(resource.file_url)}
                            className={`${buttonClasses} bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700`}
                          >
                            <FaDownload className="mr-2" />
                            Download Resource
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClassResources;
