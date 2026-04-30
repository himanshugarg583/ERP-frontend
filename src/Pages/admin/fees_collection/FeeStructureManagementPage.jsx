import React, { memo, useEffect, useMemo, useState } from "react";
import {
  createFeeStructure,
  deleteFeeStructure,
  getAcademicYearsDropdown,
  getAllFeeStructures,
  getClassSectionDropdown,
  getFeeHeadsDropdown,
  getFeeStructureById,
  updateFeeStructure,
} from "../../../helper/requests-method/feeV1Api";
import Modal from "../../../components/comman_components/Modal";
import PageHeader from "../../../components/comman_components/PageHeader";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import Footer from "../../../components/comman_components/Footer";
import ReusableTable from "../../../components/comman_components/ReusableTable";
import { AlertCircle, CheckCircle, Edit2, Eye, Plus, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";

const createDefaultInstallment = (index = 1) => ({
  name: `Term ${index}`,
  installment_number: index,
  start_date: "",
  due_date: "",
  percentage: 100,
  allow_partial_payment: true,
  late_fine_type: "none",
  late_fine_value: 0,
  grace_period_days: 0,
});

const resolveStructureType = (installments = []) =>
  installments.length <= 1 ? "onetime" : "recurring";

const getInitialForm = () => ({
  name: "",
  academic_year_id: "",
  class_id: "",
  description: "",
  is_active: true,
  items: [],
  installments: [createDefaultInstallment(1)],
});

const FeeStructureManagement = () => {
  const [feeStructures, setFeeStructures] = useState([]);
  const [feeHeads, setFeeHeads] = useState([]);
  const [classSections, setClassSections] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [currentFeeStructure, setCurrentFeeStructure] = useState(null);
  const [viewFeeStructure, setViewFeeStructure] = useState(null);
  const [form, setForm] = useState(getInitialForm());

  const classLabelMap = useMemo(() => {
    const map = new Map();
    classSections.forEach((section) => {
      const id = section.id || section._id;
      if (!id) return;
      map.set(String(id), section.label || `${section.class_name || ""}-${section.section_name || ""}`);
    });
    return map;
  }, [classSections]);

  const academicYearLabelMap = useMemo(() => {
    const map = new Map();
    academicYears.forEach((year) => {
      map.set(String(year.id), year.name || "-");
    });
    return map;
  }, [academicYears]);

  const resetFormState = () => {
    setForm((prev) => ({
      ...getInitialForm(),
      academic_year_id: prev.academic_year_id || selectedAcademicYearId || "",
    }));
    setEditMode(false);
    setCurrentFeeStructure(null);
  };

  const fetchDropdowns = async () => {
    try {
      const [classSectionsResponse, feeHeadsResponse, academicYearsResponse] = await Promise.all([
        getClassSectionDropdown(),
        getFeeHeadsDropdown(),
        getAcademicYearsDropdown(),
      ]);

      const classSectionRows = classSectionsResponse?.data || [];
      const feeHeadRows = feeHeadsResponse?.data || [];
      const academicYearRows = academicYearsResponse?.data || [];

      setClassSections(classSectionRows);
      setFeeHeads(feeHeadRows);
      setAcademicYears(academicYearRows);

      const currentAcademicYear = academicYearRows.find((year) => year.is_current);
      const fallbackAcademicYear = academicYearRows[0];
      const initialAcademicYear = currentAcademicYear?.id || fallbackAcademicYear?.id || "";

      if (initialAcademicYear) {
        setSelectedAcademicYearId(String(initialAcademicYear));
        setForm((prev) => ({ ...prev, academic_year_id: String(initialAcademicYear) }));
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Failed to fetch dropdown values";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const fetchFeeStructures = async (academicYearId = selectedAcademicYearId) => {
    setLoading(true);
    setError("");

    try {
      const response = await getAllFeeStructures({
        academic_year_id: academicYearId,
      });

      let structures = [];
      if (response?.data?.feeStructures && Array.isArray(response.data.feeStructures)) {
        structures = response.data.feeStructures;
      } else if (Array.isArray(response?.feeStructures)) {
        structures = response.feeStructures;
      } else if (Array.isArray(response?.data)) {
        structures = response.data;
      } else if (Array.isArray(response)) {
        structures = response;
      }

      setFeeStructures(structures);
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Failed to fetch fee structures";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdowns();
  }, []);

  useEffect(() => {
    if (selectedAcademicYearId) {
      fetchFeeStructures(selectedAcademicYearId);
    }
  }, [selectedAcademicYearId]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }

    return undefined;
  }, [success, error]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          fee_head_id: "",
          amount: "",
          is_mandatory: true,
          sort_order: prev.items.length + 1,
        },
      ],
    }));
  };

  const handleRemoveItem = (index) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index),
    }));
  };

  const handleItemChange = (index, field, value) => {
    setForm((prev) => {
      const nextItems = [...prev.items];
      nextItems[index] = {
        ...nextItems[index],
        [field]: field === "is_mandatory" ? value : value,
      };
      return {
        ...prev,
        items: nextItems,
      };
    });
  };

  const handleAddInstallment = () => {
    setForm((prev) => ({
      ...prev,
      installments: [...prev.installments, createDefaultInstallment(prev.installments.length + 1)],
    }));
  };

  const handleRemoveInstallment = (index) => {
    setForm((prev) => ({
      ...prev,
      installments: prev.installments.filter((_, idx) => idx !== index),
    }));
  };

  const handleInstallmentChange = (index, field, value) => {
    setForm((prev) => {
      const nextInstallments = [...prev.installments];
      nextInstallments[index] = {
        ...nextInstallments[index],
        [field]: field === "allow_partial_payment" ? value : value,
      };

      return {
        ...prev,
        installments: nextInstallments,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.academic_year_id || !form.class_id) {
      const validationMessage = "Please fill structure name, academic year, and class/section";
      setError(validationMessage);
      toast.error(validationMessage);
      return;
    }

    if (form.items.length === 0) {
      const validationMessage = "Please add at least one fee item";
      setError(validationMessage);
      toast.error(validationMessage);
      return;
    }

    if (form.installments.length === 0) {
      const validationMessage = "Please add at least one installment";
      setError(validationMessage);
      toast.error(validationMessage);
      return;
    }

    const structureType = resolveStructureType(form.installments);
    const payload = {
      name: form.name.trim(),
      academic_year_id: Number(form.academic_year_id),
      class_id: Number(form.class_id),
      description: form.description?.trim() || "",
      structure_type: structureType,
      items: form.items.map((item, idx) => ({
        fee_head_id: Number(item.fee_head_id),
        amount: Number(item.amount),
        is_mandatory: item.is_mandatory !== false,
        sort_order: Number(item.sort_order || idx + 1),
      })),
      installments: form.installments.map((installment, idx) => ({
        name: installment.name || `Term ${idx + 1}`,
        installment_number: Number(installment.installment_number || idx + 1),
        start_date: installment.start_date,
        due_date: installment.due_date,
        percentage: Number(installment.percentage || 0),
        allow_partial_payment: installment.allow_partial_payment !== false,
        late_fine_type: installment.late_fine_type || "none",
        late_fine_value: Number(installment.late_fine_value || 0),
        grace_period_days: Number(installment.grace_period_days || 0),
      })),
    };

    if (editMode) {
      payload.is_active = Boolean(form.is_active);
    }

    setSubmitLoading(true);
    setError("");
    setSuccess("");

    try {
      if (editMode && currentFeeStructure) {
        const response = await updateFeeStructure(currentFeeStructure.id || currentFeeStructure._id, payload);
        const message = response?.message || "Fee structure updated successfully";
        setSuccess(message);
        toast.success(message);
      } else {
        const response = await createFeeStructure(payload);
        const message = response?.message || "Fee structure created successfully";
        setSuccess(message);
        toast.success(message);
      }

      setIsModalOpen(false);
      resetFormState();
      fetchFeeStructures();
    } catch (err) {
      const errorMessage = err?.response?.data?.message || `Failed to ${editMode ? "update" : "create"} fee structure`;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitLoading(false);
    }
  };

  const loadFeeStructureById = async (id) => {
    const response = await getFeeStructureById(id);
    return response?.feeStructure || response?.data?.feeStructure || response?.data || null;
  };

  const handleView = async (feeStructure) => {
    const feeStructureId = feeStructure?.id || feeStructure?._id;
    if (!feeStructureId) return;

    setDetailsLoading(true);
    setError("");
    try {
      const details = await loadFeeStructureById(feeStructureId);
      if (!details) throw new Error("Fee structure details are unavailable");
      setViewFeeStructure(details);
      setIsViewModalOpen(true);
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to fetch fee structure details";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleEdit = async (feeStructure) => {
    const feeStructureId = feeStructure?.id || feeStructure?._id;
    if (!feeStructureId) return;

    setDetailsLoading(true);
    setError("");
    try {
      const details = await loadFeeStructureById(feeStructureId);
      if (!details) throw new Error("Fee structure details are unavailable");

      setCurrentFeeStructure(details);
      setForm({
        name: details.name || "",
        academic_year_id: details.academic_year_id ? String(details.academic_year_id) : "",
        class_id: details.class_id ? String(details.class_id) : details.class_section_id ? String(details.class_section_id) : "",
        description: details.description || "",
        is_active: details.is_active !== false,
        items: (details.items || details.fee_details || details.feeDetails || []).map((item, idx) => ({
          fee_head_id: item.fee_head_id ? String(item.fee_head_id) : "",
          amount: item.amount || "",
          is_mandatory: item.is_mandatory !== false,
          sort_order: item.sort_order || item.sequence_order || idx + 1,
        })),
        installments: (details.installments || []).length
          ? details.installments.map((installment, idx) => ({
              name: installment.name || `Term ${idx + 1}`,
              installment_number: installment.installment_number || idx + 1,
              start_date: installment.start_date || "",
              due_date: installment.due_date || "",
              percentage: installment.percentage || 0,
              allow_partial_payment: installment.allow_partial_payment !== false,
              late_fine_type: installment.late_fine_type || "none",
              late_fine_value: installment.late_fine_value || 0,
              grace_period_days: installment.grace_period_days || 0,
            }))
          : [createDefaultInstallment(1)],
      });

      setEditMode(true);
      setIsModalOpen(true);
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to fetch fee structure details";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleDelete = async (feeStructure) => {
    const feeStructureId = feeStructure?.id || feeStructure?._id;
    if (!feeStructureId) return;

    if (!window.confirm("Are you sure you want to delete this fee structure?")) return;

    setError("");
    setSuccess("");
    try {
      const response = await deleteFeeStructure(feeStructureId);
      const message = response?.message || "Fee structure deleted successfully";
      setSuccess(message);
      toast.success(message);
      fetchFeeStructures();
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Failed to delete fee structure";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const openAddModal = () => {
    setForm((prev) => ({
      ...getInitialForm(),
      academic_year_id: selectedAcademicYearId || prev.academic_year_id || "",
    }));
    setEditMode(false);
    setCurrentFeeStructure(null);
    setIsModalOpen(true);
  };

  const tableData = useMemo(() => {
    return feeStructures.map((structure, index) => ({
      id: structure.id || structure._id || index + 1,
      name: structure.name || "-",
      class_section_name:
        structure.class_name ||
        (structure.classSection?.class_name && structure.classSection?.section_name
          ? `${structure.classSection.class_name}-${structure.classSection.section_name}`
          : classLabelMap.get(String(structure.class_id || structure.class_section_id || "")) || "-"),
      total_amount: Number(structure.total_amount || 0),
      fee_head_count: Array.isArray(structure.fee_heads)
        ? structure.fee_heads.length
        : Array.isArray(structure.items)
        ? structure.items.length
        : 0,
      status: structure.is_active !== false ? "Active" : "Inactive",
      raw: structure,
    }));
  }, [classLabelMap, feeStructures]);

  const tableColumns = useMemo(
    () => [
      { key: "name", header: "Structure Name" },
      {
        key: "total_amount",
        header: "Amount",
        render: (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`,
      },
      { key: "class_section_name", header: "Class/Section Name" },
      { key: "fee_head_count", header: "Fee Heads Included" },
      {
        key: "status",
        header: "Status",
        render: (value) => (
          <span
            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
              String(value).toLowerCase() === "active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        key: "actions",
        header: "Actions",
        render: (_, row) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleView(row.raw)}
              disabled={detailsLoading}
              className="p-2 text-violet-600 hover:bg-violet-50 rounded-lg transition-colors cursor-pointer"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleEdit(row.raw)}
              disabled={detailsLoading}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(row.raw)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    [detailsLoading]
  );

  return (
    <div className="bg-gray-100 flex">
      <Sidebar />

      <div
        className="overflow-auto relative z-1 flex flex-col"
        style={{
          height: "100vh",
          width: "100vw",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Header />

        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <PageHeader pageheading="Fee Management" Subheading="Fee Structure Management" />
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="w-full md:w-80">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year Filter</label>
                  <select
                    value={selectedAcademicYearId}
                    onChange={(e) => setSelectedAcademicYearId(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  >
                    <option value="">All Academic Years</option>
                    {academicYears.map((year) => (
                      <option key={year.id} value={year.id}>
                        {year.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={openAddModal}
                  className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors shadow-sm font-medium cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                  Add Fee Structure
                </button>
              </div>
            </div>

            <ReusableTable
              title="Fee Structures"
              columns={tableColumns}
              displayColumns={tableColumns}
              initialData={tableData}
              searchPlaceholder="Search fee structures..."
              exportFileName="fee_structures"
              showActions={{ add: false, edit: false, delete: false, view: false }}
            />

            {loading && (
              <div className="mt-4 text-sm text-gray-600">Loading fee structures...</div>
            )}

            <Modal
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                resetFormState();
              }}
              title={editMode ? "Edit Fee Structure" : "Add Fee Structure"}
              subtitle={editMode ? "Update recurring fee structure" : "Create recurring fee structure"}
              size="xl"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Structure Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Class 10 Annual Fee"
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Academic Year <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="academic_year_id"
                        value={form.academic_year_id}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      >
                        <option value="">Select Academic Year</option>
                        {academicYears.map((year) => (
                          <option key={year.id} value={year.id}>
                            {year.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Class/Section <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="class_id"
                        value={form.class_id}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      >
                        <option value="">Select Class/Section</option>
                        {classSections.map((section) => (
                          <option key={section.id || section._id} value={section.id || section._id}>
                            {section.label || `${section.class_name}-${section.section_name}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Add fee structure description"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                      />
                    </div>

                    {editMode && (
                      <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          name="is_active"
                          checked={form.is_active}
                          onChange={handleChange}
                          className="w-4 h-4"
                        />
                        Active
                      </label>
                    )}
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Fee Items</h3>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="flex items-center gap-2 px-3 py-1.5 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add Item
                    </button>
                  </div>

                  {form.items.length === 0 ? (
                    <p className="text-sm text-gray-500">No items added yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {form.items.map((item, index) => (
                        <div key={`item-${index}`} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Fee Head</label>
                              <select
                                value={item.fee_head_id}
                                onChange={(e) => handleItemChange(index, "fee_head_id", e.target.value)}
                                required
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                              >
                                <option value="">Select</option>
                                {feeHeads.map((head) => (
                                  <option key={head.id} value={head.id}>
                                    {head.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Amount</label>
                              <input
                                type="number"
                                value={item.amount}
                                onChange={(e) => handleItemChange(index, "amount", e.target.value)}
                                required
                                min="0"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Sort Order</label>
                              <input
                                type="number"
                                value={item.sort_order}
                                onChange={(e) => handleItemChange(index, "sort_order", e.target.value)}
                                required
                                min="1"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                              />
                            </div>

                            <div className="flex items-end justify-between gap-2">
                              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                                <input
                                  type="checkbox"
                                  checked={item.is_mandatory}
                                  onChange={(e) => handleItemChange(index, "is_mandatory", e.target.checked)}
                                  className="w-4 h-4"
                                />
                                Mandatory
                              </label>
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(index)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Installments</h3>
                    <button
                      type="button"
                      onClick={handleAddInstallment}
                      className="flex items-center gap-2 px-3 py-1.5 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add Installment
                    </button>
                  </div>

                  <div className="space-y-3">
                    {form.installments.map((installment, index) => (
                      <div key={`installment-${index}`} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                            <input
                              type="text"
                              value={installment.name}
                              onChange={(e) => handleInstallmentChange(index, "name", e.target.value)}
                              required
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Installment No.</label>
                            <input
                              type="number"
                              value={installment.installment_number}
                              onChange={(e) => handleInstallmentChange(index, "installment_number", e.target.value)}
                              required
                              min="1"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Percentage</label>
                            <input
                              type="number"
                              value={installment.percentage}
                              onChange={(e) => handleInstallmentChange(index, "percentage", e.target.value)}
                              required
                              min="0"
                              max="100"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                            <input
                              type="date"
                              value={installment.start_date}
                              onChange={(e) => handleInstallmentChange(index, "start_date", e.target.value)}
                              required
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Due Date</label>
                            <input
                              type="date"
                              value={installment.due_date}
                              onChange={(e) => handleInstallmentChange(index, "due_date", e.target.value)}
                              required
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Late Fine Type</label>
                            <select
                              value={installment.late_fine_type}
                              onChange={(e) => handleInstallmentChange(index, "late_fine_type", e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                            >
                              <option value="none">None</option>
                              <option value="flat">Flat</option>
                              <option value="percentage">Percentage</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Late Fine Value</label>
                            <input
                              type="number"
                              value={installment.late_fine_value}
                              onChange={(e) => handleInstallmentChange(index, "late_fine_value", e.target.value)}
                              min="0"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                          </div>

                          <div>
                            <label className="inline-flex items-center gap-2 text-sm text-gray-700 mt-6">
                              <input
                                type="checkbox"
                                checked={installment.allow_partial_payment}
                                onChange={(e) =>
                                  handleInstallmentChange(index, "allow_partial_payment", e.target.checked)
                                }
                                className="w-4 h-4"
                              />
                              Allow Partial Payment
                            </label>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Grace Period (days)</label>
                            <input
                              type="number"
                              value={installment.grace_period_days}
                              onChange={(e) =>
                                handleInstallmentChange(index, "grace_period_days", e.target.value)
                              }
                              min="0"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                          </div>

                          <div className="flex items-end justify-end">
                            <button
                              type="button"
                              onClick={() => handleRemoveInstallment(index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetFormState();
                    }}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="flex-1 px-4 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
                  >
                    {submitLoading ? (editMode ? "Updating..." : "Creating...") : editMode ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </Modal>

            <Modal
              isOpen={isViewModalOpen}
              onClose={() => {
                setIsViewModalOpen(false);
                setViewFeeStructure(null);
              }}
              title="Fee Structure Details"
              subtitle="Complete details of selected fee structure"
              size="lg"
            >
              {viewFeeStructure && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Structure ID</label>
                      <p className="text-base font-semibold text-gray-900">{viewFeeStructure.id || "-"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                      <p className="text-base font-semibold text-gray-900">{viewFeeStructure.name || "-"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Academic Year</label>
                      <p className="text-base font-semibold text-gray-900">
                        {academicYearLabelMap.get(String(viewFeeStructure.academic_year_id || "")) ||
                          (viewFeeStructure.academic_year_id ? String(viewFeeStructure.academic_year_id) : "-")}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Class/Section</label>
                      <p className="text-base text-gray-700">
                        {classLabelMap.get(String(viewFeeStructure.class_id || viewFeeStructure.class_section_id || "")) ||
                          viewFeeStructure.class_name ||
                          (viewFeeStructure.classSection?.class_name && viewFeeStructure.classSection?.section_name
                            ? `${viewFeeStructure.classSection.class_name}-${viewFeeStructure.classSection.section_name}`
                            : "-")}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Class ID</label>
                      <p className="text-base text-gray-700">{viewFeeStructure.class_id || "-"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Structure Type</label>
                      <p className="text-base text-gray-700">{viewFeeStructure.structure_type || "-"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Total Amount</label>
                      <p className="text-base font-semibold text-gray-900">
                        Rs. {Number(viewFeeStructure.total_amount || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                      <p className="text-base text-gray-700">
                        {viewFeeStructure.is_active === false ? "Inactive" : "Active"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Created At</label>
                      <p className="text-base text-gray-700">{viewFeeStructure.created_at || "-"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Updated At</label>
                      <p className="text-base text-gray-700">{viewFeeStructure.updated_at || "-"}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {viewFeeStructure.description || "No description available"}
                    </p>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">Fee Heads</h4>
                    {((viewFeeStructure.fee_heads && viewFeeStructure.fee_heads.length > 0)
                      ? viewFeeStructure.fee_heads
                      : viewFeeStructure.items || viewFeeStructure.feeDetails || []).length === 0 ? (
                      <p className="text-sm text-gray-500">No fee heads available</p>
                    ) : (
                      <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="min-w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">ID</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Head Name</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Sort Order</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-100">
                            {((viewFeeStructure.fee_heads && viewFeeStructure.fee_heads.length > 0)
                              ? viewFeeStructure.fee_heads
                              : viewFeeStructure.items || viewFeeStructure.feeDetails || []).map((item, index) => (
                              <tr key={`view-fee-head-${index}`}>
                                <td className="px-4 py-3 text-gray-700">{item.id || item.fee_head_id || "-"}</td>
                                <td className="px-4 py-3 text-gray-900 font-medium">
                                  {item.name ||
                                    item.feeHead?.name ||
                                    feeHeads.find((head) => head.id === item.fee_head_id)?.name ||
                                    "Fee Head"}
                                </td>
                                <td className="px-4 py-3 text-gray-900">
                                  Rs. {Number(item.amount || 0).toLocaleString("en-IN")}
                                </td>
                                <td className="px-4 py-3 text-gray-700">
                                  {item.sort_order || item.sequence_order || index + 1}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">Installments</h4>
                    {(viewFeeStructure.installments || []).length === 0 ? (
                      <p className="text-sm text-gray-500">No installments available</p>
                    ) : (
                      <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="min-w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">ID</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Installment #</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Start Date</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">End Date</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Percentage</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Allow Partial</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Fixed Amount</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Late Fine</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-100">
                            {(viewFeeStructure.installments || []).map((installment, index) => (
                              <tr key={`view-installment-${index}`}>
                                <td className="px-4 py-3 text-gray-700">{installment.id || "-"}</td>
                                <td className="px-4 py-3 text-gray-900 font-medium">{installment.name || "-"}</td>
                                <td className="px-4 py-3 text-gray-700">{installment.installment_number || "-"}</td>
                                <td className="px-4 py-3 text-gray-700">{installment.start_date || "-"}</td>
                                <td className="px-4 py-3 text-gray-700">{installment.due_date || "-"}</td>
                                <td className="px-4 py-3 text-gray-700">{installment.percentage || 0}%</td>
                                <td className="px-4 py-3 text-gray-700">
                                  {installment.allow_partial_payment ? "Yes" : "No"}
                                </td>
                                <td className="px-4 py-3 text-gray-700">
                                  {installment.fixed_amount !== null && installment.fixed_amount !== undefined
                                    ? `Rs. ${Number(installment.fixed_amount).toLocaleString("en-IN")}`
                                    : "-"}
                                </td>
                                <td className="px-4 py-3 text-gray-700">
                                  {`${installment.late_fine_type || "none"} (${installment.late_fine_value || 0})`}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setIsViewModalOpen(false);
                        handleEdit(viewFeeStructure);
                      }}
                      className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
                    >
                      Edit Structure
                    </button>
                    <button
                      onClick={() => {
                        setIsViewModalOpen(false);
                        setViewFeeStructure(null);
                      }}
                      className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </Modal>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

const FeeStructureManagementPage = memo(FeeStructureManagement);

export default FeeStructureManagementPage;
