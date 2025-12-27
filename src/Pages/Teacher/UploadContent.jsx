import React, { useState, useEffect } from 'react';
import TeacherSidebar from './TeacherSidebar';
import Header from '../../components/comman_components/Header';
import { FaCloudUploadAlt, FaEdit, FaTrash, FaEye, FaPlus, FaSave, FaDownload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { 
  uploadTeacherClassResource, 
  getTeacherClassResources,
  getTeacherClassResourceById,
  updateTeacherClassResource,
  deleteTeacherClassResource,
  getAllClassesDropdown
} from '../../helper/requests-method/apiMethods';

const ContentForm = ({ editingId, newContent, classes, onChange, onFileChange, onSubmit }) => (
  <section className="mb-6">
    <h2 className="text-xl font-semibold mb-3 flex items-center">
      <FaPlus className="mr-2" /> {editingId ? "Edit Content" : "Upload New Content"}
    </h2>
    <form onSubmit={onSubmit} className="bg-gray-50 p-4 rounded-lg border">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input name="title" value={newContent?.title ?? ''} onChange={onChange} placeholder="Content Title" required />
        <SelectDropdown name="class_section_id" value={newContent?.class_section_id ?? ''} options={classes ?? []} onChange={onChange} label="Class" />
        <Select name="resource_type" value={newContent?.resource_type ?? ''} options={['syllabus', 'notes', 'study_material']} onChange={onChange} label="Content Type" />
        <textarea 
          name="description" 
          value={newContent?.description ?? ''} 
          onChange={onChange} placeholder="Description..." rows="3" className="md:col-span-2 p-2 border rounded w-full" required />
        <div className="md:col-span-2 border-2 border-dashed border-gray-300 p-4 rounded text-center relative">
          <FaCloudUploadAlt className="text-4xl text-gray-400 mx-auto" />
          <p className="text-xs text-gray-500">{newContent?.file?.name ?? "Drag or click to upload"}</p>
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

const Select = ({ name, value, options, onChange, label }) => (
  <select 
    name={name} 
    value={value ?? ''} 
    onChange={onChange} 
    className="p-2 border rounded w-full"
    required
  >
    <option value="">Select {label}</option>
    {options?.map?.((opt) => (
      <option key={opt} value={opt}>
        {opt.replace('_', ' ').toUpperCase()}
      </option>
    )) ?? []}
  </select>
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

const ContentTable = ({ contents, onEdit, onDelete, onView }) => (
  <section className="mb-6">
    <h2 className="text-xl font-semibold mb-3">Uploaded Content</h2>
    <table className="min-w-full border rounded">
      <thead className="bg-gray-50">
        <tr>{["Title", "Class", "Type", "Actions"].map(h => <th key={h} className="p-2 text-left text-xs text-gray-500">{h}</th>)}</tr>
      </thead>
      <tbody>
        {contents?.map?.((c) => (
          <tr key={c?.resource_id} className="border-t">
            <td className="p-2">{c?.title ?? ''}</td>
            <td className="p-2">{c?.class_display ?? ''}</td>
            <td className="p-2 capitalize">{c?.resource_type?.replace('_', ' ') ?? ''}</td>
            <td className="p-2 flex gap-2">
              <button onClick={() => onEdit(c)} title="Edit"><FaEdit className="text-indigo-600" /></button>
              <button onClick={() => onDelete(c?.resource_id)} title="Delete"><FaTrash className="text-red-600" /></button>
              <button onClick={() => onView(c)} title="View"><FaEye className="text-gray-600" /></button>
            </td>
          </tr>
        )) ?? []}
      </tbody>
    </table>
  </section>
);

const ViewContentModal = ({ content, onClose }) => {
  if (!content) return null;
  
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Content Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="font-semibold text-gray-700">Title:</label>
            <p className="text-gray-600">{content.title}</p>
          </div>
          
          <div>
            <label className="font-semibold text-gray-700">Class:</label>
            <p className="text-gray-600">{content.class_display}</p>
          </div>
          
          <div>
            <label className="font-semibold text-gray-700">Content Type:</label>
            <p className="text-gray-600 capitalize">{content.resource_type?.replace('_', ' ')}</p>
          </div>
          
          <div>
            <label className="font-semibold text-gray-700">Description:</label>
            <p className="text-gray-600 whitespace-pre-wrap">{content.description}</p>
          </div>
          
          {content.file_url && (
            <div>
              <label className="font-semibold text-gray-700">Attachment:</label>
              <div className="mt-2">
                <a 
                  href={content.file_url} 
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
              <p className="text-gray-600 text-sm">{new Date(content.created_at).toLocaleString()}</p>
            </div>
            <div>
              <label className="font-semibold text-gray-700">Updated At:</label>
              <p className="text-gray-600 text-sm">{new Date(content.updated_at).toLocaleString()}</p>
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

const UploadContent = () => {
  const [classes, setClasses] = useState([]);
  const [contents, setContents] = useState([]);
  const [newContent, setNewContent] = useState({ 
    title: "", 
    class_section_id: "", 
    resource_type: "", 
    description: "", 
    file: null 
  });
  const [editingId, setEditingId] = useState(null);
  const [viewingContent, setViewingContent] = useState(null);

  useEffect(() => {
    fetchClasses();
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await getTeacherClassResources();
      if (response.success) {
        setContents(response.data?.resources || []);
      }
    } catch (error) {
      console.error('Error fetching contents:', error);
      toast.error('Failed to fetch contents');
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

  const handleChange = (e) => setNewContent({ ...newContent, [e.target.name]: e.target.value });
  
  const handleFileChange = (e) => setNewContent({ ...newContent, file: e.target.files?.[0] ?? null });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('class_section_id', newContent.class_section_id);
      formData.append('title', newContent.title);
      formData.append('description', newContent.description || 'Content description');
      formData.append('resource_type', newContent.resource_type);
      
      if (newContent.file) {
        formData.append('file', newContent.file);
      }
      
      if (editingId) {
        const response = await updateTeacherClassResource(editingId, formData);
        if (response.success) {
          toast.success(response.message || 'Content updated successfully');
          fetchContents();
        }
        setEditingId(null);
      } else {
        const response = await uploadTeacherClassResource(formData);
        
        if (response.success) {
          toast.success(response.message || 'Content uploaded successfully');
          fetchContents();
        }
      }
      
      setNewContent({ 
        title: "", 
        class_section_id: "", 
        resource_type: "", 
        description: "", 
        file: null 
      });
    } catch (error) {
      console.error('Error uploading content:', error);
      toast.error(error.response?.data?.message || 'Failed to upload content');
    }
  };

  const handleEdit = (c) => { 
    setEditingId(c?.resource_id ?? null);
    setNewContent({ 
      title: c?.title ?? '',
      class_section_id: c?.class_section_id ?? '',
      resource_type: c?.resource_type ?? '',
      description: c?.description ?? '',
      file: null 
    });
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this content?')) return;
    
    try {
      const response = await deleteTeacherClassResource(id);
      if (response.success) {
        toast.success(response.message || 'Content deleted successfully');
        fetchContents();
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error(error.response?.data?.message || 'Failed to delete content');
    }
  };
  
  const handleView = async (c) => {
    try {
      const response = await getTeacherClassResourceById(c?.resource_id);
      if (response.success) {
        setViewingContent(response.data);
      }
    } catch (error) {
      console.error('Error fetching content details:', error);
      toast.error('Failed to fetch content details');
    }
  };

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
            <ContentForm 
              editingId={editingId} 
              newContent={newContent} 
              classes={classes} 
              onChange={handleChange} 
              onFileChange={handleFileChange} 
              onSubmit={handleSubmit} />
            <ContentTable 
              contents={contents} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
              onView={handleView}  />
          </div>
        </main>
      </div>
      
      {viewingContent && (
        <ViewContentModal 
          content={viewingContent} 
          onClose={() => setViewingContent(null)} 
        />
      )}
    </div>
  );
};

export default UploadContent;
