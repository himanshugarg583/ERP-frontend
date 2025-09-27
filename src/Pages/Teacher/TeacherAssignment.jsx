import React, { useState, useEffect } from 'react';
import Sidebar from './TeacherSidebar';
import Header from './TeacherHeader';
import { FaCloudUploadAlt, FaEdit, FaTrash, FaEye, FaPlus, FaSave, FaDownload } from 'react-icons/fa';

const AssignmentForm = ({ editingId, newAssignment, teacherSubjects, teacherClasses, onChange, onFileChange, onSubmit }) => (
  <section className="mb-6">
    <h2 className="text-xl font-semibold mb-3 flex items-center">
      <FaPlus className="mr-2" /> {editingId ? "Edit Assignment" : "Upload New Assignment"}
    </h2>
    <form onSubmit={onSubmit} className="bg-gray-50 p-4 rounded-lg border">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input name="title" value={newAssignment?.title ?? ''} onChange={onChange} placeholder="Assignment Title" required />
        <Select name="subject" value={newAssignment?.subject ?? ''} options={teacherSubjects ?? []} onChange={onChange} />
        <Select name="class" value={newAssignment?.class ?? ''} options={teacherClasses ?? []} onChange={onChange} />
        <Input type="date" name="dueDate" value={newAssignment?.dueDate ?? ''} onChange={onChange} required />
        <Input type="number" name="maxPoints" value={newAssignment?.maxPoints ?? ''} onChange={onChange} placeholder="100" required />
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

const AssignmentTable = ({ assignments, onEdit, onDelete, onView }) => (
  <section className="mb-6">
    <h2 className="text-xl font-semibold mb-3">Current Assignments</h2>
    <table className="min-w-full border rounded">
      <thead className="bg-gray-50">
        <tr>{["Assignment", "Subject", "Class", "Assigned", "Due", "Status", "Actions"].map(h => <th key={h} className="p-2 text-left text-xs text-gray-500">{h}</th>)}</tr>
      </thead>
      <tbody>
        {assignments?.map?.((a) => (
          <tr key={a?.id} className="border-t">
            <td className="p-2">{a?.title ?? ''}</td>
            <td className="p-2">{a?.subject ?? ''}</td>
            <td className="p-2">{a?.class ?? ''}</td>
            <td className="p-2">{a?.assignedDate ?? ''}</td>
            <td className="p-2">{a?.dueDate ?? ''}</td>
            <td className="p-2">
              <span className={`px-2 py-1 text-xs rounded-full ${a?.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                {a?.status ?? ''}
              </span>
            </td>
            <td className="p-2 flex gap-2">
              <button onClick={() => onEdit(a)}><FaEdit className="text-indigo-600" /></button>
              <button onClick={() => onDelete(a?.id)}><FaTrash className="text-red-600" /></button>
              <button onClick={() => onView(a)}><FaEye className="text-gray-600" /></button>
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

const TeacherAssignment = () => {
  const teacherSubjects = ["Mathematics"];
  const teacherClasses = ["Class 10A", "Class 10B"];
  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem('assignments');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: "Mathematical Equations", subject: "Mathematics", class: "Class 10A", assignedDate: "15 Oct 2023", dueDate: "22 Oct 2023", status: "Active", submissions: 23, totalStudents: 30 },
      { id: 2, title: "Algebra Basics", subject: "Mathematics", class: "Class 10B", assignedDate: "10 Oct 2023", dueDate: "20 Oct 2023", status: "Active", submissions: 18, totalStudents: 30 },
    ];
  });
  const [newAssignment, setNewAssignment] = useState({ 
    title: "", 
    subject: teacherSubjects?.[0] ?? '', 
    class: teacherClasses?.[0] ?? '', 
    dueDate: "", 
    maxPoints: "", 
    description: "", 
    file: null 
  });
  const [editingId, setEditingId] = useState(null);
  const [viewingSubmissions, setViewingSubmissions] = useState(null);
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

  useEffect(() => localStorage.setItem('assignments', JSON.stringify(assignments ?? [])), [assignments]);

  const handleChange = (e) => setNewAssignment({ ...newAssignment, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setNewAssignment({ ...newAssignment, file: e.target.files?.[0] ?? null });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setAssignments(assignments?.map?.((a) => a.id === editingId ? { ...a, ...newAssignment } : a) ?? []);
      setEditingId(null);
    } else {
      setAssignments([...(assignments ?? []), { 
        id: (assignments?.length ?? 0) + 1, 
        ...newAssignment, 
        assignedDate: new Date().toLocaleDateString(), 
        status: "Active", 
        submissions: 0, 
        totalStudents: 30 
      }]);
    }
    setNewAssignment({ 
      title: "", 
      subject: teacherSubjects?.[0] ?? '', 
      class: teacherClasses?.[0] ?? '', 
      dueDate: "", 
      maxPoints: "", 
      description: "", 
      file: null 
    });
  };
  const handleEdit = (a) => { 
    setEditingId(a?.id ?? null); 
    setNewAssignment({ ...a, maxPoints: "100", description: "Edit this description", file: null }); 
  };
  const handleDelete = (id) => setAssignments(assignments?.filter?.((a) => a.id !== id) ?? []);
  const handleView = (a) => setNewAssignment({ ...a, maxPoints: "100", description: "View or edit this description", file: null });
  const handleViewSubmissions = (a) => setViewingSubmissions(a?.id ?? null);
  const isLateSubmission = (submittedAt, dueDate) => (submittedAt && dueDate) ? new Date(submittedAt) > new Date(dueDate) : false;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <Header />
        <main className="p-4">
          <div className="bg-white shadow rounded-lg p-4">
            <AssignmentForm 
              editingId={editingId} 
              newAssignment={newAssignment} 
              teacherSubjects={teacherSubjects} 
              teacherClasses={teacherClasses} 
              onChange={handleChange} 
              onFileChange={handleFileChange} 
              onSubmit={handleSubmit} />
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
    </div>
  );
};

export default TeacherAssignment;