import {
  authorizedDelete,
  authorizedGet,
  authorizedPost,
  authorizedPut,
  getAllClassesDropdown as getAllClassesDropdownBase,
  getStudentsByClass as getStudentsByClassBase,
} from "./apiMethods";

const FEES_BASE = "/api/v1/fees";
const ADMIN_FEE_HEADS_BASE = "/api/admin/fees/fee-heads";
const ADMIN_FEE_STRUCTURES_BASE = "/api/admin/fees/fee-structures";
const ADMIN_FEES_DROPDOWN_BASE = "/api/admin/fees/dropdown";
const ADMIN_FEES_BASE = "/api/admin/fees";
const ADMIN_FEE_ASSIGNMENTS_BASE = "/api/admin/fees/assignments";
const ADMIN_STUDENT_FEE_ASSIGNMENT_BASE = "/api/admin/fees/students/assignment";
const ADMIN_FEE_PAYMENTS_BASE = "/api/admin/fees/payments";
const ADMIN_FEE_PAYMENTS_COLLECT_BASE = "/api/admin/fees/payments/collect";
const STUDENT_FEES_BASE = "/api/student/fees";
const ASSIGNMENT_CACHE_KEY = "fee-v1:assignments";
const DEFAULT_ACADEMIC_YEAR_ID = "00000000-0000-0000-0000-000000000008";

const safeParseJson = (value, fallback = null) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const toArray = (value) => (Array.isArray(value) ? value : []);
const extractArray = (...values) => {
  for (const value of values) {
    if (Array.isArray(value)) return value;
  }
  return [];
};
const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeStudentInvoice = (invoice = {}, index = 0) => ({
  invoice_id: invoice.invoice_id || invoice.id || index + 1,
  invoice_number: invoice.invoice_number || invoice.invoice_no || `INV-${index + 1}`,
  invoice_no: invoice.invoice_no || invoice.invoice_number || String(index + 1),
  installment_plan_id: invoice.installment_plan_id || invoice.installment_id || null,
  installment_name: invoice.installment_name || invoice.installment?.name || "",
  installment_number: invoice.installment_number || invoice.installment?.installment_number || null,
  due_date: invoice.due_date || invoice.installment?.due_date || null,
  start_date: invoice.start_date || invoice.installment?.start_date || null,
  status: String(invoice.status || "pending").toLowerCase(),
  gross_amount: toNumber(invoice.gross_amount),
  concession_amount: toNumber(invoice.concession_amount),
  net_amount: toNumber(invoice.net_amount),
  paid_amount: toNumber(invoice.paid_amount),
  balance_amount: toNumber(invoice.balance_amount),
  fine_type: invoice.fine_type || invoice.late_fine_type || null,
  calculated_fine: toNumber(invoice.calculated_fine),
  payable_amount: toNumber(
    invoice.payable_amount,
    toNumber(invoice.balance_amount) + toNumber(invoice.calculated_fine)
  ),
  installment: invoice.installment || null,
  items: toArray(invoice.items),
  payments: toArray(invoice.payments),
});

const toIsoDate = (value) => {
  if (!value) return "";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().split("T")[0];
};

const nowIso = () => new Date().toISOString();

const getUserFromStorage = () => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("userData");
  return safeParseJson(raw, null);
};

const resolveStudentId = (studentId) => {
  if (studentId) return studentId;
  const user = getUserFromStorage();
  return user?.id || user?.student_id || user?.studentId || "";
};

const resolveAcademicYearId = (payload = {}) => {
  if (payload.academic_year_id) return String(payload.academic_year_id);
  if (payload.academicYearId) return String(payload.academicYearId);
  if (typeof window !== "undefined") {
    const fromStorage =
      localStorage.getItem("academicYearId") ||
      localStorage.getItem("selectedAcademicYearId");
    if (fromStorage) return fromStorage;
  }
  return DEFAULT_ACADEMIC_YEAR_ID;
};

const feeGet = (path) => authorizedGet(`${FEES_BASE}${path}`);
const feePost = (path, data) => authorizedPost(`${FEES_BASE}${path}`, data);

const withSuccess = (response, extra = {}) => ({
  success: response?.success ?? true,
  message: response?.message || "Success",
  ...response,
  ...extra,
});

const normalizeFeeHead = (raw = {}) => {
  const isActive = raw.is_active !== undefined ? Boolean(raw.is_active) : raw.status !== "inactive";
  const isOptional = raw.is_optional !== undefined ? Boolean(raw.is_optional) : !raw.is_mandatory;

  return {
    id: raw.id || raw._id || raw.fee_head_id,
    name: raw.name || raw.fee_head_name || "",
    category: raw.category || "general",
    description: raw.description || "",
    is_optional: isOptional,
    is_refundable: Boolean(raw.is_refundable),
    ledger_code: raw.ledger_code || "",
    is_active: isActive,
    is_mandatory: !isOptional,
    status: isActive ? "active" : "inactive",
    createdAt: raw.createdAt || raw.created_at || nowIso(),
    updatedAt: raw.updatedAt || raw.updated_at || nowIso(),
  };
};

const normalizeFeeHeadList = (response) => {
  const list =
    response?.data?.data ||
    response?.data?.feeHeads ||
    response?.data?.fee_heads ||
    response?.data?.items ||
    response?.feeHeads ||
    response?.fee_heads ||
    response?.items ||
    response?.data ||
    response;

  return toArray(list).map(normalizeFeeHead);
};

const buildFeeHeadsQuery = ({ category, is_active } = {}) => {
  const params = new URLSearchParams();

  if (category !== undefined && category !== null && category !== "") {
    params.append("category", String(category));
  }

  if (is_active !== undefined && is_active !== null) {
    params.append("is_active", String(Boolean(is_active)));
  }

  const query = params.toString();
  return query ? `?${query}` : "";
};

const getStoredAcademicYearId = () => {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("academicYearId") ||
    localStorage.getItem("selectedAcademicYearId") ||
    ""
  );
};

const buildFeeStructuresQuery = ({ academic_year_id, is_active, structure_type } = {}) => {
  const params = new URLSearchParams();

  if (academic_year_id !== undefined && academic_year_id !== null && academic_year_id !== "") {
    params.append("academic_year_id", String(academic_year_id));
  }

  if (is_active !== undefined && is_active !== null) {
    params.append("is_active", String(Boolean(is_active)));
  }

  if (structure_type !== undefined && structure_type !== null && structure_type !== "") {
    params.append("structure_type", String(structure_type));
  }

  const query = params.toString();
  return query ? `?${query}` : "";
};

const resolveStructureType = (installments = [], fallback = "recurring") => {
  const count = toArray(installments).length;
  if (count === 0) return fallback;
  return count === 1 ? "onetime" : "recurring";
};

const normalizeFeeStructure = (raw = {}) => {
  const classIds = toArray(raw.class_ids || raw.classIds).map((value) => toNumber(value));
  const classId = raw.class_id || classIds[0] || raw.classSection?.id || "";
  const firstInstallment = toArray(raw.installments)[0] || {};
  const feeHeads = toArray(raw.fee_heads).map((head, index) => ({
    id: head.id || `${raw.id || raw._id || "fs"}-fh-${index + 1}`,
    name: head.name || `Fee Head ${index + 1}`,
    amount: toNumber(head.amount),
    sort_order: head.sort_order || index + 1,
  }));

  const sourceItems =
    toArray(raw.items || raw.fee_details || raw.feeDetails).length > 0
      ? toArray(raw.items || raw.fee_details || raw.feeDetails)
      : feeHeads;

  const items = sourceItems.map((item, index) => ({
    id: item.id || `${raw.id || raw._id || "fs"}-${index + 1}`,
    fee_head_id: item.fee_head_id || item.feeHead?.id || item.feeHeadId || item.id,
    amount: toNumber(item.amount),
    is_mandatory: item.is_mandatory !== undefined ? Boolean(item.is_mandatory) : true,
    sequence_order: item.sequence_order || item.sort_order || index + 1,
    feeHead: item.feeHead || {
      id: item.fee_head_id || item.id,
      name: item.fee_head_name || item.name || `Fee Head ${index + 1}`,
      description: item.description || "",
    },
  }));

  const totalAmountFromItems = items.reduce((sum, item) => sum + toNumber(item.amount), 0);
  const totalAmount =
    raw.total_amount !== undefined && raw.total_amount !== null
      ? toNumber(raw.total_amount)
      : totalAmountFromItems;

  return {
    id: raw.id || raw._id,
    name: raw.name || "",
    class_id: classId,
    class_ids: classIds,
    class_section_id: classIds[0] || classId || "",
    academic_year_id: raw.academic_year_id || "",
    academic_start_year: raw.academic_start_year || "",
    academic_end_year: raw.academic_end_year || "",
    due_date: toIsoDate(firstInstallment.due_date || raw.due_date),
    late_fee_amount: toNumber(firstInstallment.late_fine_value || raw.late_fee_amount),
    late_fee_type: firstInstallment.late_fine_type || raw.late_fee_type || "flat",
    fee_details: items,
    feeDetails: items,
    items,
    fee_heads: feeHeads.length
      ? feeHeads
      : items.map((item, index) => ({
          id: item.fee_head_id || `${raw.id || raw._id || "fs"}-fh-${index + 1}`,
          name: item.feeHead?.name || `Fee Head ${index + 1}`,
          amount: toNumber(item.amount),
          sort_order: item.sequence_order || index + 1,
        })),
    installments: toArray(raw.installments).map((inst, index) => ({
      id: inst.id || `${raw.id || raw._id || "fs"}-inst-${index + 1}`,
      fee_structure_id: inst.fee_structure_id || raw.id || raw._id,
      name: inst.name || `Installment ${index + 1}`,
      installment_number: inst.installment_number || index + 1,
      sequence_no: inst.sequence_no || inst.installment_number || index + 1,
      start_date: toIsoDate(inst.start_date || inst.due_date),
      due_date: toIsoDate(inst.due_date),
      percentage: toNumber(inst.percentage, 0),
      allow_partial_payment:
        inst.allow_partial_payment !== undefined ? Boolean(inst.allow_partial_payment) : true,
      fixed_amount: inst.fixed_amount !== undefined && inst.fixed_amount !== null ? toNumber(inst.fixed_amount) : null,
      late_fine_type: inst.late_fine_type || "none",
      late_fine_value: toNumber(inst.late_fine_value, 0),
      grace_period_days: toNumber(inst.grace_period_days, 0),
    })),
    classSection: raw.classSection || {
      id: classId || "",
      class_name:
        raw.class_name ||
        raw.class_section?.class_name ||
        (classId ? `Class ${classId}` : ""),
      section_name: raw.section_name || raw.class_section?.section_name || raw.class_section?.section || "",
    },
    class_name: raw.class_name || raw.class_section?.class_name || "",
    description: raw.description || "",
    structure_type: raw.structure_type || "recurring",
    total_amount: totalAmount,
    created_at: raw.created_at || raw.createdAt || "",
    updated_at: raw.updated_at || raw.updatedAt || "",
    usage_statistics: raw.usage_statistics || null,
    is_active: raw.is_active !== undefined ? Boolean(raw.is_active) : true,
  };
};

const normalizeFeeStructureList = (response) => {
  const list =
    response?.data?.data ||
    response?.data?.feeStructures ||
    response?.data?.fee_structures ||
    response?.data?.items ||
    response?.feeStructures ||
    response?.fee_structures ||
    response?.items ||
    response?.data ||
    response;

  return toArray(list).map(normalizeFeeStructure);
};

const toFeeStructurePayload = (payload = {}, isUpdate = false) => {
  const classId =
    payload.class_id !== undefined && payload.class_id !== null && payload.class_id !== ""
      ? toNumber(payload.class_id)
      : payload.class_section_id
      ? toNumber(payload.class_section_id)
      : null;

  const feeItems = toArray(payload.items).length
    ? toArray(payload.items)
    : toArray(payload.fee_details).map((detail, index) => ({
        fee_head_id: toNumber(detail.fee_head_id),
        amount: toNumber(detail.amount),
        is_mandatory: detail.is_mandatory !== undefined ? Boolean(detail.is_mandatory) : true,
        sort_order: detail.sequence_order || index + 1,
      }));

  const installments = toArray(payload.installments).length
    ? toArray(payload.installments).map((inst, index) => ({
        name: inst.name || `Installment ${inst.installment_number || index + 1}`,
        installment_number: inst.installment_number || index + 1,
        start_date: toIsoDate(inst.start_date || inst.due_date),
        due_date: toIsoDate(inst.due_date),
        percentage: inst.percentage || 100,
        allow_partial_payment:
          inst.allow_partial_payment !== undefined ? Boolean(inst.allow_partial_payment) : true,
        fixed_amount:
          inst.fixed_amount !== undefined && inst.fixed_amount !== null
            ? toNumber(inst.fixed_amount)
            : null,
        late_fine_type: inst.late_fine_type || payload.late_fee_type || "none",
        late_fine_value: toNumber(inst.late_fine_value ?? payload.late_fee_amount),
        max_late_fine: inst.max_late_fine !== undefined ? toNumber(inst.max_late_fine) : undefined,
        grace_period_days: toNumber(inst.grace_period_days),
      }))
    : payload.due_date
    ? [
        {
          name: "Term 1",
          installment_number: 1,
          start_date: toIsoDate(payload.start_date || payload.due_date),
          due_date: toIsoDate(payload.due_date),
          percentage: 100,
          allow_partial_payment: true,
          fixed_amount: null,
          late_fine_type: payload.late_fee_type || "none",
          late_fine_value: toNumber(payload.late_fee_amount),
          grace_period_days: 0,
        },
      ]
    : [];

  const structureType = resolveStructureType(installments, payload.structure_type || "recurring");

  const base = {};

  if (payload.name !== undefined) {
    base.name = payload.name;
  }

  if (!isUpdate || payload.academic_year_id !== undefined) {
    base.academic_year_id = payload.academic_year_id || resolveAcademicYearId(payload);
  }

  if (classId !== null) {
    base.class_id = classId;
  }

  if (payload.description !== undefined) {
    base.description = payload.description;
  } else if (!isUpdate) {
    base.description =
      payload.description ||
      (payload.academic_start_year && payload.academic_end_year
        ? `Academic session ${payload.academic_start_year}-${payload.academic_end_year}`
        : "Fee structure");
  }

  if (!isUpdate || payload.structure_type !== undefined) {
    base.structure_type = structureType;
  }

  if ((!isUpdate && feeItems.length > 0) || payload.items || payload.fee_details) {
    base.items = feeItems;
  }

  if ((!isUpdate && installments.length > 0) || payload.installments || payload.due_date) {
    base.installments = installments;
  }

  if (isUpdate && payload.is_active !== undefined) {
    base.is_active = Boolean(payload.is_active);
  }

  return base;
};

const readAssignmentCache = () => {
  if (typeof window === "undefined") return [];
  const cached = safeParseJson(localStorage.getItem(ASSIGNMENT_CACHE_KEY), []);
  return toArray(cached);
};

const writeAssignmentCache = (items) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(ASSIGNMENT_CACHE_KEY, JSON.stringify(toArray(items)));
};

const mergeAssignment = (existing = [], incoming) => {
  const key = `${incoming.class_section?.id || ""}|${incoming.fee_structure?.id || ""}`;
  const withoutCurrent = existing.filter(
    (item) => `${item.class_section?.id || ""}|${item.fee_structure?.id || ""}` !== key
  );
  return [incoming, ...withoutCurrent];
};

const inferPaymentStatus = (invoice = {}) => {
  const raw = String(invoice.status || "").toLowerCase();
  if (["paid", "success"].includes(raw)) return "paid";
  if (["partial", "partially_paid"].includes(raw)) return "partial";

  const paidAmount = toNumber(invoice.paid_amount || invoice.amount_paid);
  const total = toNumber(invoice.final_amount || invoice.total_amount || invoice.amount || invoice.amount_due);
  if (paidAmount >= total && total > 0) return "paid";
  if (paidAmount > 0) return "partial";
  return "pending";
};

const normalizeStudentFeeAssignmentItem = (item = {}, index = 0) => ({
  id: item.id || item.fee_head_id || `${index + 1}`,
  fee_head_id: item.fee_head_id || item.feeHead?.id || null,
  amount: toNumber(item.amount),
  is_mandatory:
    item.is_mandatory !== undefined ? Boolean(item.is_mandatory) : !item.feeHead?.is_optional,
  sort_order: item.sort_order || item.sequence_order || item.feeHead?.display_order || index + 1,
  feeHead: item.feeHead
    ? {
        ...item.feeHead,
        display_order: item.feeHead.display_order || item.sort_order || index + 1,
      }
    : {
        id: item.fee_head_id || null,
        name: item.fee_head_name || item.name || `Fee Head ${index + 1}`,
        category: item.category || "general",
        description: item.description || "",
        is_optional: item.is_optional !== undefined ? Boolean(item.is_optional) : false,
        display_order: item.display_order || item.sort_order || index + 1,
      },
});

const normalizeStudentFeeInvoiceItem = (invoice = {}, index = 0) => ({
  id: invoice.id || invoice.invoice_id || `inv-${index + 1}`,
  invoice_number: invoice.invoice_number || invoice.invoice_no || `INV-${index + 1}`,
  invoice_no: invoice.invoice_no || invoice.invoice_number || `INV${index + 1}`,
  installment_plan_id: invoice.installment_plan_id || invoice.installment?.id || null,
  installment: invoice.installment
    ? {
        ...invoice.installment,
        id: invoice.installment.id || invoice.installment_plan_id || null,
      }
    : null,
  gross_amount: toNumber(invoice.gross_amount || invoice.original_amount || invoice.total_amount),
  concession_amount: toNumber(invoice.concession_amount),
  net_amount: toNumber(invoice.net_amount || invoice.final_amount || invoice.total_amount),
  fine_amount: toNumber(invoice.fine_amount || invoice.late_fee),
  paid_amount: toNumber(invoice.paid_amount || invoice.amount_paid),
  balance_amount: toNumber(invoice.balance_amount),
  status: String(invoice.status || inferPaymentStatus(invoice) || "pending").toLowerCase(),
  due_date: invoice.due_date || invoice.installment?.due_date || null,
  start_date: invoice.start_date || invoice.installment?.start_date || null,
  generated_at: invoice.generated_at || invoice.created_at || null,
  items: toArray(invoice.items).map((item, itemIndex) => ({
    id: item.id || `inv-item-${index + 1}-${itemIndex + 1}`,
    fee_head_id: item.fee_head_id || item.feeHead?.id || null,
    gross_amount: toNumber(item.gross_amount),
    concession_amount: toNumber(item.concession_amount),
    net_amount: toNumber(item.net_amount),
    feeHead: item.feeHead || {
      id: item.fee_head_id || null,
      name: item.fee_head_name || item.name || `Fee Head ${itemIndex + 1}`,
      category: item.category || "general",
      display_order: item.sort_order || item.display_order || itemIndex + 1,
    },
  })),
});

const normalizeStudentFeeAssignmentResponse = (response = {}, fallbackStudent = {}) => {
  const data = response?.data?.data || response?.data || response || {};
  const assignment = data.assignment || {};
  const feeStructure = data.feeStructure || data.fee_structure || {};
  const studentPayload = data.student || {};
  const studentClass = studentPayload.class || {};
  const installmentSource = toArray(data.installments);
  const installments = installmentSource.map((installment, index) => ({
    id: installment.id || `inst-${index + 1}`,
    name: installment.name || `Installment ${index + 1}`,
    installment_number: installment.installment_number || installment.sequence_no || index + 1,
    due_date: installment.due_date || null,
    start_date: installment.start_date || null,
    sequence_no: installment.sequence_no || installment.installment_number || index + 1,
    percentage: toNumber(installment.percentage),
    allow_partial_payment:
      installment.allow_partial_payment !== undefined ? Boolean(installment.allow_partial_payment) : true,
    fixed_amount:
      installment.fixed_amount !== undefined && installment.fixed_amount !== null
        ? toNumber(installment.fixed_amount)
        : null,
    late_fine_type: installment.late_fine_type || "none",
    late_fine_value: toNumber(installment.late_fine_value),
    invoice: installment.invoice || null,
    payment_status: installment.payment_status || null,
  }));

  const feeStructureItems = toArray(feeStructure.items || feeStructure.fee_heads).map(
    normalizeStudentFeeAssignmentItem
  );
  const paidInvoices = toArray(data.invoices?.paid).map(normalizeStudentFeeInvoiceItem);
  const unpaidInvoices = toArray(data.invoices?.unpaid).map(normalizeStudentFeeInvoiceItem);
  const invoicesFromInstallments = installments
    .map((installment, index) => {
      if (!installment.invoice) return null;
      const installmentId = installment.id || `inst-${index + 1}`;
      return normalizeStudentFeeInvoiceItem(
        {
          ...installment.invoice,
          installment_plan_id: installment.invoice?.installment_plan_id || installmentId,
          installment: {
            id: installmentId,
            name: installment.name || `Installment ${index + 1}`,
            due_date: installment.due_date || null,
            start_date: installment.start_date || null,
          },
        },
        index
      );
    })
    .filter(Boolean);
  const allInvoiceRows = new Map();
  [...paidInvoices, ...unpaidInvoices, ...invoicesFromInstallments].forEach((invoice) => {
    if (!invoice) return;
    const key = String(invoice.id || invoice.invoice_number || invoice.invoice_no);
    if (!allInvoiceRows.has(key)) {
      allInvoiceRows.set(key, invoice);
    }
  });
  const allInvoices = Array.from(allInvoiceRows.values());
  const paidInvoiceRows = allInvoices.filter((invoice) => invoice.status === "paid");
  const unpaidInvoiceRows = allInvoices.filter((invoice) => invoice.status !== "paid");

  const invoiceByInstallmentId = new Map(
    allInvoices.map((invoice) => [String(invoice.installment_plan_id || invoice.installment?.id || invoice.id), invoice])
  );

  const installmentRows = installments.map((installment) => {
    const matchedInvoice =
      invoiceByInstallmentId.get(String(installment.id)) ||
      invoiceByInstallmentId.get(String(installment.installment_number)) ||
      invoiceByInstallmentId.get(String(installment.sequence_no)) ||
      null;
    const rawStatus = String(
      installment.payment_status ||
        matchedInvoice?.status ||
        (matchedInvoice ? inferPaymentStatus(matchedInvoice) : "") ||
        ""
    ).toLowerCase();
    const status = rawStatus === "paid" ? "paid" : "unpaid";

    return {
      ...installment,
      status,
      invoice: matchedInvoice || null,
      paid_amount: toNumber(matchedInvoice?.paid_amount),
      balance_amount: toNumber(matchedInvoice?.balance_amount),
      fine_amount: toNumber(matchedInvoice?.fine_amount),
      payment_date: matchedInvoice?.payment_date || matchedInvoice?.generated_at || null,
      invoice_number: matchedInvoice?.invoice_number || matchedInvoice?.invoice_no || null,
      invoice_no: matchedInvoice?.invoice_no || matchedInvoice?.invoice_number || null,
      invoice_id: matchedInvoice?.id || null,
    };
  });

  const totalAssigned =
    feeStructureItems.reduce((sum, item) => sum + toNumber(item.amount), 0) ||
    allInvoices.reduce((sum, invoice) => sum + toNumber(invoice.net_amount || invoice.gross_amount), 0);
  const totalPaid = allInvoices.reduce((sum, invoice) => sum + toNumber(invoice.paid_amount), 0);
  const totalDue = unpaidInvoiceRows.reduce(
    (sum, invoice) => sum + toNumber(invoice.balance_amount || invoice.net_amount - invoice.paid_amount + invoice.fine_amount),
    0
  );
  const totalDiscount = allInvoices.reduce((sum, invoice) => sum + toNumber(invoice.concession_amount), 0);
  const totalInstallments = installments.length || installmentRows.length || 0;
  const paidInstallments = installmentRows.filter((installment) => installment.status === "paid").length;
  const overdueInstallments = installmentRows.filter((installment) => installment.status === "overdue").length;
  const pendingInstallments = Math.max(totalInstallments - paidInstallments - overdueInstallments, 0);

  const studentName =
    studentPayload?.name ||
    fallbackStudent?.name ||
    fallbackStudent?.User?.name ||
    data.student_name ||
    assignment?.student_name ||
    `Student ${assignment?.student_id || fallbackStudent?.id || ""}`.trim();
  const rollNumber =
    studentPayload?.roll_number ||
    fallbackStudent?.roll_number ||
    fallbackStudent?.rollNo ||
    data.roll_number ||
    assignment?.roll_number ||
    assignment?.student_id ||
    fallbackStudent?.id ||
    "N/A";

  const normalizedFeeStructure = {
    id: feeStructure.id || assignment?.fee_structure_id || null,
    name: feeStructure.name || "Fee Structure",
    description: feeStructure.description || "",
    structure_type: feeStructure.structure_type || assignment?.assignment_type || "recurring",
    is_active: feeStructure.is_active !== undefined ? Boolean(feeStructure.is_active) : true,
    items: feeStructureItems,
    total_amount: totalAssigned,
  };

  const academicYearLabel =
    data.academic_year ||
    data.academicYear ||
    assignment?.academic_year_name ||
    assignment?.academic_year_id ||
    "N/A";

  return {
    success: true,
    data: {
      assignment: {
        ...assignment,
        id: assignment.id || null,
        student_id: assignment.student_id || fallbackStudent?.id || null,
        fee_structure_id: assignment.fee_structure_id || normalizedFeeStructure.id || null,
        academic_year_id: assignment.academic_year_id || null,
      },
      feeStructure: normalizedFeeStructure,
      installments: installmentRows,
      invoices: {
        paid: paidInvoiceRows,
        unpaid: unpaidInvoiceRows,
        all: allInvoices,
      },
      student_info: {
        name: studentName,
        admission_number: rollNumber,
        class:
          [
            studentClass.name || studentPayload.class_name || fallbackStudent?.class_name || fallbackStudent?.class || data.class_name,
            studentClass.section || studentPayload.section,
          ]
            .filter(Boolean)
            .join(" - ") || "N/A",
        email: studentPayload.email || fallbackStudent?.email || data.email || "",
        phone: studentPayload.phone || fallbackStudent?.phone_no || fallbackStudent?.phone || data.phone || "",
      },
      summary: {
        total_assigned_fee: totalAssigned,
        total_paid_fee: totalPaid,
        total_due_fee: totalDue,
        total_discount: totalDiscount,
        installments_summary: {
          total_installments: totalInstallments,
          paid_installments: paidInstallments,
          pending_installments: pendingInstallments,
          overdue_installments: overdueInstallments,
        },
      },
      fees_by_academic_year: [
        {
          academic_year: academicYearLabel,
          total_assigned: totalAssigned,
          total_paid: totalPaid,
          total_due: totalDue,
          fee_structures: [
            {
              status: totalDue <= 0 ? "paid" : overdueInstallments > 0 ? "overdue" : "pending",
              original_amount: totalAssigned,
              discount_amount: totalDiscount,
              discount_reason: "",
              final_amount: Math.max(totalAssigned - totalDiscount, 0),
              fee_structure: {
                ...normalizedFeeStructure,
                due_date: installments[0]?.due_date || feeStructure.due_date || null,
              },
              installments: installmentRows.map((installment) => ({
                installment_number: installment.installment_number,
                amount: installment.fixed_amount !== null ? installment.fixed_amount : Math.max(totalAssigned * (installment.percentage / 100 || 0), 0),
                due_date: installment.due_date,
                paid_amount: installment.paid_amount,
                payment_date: installment.payment_date,
                late_fee_applied: installment.fine_amount,
                status: installment.status,
              })),
            },
          ],
        },
      ],
    },
  };
};

const toStudentInvoiceRows = (invoices, assignment) =>
  toArray(invoices).map((invoice, index) => {
    const finalAmount = toNumber(
      invoice.final_amount || invoice.total_amount || invoice.amount_due || invoice.amount
    );
    const discount = toNumber(invoice.discount_amount);
    const original = finalAmount + discount;

    return {
      id: invoice.id || invoice.invoice_id || `inv-${index + 1}`,
      fee_structure_name:
        invoice.fee_structure_name || assignment?.fee_structure?.name || `Fee Invoice ${index + 1}`,
      academic_year: invoice.academic_year || assignment?.academic_year || "N/A",
      original_amount: original,
      discount_amount: discount,
      discount_reason: invoice.discount_reason || "",
      final_amount: finalAmount,
      due_date: invoice.due_date,
      paid_amount: toNumber(invoice.paid_amount || invoice.amount_paid),
      status: inferPaymentStatus(invoice),
      late_fee: toNumber(invoice.late_fee || invoice.late_fee_applied),
      payment_date: invoice.payment_date || invoice.last_payment_date,
      invoice_no: invoice.invoice_number || invoice.invoice_no || invoice.id,
    };
  });

const toHistoryPayload = (ledgerResponse, fallbackInvoices = []) => {
  const entries =
    toArray(ledgerResponse?.data?.entries) ||
    toArray(ledgerResponse?.data?.ledger) ||
    toArray(ledgerResponse?.data?.transactions) ||
    [];

  const payments = entries.length
    ? entries.map((entry, index) => {
        const amountPaid = toNumber(entry.amount_paid || entry.amount || entry.credit);
        const lateFee = toNumber(entry.late_fee_paid || entry.late_fee || 0);
        const totalPaid = amountPaid + lateFee;

        return {
          payment_id: entry.payment_id || entry.id || `p-${index + 1}`,
          receipt_number: entry.receipt_number || entry.reference || `RCPT-${index + 1}`,
          academic_year: entry.academic_year || "N/A",
          payment_date: entry.payment_date || entry.date || nowIso(),
          payment_for: entry.payment_for || entry.description || "Fee Payment",
          amount_paid: amountPaid,
          late_fee_paid: lateFee,
          total_paid: totalPaid,
          payment_method: entry.payment_method || entry.mode || "online",
          payment_status: String(entry.status || "paid").toLowerCase(),
          is_refund: Boolean(entry.is_refund),
          remarks: entry.remarks || "",
        };
      })
    : toStudentInvoiceRows(fallbackInvoices, null)
        .filter((invoice) => toNumber(invoice.paid_amount) > 0)
        .map((invoice) => ({
          payment_id: invoice.id,
          receipt_number: `INV-${invoice.invoice_no}`,
          academic_year: invoice.academic_year,
          payment_date: invoice.payment_date || invoice.due_date,
          payment_for: invoice.fee_structure_name,
          amount_paid: invoice.paid_amount,
          late_fee_paid: invoice.late_fee,
          total_paid: invoice.paid_amount + invoice.late_fee,
          payment_method: "online",
          payment_status: inferPaymentStatus(invoice),
          is_refund: false,
          remarks: "",
        }));

  const summary = payments.reduce(
    (acc, payment) => {
      const status = String(payment.payment_status || "").toLowerCase();
      acc.total_payments += 1;
      acc.total_amount_paid += toNumber(payment.total_paid);
      if (status === "paid" || status === "success") acc.successful_payments += 1;
      if (status === "pending") acc.pending_payments += 1;
      if (payment.is_refund) acc.refund_payments += 1;
      return acc;
    },
    {
      total_payments: 0,
      successful_payments: 0,
      pending_payments: 0,
      refund_payments: 0,
      total_amount_paid: 0,
    }
  );

  return { summary, payments };
};

const toDuesRows = (response) => {
  const rows =
    response?.data?.overdue_installments ||
    response?.data?.items ||
    response?.data?.records ||
    response?.data ||
    response?.items ||
    response;

  return toArray(rows).map((item, index) => {
    const amount = toNumber(item.amount || item.due_amount || item.pending_amount);
    const paid = toNumber(item.paid_amount);
    const lateFee = toNumber(item.late_fee_applied || item.late_fee || 0);

    return {
      id: item.id || `due-${index + 1}`,
      installment_number: item.installment_number || index + 1,
      due_date: item.due_date || nowIso(),
      amount,
      paid_amount: paid,
      late_fee_applied: lateFee,
      status: item.status || "pending",
      studentFee: {
        academic_year: item.academic_year || item.academicYear || "N/A",
        student: {
          ClassSection: {
            class_name: item.class_name || item.class || "N/A",
            section_name: item.section_name || item.section || "N/A",
          },
          User: {
            name: item.student_name || item.name || "N/A",
            email: item.email || "",
          },
        },
      },
    };
  });
};

const normalizeStudentRecord = (raw = {}, index = 0) => {
  const user = raw.User || raw.user || {};
  const classSection = raw.ClassSection || raw.classSection || raw.class_section || {};

  return {
    ...raw,
    id: raw.id || raw.student_id || raw.user_id || `student-${index + 1}`,
    name: raw.name || raw.student_name || user.name || "N/A",
    roll_number: raw.roll_number || raw.roll_no || "",
    gender: raw.gender || "",
    phone_no: raw.phone_no || raw.phone || user.phone || user.phone_number || "",
    father_name: raw.father_name || "N/A",
    admission_number: raw.admission_number || raw.admission_no || "",
    User: {
      ...user,
      name: user.name || raw.name || raw.student_name || "N/A",
      email: user.email || raw.email || "",
      phone_number: user.phone_number || raw.phone_no || raw.phone || "",
    },
    ClassSection: {
      ...classSection,
      class_name: classSection.class_name || raw.class_name || "N/A",
      section_name: classSection.section_name || classSection.section || raw.section_name || "",
    },
  };
};

const normalizePaymentRecord = (raw = {}, index = 0) => {
  const studentRaw = raw.student || raw.Student || raw.student_info || {};
  const resolvedStudentRaw = Object.keys(studentRaw || {}).length
    ? studentRaw
    : {
        id: raw.student_id || raw.studentId || raw.studentID || "",
        student_name: raw.student_name || raw.studentName || raw.name || "",
        class_name: raw.class_name || raw.className || raw.class || "",
        section_name: raw.section_name || raw.sectionName || "",
      };
  const normalizedStudent = normalizeStudentRecord(resolvedStudentRaw, index);

  const amountPaid = toNumber(
    raw.amount_paid || raw.amount || raw.paid_amount || raw.credit || raw.total_amount
  );
  const lateFeePaid = toNumber(raw.late_fee_paid || raw.late_fee || raw.late_fee_applied);
  const totalPaid = toNumber(raw.total_paid || raw.total_amount || amountPaid + lateFeePaid);

  return {
    id: raw.id || raw.payment_id || raw.paymentId || `payment-${index + 1}`,
    receipt_number: raw.receipt_number || raw.receipt_no || raw.reference || `RCPT-${index + 1}`,
    academic_year: raw.academic_year || raw.academicYear || "N/A",
    payment_date: raw.payment_date || raw.created_at || nowIso(),
    amount_paid: amountPaid,
    late_fee_paid: lateFeePaid,
    total_paid: totalPaid,
    payment_method: String(
      raw.payment_method || raw.payment_mode || raw.mode || raw.method || "cash"
    ).toLowerCase(),
    payment_status: String(raw.payment_status || raw.status || "success").toLowerCase(),
    payment_type: raw.payment_type || "fee",
    payment_for: raw.payment_for || raw.description || "Fee Payment",
    transaction_id: raw.transaction_id || raw.transaction_ref || raw.reference || "",
    cheque_number: raw.cheque_number || "",
    bank_name: raw.bank_name || raw.cheque_bank || "",
    is_refund: Boolean(raw.is_refund),
    refund_reason: raw.refund_reason || "",
    remarks: raw.remarks || "",
    created_at: raw.created_at || raw.createdAt || nowIso(),
    updated_at: raw.updated_at || raw.updatedAt || nowIso(),
    student: normalizedStudent,
    student_name:
      normalizedStudent?.User?.name || normalizedStudent?.name || raw.student_name || "N/A",
    class_name:
      normalizedStudent?.ClassSection?.class_name || raw.class_name || raw.class || "N/A",
  };
};

const getPaymentsFromResponse = (response) => {
  const rows =
    response?.data?.payments ||
    response?.data?.items ||
    response?.data?.records ||
    response?.payments ||
    response?.items ||
    response?.data ||
    response;

  return toArray(rows).map(normalizePaymentRecord);
};

const getPaymentSummary = (response, payments = []) => {
  const calculated = payments.reduce(
    (acc, payment) => {
      const status = String(payment.payment_status || "").toLowerCase();
      acc.total_payments += 1;
      acc.total_amount += toNumber(payment.amount_paid);
      acc.total_late_fee_paid += toNumber(payment.late_fee_paid);
      acc.total_paid += toNumber(payment.total_paid);

      if (status === "paid" || status === "success") {
        acc.successful_payments += 1;
        acc.total_successful_amount += toNumber(payment.total_paid);
      }
      return acc;
    },
    {
      total_payments: 0,
      total_amount: 0,
      successful_payments: 0,
      total_successful_amount: 0,
      total_late_fee_paid: 0,
      total_paid: 0,
    }
  );

  const responseSummary = response?.data?.summary || response?.summary || {};

  return {
    total_payments:
      toNumber(responseSummary.total_payments, calculated.total_payments) || calculated.total_payments,
    total_amount: toNumber(responseSummary.total_amount, calculated.total_amount),
    successful_payments:
      toNumber(responseSummary.successful_payments, calculated.successful_payments) ||
      calculated.successful_payments,
    total_successful_amount: toNumber(
      responseSummary.total_successful_amount,
      calculated.total_successful_amount
    ),
    total_amount_paid: toNumber(responseSummary.total_amount_paid, calculated.total_amount),
    total_late_fee_paid: toNumber(responseSummary.total_late_fee_paid, calculated.total_late_fee_paid),
    total_paid: toNumber(responseSummary.total_paid, calculated.total_paid),
  };
};

export const getClassSectionDropdown = async () => {
  try {
    const response = await authorizedGet(`${ADMIN_FEES_DROPDOWN_BASE}/class-sections`);
    const data = extractArray(
      response?.data?.data,
      response?.data?.classSections,
      response?.data?.class_sections,
      response?.data?.classes,
      response?.data?.items,
      response?.data
    );
    return withSuccess(response, { data });
  } catch {
    const response = await getAllClassesDropdownBase();
    const data = extractArray(
      response?.data?.data,
      response?.data?.classSections,
      response?.data?.class_sections,
      response?.data?.classes,
      response?.data?.items,
      response?.data,
      response
    );
    return withSuccess(response, { data });
  }
};

export const getAllClassesDropdown = getClassSectionDropdown;

export const getFeeHeadsDropdown = async () => {
  const response = await authorizedGet(`${ADMIN_FEES_DROPDOWN_BASE}/fee-heads`);
  const data = toArray(response?.data?.data || response?.data || response).map(normalizeFeeHead);
  return withSuccess(response, { data });
};

export const getAcademicYearsDropdown = async () => {
  const response = await authorizedGet(`${ADMIN_FEES_DROPDOWN_BASE}/academic-years`);
  const data = toArray(response?.data?.data || response?.data || response).map((item) => ({
    id: item.id,
    name: item.name || "",
    start_date: item.start_date || "",
    end_date: item.end_date || "",
    is_current: Boolean(item.is_current),
  }));
  return withSuccess(response, { data });
};

export const getFeeStructuresDropdown = async () => {
  const response = await authorizedGet(`${ADMIN_FEES_DROPDOWN_BASE}/fee-structures`);
  const data = toArray(response?.data?.data || response?.data || response).map((item) => ({
    id: item.id,
    name: item.name || "",
    label: item.label || item.name || "",
    academic_year_id: item.academic_year_id || "",
    class_id: item.class_id || "",
    structure_type: item.structure_type || "recurring",
    is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
  }));
  return withSuccess(response, { data });
};

export const getClassDropdown = getClassSectionDropdown;

export const getStudentsByClass = async (classId) => {
  const response = await getStudentsByClassBase(classId);
  const students = extractArray(
    response?.data?.data,
    response?.data?.students,
    response?.data?.items,
    response?.data,
    response
  ).map(normalizeStudentRecord);
  return withSuccess(response, {
    data: students,
    students,
  });
};

export const getAllStudentsByClass = getStudentsByClass;

export const getAllFeeHeads = async (filters = { category: "academic", is_active: true }) => {
  const response = await authorizedGet(`${ADMIN_FEE_HEADS_BASE}${buildFeeHeadsQuery(filters)}`);
  const feeHeads = normalizeFeeHeadList(response);
  return withSuccess(response, {
    data: { feeHeads, fee_heads: feeHeads },
    feeHeads,
    fee_heads: feeHeads,
  });
};

export const createFeeHead = async (feeHeadData) => {
  const payload = {
    name: feeHeadData?.name,
    category: feeHeadData?.category || "academic",
    description: feeHeadData?.description || "",
    is_optional: feeHeadData?.is_optional ?? !feeHeadData?.is_mandatory,
    is_refundable: Boolean(feeHeadData?.is_refundable),
    ledger_code: feeHeadData?.ledger_code || "",
  };

  const response = await authorizedPost(
    `${ADMIN_FEE_HEADS_BASE}${buildFeeHeadsQuery({
      category: payload.category,
      is_active: true,
    })}`,
    payload
  );
  return withSuccess(response);
};

export const getFeeHeadById = async (id) => {
  const response = await authorizedGet(`${ADMIN_FEE_HEADS_BASE}/${id}`);
  const feeHead = normalizeFeeHead(response?.data?.data || response?.data || response);
  return withSuccess(response, { data: { feeHead }, feeHead });
};

export const updateFeeHead = async (id, feeHeadData) => {
  const payload = {
    name: feeHeadData?.name,
    category: feeHeadData?.category || "academic",
    description: feeHeadData?.description || "",
    is_optional: feeHeadData?.is_optional ?? !feeHeadData?.is_mandatory,
    is_refundable: Boolean(feeHeadData?.is_refundable),
    ledger_code: feeHeadData?.ledger_code || "",
    is_active:
      feeHeadData?.is_active !== undefined
        ? Boolean(feeHeadData.is_active)
        : feeHeadData?.status
        ? String(feeHeadData.status).toLowerCase() === "active"
        : true,
  };

  const response = await authorizedPut(`${ADMIN_FEE_HEADS_BASE}/${id}`, payload);
  return withSuccess(response);
};

export const deleteFeeHead = async (id) => {
  const response = await authorizedDelete(`${ADMIN_FEE_HEADS_BASE}/${id}`);
  return withSuccess(response);
};

export const getAllFeeStructures = async (filters = {}) => {
  const response = await authorizedGet(
    `${ADMIN_FEE_STRUCTURES_BASE}${buildFeeStructuresQuery({
      academic_year_id: filters.academic_year_id ?? getStoredAcademicYearId(),
    })}`
  );
  const feeStructures = normalizeFeeStructureList(response);
  return withSuccess(response, {
    data: { feeStructures, fee_structures: feeStructures },
    feeStructures,
    fee_structures: feeStructures,
  });
};

export const createFeeStructure = async (feeStructureData) => {
  const payload = toFeeStructurePayload(feeStructureData);
  const structureType = resolveStructureType(payload.installments, payload.structure_type || "recurring");
  const response = await authorizedPost(
    `${ADMIN_FEE_STRUCTURES_BASE}${buildFeeStructuresQuery({
      academic_year_id: payload.academic_year_id,
      is_active: true,
      structure_type: structureType,
    })}`,
    payload
  );
  return withSuccess(response);
};

export const getFeeStructureById = async (id) => {
  const response = await authorizedGet(`${ADMIN_FEE_STRUCTURES_BASE}/${id}`);
  const rawDetailData = response?.data?.data ?? response?.data;
  const rawFeeStructure = Array.isArray(rawDetailData)
    ? rawDetailData[0] || {}
    : rawDetailData?.feeStructure || rawDetailData?.fee_structure || rawDetailData || response;
  const feeStructure = normalizeFeeStructure(rawFeeStructure);
  return withSuccess(response, {
    data: {
      feeStructure,
      usage_statistics: response?.data?.usage_statistics || null,
    },
    feeStructure,
    usage_statistics: response?.data?.usage_statistics || null,
  });
};

export const updateFeeStructure = async (id, feeStructureData) => {
  const response = await authorizedPut(
    `${ADMIN_FEE_STRUCTURES_BASE}/${id}`,
    toFeeStructurePayload(feeStructureData, true)
  );
  return withSuccess(response);
};

export const deleteFeeStructure = async (id) => {
  const response = await authorizedDelete(`${ADMIN_FEE_STRUCTURES_BASE}/${id}`);
  return withSuccess(response);
};

export const assignFeeWithInstallments = async (assignmentData) => {
  const academicYearId = assignmentData?.academic_year_id || resolveAcademicYearId(assignmentData);
  const payload = {
    fee_structure_id: toNumber(assignmentData.fee_structure_id),
    class_ids: [toNumber(assignmentData.class_section_id)],
    student_ids: toArray(assignmentData.student_ids),
    academic_year_id: toNumber(academicYearId),
    custom_items: assignmentData?.custom_items ?? null,
    excluded_heads: assignmentData?.excluded_heads ?? null,
    effective_from: assignmentData?.effective_from || null,
    effective_to: assignmentData?.effective_to || null,
    override_json: assignmentData?.override_json ?? null,
  };

  const response = await authorizedPost(`${ADMIN_FEE_ASSIGNMENTS_BASE}/bulk`, payload);
  const assignmentId =
    response?.data?.data?.id ||
    response?.data?.id ||
    response?.data?.assignment_id ||
    response?.data?.assignment?.id ||
    response?.assignment_id ||
    null;

  const baseAssignment = {
    id: assignmentId,
    fee_structure_id: payload.fee_structure_id,
    academic_year_id: payload.academic_year_id,
    class_id: payload.class_ids[0],
    effective_from: payload.effective_from,
    effective_to: payload.effective_to,
    custom_items: payload.custom_items,
    excluded_heads: payload.excluded_heads,
    override_json: payload.override_json,
    status: "active",
  };

  const assignmentView = {
    id: assignmentId || `${payload.class_ids[0]}-${payload.fee_structure_id}-${Date.now()}`,
    assignment_id: assignmentId || null,
    class_section: {
      id: payload.class_ids[0],
      class_name: assignmentData?.class_name || "Class",
      section_name: assignmentData?.section_name || "Section",
    },
    fee_structure: {
      id: payload.fee_structure_id,
      name: assignmentData?.fee_structure_name || `Structure ${payload.fee_structure_id}`,
      academic_year: payload.academic_year_id,
      total_amount: toNumber(assignmentData?.fee_structure_total_amount, 0),
    },
    installment_structure: [],
    statistics: {
      students_assigned: 0,
      discount_amount_per_student: 0,
    },
    effective_from: baseAssignment.effective_from || null,
    effective_to: baseAssignment.effective_to || null,
    status: baseAssignment.status || "active",
    raw: baseAssignment,
    created_at: nowIso(),
  };

  const cache = readAssignmentCache();
  writeAssignmentCache(mergeAssignment(cache, assignmentView));

  return withSuccess(response, {
    data: {
      assignment_id: assignmentId,
      assignment: assignmentView,
    },
    assignment_id: assignmentId,
  });
};

export const editClassFeeAssignment = async (assignmentData) => {
  return assignFeeWithInstallments(assignmentData);
};

export const getClassFeeAssignment = async (assignmentId) => {
  if (assignmentId !== undefined && assignmentId !== null && assignmentId !== "") {
    const response = await authorizedGet(`${ADMIN_FEE_ASSIGNMENTS_BASE}/${assignmentId}`);
    return withSuccess(response, {
      data: {
        assignment: response?.data?.data || response?.data || null,
      },
      assignment: response?.data?.data || response?.data || null,
    });
  }

  const response = await authorizedGet(`${ADMIN_FEE_ASSIGNMENTS_BASE}`);
  const assignments = toArray(response?.data?.data || response?.data || response).map((item) => ({
    id: item.id || `${item.fee_structure_id || "fs"}-${item.class_section_id || "cs"}-${item.academic_year_id || "ay"}`,
    assignment_id: item.id || null,
    student_id: item.student_id || null,
    fee_structure_id: item.fee_structure_id || item.feeStructure?.id,
    fee_structure_name: item.fee_structure_name || item.feeStructure?.name || "",
    class_section_id: item.class_section_id || item.class_section?.id || null,
    class_section_name: item.class_section_name || item.class_section?.name || "",
    academic_year_id: item.academic_year_id,
    academic_year_name: item.academic_year_name || "",
    assignment_type: item.assignment_type || item.fee_type || "recurring",
    fee_type: item.fee_type || item.assignment_type || "recurring",
    status: item.status || "active",
    total_amount: toNumber(item.total_amount ?? item.feeStructure?.total_amount),
    total_assigned_students: toNumber(item.total_assigned_students, 0),
    assigned_at: item.assigned_at || item.created_at || null,
    fee_structure: item.feeStructure
      ? {
          id: item.feeStructure.id,
          name: item.feeStructure.name || "",
          structure_type: item.feeStructure.structure_type || "recurring",
          is_active: item.feeStructure.is_active !== undefined ? Boolean(item.feeStructure.is_active) : true,
          total_amount: toNumber(item.total_amount ?? item.feeStructure.total_amount),
        }
      : {
          id: item.fee_structure_id,
          name: item.fee_structure_name || `Structure ${item.fee_structure_id || ""}`,
          structure_type: item.assignment_type || item.fee_type || "recurring",
          is_active: true,
          total_amount: toNumber(item.total_amount),
        },
    class_section: item.class_section
      ? {
          id: item.class_section.id,
          name: item.class_section.name || item.class_section_name || "",
          class_name: item.class_section.class_name || item.class_section_name || "",
        }
      : {
          id: item.class_section_id || null,
          name: item.class_section_name || "",
          class_name: item.class_section_name || "",
        },
    raw: item,
  }));

  writeAssignmentCache(assignments);
  return {
    success: true,
    message: response?.message || "Assignments loaded",
    data: { assignments, meta: response?.data?.meta || response?.meta || null },
    assignments,
    meta: response?.data?.meta || response?.meta || null,
  };
};

export const viewClassFeeAssignmentStudents = async (classSectionId, feeStructureId) => {
  const response = await feePost(`/assignments/preview/${feeStructureId}`, {
    class_ids: [toNumber(classSectionId)],
    student_ids: [],
  });

  const rawStudents =
    response?.data?.students ||
    response?.data?.target_students ||
    response?.data?.targets ||
    response?.students ||
    [];

  const students = toArray(rawStudents).map((student, index) => ({
    student_fee_id: student.student_fee_id || student.id || `s-${index + 1}`,
    roll_number: student.roll_number || student.roll_no || "-",
    student_name: student.student_name || student.name || "N/A",
    email: student.email || "",
    phone: student.phone || student.phone_no || "",
    original_amount: toNumber(student.original_amount),
    discount_amount: toNumber(student.discount_amount),
    final_amount: toNumber(student.final_amount || student.amount),
    discount_reason: student.discount_reason || "",
  }));

  const summary = {
    total_students: students.length,
    total_original_amount: students.reduce((sum, item) => sum + toNumber(item.original_amount), 0),
    total_discount: students.reduce((sum, item) => sum + toNumber(item.discount_amount), 0),
    total_final_amount: students.reduce((sum, item) => sum + toNumber(item.final_amount), 0),
  };

  return withSuccess(response, {
    data: {
      summary,
      students,
    },
    summary,
    students,
  });
};

export const deleteClassFeeAssignment = async (assignmentId, reason = "Fee assignment no longer required") => {
  const response = await authorizedPut(`${ADMIN_FEE_ASSIGNMENTS_BASE}/cancel/${assignmentId}`, {
    reason,
  });
  return withSuccess(response);
};

export const getOverdueInstallments = async () => {
  const response = await feeGet("/reports/dues");
  const overdueInstallments = toDuesRows(response);
  return withSuccess(response, {
    data: {
      overdue_installments: overdueInstallments,
      pagination: response?.data?.pagination || null,
    },
  });
};

export const getClassWiseDues = async (classSectionId) => {
  const response = await authorizedGet(`${ADMIN_FEES_BASE}/class-dues/${classSectionId}`);
  const payload = response?.data?.data ?? response?.data ?? {};
  const studentRows = Array.isArray(payload)
    ? payload
    : toArray(payload.students || payload.items || payload.records);

  const students = studentRows.map((student, studentIndex) => {
    const invoices = toArray(student.invoices).map((invoice, invoiceIndex) => ({
      id: invoice.id || `invoice-${studentIndex + 1}-${invoiceIndex + 1}`,
      invoice_number: invoice.invoice_number || invoice.invoice_no || `INV-${invoiceIndex + 1}`,
      invoice_no: invoice.invoice_no || invoice.invoice_number || `INV${invoiceIndex + 1}`,
      assignment_id: invoice.assignment_id || null,
      status: String(invoice.status || "pending").toLowerCase(),
      due_date: invoice.due_date || null,
      generated_at: invoice.generated_at || null,
      gross_amount: toNumber(invoice.gross_amount),
      concession_amount: toNumber(invoice.concession_amount),
      net_amount: toNumber(invoice.net_amount),
      fine_amount: toNumber(invoice.fine_amount),
      paid_amount: toNumber(invoice.paid_amount),
      balance_amount: toNumber(invoice.balance_amount),
      installment: invoice.installment || null,
      items: toArray(invoice.items),
    }));

    return {
      id: student.id || student.user_id || `student-${studentIndex + 1}`,
      user_id: student.user_id || null,
      name: student.name || "N/A",
      email: student.email || "",
      roll_number: student.roll_number || "N/A",
      phone_no: student.phone_no || "",
      total_dues: toNumber(student.total_dues),
      invoice_count: toNumber(student.invoice_count, invoices.length),
      invoices,
    };
  });

  return withSuccess(response, {
    data: {
      class_id: payload.class_id || classSectionId,
      total_students: toNumber(payload.total_students),
      students_with_dues: toNumber(payload.students_with_dues),
      total_dues_amount: toNumber(payload.total_dues_amount),
      total_invoices: toNumber(payload.total_invoices),
      students,
      pagination: response?.data?.meta || null,
    },
  });
};

export const getStudentFeesDetails = async (studentId) => {
  const resolvedStudentId = resolveStudentId(studentId);
  const [assignmentResponse, invoicesResponse] = await Promise.all([
    feeGet(`/students/${resolvedStudentId}/assignment`).catch(() => null),
    feeGet(`/students/${resolvedStudentId}/invoices`).catch(() => ({ data: [] })),
  ]);

  const assignment = assignmentResponse?.data || assignmentResponse || null;
  const invoices =
    invoicesResponse?.data?.invoices ||
    invoicesResponse?.data?.items ||
    invoicesResponse?.invoices ||
    invoicesResponse?.items ||
    invoicesResponse?.data ||
    [];

  const fees = toStudentInvoiceRows(invoices, assignment);

  return {
    success: true,
    data: {
      student_id: resolvedStudentId,
      user_id: resolvedStudentId,
      total_fees_assigned: fees.reduce((sum, row) => sum + toNumber(row.final_amount), 0),
      total_fee_records: fees.length,
      fees,
      assignment,
    },
  };
};

export const getStudentInvoicesList = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.academic_year_id) query.set("academic_year_id", params.academic_year_id);

  const endpoint = query.toString()
    ? `${STUDENT_FEES_BASE}/invoices?${query.toString()}`
    : `${STUDENT_FEES_BASE}/invoices`;

  const response = await authorizedGet(endpoint);
  const rawList = response?.data?.data || response?.data?.invoices || response?.data || [];
  const invoices = toArray(rawList).map((invoice, index) => normalizeStudentInvoice(invoice, index));

  return withSuccess(response, {
    data: invoices,
    invoices,
    meta: {
      total: toNumber(response?.data?.meta?.total, invoices.length),
    },
  });
};

export const getStudentInvoiceById = async (invoiceId) => {
  const response = await authorizedGet(`${STUDENT_FEES_BASE}/invoices/${invoiceId}`);
  const invoice = normalizeStudentInvoice(response?.data || response?.data?.data || {}, 0);

  return withSuccess(response, {
    data: invoice,
    invoice,
  });
};

export const getStudentSelfUnpaidInvoices = async () => {
  const response = await authorizedGet(`${STUDENT_FEES_BASE}/invoices/unpaid`);
  const rawList = response?.data?.data || response?.data || [];
  const invoices = toArray(rawList).map((invoice, index) => normalizeStudentInvoice(invoice, index));

  return withSuccess(response, {
    data: invoices,
    invoices,
    meta: {
      total: toNumber(response?.data?.meta?.total, invoices.length),
    },
  });
};

export const getStudentSelfFeeAssignment = async (academicYearId = null) => {
  const query = academicYearId ? `?academic_year_id=${academicYearId}` : "";
  const response = await authorizedGet(`${STUDENT_FEES_BASE}/assignment${query}`);
  const payload = response?.data?.data || response?.data || {};

  return withSuccess(response, {
    data: {
      fee_structure: payload?.fee_structure || null,
      installments: toArray(payload?.installments),
      invoices: toArray(payload?.invoices),
    },
  });
};

export const getStudentInstallments = async (studentId) => {
  const resolvedStudentId = resolveStudentId(studentId);
  const [assignmentResponse, invoicesResponse] = await Promise.all([
    feeGet(`/students/${resolvedStudentId}/assignment`).catch(() => ({ data: null })),
    feeGet(`/students/${resolvedStudentId}/invoices`).catch(() => ({ data: [] })),
  ]);

  const assignment = assignmentResponse?.data || null;
  const invoices =
    invoicesResponse?.data?.invoices ||
    invoicesResponse?.data?.items ||
    invoicesResponse?.data ||
    [];

  const feeRows = toStudentInvoiceRows(invoices, null).map((row) => {
    const amount = toNumber(row.final_amount);
    const paid = toNumber(row.paid_amount);
    const remaining = Math.max(amount - paid, 0);

    return {
      student_fee_id: row.id,
      fee_structure_name: row.fee_structure_name,
      academic_year: row.academic_year,
      installments: [
        {
          installment_id: row.id,
          installment_number: 1,
          amount,
          due_date: row.due_date,
          paid_amount: paid,
          remaining_amount: remaining,
          calculated_late_fee: toNumber(row.late_fee),
          payment_date: row.payment_date,
          status: remaining <= 0 ? "paid" : inferPaymentStatus(row),
          is_overdue: remaining > 0 && row.due_date ? new Date(row.due_date) < new Date() : false,
        },
      ],
    };
  });

  const installments = feeRows.flatMap((feeRecord) =>
    toArray(feeRecord.installments).map((installment) => {
      const lateFee = toNumber(installment.calculated_late_fee);
      const remainingAmount = toNumber(installment.remaining_amount);

      return {
        installment_id: installment.installment_id,
        installment_name: `Installment ${installment.installment_number}`,
        installment_number: installment.installment_number,
        fee_structure_name: feeRecord.fee_structure_name,
        academic_year: feeRecord.academic_year,
        amount: toNumber(installment.amount),
        paid_amount: toNumber(installment.paid_amount),
        due_amount: remainingAmount,
        late_fee: lateFee,
        due_date: installment.due_date,
        payment_date: installment.payment_date,
        status: installment.status,
      };
    })
  );

  return {
    success: true,
    data: {
      fee_records: feeRows,
      installments,
      student_info: {
        id: resolvedStudentId,
        name: assignment?.student_name || assignment?.name || `Student ${resolvedStudentId}`,
        email: assignment?.email || "",
        phone: assignment?.phone || "",
      },
    },
  };
};

export const getStudentUnpaidInvoices = async (studentId) => {
  const resolvedStudentId = resolveStudentId(studentId);
  const response = await authorizedGet(`${"/api/admin/fees"}/students/unpaid-invoices/${resolvedStudentId}`);

  const invoices =
    response?.data?.data ||
    response?.data?.invoices ||
    response?.data?.items ||
    response?.data ||
    [];

  const normalizedInvoices = toArray(invoices).map((invoice, index) => ({
    id: invoice.id || invoice.invoice_id || `invoice-${index + 1}`,
    invoice_number: invoice.invoice_number || invoice.invoice_no || `INV-${index + 1}`,
    student_id: invoice.student_id || resolvedStudentId,
    assignment_id: invoice.assignment_id || "",
    installment_plan_id: invoice.installment_plan_id || "",
    installment_name: invoice.installment_name || "",
    installment_number: invoice.installment_number || "",
    academic_year_id: invoice.academic_year_id || "",
    start_date: invoice.start_date || "",
    gross_amount: toNumber(invoice.gross_amount),
    concession_amount: toNumber(invoice.concession_amount),
    net_amount: toNumber(invoice.net_amount),
    fine_amount: toNumber(invoice.fine_amount),
    fine_type: invoice.fine_type || invoice.late_fine_type || "",
    calculated_fine: toNumber(invoice.calculated_fine),
    payable_amount: toNumber(invoice.payable_amount),
    paid_amount: toNumber(invoice.paid_amount),
    balance_amount: toNumber(invoice.balance_amount),
    status: invoice.status || "due",
    due_date: invoice.due_date || "",
    generated_at: invoice.generated_at || invoice.created_at || "",
    items: toArray(invoice.items).map((item) => ({
      id: item.id || "",
      fee_head_id: item.fee_head_id || "",
      gross_amount: toNumber(item.gross_amount),
      concession_amount: toNumber(item.concession_amount),
      net_amount: toNumber(item.net_amount),
    })),
  }));

  return withSuccess(response, {
    data: {
      invoices: normalizedInvoices,
      data: normalizedInvoices,
      total: toNumber(response?.data?.total, normalizedInvoices.length),
    },
    invoices: normalizedInvoices,
    total: toNumber(response?.data?.total, normalizedInvoices.length),
  });
};

export const getFeePayments = async () => {
  const response = await authorizedGet(ADMIN_FEE_PAYMENTS_BASE).catch(() => ({ data: [] }));
  const payments = getPaymentsFromResponse(response);
  const summary = getPaymentSummary(response, payments);
  const pagination = response?.data?.pagination || response?.pagination || null;

  return withSuccess(response, {
    data: {
      payments,
      summary,
      pagination,
      total_records: toNumber(response?.data?.total_records, payments.length),
    },
    payments,
    summary,
    pagination,
  });
};

export const getAllPayments = getFeePayments;

export const getPaymentDetails = async (id) => {
  const response = await authorizedGet(`${ADMIN_FEE_PAYMENTS_BASE}/${id}`);
  const payload = response?.data?.data || response?.data || response || {};
  const paymentRaw = payload?.payment || payload?.payment_details || payload;
  const payment = normalizePaymentRecord(paymentRaw);
  const studentRaw = payload?.student || payload?.student_info || paymentRaw?.student || payment.student || {};
  const student = normalizeStudentRecord(studentRaw);
  const receiptRaw =
    payload?.receipt ||
    payload?.payment_receipt ||
    payload?.invoice ||
    payload?.fee_invoice ||
    paymentRaw?.receipt ||
    null;
  const receiptNumber = receiptRaw?.receipt_number || receiptRaw?.receipt_no || payment.receipt_number;
  const details = {
    ...payment,
    student,
    receipt_number: receiptNumber,
    receipt: receiptRaw,
  };

  return withSuccess(response, {
    data: details,
    payment: details,
  });
};

export const createPayment = async (paymentData = {}) => {
  const payload = {
    invoice_id: paymentData.invoice_id ?? paymentData.invoiceId ?? null,
    amount_paid: toNumber(paymentData.amount_paid ?? paymentData.amount),
    payment_mode: String(paymentData.payment_mode || paymentData.payment_method || "cash").toLowerCase(),
    transaction_ref: paymentData.transaction_ref || paymentData.transaction_id || null,
    notes: paymentData.notes || paymentData.remarks || "",
    cheque_date: paymentData.cheque_date || null,
    cheque_bank: paymentData.cheque_bank || paymentData.bank_name || null,
  };

  const response = await authorizedPost(ADMIN_FEE_PAYMENTS_COLLECT_BASE, payload);
  const payment = normalizePaymentRecord(response?.data?.payment || response?.data || response);

  return withSuccess(response, {
    data: payment,
    payment,
  });
};

export const fillPayment = createPayment;

export const getStudentPaymentHistory = async (studentId) => {
  const resolvedStudentId = resolveStudentId(studentId);

  const [ledgerResponse, invoicesResponse] = await Promise.all([
    feeGet(`/reports/student-ledger/${resolvedStudentId}`).catch(() => ({ data: {} })),
    feeGet(`/students/${resolvedStudentId}/invoices`).catch(() => ({ data: [] })),
  ]);

  const invoices =
    invoicesResponse?.data?.invoices ||
    invoicesResponse?.data?.items ||
    invoicesResponse?.data ||
    [];

  const data = toHistoryPayload(ledgerResponse, invoices);
  return {
    success: true,
    data,
  };
};

export const createPaymentOrder = async (installmentId) => {
  const invoiceResponse = await feeGet(`/invoices/${installmentId}`).catch(() => ({ data: null }));
  const invoice = invoiceResponse?.data || {};

  const payableAmount =
    toNumber(invoice.amount_due) ||
    toNumber(invoice.remaining_amount) ||
    toNumber(invoice.final_amount) ||
    toNumber(invoice.total_amount) ||
    0;

  const response = await feePost("/payments/initiate-online", {
    invoice_id: String(installmentId),
    amount: payableAmount,
  });

  return withSuccess(response, {
    data: {
      order_id: response?.data?.order_id || response?.data?.orderId || response?.data?.id,
      amount: response?.data?.amount || payableAmount,
      currency: response?.data?.currency || "INR",
      key_id: response?.data?.key_id || response?.data?.keyId || "",
      payment_id: response?.data?.payment_id || response?.data?.paymentId || "",
      raw: response?.data || null,
    },
  });
};

export const verifyPayment = async () => {
  return {
    success: true,
    message: "Payment verification is handled by the Razorpay webhook and backend reconciliation.",
  };
};

export const getStudentCompleteFeeDetails = async (studentId, studentData = null) => {
  const resolvedStudentId = resolveStudentId(studentId);
  const response = await authorizedGet(`${ADMIN_STUDENT_FEE_ASSIGNMENT_BASE}/${resolvedStudentId}`);
  return normalizeStudentFeeAssignmentResponse(response, studentData);
};

export const getStudentFeeDetails = async (studentId) => {
  const response = await getStudentCompleteFeeDetails(studentId);
  const data = response?.data || {};
  const studentInfo = data?.student_info || {};
  const feeByYear = toArray(data?.fees_by_academic_year);

  const feeDetails = feeByYear.flatMap((year) =>
    toArray(year?.fee_structures).map((item, index) => ({
      id: `${year.academic_year || "year"}-${index + 1}`,
      academic_year: year.academic_year || "N/A",
      original_amount: toNumber(item.original_amount),
      discount_amount: toNumber(item.discount_amount),
      final_amount: toNumber(item.final_amount),
      installments: toArray(item.installments).map((installment, installmentIndex) => ({
        id: `${year.academic_year || "year"}-${index + 1}-${installmentIndex + 1}`,
        installment_number: installment.installment_number || installmentIndex + 1,
        amount: toNumber(installment.amount),
        paid_amount: toNumber(installment.paid_amount),
        status: installment.status || item.status || "pending",
      })),
    }))
  );

  const totalOriginalAmount = feeDetails.reduce((sum, item) => sum + toNumber(item.original_amount), 0);
  const totalDiscountAmount = feeDetails.reduce((sum, item) => sum + toNumber(item.discount_amount), 0);
  const totalFinalAmount = feeDetails.reduce((sum, item) => sum + toNumber(item.final_amount), 0);

  return {
    success: true,
    data: {
      student_info: {
        User: {
          name: studentInfo.name || `Student ${studentId}`,
          email: studentInfo.email || "",
        },
        roll_number: studentInfo.admission_number || "N/A",
        ClassSection: {
          class_name: studentInfo.class || "N/A",
          section: "",
        },
        gender: studentInfo.gender || "",
        phone_no: studentInfo.phone || "",
      },
      fee_summary: {
        total_original_amount: totalOriginalAmount,
        total_discount_amount: totalDiscountAmount,
        total_final_amount: totalFinalAmount,
        total_fees_assigned: feeDetails.length,
      },
      fee_details: feeDetails,
    },
  };
};

export const addAccountantFeeHead = createFeeHead;
export const getAccountantFeeHeads = async () => {
  const response = await getAllFeeHeads();
  return withSuccess(response, {
    data: {
      fee_heads: response?.fee_heads || response?.feeHeads || response?.data?.feeHeads || [],
    },
  });
};
export const updateAccountantFeeHead = updateFeeHead;
export const deleteAccountantFeeHead = deleteFeeHead;

export const addAccountantFeeStructure = createFeeStructure;
export const getAccountantFeeStructures = async () => {
  const response = await getAllFeeStructures();
  return withSuccess(response, {
    data: {
      fee_structures:
        response?.fee_structures || response?.feeStructures || response?.data?.feeStructures || [],
    },
  });
};
export const getAccountantFeeStructureById = async (id) => {
  const response = await getFeeStructureById(id);
  return withSuccess(response, { data: response?.feeStructure || response?.data?.feeStructure || {} });
};
export const updateAccountantFeeStructure = updateFeeStructure;
export const deleteAccountantFeeStructure = deleteFeeStructure;

export const assignFee = assignFeeWithInstallments;

export const getAssignedFeesByClass = async (classSectionId) => {
  const assignmentsResponse = await getClassFeeAssignment();
  const assignments = toArray(assignmentsResponse?.data?.assignments || assignmentsResponse?.assignments);
  const selected = assignments.filter(
    (item) => toNumber(item.class_section?.id) === toNumber(classSectionId)
  );

  const rows = [];

  for (const assignment of selected) {
    const preview = await viewClassFeeAssignmentStudents(
      assignment.class_section.id,
      assignment.fee_structure.id
    );

    const students = toArray(preview?.data?.students || preview?.students);

    students.forEach((student, index) => {
      const finalAmount = toNumber(student.final_amount || assignment.fee_structure.total_amount);
      rows.push({
        id: `${assignment.id}-${student.student_fee_id || index + 1}`,
        student: {
          User: {
            name: student.student_name || "N/A",
            email: student.email || "",
          },
          roll_number: student.roll_number || "-",
        },
        feeStructure: {
          name: assignment.fee_structure.name,
        },
        academic_year: assignment.fee_structure.academic_year || "N/A",
        original_amount: toNumber(student.original_amount || finalAmount),
        discount_amount: toNumber(student.discount_amount),
        discount_reason: student.discount_reason || "",
        final_amount: finalAmount,
        paid_amount: 0,
        due_amount: finalAmount,
        status: "due",
        installments: assignment.installment_structure || [],
      });
    });
  }

  return {
    success: true,
    data: rows,
  };
};
