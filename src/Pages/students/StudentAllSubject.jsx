import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getStudentSubjects } from '../../helper/requests-method/apiMethods';

const StudentAllSubject = () => {
  const [subjects, setSubjects] = useState([]);
  const [classInfo, setClassInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await getStudentSubjects();
      if (response.success && response.data) {
        setClassInfo(response.data.class_info);
        setSubjects(response.data.subjects || []);
      } else {
        toast.error(response.message || 'Failed to fetch subjects');
      }
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch subjects');
    } finally {
      setLoading(false);
    }
  };

  const SubjectCard = ({ subject, index }) => (
    <div key={index} className="p-4 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{subject.subject_name || subject.name}</h2>
          <p className="text-sm text-gray-600">Code: {subject.subject_code || subject.code}</p>
        </div>
      </div>
    </div>
  );


  return (
    <div className="p-6">
      <div className="w-full bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-indigo-600">
          {classInfo ? `${classInfo.display_name} - Subjects` : 'My Subjects'}
        </h1>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : subjects.length > 0 ? (
          <>
            {classInfo && (
              <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Class:</span> {classInfo.display_name} | 
                  <span className="font-medium ml-2">Room:</span> {classInfo.room_no || 'N/A'} | 
                  <span className="font-medium ml-2">Capacity:</span> {classInfo.capacity || 'N/A'}
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject, index) => <SubjectCard subject={subject} index={index} key={subject.subject_id || index} />)}
            </div>
            <div className="mt-6 text-center text-sm text-gray-600">
              Total Subjects: {subjects.length}
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No subjects found
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default StudentAllSubject;