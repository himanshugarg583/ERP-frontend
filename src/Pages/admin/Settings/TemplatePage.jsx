import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Sidebar from '../Sidebar';
import Header from '../../../components/comman_components/Header';
import Modal from '../../../components/comman_components/Modal';
import {
  createDocumentTemplateV2Thunk,
  listDocumentTemplatesV2Thunk,
  updateDocumentTemplateV2Thunk,
} from '../../../store/slices/examSlice';

const DEFAULT_FORM = {
  name: 'Report Card Template',
  document_type: 'report_card',
  template_config_text: '{\n  "layout": "default"\n}',
  is_active: true,
};

const DOCUMENT_TYPES = [
  { value: 'report_card', label: 'Report Card' },
  { value: 'admit_card', label: 'Admit Card' },
  { value: 'marksheet', label: 'Marksheet' },
  { value: 'certificate', label: 'Certificate' },
];

const parseTemplateConfig = (value) => {
  if (typeof value === 'object' && value !== null) return value;
  if (typeof value !== 'string') return {};
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
};

const toRows = (response) => {
  const source = Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response)
      ? response
      : [];

  return source.map((item) => ({
    id: item.id,
    name: item.name || '',
    document_type: item.document_type || 'report_card',
    template_config_obj: parseTemplateConfig(item.template_config),
    template_config_text: JSON.stringify(parseTemplateConfig(item.template_config), null, 2),
    is_active: Boolean(item.is_active),
    created_at: item.created_at,
    updated_at: item.updated_at,
  }));
};

const formatDateTime = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const TemplatePage = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [submittingCreate, setSubmittingCreate] = useState(false);
  const [submittingUpdate, setSubmittingUpdate] = useState(false);

  const [templates, setTemplates] = useState([]);
  const [createForm, setCreateForm] = useState(DEFAULT_FORM);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const activeCount = useMemo(
    () => templates.filter((item) => item.is_active).length,
    [templates]
  );

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await dispatch(listDocumentTemplatesV2Thunk({})).unwrap();
      setTemplates(toRows(response));
    } catch (error) {
      toast.error(error?.message || 'Failed to load templates');
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleCreateChange = (field, value) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditChange = (field, value) => {
    setEditForm((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };

  const handleCreateTemplate = async (event) => {
    event.preventDefault();

    if (!createForm.name.trim()) {
      toast.error('Template name is required');
      return;
    }

    let config;
    try {
      config = JSON.parse(createForm.template_config_text);
    } catch {
      toast.error('Template config must be valid JSON');
      return;
    }

    const payload = {
      name: createForm.name.trim(),
      document_type: createForm.document_type,
      template_config: config,
      is_active: Boolean(createForm.is_active),
    };

    try {
      setSubmittingCreate(true);
      const response = await dispatch(createDocumentTemplateV2Thunk(payload)).unwrap();
      toast.success(response?.message || 'Template created successfully');
      setCreateForm(DEFAULT_FORM);
      await loadTemplates();
    } catch (error) {
      toast.error(error?.message || 'Failed to create template');
    } finally {
      setSubmittingCreate(false);
    }
  };

  const openEditModal = (template) => {
    setEditForm({
      id: template.id,
      name: template.name,
      document_type: template.document_type,
      template_config_text: JSON.stringify(template.template_config_obj || {}, null, 2),
      is_active: Boolean(template.is_active),
    });
    setEditModalOpen(true);
  };

  const handleUpdateTemplate = async (event) => {
    event.preventDefault();

    if (!editForm?.id) return;
    if (!editForm.name.trim()) {
      toast.error('Template name is required');
      return;
    }

    let config;
    try {
      config = JSON.parse(editForm.template_config_text);
    } catch {
      toast.error('Template config must be valid JSON');
      return;
    }

    const payload = {
      name: editForm.name.trim(),
      document_type: editForm.document_type,
      template_config: config,
      is_active: Boolean(editForm.is_active),
    };

    try {
      setSubmittingUpdate(true);
      const response = await dispatch(
        updateDocumentTemplateV2Thunk({
          documentTemplateUuid: editForm.id,
          payload,
        })
      ).unwrap();

      toast.success(response?.message || 'Template updated successfully');
      setEditModalOpen(false);
      setEditForm(null);
      await loadTemplates();
    } catch (error) {
      toast.error(error?.message || 'Failed to update template');
    } finally {
      setSubmittingUpdate(false);
    }
  };

  return (
    <div className="bg-slate-200 flex AddStudent">
      <Sidebar />

      <div
        className="overflow-auto relative z-1 flex-col"
        style={{
          height: '95vh',
          width: '100vw',
          gap: '10px',
          display: 'flex',
          transition: 'margin-left 0.3s ease',
        }}
      >
        <Header />

        <main className="w-full py-4 md:py-6 px-4 md:px-6">
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-xl md:text-2xl font-semibold text-slate-800">Template Settings</h1>
                  <p className="text-sm text-slate-600">Manage exam document templates from /api/v2/admin/exam/templates</p>
                </div>
                <button
                  type="button"
                  onClick={loadTemplates}
                  className="px-4 py-2 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-lg"
                  disabled={loading}
                >
                  {loading ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Create Template</h2>

              <form onSubmit={handleCreateTemplate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                    <input
                      value={createForm.name}
                      onChange={(event) => handleCreateChange('name', event.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                      placeholder="Report Card Template"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Document Type</label>
                    <select
                      value={createForm.document_type}
                      onChange={(event) => handleCreateChange('document_type', event.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      {DOCUMENT_TYPES.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Template Config (JSON)</label>
                  <textarea
                    value={createForm.template_config_text}
                    onChange={(event) => handleCreateChange('template_config_text', event.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono text-xs"
                  />
                </div>

                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={createForm.is_active}
                    onChange={(event) => handleCreateChange('is_active', event.target.checked)}
                    className="w-4 h-4"
                  />
                  Active
                </label>

                <div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-60"
                    disabled={submittingCreate}
                  >
                    {submittingCreate ? 'Creating...' : 'Create Template'}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Template List</h2>
                <span className="text-sm text-slate-600">Total: {templates.length} | Active: {activeCount}</span>
              </div>

              {loading ? (
                <p className="text-sm text-slate-500">Loading templates...</p>
              ) : templates.length === 0 ? (
                <p className="text-sm text-slate-500">No templates found.</p>
              ) : (
                <div className="overflow-auto border border-slate-200 rounded-lg">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-100 text-slate-700">
                      <tr>
                        <th className="px-3 py-2 text-left">ID</th>
                        <th className="px-3 py-2 text-left">Name</th>
                        <th className="px-3 py-2 text-left">Type</th>
                        <th className="px-3 py-2 text-left">Config</th>
                        <th className="px-3 py-2 text-left">Status</th>
                        <th className="px-3 py-2 text-left">Updated</th>
                        <th className="px-3 py-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {templates.map((template) => (
                        <tr key={template.id} className="border-t border-slate-200 even:bg-slate-50">
                          <td className="px-3 py-2">{template.id}</td>
                          <td className="px-3 py-2">{template.name}</td>
                          <td className="px-3 py-2">{template.document_type}</td>
                          <td className="px-3 py-2">
                            <pre className="text-[11px] whitespace-pre-wrap break-all max-w-md">
                              {JSON.stringify(template.template_config_obj || {}, null, 2)}
                            </pre>
                          </td>
                          <td className="px-3 py-2">
                            <span className={`px-2 py-0.5 rounded text-xs ${template.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                              {template.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-3 py-2">{formatDateTime(template.updated_at)}</td>
                          <td className="px-3 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => openEditModal(template)}
                              className="px-3 py-1.5 text-xs rounded bg-indigo-600 text-white hover:bg-indigo-700"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <Modal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditForm(null);
        }}
        title="Edit Template"
        subtitle="PATCH /api/v2/admin/exam/templates/:documentTemplateId"
        size="lg"
      >
        {editForm && (
          <form onSubmit={handleUpdateTemplate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  value={editForm.name}
                  onChange={(event) => handleEditChange('name', event.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Document Type</label>
                <select
                  value={editForm.document_type}
                  onChange={(event) => handleEditChange('document_type', event.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {DOCUMENT_TYPES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Template Config (JSON)</label>
              <textarea
                value={editForm.template_config_text}
                onChange={(event) => handleEditChange('template_config_text', event.target.value)}
                rows={8}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono text-xs"
              />
            </div>

            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={editForm.is_active}
                onChange={(event) => handleEditChange('is_active', event.target.checked)}
                className="w-4 h-4"
              />
              Active
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setEditModalOpen(false);
                  setEditForm(null);
                }}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-60"
                disabled={submittingUpdate}
              >
                {submittingUpdate ? 'Updating...' : 'Update Template'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default TemplatePage;
