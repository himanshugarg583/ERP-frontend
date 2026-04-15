import {
  authorizedDelete,
  authorizedGet,
  authorizedPost,
  authorizedPut,
  getAllClassesDropdown as getAllClassesDropdownBase,
  getStudentsByClass as getStudentsByClassBase,
} from "./apiMethods";

const FEES_BASE = "/api/v1/fees";
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
const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

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
const feePut = (path, data) => authorizedPut(`${FEES_BASE}${path}`, data);
const feeDelete = (path) => authorizedDelete(`${FEES_BASE}${path}`);

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

const normalizeFeeStructure = (raw = {}) => {
  const classIds = toArray(raw.class_ids || raw.classIds).map((value) => toNumber(value));
  const firstInstallment = toArray(raw.installments)[0] || {};
  const items = toArray(raw.items || raw.fee_details || raw.feeDetails).map((item, index) => ({
    id: item.id || `${raw.id || raw._id || "fs"}-${index + 1}`,
    fee_head_id: item.fee_head_id || item.feeHead?.id || item.feeHeadId,
    amount: toNumber(item.amount),
    is_mandatory: item.is_mandatory !== undefined ? Boolean(item.is_mandatory) : true,
    sequence_order: item.sequence_order || item.sort_order || index + 1,
    feeHead: item.feeHead || {
      id: item.fee_head_id,
      name: item.fee_head_name || item.name || `Fee Head ${index + 1}`,
      description: item.description || "",
    },
  }));

  const totalAmount = items.reduce((sum, item) => sum + toNumber(item.amount), 0);

  return {
    id: raw.id || raw._id,
    name: raw.name || "",
    class_ids: classIds,
    class_section_id: classIds[0] || "",
    academic_year_id: raw.academic_year_id || "",
    academic_start_year: raw.academic_start_year || "",
    academic_end_year: raw.academic_end_year || "",
    due_date: toIsoDate(firstInstallment.due_date || raw.due_date),
    late_fee_amount: toNumber(firstInstallment.late_fine_value || raw.late_fee_amount),
    late_fee_type: firstInstallment.late_fine_type || raw.late_fee_type || "flat",
    fee_details: items,
    feeDetails: items,
    installments: toArray(raw.installments),
    classSection: raw.classSection || {
      id: classIds[0] || "",
      class_name: raw.class_name || `Class ${classIds[0] || ""}`,
      section_name: raw.section_name || "Section",
    },
    description: raw.description || "",
    structure_type: raw.structure_type || "recurring",
    total_amount: totalAmount,
    usage_statistics: raw.usage_statistics || null,
    is_active: raw.is_active !== undefined ? Boolean(raw.is_active) : true,
  };
};

const normalizeFeeStructureList = (response) => {
  const list =
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
  const classIds = toArray(payload.class_ids).length
    ? toArray(payload.class_ids).map((value) => toNumber(value))
    : payload.class_section_id
    ? [toNumber(payload.class_section_id)]
    : [];

  const feeItems = toArray(payload.items).length
    ? toArray(payload.items)
    : toArray(payload.fee_details).map((detail, index) => ({
        fee_head_id: String(detail.fee_head_id),
        amount: toNumber(detail.amount),
        is_mandatory: detail.is_mandatory !== undefined ? Boolean(detail.is_mandatory) : true,
        sort_order: detail.sequence_order || index + 1,
      }));

  const installments = toArray(payload.installments).length
    ? toArray(payload.installments).map((inst, index) => ({
        name: inst.name || `Installment ${inst.installment_number || index + 1}`,
        installment_number: inst.installment_number || index + 1,
        due_date: toIsoDate(inst.due_date),
        percentage: inst.percentage || 100,
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
          due_date: toIsoDate(payload.due_date),
          percentage: 100,
          late_fine_type: payload.late_fee_type || "none",
          late_fine_value: toNumber(payload.late_fee_amount),
          grace_period_days: 0,
        },
      ]
    : [];

  const base = {
    name: payload.name,
    academic_year_id: resolveAcademicYearId(payload),
    applicable_to: payload.applicable_to || "class",
    class_ids: classIds,
    description:
      payload.description ||
      (payload.academic_start_year && payload.academic_end_year
        ? `Academic session ${payload.academic_start_year}-${payload.academic_end_year}`
        : "Fee structure"),
    structure_type: payload.structure_type || "recurring",
  };

  if (!isUpdate || feeItems.length > 0) {
    base.items = feeItems;
  }

  if (!isUpdate || installments.length > 0) {
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

const buildAssignmentViewModel = async (payload, assignmentId) => {
  const classSectionsResponse = await getAllClassesDropdown();
  const classSections = toArray(classSectionsResponse?.data || classSectionsResponse);
  const classSection = classSections.find((item) => item.id === toNumber(payload.class_section_id));

  const structuresResponse = await feeGet("/fee-structures");
  const structures = normalizeFeeStructureList(structuresResponse);
  const structure = structures.find((item) => toNumber(item.id) === toNumber(payload.fee_structure_id));

  return {
    id: assignmentId || `${payload.class_section_id}-${payload.fee_structure_id}-${Date.now()}`,
    assignment_id: assignmentId || null,
    class_section: {
      id: toNumber(payload.class_section_id),
      class_name: classSection?.class_name || `Class ${payload.class_section_id}`,
      section_name: classSection?.section_name || "Section",
    },
    fee_structure: {
      id: toNumber(payload.fee_structure_id),
      name: structure?.name || `Structure ${payload.fee_structure_id}`,
      academic_year:
        structure?.academic_start_year && structure?.academic_end_year
          ? `${structure.academic_start_year}-${structure.academic_end_year}`
          : "N/A",
      total_amount: structure?.total_amount || 0,
    },
    installment_structure: toArray(payload.installments).map((inst, index) => ({
      installment_number: inst.installment_number || index + 1,
      amount: toNumber(inst.amount),
      due_date: toIsoDate(inst.due_date),
    })),
    statistics: {
      students_assigned: 0,
      discount_amount_per_student: toNumber(payload.discount_amount),
    },
    raw_payload: payload,
    created_at: nowIso(),
  };
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
  const normalizedStudent = normalizeStudentRecord(studentRaw, index);

  const amountPaid = toNumber(raw.amount_paid || raw.amount || raw.paid_amount || raw.credit);
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
    payment_method: String(raw.payment_method || raw.mode || "cash").toLowerCase(),
    payment_status: String(raw.payment_status || raw.status || "success").toLowerCase(),
    payment_type: raw.payment_type || "fee",
    payment_for: raw.payment_for || raw.description || "Fee Payment",
    transaction_id: raw.transaction_id || "",
    cheque_number: raw.cheque_number || "",
    bank_name: raw.bank_name || "",
    is_refund: Boolean(raw.is_refund),
    refund_reason: raw.refund_reason || "",
    remarks: raw.remarks || "",
    created_at: raw.created_at || raw.createdAt || nowIso(),
    updated_at: raw.updated_at || raw.updatedAt || nowIso(),
    student: normalizedStudent,
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

export const getAllClassesDropdown = async () => getAllClassesDropdownBase();
export const getClassSectionDropdown = async () => {
  const response = await getAllClassesDropdownBase();
  const data = toArray(response?.data || response);
  return withSuccess(response, { data });
};

export const getClassDropdown = getClassSectionDropdown;

export const getStudentsByClass = async (classId) => {
  const response = await getStudentsByClassBase(classId);
  const students = toArray(response?.data || response).map(normalizeStudentRecord);
  return withSuccess(response, {
    data: students,
    students,
  });
};

export const getAllStudentsByClass = getStudentsByClass;

export const getAllFeeHeads = async () => {
  const response = await feeGet("/fee-heads");
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
    category: feeHeadData?.category || "general",
    description: feeHeadData?.description || "",
    is_optional: feeHeadData?.is_optional ?? !feeHeadData?.is_mandatory,
    is_refundable: Boolean(feeHeadData?.is_refundable),
    ledger_code: feeHeadData?.ledger_code || "",
  };

  const response = await feePost("/fee-heads", payload);
  return withSuccess(response);
};

export const getFeeHeadById = async (id) => {
  const response = await feeGet(`/fee-heads/${id}`);
  const feeHead = normalizeFeeHead(response?.data || response);
  return withSuccess(response, { data: { feeHead }, feeHead });
};

export const updateFeeHead = async (id, feeHeadData) => {
  const payload = {
    name: feeHeadData?.name,
    category: feeHeadData?.category || "general",
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

  const response = await feePut(`/fee-heads/${id}`, payload);
  return withSuccess(response);
};

export const deleteFeeHead = async (id) => {
  const response = await feeDelete(`/fee-heads/${id}`);
  return withSuccess(response);
};

export const getAllFeeStructures = async () => {
  const response = await feeGet("/fee-structures");
  const feeStructures = normalizeFeeStructureList(response);
  return withSuccess(response, {
    data: { feeStructures, fee_structures: feeStructures },
    feeStructures,
    fee_structures: feeStructures,
  });
};

export const createFeeStructure = async (feeStructureData) => {
  const response = await feePost("/fee-structures", toFeeStructurePayload(feeStructureData));
  return withSuccess(response);
};

export const getFeeStructureById = async (id) => {
  const response = await feeGet(`/fee-structures/${id}`);
  const feeStructure = normalizeFeeStructure(response?.data || response);
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
  const response = await feePut(`/fee-structures/${id}`, toFeeStructurePayload(feeStructureData, true));
  return withSuccess(response);
};

export const deleteFeeStructure = async (id) => {
  const response = await feeDelete(`/fee-structures/${id}`);
  return withSuccess(response);
};

export const assignFeeWithInstallments = async (assignmentData) => {
  const payload = {
    fee_structure_id: String(assignmentData.fee_structure_id),
    class_ids: [toNumber(assignmentData.class_section_id)],
    student_ids: [],
    academic_year_id: resolveAcademicYearId(assignmentData),
    custom_items: [],
    excluded_heads: [],
  };

  const response = await feePost("/assignments/bulk", payload);
  const assignmentId =
    response?.data?.assignment_id ||
    response?.data?.id ||
    response?.data?.assignment?.id ||
    null;

  const assignmentView = await buildAssignmentViewModel(assignmentData, assignmentId);
  const cache = readAssignmentCache();
  writeAssignmentCache(mergeAssignment(cache, assignmentView));

  return withSuccess(response, {
    data: {
      assignment: assignmentView,
    },
  });
};

export const editClassFeeAssignment = async (assignmentData) => {
  return assignFeeWithInstallments(assignmentData);
};

export const getClassFeeAssignment = async () => {
  const assignments = readAssignmentCache();
  return {
    success: true,
    message: "Assignments loaded",
    data: { assignments },
    assignments,
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

export const deleteClassFeeAssignment = async (classSectionId, feeStructureId) => {
  const cached = readAssignmentCache();
  const match = cached.find(
    (item) =>
      toNumber(item.class_section?.id) === toNumber(classSectionId) &&
      toNumber(item.fee_structure?.id) === toNumber(feeStructureId)
  );

  if (match?.assignment_id) {
    await feePut(`/assignments/${match.assignment_id}/cancel`, {
      reason: "Cancelled from fee assignment screen",
    });
  }

  const filtered = cached.filter(
    (item) =>
      !(
        toNumber(item.class_section?.id) === toNumber(classSectionId) &&
        toNumber(item.fee_structure?.id) === toNumber(feeStructureId)
      )
  );

  writeAssignmentCache(filtered);
  return {
    success: true,
    message: "Assignment deleted",
  };
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

export const getFeePayments = async () => {
  const response = await feeGet("/payments").catch(() => ({ data: [] }));
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
  const response = await feeGet(`/payments/${id}`);
  const payment = normalizePaymentRecord(response?.data || response);

  return withSuccess(response, {
    data: payment,
    payment,
  });
};

export const createPayment = async (paymentData = {}) => {
  const installmentIds = toArray(paymentData.installment_ids || paymentData.invoice_ids).map((item) =>
    String(item)
  );

  const payload = {
    student_id: String(paymentData.student_id || ""),
    invoice_ids: installmentIds,
    amount: toNumber(paymentData.amount ?? paymentData.amount_paid),
    amount_paid: toNumber(paymentData.amount_paid ?? paymentData.amount),
    late_fee_paid: toNumber(paymentData.late_fee_paid),
    payment_method: String(paymentData.payment_method || "cash").toLowerCase(),
    payment_for: paymentData.payment_for || "Fee Payment",
    transaction_id: paymentData.transaction_id || null,
    cheque_number: paymentData.cheque_number || null,
    bank_name: paymentData.bank_name || null,
    remarks: paymentData.remarks || "",
    academic_year_id: resolveAcademicYearId(paymentData),
  };

  const response = await feePost("/payments", payload);
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

export const getStudentCompleteFeeDetails = async (studentId) => {
  const resolvedStudentId = resolveStudentId(studentId);
  const [assignmentResponse, concessionsResponse, invoicesResponse] = await Promise.all([
    feeGet(`/students/${resolvedStudentId}/assignment`).catch(() => ({ data: null })),
    feeGet(`/students/${resolvedStudentId}/concessions`).catch(() => ({ data: [] })),
    feeGet(`/students/${resolvedStudentId}/invoices`).catch(() => ({ data: [] })),
  ]);

  const assignment = assignmentResponse?.data || null;
  const concessions =
    concessionsResponse?.data?.concessions ||
    concessionsResponse?.data?.items ||
    concessionsResponse?.data ||
    [];
  const invoices =
    invoicesResponse?.data?.invoices ||
    invoicesResponse?.data?.items ||
    invoicesResponse?.data ||
    [];

  const invoiceRows = toStudentInvoiceRows(invoices, assignment);

  const totalAssigned = invoiceRows.reduce((sum, row) => sum + toNumber(row.final_amount), 0);
  const totalPaid = invoiceRows.reduce((sum, row) => sum + toNumber(row.paid_amount), 0);
  const totalDue = Math.max(totalAssigned - totalPaid, 0);
  const totalDiscount = invoiceRows.reduce((sum, row) => sum + toNumber(row.discount_amount), 0);

  const feeStructureRows = invoiceRows.map((row) => {
    const status = inferPaymentStatus(row);
    return {
      status,
      original_amount: toNumber(row.original_amount),
      discount_amount: toNumber(row.discount_amount),
      discount_reason: row.discount_reason,
      final_amount: toNumber(row.final_amount),
      fee_structure: {
        name: row.fee_structure_name,
        due_date: row.due_date,
      },
      installments: [
        {
          installment_number: 1,
          amount: toNumber(row.final_amount),
          due_date: row.due_date,
          paid_amount: toNumber(row.paid_amount),
          payment_date: row.payment_date,
          late_fee_applied: toNumber(row.late_fee),
          status,
        },
      ],
    };
  });

  return {
    success: true,
    data: {
      student_info: {
        name: assignment?.student_name || `Student ${resolvedStudentId}`,
        admission_number: resolvedStudentId,
        class: assignment?.class_name || "N/A",
        email: assignment?.email || "",
        phone: assignment?.phone || "",
      },
      summary: {
        total_assigned_fee: totalAssigned,
        total_paid_fee: totalPaid,
        total_due_fee: totalDue,
        total_discount: totalDiscount,
        installments_summary: {
          total_installments: feeStructureRows.length,
          paid_installments: feeStructureRows.filter((row) => row.status === "paid").length,
          pending_installments: feeStructureRows.filter((row) => row.status === "pending").length,
          overdue_installments: feeStructureRows.filter((row) => row.status === "overdue").length,
        },
      },
      concessions,
      fees_by_academic_year: [
        {
          academic_year: assignment?.academic_year || "N/A",
          total_assigned: totalAssigned,
          total_paid: totalPaid,
          total_due: totalDue,
          fee_structures: feeStructureRows,
        },
      ],
    },
  };
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
