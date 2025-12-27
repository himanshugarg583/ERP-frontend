import React, { useState, useEffect } from 'react';
import TeacherSidebar from './TeacherSidebar';
import Header from '../../components/comman_components/Header';
import { FaCloudUploadAlt, FaEdit, FaTrash, FaEye, FaPlus, FaSave, FaDownload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { 
  uploadTeacherSubjectResource, 
  getTeacherSubjectResources,
  getTeacherSubjectResourceById,
  updateTeacherSubjectResource,
  deleteTeacherSubjectResource,
  getAllClassesDropdown, 
  getSubjectsByClass 
} from '../../helper/requests-method/apiMethods';

const AssignmentForm = ({ editingId, newAssignment, subjects, classes, onChange, onFileChange, onSubmit, onClassChange }) => (
  <section className="mb-6">
    <h2 className="text-xl font-semibold mb-3 flex items-center">
      <FaPlus className="mr-2" /> {editingId ? "Edit Assignment" : "Upload New Assignment"}
    </h2>
    <form onSubmit={onSubmit} className="bg-gray-50 p-4 rounded-lg border">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input name="title" value={newAssignment?.title ?? ''} onChange={onChange} placeholder="Assignment Title" required />
        <SelectDropdown name="class_section_id" value={newAssignment?.class_section_id ?? ''} options={classes ?? []} onChange={onClassChange} label="Class" />
        <SelectDropdown name="subject_id" value={newAssignment?.subject_id ?? ''} options={subjects ?? []} onChange={onChange} label="Subject" disabled={!newAssignment?.class_section_id} />
        <Input type="date" name="due_date" value={newAssignment?.due_date ?? ''} onChange={onChange} required />
        <textarea 
          name="description" 
          value={newAssignment?.description ?? ''} 
          onChange={onChange} placeholder="Instructions..." rows="3" className="md:col-span-2 p-2 border rounded w-full" required />
        <div className="md:col-span-2 border-2 border-dashed border-gray-300 p-4 rounded text-center relative">
          <FaCloudUploadAlt className="text-4xl text-gray-400 mx-auto" />
          <p className="text-xs text-gray-500">{newAssignment?.file?.name ?? "Drag or click to upload"}</p>
          <input type="file" onChange={onFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>
      </div>
      <button type="submit" className="mt-4 bg-blue-600 text-white p-2 rounded flex items-center">
        {editingId ? <><FaSave className="mr-1" /> Save</> : <><FaPlus className="mr-1" /> Upload</>}
      </button>
    </form>
  </section>
);

const Input = ({ type = "text", name, value, onChange, placeholder, required }) => (
  <input type={type} name={name} 
    value={value ?? ''} onChange={onChange} placeholder={placeholder} className="p-2 border rounded w-full" required={required} />
);

const Select = ({ name, value, options, onChange }) => (
  (options?.length === 1) ? (
    <input type="text" value={options?.[0] ?? ''} 
      readOnly className="p-2 border rounded w-full bg-gray-100" />
  ) : (
    <select 
      name={name} value={value ?? ''} 
      onChange={onChange} className="p-2 border rounded w-full">
      {options?.map?.((opt) => <option key={opt} value={opt}>{opt}</option>) ?? []}
    </select>
  )
);

const SelectDropdown = ({ name, value, options, onChange, label, disabled }) => {
  const getDisplayText = (opt) => {
    if (opt.class_name && opt.section_name) {
      return `${opt.class_name} - ${opt.section_name}`;
    }
    return opt.class_name || opt.subject_name || opt.name || '';
  };

  const getOptionValue = (opt) => {
    return opt.subject_id || opt.id;
  };

  const getOptionKey = (opt) => {
    return opt.subject_id || opt.id;
  };

  return (
    <select 
      name={name} 
      value={value ?? ''} 
      onChange={onChange} 
      className="p-2 border rounded w-full"
      disabled={disabled}
      required
    >
      <option value="">Select {label}</option>
      {options?.map?.((opt) => (
        <option key={getOptionKey(opt)} value={getOptionValue(opt)}>
          {getDisplayText(opt)}
        </option>
      )) ?? []}
    </select>
  );
};

const AssignmentTable = ({ assignments, onEdit, onDelete, onView }) => (
  <section className="mb-6">
    <h2 className="text-xl font-semibold mb-3">Current Assignments</h2>
    <table className="min-w-full border rounded">
      <thead className="bg-gray-50">
        <tr>{["Assignment", "Subject", "Class", "Due Date", "Actions"].map(h => <th key={h} className="p-2 text-left text-xs text-gray-500">{h}</th>)}</tr>
      </thead>
      <tbody>
        {assignments?.map?.((a) => (
          <tr key={a?.resource_id} className="border-t">
            <td className="p-2">{a?.title ?? ''}</td>
            <td className="p-2">{a?.subject_name ?? ''}</td>
            <td className="p-2">{a?.class_display ?? ''}</td>
            <td className="p-2">{a?.due_date ? new Date(a.due_date).toLocaleDateString() : 'N/A'}</td>
            <td className="p-2 flex gap-2">
              <button onClick={() => onEdit(a)} title="Edit"><FaEdit className="text-indigo-600" /></button>
              <button onClick={() => onDelete(a?.resource_id)} title="Delete"><FaTrash className="text-red-600" /></button>
              <button onClick={() => onView(a)} title="View"><FaEye className="text-gray-600" /></button>
            </td>
          </tr>
        )) ?? []}
      </tbody>
    </table>
  </section>
);

const SubmissionCard = ({ assignment, isViewing, submissions, onView, isLate }) => {
  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement('a');
    link.download = fileName ?? '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-4 rounded border">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-medium">{assignment?.title ?? ''}</h3>
          <p className="text-sm text-gray-500">{assignment?.submissions ?? 0}/{assignment?.totalStudents ?? 0} submitted</p>
        </div>
        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800">
          {Math.round(((assignment?.submissions ?? 0) / (assignment?.totalStudents || 1)) * 100)}%
        </span>
      </div>
      <div className="mt-2 bg-gray-200 h-2 rounded">
        <div 
          className="bg-blue-600 h-2 rounded" 
          style={{ width: `${((assignment?.submissions ?? 0) / (assignment?.totalStudents || 1)) * 100}%` }}></div>
      </div>
      <button onClick={() => onView(assignment)} className="mt-2 text-sm text-blue-600 flex items-center">
        View Submissions <FaEye className="ml-1" />
      </button>
      {isViewing && (
        <div className="mt-2">
          <h4 className="text-lg font-semibold">Submissions</h4>
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>{["Name", "Submitted", "Status", "File"].map(h => <th key={h} className="p-2 text-left text-xs text-gray-700">{h}</th>)}</tr>
            </thead>
            <tbody>
              {(submissions?.[assignment?.id] ?? []).map((s, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2 text-sm">{s?.name ?? ''}</td>
                  <td className="p-2 text-sm">{s?.submittedAt ? new Date(s.submittedAt).toLocaleString() : ''}</td>
                  <td className="p-2 text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full ${isLate?.(s?.submittedAt, s?.dueDate) ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                      {isLate?.(s?.submittedAt, s?.dueDate) ? "Late" : "On Time"}
                    </span>
                  </td>
                  <td className="p-2 text-sm">
                    {s?.fileUrl ? (
                      <button onClick={() => handleDownload(s.fileUrl, s?.fileName)} className="text-blue-600 flex items-center">
                        <FaDownload className="mr-1" /> Download
                      </button>
                    ) : "No File"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const ViewAssignmentModal = ({ assignment, onClose }) => {
  if (!assignment) return null;
  
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Assignment Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="font-semibold text-gray-700">Title:</label>
            <p className="text-gray-600">{assignment.title}</p>
          </div>
          
          <div>
            <label className="font-semibold text-gray-700">Subject:</label>
            <p className="text-gray-600">{assignment.subject_name}</p>
          </div>
          
          <div>
            <label className="font-semibold text-gray-700">Class:</label>
            <p className="text-gray-600">{assignment.class_display}</p>
          </div>
          
          <div>
            <label className="font-semibold text-gray-700">Due Date:</label>
            <p className="text-gray-600">{assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'N/A'}</p>
          </div>
          
          <div>
            <label className="font-semibold text-gray-700">Description:</label>
            <p className="text-gray-600 whitespace-pre-wrap">{assignment.description}</p>
          </div>
          
          <div>
            <label className="font-semibold text-gray-700">Resource Type:</label>
            <p className="text-gray-600 capitalize">{assignment.resource_type}</p>
          </div>
          
          {assignment.file_url && (
            <div>
              <label className="font-semibold text-gray-700">Attachment:</label>
              <div className="mt-2">
                <a 
                  href={assignment.file_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <FaDownload className="mr-2" />
                  Download File
                </a>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <label className="font-semibold text-gray-700">Created At:</label>
              <p className="text-gray-600 text-sm">{new Date(assignment.created_at).toLocaleString()}</p>
            </div>
            <div>
              <label className="font-semibold text-gray-700">Updated At:</label>
              <p className="text-gray-600 text-sm">{new Date(assignment.updated_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const TeacherAssignment = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({ 
    title: "", 
    class_section_id: "", 
    subject_id: "", 
    due_date: "", 
    description: "", 
    file: null 
  });
  const [editingId, setEditingId] = useState(null);
  const [viewingSubmissions, setViewingSubmissions] = useState(null);
  const [viewingAssignment, setViewingAssignment] = useState(null);
  const studentSubmissions = {
    1: [
      { name: "Amit", submittedAt: "2023-10-20T10:00:00", dueDate: "2023-10-22", fileUrl: "https://example.com/amit_math.pdf", fileName: "amit_math.pdf" },
      { name: "Priya", submittedAt: "2023-10-21T15:30:00", dueDate: "2023-10-22", fileUrl: "https://example.com/priya_math.pdf", fileName: "priya_math.pdf" },
    ],
    2: [
      { name: "Rohan", submittedAt: "2023-10-19T09:15:00", dueDate: "2023-10-20", fileUrl: "https://example.com/rohan_algebra.pdf", fileName: "rohan_algebra.pdf" },
      { name: "Sneha", submittedAt: "2023-10-21T12:00:00", dueDate: "2023-10-20" }, 
    ],
  };

  useEffect(() => {
    fetchClasses();
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await getTeacherSubjectResources();
      if (response.success) {
        setAssignments(response.data?.resources || []);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to fetch assignments');
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await getAllClassesDropdown();
      if (response.success) {
        setClasses(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to fetch classes');
    }
  };

  const fetchSubjects = async (classId) => {
    try {
      const response = await getSubjectsByClass(classId);
      if (response.success) {
        setSubjects(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error('Failed to fetch subjects');
    }
  };

  const handleChange = (e) => setNewAssignment({ ...newAssignment, [e.target.name]: e.target.value });
  
  const handleClassChange = (e) => {
    const classId = e.target.value;
    setNewAssignment({ ...newAssignment, class_section_id: classId, subject_id: '' });
    if (classId) {
      fetchSubjects(classId);
    } else {
      setSubjects([]);
    }
  };
  
  const handleFileChange = (e) => setNewAssignment({ ...newAssignment, file: e.target.files?.[0] ?? null });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('class_section_id', newAssignment.class_section_id);
      formData.append('subject_id', newAssignment.subject_id);
      formData.append('title', newAssignment.title);
      formData.append('description', newAssignment.description || 'Assignment description');
      formData.append('resource_type', 'assignment');
      formData.append('due_date', newAssignment.due_date);
      
      if (newAssignment.file) {
        formData.append('file', newAssignment.file);
      }
      
      if (editingId) {
        const response = await updateTeacherSubjectResource(editingId, formData);
        if (response.success) {
          toast.success(response.message || 'Assignment updated successfully');
          fetchAssignments();
        }
        setEditingId(null);
      } else {
        const response = await uploadTeacherSubjectResource(formData);
        
        if (response.success) {
          toast.success(response.message || 'Assignment uploaded successfully');
          fetchAssignments();
        }
      }
      
      setNewAssignment({ 
        title: "", 
        class_section_id: "", 
        subject_id: "", 
        due_date: "", 
        description: "", 
        file: null 
      });
      setSubjects([]);
    } catch (error) {
      console.error('Error uploading assignment:', error);
      toast.error(error.response?.data?.message || 'Failed to upload assignment');
    }
  };
  const handleEdit = (a) => { 
    setEditingId(a?.resource_id ?? null);
    setNewAssignment({ 
      title: a?.title ?? '',
      class_section_id: a?.class_section_id ?? '',
      subject_id: a?.subject_id ?? '',
      due_date: a?.due_date ?? '',
      description: a?.description ?? '',
      file: null 
    });
    // Fetch subjects for the class
    if (a?.class_section_id) {
      fetchSubjects(a.class_section_id);
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    
    try {
      const response = await deleteTeacherSubjectResource(id);
      if (response.success) {
        toast.success(response.message || 'Assignment deleted successfully');
        fetchAssignments();
      }
    } catch (error) {
      console.error('Error deleting assignment:', error);
      toast.error(error.response?.data?.message || 'Failed to delete assignment');
    }
  };
  
  const handleView = async (a) => {
    try {
      const response = await getTeacherSubjectResourceById(a?.resource_id);
      if (response.success) {
        setViewingAssignment(response.data);
      }
    } catch (error) {
      console.error('Error fetching assignment details:', error);
      toast.error('Failed to fetch assignment details');
    }
  };
  
  const handleViewSubmissions = (a) => setViewingSubmissions(a?.id ?? null);
  const isLateSubmission = (submittedAt, dueDate) => (submittedAt && dueDate) ? new Date(submittedAt) > new Date(dueDate) : false;

  return (
    <div className="bg-gray-100 flex AddStudent">
      <TeacherSidebar />

      <div
        className=" overflow-auto relative z-1 flex-col"
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
          <div className="bg-white shadow rounded-lg p-4">
            <AssignmentForm 
              editingId={editingId} 
              newAssignment={newAssignment} 
              subjects={subjects} 
              classes={classes} 
              onChange={handleChange} 
              onFileChange={handleFileChange} 
              onSubmit={handleSubmit}
              onClassChange={handleClassChange} />
            <AssignmentTable 
              assignments={assignments} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
              onView={handleView}  />
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Student Submissions</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {assignments?.map?.((a) => (
                  <SubmissionCard 
                    key={a?.id} 
                    assignment={a} 
                    isViewing={viewingSubmissions === a?.id} 
                    submissions={studentSubmissions} 
                    onView={handleViewSubmissions} 
                    isLate={isLateSubmission} />
                )) ?? []}
              </div>
            </section>
          </div>
        </main>
      </div>
      
      {viewingAssignment && (
        <ViewAssignmentModal 
          assignment={viewingAssignment} 
          onClose={() => setViewingAssignment(null)} 
        />
      )}
    </div>
  );
};

export default TeacherAssignment;