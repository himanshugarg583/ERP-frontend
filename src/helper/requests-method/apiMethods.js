// Staff ID Card endpoints
export const generateStaffIdCard = async (user_id) => {
  return authorizedPost(API_ENDPOINTS.GENERATE_SATFF_ID_CARD, { user_id });
};

export const generateMultipleStaffIdCards = async (user_ids) => {
  return authorizedPost(API_ENDPOINTS.GENERATE_SATFF_ID_CARDS, { user_ids });
};

export const getAccountantDashboardStats = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ACCOUNTANT_DASHBOARD_STATS);
};

export const getAccountantMonthlyCollection = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ACCOUNTANT_MONTHLY_COLLECTION);
};

export const getAccountantIncomeExpenseChart = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ACCOUNTANT_INCOME_EXPENSE_CHART);
};

export const getAccountantRecentPayments = async (limit = 10) => {
  return authorizedGet(API_ENDPOINTS.GET_ACCOUNTANT_RECENT_PAYMENTS(limit));
};

export const getOverdueInstallments = async () => {
  return authorizedGet(API_ENDPOINTS.GET_OVERDUE_INSTALLMENTS);
};

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001'; // Backend base URL

// Centralized endpoints
export const API_ENDPOINTS = {
    // Fee Management endpoints
    CREATE_FEE_HEAD: '/admin/fees/createFeeHead',
    GET_ALL_FEE_HEADS: '/admin/fees/getAllFeeHeads',
    GET_FEE_HEAD_BY_ID: (id) => `/admin/fees/getFeeHead/${id}`,
    UPDATE_FEE_HEAD: (id) => `/admin/fees/updateFeeHead/${id}`,
    DELETE_FEE_HEAD: (id) => `/admin/fees/deleteFeeHead/${id}`,

    CREATE_FEE_STRUCTURE: '/admin/feeStructure/createFeeStructure',
    GET_ALL_FEE_STRUCTURES: '/admin/feeStructure/getAllFeeStructures',
    GET_FEE_STRUCTURE_BY_ID: (id) => `/admin/feeStructure/getSingleFeeStructure/${id}`,
    UPDATE_FEE_STRUCTURE: (id) => `/admin/feeStructure/updateFeeStructure/${id}`,
    DELETE_FEE_STRUCTURE: (id) => `/admin/feeStructure/deleteFeeStructure/${id}`,

    ASSIGN_FEE_TO_STUDENTS: '/admin/fees_collection/assignFeeToStudents',
    ASSIGN_FEE_WITH_INSTALLMENTS: '/admin/studentFee/assignFeeWithInstallments',
    GET_ALL_FEE_ASSIGNMENTS: '/admin/fees_collection/getAllFeeAssignments',
    GET_CLASS_FEE_ASSIGNMENT: '/admin/studentFee/getClassFeeAssignment',
    EDIT_CLASS_FEE_ASSIGNMENT: '/admin/studentFee/editClassFeeAssignment',
    VIEW_CLASS_FEE_ASSIGNMENT_STUDENTS: '/admin/studentFee/viewClassFeeAssignmentStudents',
    DELETE_CLASS_FEE_ASSIGNMENT: '/admin/studentFee/deleteClassFeeAssignment',
    GET_STUDENTS_BY_CLASS_SECTION: (classId, sectionId) => `/admin/fees_collection/getStudentsByClassSection?class_id=${classId}&section_id=${sectionId}`,
    GET_STUDENT_FEE_REPORT: (studentId) => `/admin/fees_collection/getStudentFeeReport/${studentId}`,
    GET_STUDENTS_FEE_SUMMARY: (classId, sectionId) => `/admin/fees_collection/getStudentsFeeSummary?class_id=${classId}&section_id=${sectionId}`,
    GET_ALL_PAYMENTS: '/admin/feePayment/getAllPayments',
    GET_PAYMENT_DETAILS: (id) => `/admin/feePayment/getPaymentDetails/${id}`,
    GET_PAYMENT_BY_ID: (id) => `/admin/fees_collection/getPayment/${id}`,
    CREATE_PAYMENT: '/admin/feePayment/createPayment',
    GET_STUDENT_FEE_DETAILS: (studentId) => `/api/accountant/student-fee-details/${studentId}`,
    GET_FEE_PAYMENTS: '/api/accountant/fee-payments',
    GET_ACCOUNTANT_PROFILE: '/api/accountant/profile/me',
    CHANGE_ACCOUNTANT_PASSWORD: '/api/accountant/profile/change-password',
    
    // Accountant Payment endpoints
    FILL_PAYMENT: '/api/accountant/fees/fill-payment',
    GET_ACCOUNTANT_STUDENT_INSTALLMENTS: (studentId) => `/api/accountant/fees/student-installments/${studentId}`,
    GET_ACCOUNTANT_DASHBOARD_STATS: '/api/accountant/dashboard/stats',
    GET_ACCOUNTANT_MONTHLY_COLLECTION: '/api/accountant/dashboard/monthly-collection',
    GET_ACCOUNTANT_INCOME_EXPENSE_CHART: '/api/accountant/dashboard/income-expense-chart',
    GET_ACCOUNTANT_RECENT_PAYMENTS: (limit) => `/api/accountant/dashboard/recent-payments?limit=${limit}`,
    
    // Admin Dashboard endpoints
    GET_OVERDUE_INSTALLMENTS: '/admin/studentFeeInstallment/overdue',
    
  LOGIN: '/api/auth/login',
  SIGNUP: '/api/auth/signup',
  REQUEST_PASSWORD_RESET: '/api/auth/request-password-reset',
  GET_ALL_ENQUIRIES: '/api/admissionenquiry/getAllEnquiries',
  CREATE_ENQUIRY: '/api/admissionenquiry/createEnquiry',
  UPDATE_ENQUIRY: (id) => `/api/admissionenquiry/updateEnquiry/${id}`,
  DELETE_ENQUIRY: (id) => `/api/admissionenquiry/deleteEnquiry/${id}`,
  GET_ENQUIRY_COUNT: '/api/admissionenquiry/getEnquiryCount',
  ADD_STUDENT: '/admin/studentinfo/addStudent',
  GET_CLASS_DROPDOWN: '/admin/dropdown/getClassDropdown',
  GET_TEACHER_DROPDOWN: '/admin/dropdown/getTeacherDropdown',
  CREATE_CLASS: '/api/Classsection/createClass',
  ADD_SUBJECT: '/admin/Subject/addSubject',
  // ADD_TEACHER: '/admin/hr/register/addTeacher',
  GET_TEACHER_CREDENTIALS: '/api/teachers/credentials',
  UPDATE_TEACHER_CREDENTIALS: (id) => `/api/teachers/credentials/${id}`,
  // Income endpoints
  GET_ALL_INCOME: '/admin/income/getAllIncome',
  ADD_INCOME: '/admin/income/createIncome',
  GET_INCOME_BY_ID: (id) => `/admin/income/getSingleIncome/${id}`,  
  UPDATE_INCOME: (id) => `/admin/income/updateIncome/${id}`,
  DELETE_INCOME: (id) => `/admin/income/deleteIncome/${id}`,
  
  // Accountant Income endpoints
  ADD_ACCOUNTANT_INCOME: '/api/accountant/income',
  GET_ACCOUNTANT_INCOME_LIST: '/api/accountant/income-list',
  UPDATE_ACCOUNTANT_INCOME_EXPENSE: (id) => `/api/accountant/income-expense/${id}`,
  DELETE_ACCOUNTANT_INCOME_EXPENSE: (id) => `/api/accountant/income-expense/${id}`,
  
  // Accountant Expense endpoints
  ADD_ACCOUNTANT_EXPENSE: '/api/accountant/expense',
  GET_ACCOUNTANT_EXPENSE_LIST: '/api/accountant/expense-list',
  GET_ACCOUNTANT_INCOME_EXPENSE_GRAPH: '/api/accountant/income-expense-graph',
  GET_ACCOUNTANT_MONTHLY_EXPENSE: '/api/accountant/monthly-expense',

  // Accountant Fee Head endpoints
  ADD_ACCOUNTANT_FEE_HEAD: '/api/accountant/fees/fee-head',
  GET_ACCOUNTANT_FEE_HEADS: '/api/accountant/fees/fee-head',
  UPDATE_ACCOUNTANT_FEE_HEAD: (id) => `/api/accountant/fees/fee-head/${id}`,
  DELETE_ACCOUNTANT_FEE_HEAD: (id) => `/api/accountant/fees/fee-head/${id}`,

  // Accountant Fee Structure endpoints
  ADD_ACCOUNTANT_FEE_STRUCTURE: '/api/accountant/fees/fee-structure',
  GET_ACCOUNTANT_FEE_STRUCTURES: '/api/accountant/fees/fee-structure',
  GET_ACCOUNTANT_FEE_STRUCTURE_BY_ID: (id) => `/api/accountant/fees/fee-structure/${id}`,
  UPDATE_ACCOUNTANT_FEE_STRUCTURE: (id) => `/api/accountant/fees/fee-structure/${id}`,
  DELETE_ACCOUNTANT_FEE_STRUCTURE: (id) => `/api/accountant/fees/fee-structure/${id}`,

  // Class Section Dropdown
  GET_CLASS_SECTION_DROPDOWN: '/admin/dropdown/getClassDropdown',

  // Assign Fee
  ASSIGN_FEE: '/api/accountant/assign-fee',
  GET_ASSIGNED_FEES_BY_CLASS: (class_section_id) => `/api/accountant/assigned-fees/${class_section_id}`,

  // Expense endpoints
  GET_ALL_EXPENSE: '/admin/expense/getAllExpense',
  ADD_EXPENSE: '/admin/expense/createExpense',
  GET_EXPENSE_BY_ID: (id) => `/admin/expense/getSingleExpense/${id}`,  
  UPDATE_EXPENSE: (id) => `/admin/expense/updateExpense/${id}`,
  DELETE_EXPENSE: (id) => `/admin/expense/deleteExpense/${id}`,
  // Subject endpoints
  GET_ALL_SUBJECTS: '/admin/Subject/getAllSubjects',
  CREATE_SUBJECT: '/admin/Subject/createSubject',
  UPDATE_SUBJECT: (id) => `/admin/Subject/updateSubject/${id}`,
  DELETE_SUBJECT: (id) => `/admin/Subject/deleteSubject/${id}`,
  // student attendance endpoints
  GET_ALL_CLASSES: '/admin/studentsAttendance/getAllClasses',
  GET_STUDENTS_BY_CLASS: (classId) => `/admin/studentsAttendance/getStudentsByClass/${classId}`,
  GET_ADMIN_CLASS_ATTENDANCE_BY_DATE: (classSectionId, date) => `/admin/studentsAttendance/getClassAttendanceByDate?class_section_id=${classSectionId}&date=${date}`,
  MARK_ATTENDANCE: '/admin/studentsAttendance/markClassAttendance',
  // student leave endpoints
  GET_ALL_LEAVES: '/admin/studentLeave/getAllLeaves',
  APPLY_LEAVE: '/admin/studentLeave/applyLeave',
  GET_LEAVE_BY_ID: (id) => `/admin/studentLeave/getLeave/${id}`,
  UPDATE_LEAVE: (id) => `/admin/studentLeave/updateLeaveStatus/${id}`,
  DELETE_ADMIN_LEAVE: (id) => `/admin/studentLeave/deleteLeave/${id}`,
  CREATE_HOLIDAY: '/admin/holiday/createHoliday',
  GET_ALL_HOLIDAYS: (month, year) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    const query = params.toString();
    return `/admin/holiday/getAllHolidays${query ? `?${query}` : ''}`;
  },
  GET_HOLIDAY_BY_DATE: (holidayDate) => `/admin/holiday/getHolidayByDate?holiday_date=${holidayDate}`,
  DELETE_HOLIDAY: (id) => `/admin/holiday/deleteHoliday/${id}`,

  // student information endpoints
  GET_ALL_STUDENTS: '/admin/studentInfo/getAllStudents',
  GET_STUDENT_STATES: '/admin/studentInfo/getStudentStats',
  UPDATE_STUDENT: (id) => `/api/admin/updateStudent/${id}`,
  DELETE_STUDENT: (studentId) => `/admin/studentInfo/deleteStudent/${studentId}`,
  GET_STUDENT_REPORT: (classId) => `/admin/studentInfo/getStudentReport/${classId}`,
  GET_PARENT_REPORT: (classId) => `/admin/studentInfo/getParentReport/${classId}`,
  GET_STUDENT_CREDENTIALS: (classId) => `/admin/studentInfo/getStudentCredentials?class_id=${classId}`,
  GET_CLASS_STATES: () => `/admin/studentInfo/getClassWiseStudentStats`,


  // Certificate endpoints
  GENERATE_ID_CARD: '/admin/certificate/generateIdCard',
  GENERATE_ID_CARDS: '/admin/certificate/generateMultipleIdCards',
  GENERATE_SATFF_ID_CARD: '/admin/certificate/generateStaffIdCard',
  GENERATE_SATFF_ID_CARDS: '/admin/certificate/generateMultipleStaffIdCards',

  // admit card related endpoints
  GET_ALL_EXAM_TERMS_FOR_ADMIT_CARD: '/admin/dropdown/getExamTermDropdown',
  GET_EXAM_BY_TERM: (examTermId) => `/admin/dropdown/getExamDropdown?term_id=${examTermId}`,
  GET_EXAM_DROPDOWN: (termId) => `/admin/dropdown/getExamDropdown?term_id=${termId}`,
  GET_EXAM_SCHEDULE_BY_EXAM: (examId) => `/admin/dropdown/getExamScheduleByExam?exam_id=${examId}`,
  GET_STUDENT_ADMIT_CARD: (studentId, examId) => `/admin/admitCard/getStudentAdmitCard?student_id=${studentId}&exam_id=${examId}`,
  GET_CLASS_ADMIT_CARDS: (classId, examId, classSectionId) => `/admin/admitCard/getClassAdmitCards/${classId}?exam_id=${examId}&class_section_id=${classSectionId}`,
  GET_STUDENTS_EXAM_LIST: (classId, examTermId,classSectionId) => `/admin/admitCard/getExamStudentList?term_id=${classId}&exam_id=${examTermId}&class_section_id=${classSectionId}`,
 
  // exam timetable endpoints
  CREATE_EXAM_TIMETABLE: '/admin/examTimetable/createExamTimetable',
  GET_CLASS_SCHEDULED_EXAMS: (classSectionId) => `/admin/examTimetable/getClassScheduledExams/${classSectionId}`,
  GET_EXAM_TIMETABLE_BY_CLASS_AND_EXAM: (examId, classSectionId) => `/admin/examTimetable/getExamTimetableByClassAndExam?exam_id=${examId}&class_section_id=${classSectionId}`,
  
  // dashboard endpoints
  GET_DASHBOARD_STATS: '/admin/dashboard/stats',
  GET_MONTHLY_INCOME_EXPENSE: '/admin/dashboard/monthly-income-expense',
  GET_PAYMENT_MODE_COLLECTION: '/admin/dashboard/payment-mode-collection',
  GET_CLASS_WISE_ATTENDANCE: '/admin/dashboard/class-wise-attendance',
  GET_NOTICES: '/admin/dashboard/notices',
  GET_MONTHLY_FEE_COLLECTION: '/admin/dashboard/monthly-fee-collection',
  GET_FEE_ASSIGNMENT_COLLECTION: '/admin/dashboard/fee-assignment-collection',
  GET_STUDENT_DASHBOARD_STATS: '/student/dashboard/stats',
  GET_TODAY_CLASSES: '/student/dashboard/today-classes',
  GET_WEEKLY_TIMETABLE: '/student/dashboard/weekly-timetable',
  GET_PENDING_ASSIGNMENTS: '/student/dashboard/pending-assignments',
  GET_STUDENT_NOTICES: '/student/dashboard/notices',
  GET_ACADEMIC_PERFORMANCE: (examId) => `/student/dashboard/academic-performance?exam_id=${examId}`,
  GET_TEACHER_DASHBOARD_STATS: '/teacher/dashboard/stats',
  GET_TEACHER_TODAY_CLASSES: '/teacher/dashboard/today-classes',
  LOGOUT: '/api/auth/logout',

  // student report endpoints
  GET_STUDENT_REPORT_BY_DATE: (className, sectionName, date) => `/admin/studentsAttendance/attendanceReport?class_name=${className}&section_name=${sectionName}&date=${date}`,
  GET_STUDENT_REPORT_BY_MONTH: (className, sectionName, month, year) => `/admin/studentsAttendance/monthlyAttendanceReport?class_name=${className}&section_name=${sectionName}&month=${month}&year=${year}`,
  GET_CLASS_WISE_SUMMARY: (date) => `/admin/studentsAttendance/classWiseSummary?date=${date}`,
  
  // student fee details endpoint
  GET_STUDENT_COMPLETE_FEE_DETAILS: (studentId) => `/admin/studentFee/getStudentCompleteFeeDetails/${studentId}`,

  // get class sections endpoint
  GET_ALL_CLASSES_DROPDOWN: '/admin/dropdown/getClassDropdown',
  // get students by class and section
  GET_ALL_STUDENTS_BY_CLASS: (classId) => `/admin/dropdown/getStudentsByClass/${classId}`,
  // class section endpoints
  CREATE_CLASSES: '/api/Classsection/createClass',
  GET_ALL_CLASS_SECTIONS: '/api/Classsection/getAllClassSections',
  UPDATE_CLASS_SECTION: (id) => `/api/Classsection/updateClassSection/${id}`,
  DELETE_CLASS_SECTION: (id) => `/api/Classsection/DeleteClassSection/${id}`,

  // subject endpoints
  ADD_SUBJECTS: '/admin/Subject/addSubject',
  GET_ALL_SUBJECTS_CLASS: '/admin/Subject/getAllSubjectsWithDetails',
  UPDATE_SUBJECT_CLASS: (id) => `/api/classSubject/updateSubject/${id}`,
  DELETE_SUBJECT_CLASS: (id) => `/api/classSubject/deleteSubject/${id}`,
  GET_SUBJECT_BY_ID: (id) => `/api/classSubject/getSingleSubject/${id}`,
  GET_SUBJECT_BY_CLASS_SECTION: (classSectionId) => `/admin/timetable/getByClass/${classSectionId}`,
  
  // time table endpoints
  GET_TIME_TABLE_BY_CLASS_SECTION: (classSectionId) => `/admin/timetable/getByClass/${classSectionId}`,
  GET_TEACHER_TIME_TABLE: (teacherId) => `/admin/timetable/getByTeacher/${teacherId}`,
  ADD_BULK_TIME_TABLE: '/admin/timetable/bulkCreate',
  
  //Examinaton related endpoints
  GET_ALL_EXAM_TERMS: '/admin/examTerm/getAllExamTerms',
  CREATE_EXAM_TERM: '/admin/examTerm/createExamTerm',
  GET_EXAM_TERM_BY_ID: (id) => `/admin/examTerm/getSingleExamTerm/${id}`,
  UPDATE_EXAM_TERM: (id) => `/admin/examTerm/updateExamTerm/${id}`,
  DELETE_EXAM_TERM: (id) => `/admin/examTerm/deleteExamTerm/${id}`,
  
  // Exam related endpoints
  GET_ALL_EXAMS: '/admin/exam/getAllExams',
  CREATE_EXAM: '/admin/exam/createExam',
  UPDATE_EXAM: (id) => `/admin/exam/updateExam/${id}`,
  DELETE_EXAM: (id) => `/admin/exam/deleteExam/${id}`,

  // Exam Marks endpoints
  REGISTER_STUDENT_MARKS: '/admin/examMark/registerStudent',
  GET_COMPLETE_MARKSHEET: (examId, classSectionId) => `/admin/examMark/getCompleteMarksheet?exam_id=${examId}&class_section_id=${classSectionId}`,
  GET_STUDENTS_BY_SUBJECT: (examId, classSectionId, subjectId) => `/admin/examMark/getStudentsBySubject?exam_id=${examId}&class_section_id=${classSectionId}&subject_id=${subjectId}`,
  UPDATE_SUBJECT_MARKS: '/admin/examMark/updateSubject',
  GET_STUDENT_EXAM_HISTORY: (studentId) => `/admin/examMark/getStudentExamHistory?student_id=${studentId}`,
  GET_STUDENT_REPORT_HISTORY: '/api/v2/admin/exam/reports/students/history',
  GET_REPORT_CARD_DATA: '/admin/examMark/getReportCardData',
  GET_PUBLISHED_RESULTS_BY_EXAM_TYPES: '/api/v2/admin/exam/results/published/by-exam-types',
  GET_PUBLISHED_RESULTS_BY_EVENT_STUDENTS: '/api/v2/admin/exam/results/published/by-event-students',
  GET_PUBLISHED_FAILED_STUDENTS_BY_EVENT: '/api/v2/admin/exam/results/published/failed-students',
  GET_PUBLISHED_RESULTS_CLASS_WISE: '/api/v2/admin/exam/results/published/class-wise',
  GET_PUBLISHED_RESULTS_SUBJECT_WISE: '/api/v2/admin/exam/results/published/subject-wise',
  GENERATE_EXAM_DOCUMENT: '/api/v2/admin/exam/documents/generate',
  
  // Admin profile endpoints
  GET_ADMIN_PROFILE: '/admin/setting/profile',
  CHANGE_PASSWORD: '/admin/setting/changePassword',
 // Admin notice endpoints
  GET_ADMIN_NOTICES: '/admin/notice/getAllNotices',
  ADD_ADMIN_NOTICE: '/admin/notice/createNotices',
  UPDATE_ADMIN_NOTICE: (id) => `/admin/notice/updateNotice/${id}`,
  DELETE_ADMIN_NOTICE: (id) => `/admin/notice/deleteNotice/${id}`,

  // Teacher management endpoints
  GET_ALL_TEACHERS: '/api/admin/getAllTeachers',
  ADD_TEACHER: '/api/admin/register/addTeacher',
  GET_TEACHER_BY_ID: (id) => `/api/admin/getSingleTeacher/${id}`,
  UPDATE_TEACHER: (id) => `/api/admin/updateTeacher/${id}`,
  DELETE_TEACHER: (id) => `/api/admin/softDeleteTeacher/${id}`,
  GET_TEACHERS_CREDENTIALS: '/admin/hr/getTeacherCredentials',
  GET_TEACHERS_SALARY: '/admin/hr/getTeacherSalary',

  // Teacher Attendance Endpoints
  GET_TEACHER_CLASSES: '/classattendance/getTeacherClasses',
  GET_CLASS_STUDENT_LIST: (classSectionId) => `/classattendance/getClassStudentList/${classSectionId}`,
  GET_STUDENTS_BY_CLASS_FOR_TEACHER: (classId) => `/classattendance/getStudentsByClass/${classId}`,
  MARK_CLASS_ATTENDANCE: '/classattendance/markClassAttendance',
  UPDATE_CLASS_ATTENDANCE: '/classattendance/updateClassAttendance',
  GET_CLASS_ATTENDANCE_BY_DATE: (classId, date) => `/classattendance/getClassAttendanceByDate?class_section_id=${classId}&date=${date}`,

  // Teacher Timetable Endpoints
  GET_TEACHER_TIMETABLE: '/teacherTimetable/getTeacherTimetable',
  GET_CLASS_TIMETABLE: (classSectionId) => `/teacherTimetable/getClassTimetable/${classSectionId}`,

  // Teacher subject allocation endpoints
  GET_TEACHER_SUBJECT_ALLOCATION: '/teacher/subject/getMySubjects',

  // teacher profile and change password endpoints
  GET_TEACHER_PROFILE: '/teacher/setting/getProfile',
  CHANGE_TEACHER_PASSWORD: '/teacher/setting/changePassword',

  // teacher notes endpoints
  GET_TEACHER_NOTES: '/teacher/notice/getMyNotices',
  ADD_TEACHER_NOTE: '/teacher/notice/createNotice',
  UPDATE_TEACHER_NOTE: (id) => `/teacher/notice/updateNotice/${id}`,
  DELETE_TEACHER_NOTE: (id) => `/teacher/notice/deleteNotice/${id}`,

// Student Dashboard Endpoints
  // GET STUDENT ATTENDANCE
  GET_STUDENT_ATTENDANCE: (month, year) => `/studentattendance/getMonthlyAttendance?month=${month}&year=${year}`,
  // GET STUDENT SUBJECTS
  GET_STUDENT_SUBJECTS: '/studentattendance/getClassAndSubjects',
  // Get student timetable
  GET_STUDENT_TIMETABLE: '/studentattendance/getTimetable',
  // get student fees
  GET_STUDENT_FEES_DETAILS: '/student/fees/getFeeDetails',
  // get student installments
  GET_STUDENT_INSTALLMENTS: '/student/fees/getInstallments',
  // get student payment history
  GET_STUDENT_PAYMENT_HISTORY: '/student/fees/getPaymentHistory',
  // create payment order for installment
  CREATE_PAYMENT_ORDER: '/student/fees/createPaymentOrder',
  // verify payment
  VERIFY_PAYMENT: '/student/fees/verifyPayment',
  // get student profile and change password
  GET_STUDENT_PROFILE: '/student/setting/getProfile',
  CHANGE_STUDENT_PASSWORD: '/student/setting/changePassword',

  // Student leave endpoints
  GET_STUDENT_LEAVES: '/student/leave/getMyLeaves',
  APPLY_STUDENT_LEAVE: '/student/leave/applyLeave',
  DELETE_STUDENT_LEAVE: (id) => `/student/leave/deleteLeave/${id}`,

  //student notice endpoints
  GET_STUDENT_NOTICES_LIST: '/student/notice/getNoticesForMe',
  
  // Student exam endpoints
  GET_STUDENT_EXAM_RESULT: (examId) => `/student/exam/myExam?exam_id=${examId}`,
  
  // subject resource endpoints (assignments)
  UPLOAD_SUBJECT_RESOURCE: '/admin/subjectResource/uploadSubjectResource',
  GET_ALL_SUBJECT_RESOURCES: '/admin/subjectResource/getAllSubjectResources',
  GET_SUBJECT_RESOURCE: (resourceId) => `/admin/subjectResource/getSubjectResource/${resourceId}`,
  UPDATE_SUBJECT_RESOURCE: (resourceId) => `/admin/subjectResource/updateSubjectResource/${resourceId}`,
  DELETE_SUBJECT_RESOURCE: (resourceId) => `/admin/subjectResource/deleteSubjectResource/${resourceId}`,
  GET_SUBJECTS_BY_CLASS: (classId) => `/admin/dropdown/getSubjectsByClass?class_id=${classId}`,

  // student assignments endpoint
  GET_STUDENT_ASSIGNMENTS: '/student/resources/assignments',
  
  // student class resources endpoint
  GET_STUDENT_CLASS_RESOURCES: '/student/resources/classResources',
  
  // student subject resources endpoint
  GET_STUDENT_SUBJECT_RESOURCES: '/student/resources/subjectResources',
  
  // teacher subject resource endpoints
  TEACHER_UPLOAD_SUBJECT_RESOURCE: '/teacher/subjectResource/uploadSubjectResource',
  GET_TEACHER_SUBJECT_RESOURCES: '/teacher/subjectResource/getMySubjectResources',
  GET_TEACHER_SUBJECT_RESOURCE_BY_ID: (resourceId) => `/teacher/subjectResource/getSubjectResourceById/${resourceId}`,
  UPDATE_TEACHER_SUBJECT_RESOURCE: (resourceId) => `/teacher/subjectResource/updateSubjectResource/${resourceId}`,
  DELETE_TEACHER_SUBJECT_RESOURCE: (resourceId) => `/teacher/subjectResource/deleteSubjectResource/${resourceId}`,
  
  // teacher class resource endpoints
  TEACHER_UPLOAD_CLASS_RESOURCE: '/teacher/classResource/uploadClassResource',
  GET_TEACHER_CLASS_RESOURCES: '/teacher/classResource/getMyClassResources',
  GET_TEACHER_CLASS_RESOURCE_BY_ID: (resourceId) => `/teacher/classResource/getClassResourceById/${resourceId}`,
  UPDATE_TEACHER_CLASS_RESOURCE: (resourceId) => `/teacher/classResource/updateClassResource/${resourceId}`,
  DELETE_TEACHER_CLASS_RESOURCE: (resourceId) => `/teacher/classResource/deleteClassResource/${resourceId}`,

};

// Reusable authorized GET request
export const authorizedGet = async (endpoint) => {
  const token = localStorage.getItem('authToken');
  const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// Reusable authorized POST request with FormData (for file uploads)
export const authorizedPostFormData = async (endpoint, formData) => {
  const token = localStorage.getItem('authToken');
  const response = await axios.post(`${API_BASE_URL}${endpoint}`, formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Upload class resource
export const uploadClassResource = async (formData) => {
  return authorizedPostFormData(API_ENDPOINTS.UPLOAD_CLASS_RESOURCE, formData);
};

// Get all class resources
export const getAllClassResources = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ALL_CLASS_RESOURCES);
};

// Get class resource by ID
export const getClassResource = async (resourceId) => {
  return authorizedGet(API_ENDPOINTS.GET_CLASS_RESOURCE(resourceId));
};

// Update class resource
export const updateClassResource = async (resourceId, formData) => {
  return authorizedPostFormData(API_ENDPOINTS.UPDATE_CLASS_RESOURCE(resourceId), formData);
};

// Delete class resource
export const deleteClassResource = async (resourceId) => {
  return authorizedDelete(API_ENDPOINTS.DELETE_CLASS_RESOURCE(resourceId));
};

// Reusable authorized POST request
export const authorizedPost = async (endpoint, data) => {
  const token = localStorage.getItem('authToken');
  const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// Reusable authorized PUT request
export const authorizedPut = async (endpoint, data) => {
  const token = localStorage.getItem('authToken');
  const response = await axios.put(`${API_BASE_URL}${endpoint}`, data, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// Reusable authorized PATCH request
export const authorizedPatch = async (endpoint, data) => {
  const token = localStorage.getItem('authToken');
  const response = await axios.patch(`${API_BASE_URL}${endpoint}`, data, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// Reusable authorized PUT request with FormData (for file uploads)
export const authorizedPutFormData = async (endpoint, formData) => {
  const token = localStorage.getItem('authToken');
  const response = await axios.put(`${API_BASE_URL}${endpoint}`, formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Reusable authorized DELETE request
export const authorizedDelete = async (endpoint) => {
  const token = localStorage.getItem('authToken');
  const response = await axios.delete(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// Login function
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.LOGIN}`,
      credentials,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Signup function
export const signupUser = async (payload) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.SIGNUP}`,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    console.error('Signup failed:', error);
    throw error;
  }
};

// Request password reset
export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.REQUEST_PASSWORD_RESET}`,
      { email },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    console.error('Password reset request failed:', error);
    throw error;
  }
};

// Fetch student complete fee details
export const getStudentCompleteFeeDetails = async (studentId) => {
  return authorizedGet(API_ENDPOINTS.GET_STUDENT_COMPLETE_FEE_DETAILS(studentId));
};

// Fetch all admission enquiries
export const fetchAllEnquiries = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ALL_ENQUIRIES);
};

// Fetch assignments for student panel
export const fetchStudentAssignments = async () => {
  return authorizedGet(API_ENDPOINTS.GET_STUDENT_ASSIGNMENTS);
};

// Fetch class resources for student panel
export const fetchStudentClassResources = async () => {
  return authorizedGet(API_ENDPOINTS.GET_STUDENT_CLASS_RESOURCES);
};

// Fetch subject resources for student panel
export const fetchStudentSubjectResources = async () => {
  return authorizedGet(API_ENDPOINTS.GET_STUDENT_SUBJECT_RESOURCES);
};

// Create a new enquiry
export const createEnquiry = async (enquiryData) => {
  return authorizedPost(API_ENDPOINTS.CREATE_ENQUIRY, enquiryData);
};

// Update an enquiry by ID
export const updateEnquiry = async (id, enquiryData) => {
  return authorizedPut(API_ENDPOINTS.UPDATE_ENQUIRY(id), enquiryData);
};

// Delete an enquiry by ID
export const deleteEnquiry = async (id) => {
  return authorizedDelete(API_ENDPOINTS.DELETE_ENQUIRY(id));
};

// Fetch enquiry count stats
export const fetchEnquiryCount = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ENQUIRY_COUNT);
};

// Add new student with file uploads
export const addStudent = async (studentData, files = {}) => {
  const formData = new FormData();
  
  // Append all student data fields
  Object.keys(studentData).forEach(key => {
    if (studentData[key] !== null && studentData[key] !== undefined) {
      formData.append(key, studentData[key]);
    }
  });
  
  // Append files if provided
  if (files.tc) formData.append('tc', files.tc);
  if (files.marksheet) formData.append('marksheet', files.marksheet);
  if (files.image) formData.append('image', files.image);
  if (files.aadhar_card) formData.append('aadhar_card', files.aadhar_card);
  if (files.sign) formData.append('sign', files.sign);
  
  return authorizedPostFormData(API_ENDPOINTS.ADD_STUDENT, formData);
};

// Get all students with pagination
export const getAllStudents = async (page = 1, limit = 10) => {
  return authorizedGet(`${API_ENDPOINTS.GET_ALL_STUDENTS}?page=${page}&limit=${limit}`);
};

// Get student statistics
export const getStudentStats = async () => {
  return authorizedGet(API_ENDPOINTS.GET_STUDENT_STATES);
};

// Update student
export const updateStudent = async (id, studentData) => {
  return authorizedPut(API_ENDPOINTS.UPDATE_STUDENT(id), studentData);
};

// Delete student (soft delete)
export const deleteStudent = async (id) => {
  return authorizedDelete(API_ENDPOINTS.DELETE_STUDENT(id));
};

// Get student report by class
export const getStudentReport = async (classId) => {
  return authorizedGet(API_ENDPOINTS.GET_STUDENT_REPORT(classId));
};

// Get parent report by class
export const getParentReport = async (classId) => {
  return authorizedGet(API_ENDPOINTS.GET_PARENT_REPORT(classId));
};

// Get student credentials by class
export const getStudentCredentials = async (classId) => {
  return authorizedGet(API_ENDPOINTS.GET_STUDENT_CREDENTIALS(classId));
};

// Get class-wise student stats
export const getClassWiseStudentStats = async () => {
  return authorizedGet(API_ENDPOINTS.GET_CLASS_STATES());
};

// Create new class
export const createClass = async (classData) => {
  return authorizedPost(API_ENDPOINTS.CREATE_CLASS, classData);
};

// Add new subject
export const addSubject = async (subjectData) => {
  return authorizedPost(API_ENDPOINTS.ADD_SUBJECT, subjectData);
};

// Fetch teacher credentials
export const fetchTeacherCredentials = async () => {
  return authorizedGet(API_ENDPOINTS.GET_TEACHER_CREDENTIALS);
};

// Update teacher credentials
export const updateTeacherCredentials = async (id, credentialsData) => {
  return authorizedPut(API_ENDPOINTS.UPDATE_TEACHER_CREDENTIALS(id), credentialsData);
};

// Fetch class dropdown data
export const fetchClassDropdown = async () => {
  return authorizedGet(API_ENDPOINTS.GET_CLASS_DROPDOWN);
};

// Alias for getClassDropdown
export const getClassDropdown = fetchClassDropdown;

// Fetch teacher dropdown data
export const fetchTeacherDropdown = async () => {
  return authorizedGet(API_ENDPOINTS.GET_TEACHER_DROPDOWN);
};

// Add new teacher/staff
export const addTeacher = async (teacherData, imageFile = null) => {
  const formData = new FormData();
  
  // Append all teacher data fields
  Object.keys(teacherData).forEach(key => {
    if (teacherData[key] !== null && teacherData[key] !== undefined) {
      formData.append(key, teacherData[key]);
    }
  });
  
  // Append image file if provided
  if (imageFile) {
    formData.append('image', imageFile);
  }
  
  return authorizedPostFormData(API_ENDPOINTS.ADD_TEACHER, formData);
};

//get all income
export const getAllIncome = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ALL_INCOME);
};

// update income
export const updateIncome = async (id, data) => {
  return authorizedPut(API_ENDPOINTS.UPDATE_INCOME(id), data);
};

// add income
export const addIncome = async (data) => {
  return authorizedPost(API_ENDPOINTS.ADD_INCOME, data);
};

// add accountant income
export const addAccountantIncome = async (data) => {
  return authorizedPost(API_ENDPOINTS.ADD_ACCOUNTANT_INCOME, data);
};

// get accountant income list
export const getAccountantIncomeList = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ACCOUNTANT_INCOME_LIST);
};

// update accountant income/expense
export const updateAccountantIncomeExpense = async (id, data) => {
  return authorizedPut(API_ENDPOINTS.UPDATE_ACCOUNTANT_INCOME_EXPENSE(id), data);
};

// delete accountant income/expense
export const deleteAccountantIncomeExpense = async (id) => {
  return authorizedDelete(API_ENDPOINTS.DELETE_ACCOUNTANT_INCOME_EXPENSE(id));
};

// add accountant expense
export const addAccountantExpense = async (data) => {
  return authorizedPost(API_ENDPOINTS.ADD_ACCOUNTANT_EXPENSE, data);
};

// get accountant expense list
export const getAccountantExpenseList = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ACCOUNTANT_EXPENSE_LIST);
};

// get accountant income vs expense graph data
export const getAccountantIncomeExpenseGraph = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ACCOUNTANT_INCOME_EXPENSE_GRAPH);
};

// get accountant monthly expense data
export const getAccountantMonthlyExpense = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ACCOUNTANT_MONTHLY_EXPENSE);
};

// add accountant fee head
export const addAccountantFeeHead = async (data) => {
  return authorizedPost(API_ENDPOINTS.ADD_ACCOUNTANT_FEE_HEAD, data);
};

// get accountant fee heads
export const getAccountantFeeHeads = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ACCOUNTANT_FEE_HEADS);
};

// update accountant fee head
export const updateAccountantFeeHead = async (id, data) => {
  return authorizedPut(API_ENDPOINTS.UPDATE_ACCOUNTANT_FEE_HEAD(id), data);
};

// delete accountant fee head
export const deleteAccountantFeeHead = async (id) => {
  return authorizedDelete(API_ENDPOINTS.DELETE_ACCOUNTANT_FEE_HEAD(id));
};

// add accountant fee structure
export const addAccountantFeeStructure = async (data) => {
  return authorizedPost(API_ENDPOINTS.ADD_ACCOUNTANT_FEE_STRUCTURE, data);
};

// get accountant fee structures
export const getAccountantFeeStructures = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ACCOUNTANT_FEE_STRUCTURES);
};

// get accountant fee structure by id
export const getAccountantFeeStructureById = async (id) => {
  return authorizedGet(API_ENDPOINTS.GET_ACCOUNTANT_FEE_STRUCTURE_BY_ID(id));
};

// update accountant fee structure
export const updateAccountantFeeStructure = async (id, data) => {
  return authorizedPut(API_ENDPOINTS.UPDATE_ACCOUNTANT_FEE_STRUCTURE(id), data);
};

// delete accountant fee structure
export const deleteAccountantFeeStructure = async (id) => {
  return authorizedDelete(API_ENDPOINTS.DELETE_ACCOUNTANT_FEE_STRUCTURE(id));
};

// get class section dropdown
export const getClassSectionDropdown = async () => {
  return authorizedGet(API_ENDPOINTS.GET_CLASS_SECTION_DROPDOWN);
};

// get students by class for accounts page
export const getStudentsByClass = async (classId) => {
  return authorizedGet(API_ENDPOINTS.GET_ALL_STUDENTS_BY_CLASS(classId));
};

// get student fee details
export const getStudentFeeDetails = async (studentId) => {
  return authorizedGet(API_ENDPOINTS.GET_STUDENT_FEE_DETAILS(studentId));
};

// get all fee payments
export const getFeePayments = async () => {
  return authorizedGet(API_ENDPOINTS.GET_FEE_PAYMENTS);
};

// get accountant profile
export const getAccountantProfile = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ACCOUNTANT_PROFILE);
};

// change accountant password
export const changeAccountantPassword = async (data) => {
  return authorizedPut(API_ENDPOINTS.CHANGE_ACCOUNTANT_PASSWORD, data);
};

// fill payment
export const fillPayment = async (data) => {
  return authorizedPost(API_ENDPOINTS.FILL_PAYMENT, data);
};

// assign fee
export const assignFee = async (data) => {
  return authorizedPost(API_ENDPOINTS.ASSIGN_FEE, data);
};

// get assigned fees by class section
export const getAssignedFeesByClass = async (class_section_id) => {
  return authorizedGet(API_ENDPOINTS.GET_ASSIGNED_FEES_BY_CLASS(class_section_id));
};

// delete income
export const deleteIncome = async (id) => {
  return authorizedDelete(API_ENDPOINTS.DELETE_INCOME(id));
};

//get all expense
export const getAllExpense = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ALL_EXPENSE);
};
// update expense
export const updateExpense = async (id, data) => {
  return authorizedPut(API_ENDPOINTS.UPDATE_EXPENSE(id), data);
};
// add expense
export const addExpense = async (data) => {
  return authorizedPost(API_ENDPOINTS.ADD_EXPENSE, data);
};
// delete expense
export const deleteExpense = async (id) => {
  return authorizedDelete(API_ENDPOINTS.DELETE_EXPENSE(id));
};

// fetch all classes for attendance
export const fetchAllClassesForAttendance = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ALL_CLASSES);
};

// fetch all the students basis on the class
export const fetchStudentsByClass = async (classId) => {
  return authorizedGet(API_ENDPOINTS.GET_STUDENTS_BY_CLASS(classId));
};

// get admin class attendance by date
export const getAdminClassAttendanceByDate = async (classSectionId, date) => {
  return authorizedGet(API_ENDPOINTS.GET_ADMIN_CLASS_ATTENDANCE_BY_DATE(classSectionId, date));
};

// mark attendance
export const markAttendance = async (attendanceData) => {
  return authorizedPost(API_ENDPOINTS.MARK_ATTENDANCE, attendanceData);
};

// get all leaves
export const getAllLeaves = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ALL_LEAVES);
};
// apply leave (with file upload support)
export const applyLeave = async (leaveData, attachmentFile = null) => {
  if (attachmentFile) {
    const formData = new FormData();
    // Append all leave data fields
    Object.keys(leaveData).forEach(key => {
      if (leaveData[key] !== null && leaveData[key] !== undefined) {
        formData.append(key, leaveData[key]);
      }
    });
    // Append attachment file if provided
    if (attachmentFile) {
      formData.append('attachment', attachmentFile);
    }
    return authorizedPostFormData(API_ENDPOINTS.APPLY_LEAVE, formData);
  } else {
  return authorizedPost(API_ENDPOINTS.APPLY_LEAVE, leaveData);
  }
};
// update leave status
export const updateLeaveStatus = async (id, statusData) => {
  return authorizedPut(API_ENDPOINTS.UPDATE_LEAVE(id), statusData);
};
// get leave by id
export const getLeaveById = async (id) => {
  return authorizedGet(API_ENDPOINTS.GET_LEAVE_BY_ID(id));
};

export const deleteAdminLeave = async (id) => {
  return authorizedDelete(API_ENDPOINTS.DELETE_ADMIN_LEAVE(id));
};

export const createHoliday = async (payload) => {
  return authorizedPost(API_ENDPOINTS.CREATE_HOLIDAY, payload);
};

export const getAllHolidays = async (month, year) => {
  return authorizedGet(API_ENDPOINTS.GET_ALL_HOLIDAYS(month, year));
};

export const getHolidayByDate = async (holidayDate) => {
  return authorizedGet(API_ENDPOINTS.GET_HOLIDAY_BY_DATE(holidayDate));
};

export const deleteHoliday = async (id) => {
  return authorizedDelete(API_ENDPOINTS.DELETE_HOLIDAY(id));
};

// get student report by date
export const getStudentReportByDate = async (className, sectionName, date) => {
  return authorizedGet(API_ENDPOINTS.GET_STUDENT_REPORT_BY_DATE(className, sectionName, date));
};
// get student report by month
export const getStudentReportByMonth = async (className, sectionName, month, year) => {
  return authorizedGet(API_ENDPOINTS.GET_STUDENT_REPORT_BY_MONTH(className, sectionName, month, year));
};
// get class wise summary
export const getClassWiseSummary = async (date) => {
  return authorizedGet(API_ENDPOINTS.GET_CLASS_WISE_SUMMARY(date));
};

// get all the classes for dropdown
export const getAllClassesDropdown = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ALL_CLASSES_DROPDOWN);
};
// get all students by class
export const getAllStudentsByClass = async (classId) => {
  return authorizedGet(API_ENDPOINTS.GET_ALL_STUDENTS_BY_CLASS(classId));
};

// class section endpoints
export const createClasses = async (classData) => {
  return authorizedPost(API_ENDPOINTS.CREATE_CLASSES, classData);
};
export const getAllClassSections = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ALL_CLASS_SECTIONS); 
};
export const updateClassSection = async (id, classData) => {
  return authorizedPut(API_ENDPOINTS.UPDATE_CLASS_SECTION(id), classData);
};
export const deleteClassSection = async (id) => {
  return authorizedDelete(API_ENDPOINTS.DELETE_CLASS_SECTION(id));
}
// subject endpoints
export const addSubjects = async (subjectData) => {
  return authorizedPost(API_ENDPOINTS.ADD_SUBJECTS, subjectData);
};
export const getAllSubjectsClass = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ALL_SUBJECTS_CLASS); 
}
export const updateSubjectClass = async (id, subjectData) => {
  return authorizedPut(API_ENDPOINTS.UPDATE_SUBJECT_CLASS(id), subjectData);
}
export const deleteSubjectClass = async (id) => {
  return authorizedDelete(API_ENDPOINTS.DELETE_SUBJECT_CLASS(id));
}

// TIME TABLE ENDPOINTS
export const getTimeTableByClassSection = async (classSectionId) => {
  return authorizedGet(API_ENDPOINTS.GET_TIME_TABLE_BY_CLASS_SECTION(classSectionId));
};

export const getTeacherTimeTable = async (teacherId) => {
  return authorizedGet(API_ENDPOINTS.GET_TEACHER_TIME_TABLE(teacherId));
};

// EXAM TERM ENDPOINTS
export const getAllExamTerms = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ALL_EXAM_TERMS);
};

export const createExamTerm = async (termData) => {
  return authorizedPost(API_ENDPOINTS.CREATE_EXAM_TERM, termData);
};

export const getExamTermById = async (id) => {
  return authorizedGet(API_ENDPOINTS.GET_EXAM_TERM_BY_ID(id));
};

export const updateExamTerm = async (id, termData) => {
  return authorizedPut(API_ENDPOINTS.UPDATE_EXAM_TERM(id), termData);
};

export const deleteExamTerm = async (id) => {
  return authorizedDelete(API_ENDPOINTS.DELETE_EXAM_TERM(id));
};

// EXAM ENDPOINTS
export const getAllExams = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ALL_EXAMS);
};

export const createExam = async (examData) => {
  return authorizedPost(API_ENDPOINTS.CREATE_EXAM, examData);
};

export const updateExam = async (id, examData) => {
  return authorizedPut(API_ENDPOINTS.UPDATE_EXAM(id), examData);
};

export const deleteExam = async (id) => {
  return authorizedDelete(API_ENDPOINTS.DELETE_EXAM(id));
};

// ADMIN PROFILE ENDPOINTS
export const getAdminProfile = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ADMIN_PROFILE);
};

export const changePassword = async (passwordData) => {
  return authorizedPost(API_ENDPOINTS.CHANGE_PASSWORD, passwordData);
};

// TEACHER MANAGEMENT ENDPOINTS
export const getAllTeachers = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ALL_TEACHERS);
};

export const getTeacherById = async (id) => {
  return authorizedGet(API_ENDPOINTS.GET_TEACHER_BY_ID(id));
};

export const createTeacher = async (teacherData, imageFile = null) => {
  const formData = new FormData();
  Object.keys(teacherData).forEach(key => {
    if (teacherData[key] !== null && teacherData[key] !== undefined) {
      formData.append(key, teacherData[key]);
    }
  });
  if (imageFile) {
    formData.append('image', imageFile);
  }
  return authorizedPostFormData(API_ENDPOINTS.ADD_TEACHER, formData);
};

export const updateTeacher = async (id, teacherData, imageFile = null) => {
  if (imageFile) {
    const formData = new FormData();
    Object.keys(teacherData).forEach(key => {
      if (teacherData[key] !== null && teacherData[key] !== undefined) {
        formData.append(key, teacherData[key]);
      }
    });
    if (imageFile) {
      formData.append('image', imageFile);
    }
    return authorizedPutFormData(API_ENDPOINTS.UPDATE_TEACHER(id), formData);
  } else {
    return authorizedPut(API_ENDPOINTS.UPDATE_TEACHER(id), teacherData);
  }
};

export const deleteTeacher = async (id) => {
  return authorizedDelete(API_ENDPOINTS.DELETE_TEACHER(id));
};

// Get teacher credentials
export const getTeacherCredentials = async () => {
  return authorizedGet(API_ENDPOINTS.GET_TEACHERS_CREDENTIALS);
};

// Get teacher salary
export const getTeacherSalary = async () => {
  return authorizedGet(API_ENDPOINTS.GET_TEACHERS_SALARY);
};

// TEACHER ATTENDANCE ENDPOINTS
// Get all classes for a teacher (static teacher ID: 35)
export const getTeacherClasses = async () => {
  return authorizedGet(API_ENDPOINTS.GET_TEACHER_CLASSES);
};

// Get students by class for attendance
export const getStudentsByClassForAttendance = async (classId) => {
  try {
    return await authorizedGet(API_ENDPOINTS.GET_CLASS_STUDENT_LIST(classId));
  } catch {
    return authorizedGet(API_ENDPOINTS.GET_STUDENTS_BY_CLASS_FOR_TEACHER(classId));
  }
};

// Mark class attendance
export const markClassAttendance = async (attendanceData) => {
  return authorizedPost(API_ENDPOINTS.MARK_CLASS_ATTENDANCE, attendanceData);
};

// Update class attendance (current date)
export const updateClassAttendance = async (attendanceData) => {
  return authorizedPatch(API_ENDPOINTS.UPDATE_CLASS_ATTENDANCE, attendanceData);
};

// Get class attendance by date
export const getClassAttendanceByDate = async (classId, date) => {
  return authorizedGet(API_ENDPOINTS.GET_CLASS_ATTENDANCE_BY_DATE(classId, date));
};

// TEACHER TIMETABLE ENDPOINTS
// Get teacher timetable
export const getTeacherTimetable = async () => {
  return authorizedGet(API_ENDPOINTS.GET_TEACHER_TIMETABLE);
};

// Get class timetable
export const getClassTimetable = async (classSectionId) => {
  return authorizedGet(API_ENDPOINTS.GET_CLASS_TIMETABLE(classSectionId));
};

// TEACHER SUBJECT ALLOCATION ENDPOINTS
// Get teacher subject allocation
export const getTeacherSubjectAllocation = async () => {
  return authorizedGet(API_ENDPOINTS.GET_TEACHER_SUBJECT_ALLOCATION);
};

// TEACHER PROFILE ENDPOINTS
// Get teacher profile
export const getTeacherProfile = async () => {
  return authorizedGet(API_ENDPOINTS.GET_TEACHER_PROFILE);
};

// Change teacher password
export const changeTeacherPassword = async (passwordData) => {
  return authorizedPut(API_ENDPOINTS.CHANGE_TEACHER_PASSWORD, passwordData);
};

// STUDENT DASHBOARD ENDPOINTS
// Get student attendance
export const getStudentAttendance = async (month, year) => {
  return authorizedGet(API_ENDPOINTS.GET_STUDENT_ATTENDANCE(month, year));
};

// Get student subjects
export const getStudentSubjects = async () => {
  return authorizedGet(API_ENDPOINTS.GET_STUDENT_SUBJECTS);
};

// Get student timetable
export const getStudentTimetable = async () => {
  return authorizedGet(API_ENDPOINTS.GET_STUDENT_TIMETABLE);
};

// Get student profile
export const getStudentProfile = async () => {
  return authorizedGet(API_ENDPOINTS.GET_STUDENT_PROFILE);
};

// Change student password
export const changeStudentPassword = async (passwordData) => {
  return authorizedPut(API_ENDPOINTS.CHANGE_STUDENT_PASSWORD, passwordData);
};

// Get student fees details
export const getStudentFeesDetails = async () => {
  return authorizedGet(API_ENDPOINTS.GET_STUDENT_FEES_DETAILS);
};

// Get student installments
export const getStudentInstallments = async (studentId) => {
  // If studentId is provided, use accountant endpoint, otherwise use student endpoint
  if (studentId) {
    return authorizedGet(API_ENDPOINTS.GET_ACCOUNTANT_STUDENT_INSTALLMENTS(studentId));
  }
  return authorizedGet(API_ENDPOINTS.GET_STUDENT_INSTALLMENTS);
};

// Get student payment history
export const getStudentPaymentHistory = async () => {
  return authorizedGet(API_ENDPOINTS.GET_STUDENT_PAYMENT_HISTORY);
};

// Create payment order for installment
export const createPaymentOrder = async (installmentId) => {
  return authorizedPost(API_ENDPOINTS.CREATE_PAYMENT_ORDER, { installment_id: installmentId });
};

// Verify payment
export const verifyPayment = async (paymentData) => {
  return authorizedPost(API_ENDPOINTS.VERIFY_PAYMENT, paymentData);
};

// Student Leave API functions
export const getStudentLeaves = async () => {
  return authorizedGet(API_ENDPOINTS.GET_STUDENT_LEAVES);
};

export const applyStudentLeave = async (payload) => {
  return authorizedPost(API_ENDPOINTS.APPLY_STUDENT_LEAVE, payload);
};

export const deleteStudentLeave = async (leaveId) => {
  return authorizedDelete(API_ENDPOINTS.DELETE_STUDENT_LEAVE(leaveId));
};

// Student Notice API functions
export const getStudentNotices = async () => {
  return authorizedGet(API_ENDPOINTS.GET_STUDENT_NOTICES);
};

// Upload subject resource (assignment)
export const uploadSubjectResource = async (formData) => {
  return authorizedPostFormData(API_ENDPOINTS.UPLOAD_SUBJECT_RESOURCE, formData);
};

// Get all subject resources (assignments)
export const getAllSubjectResources = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ALL_SUBJECT_RESOURCES);
};

// Get subject resource by ID
export const getSubjectResource = async (resourceId) => {
  return authorizedGet(API_ENDPOINTS.GET_SUBJECT_RESOURCE(resourceId));
};

// Update subject resource
export const updateSubjectResource = async (resourceId, formData) => {
  return authorizedPostFormData(API_ENDPOINTS.UPDATE_SUBJECT_RESOURCE(resourceId), formData);
};

// Delete subject resource
export const deleteSubjectResource = async (resourceId) => {
  return authorizedDelete(API_ENDPOINTS.DELETE_SUBJECT_RESOURCE(resourceId));
};

// Get subjects by class
export const getSubjectsByClass = async (classId) => {
  return authorizedGet(API_ENDPOINTS.GET_SUBJECTS_BY_CLASS(classId));
};

// Teacher upload subject resource (assignment)
export const uploadTeacherSubjectResource = async (formData) => {
  return authorizedPostFormData(API_ENDPOINTS.TEACHER_UPLOAD_SUBJECT_RESOURCE, formData);
};

// Get teacher's subject resources
export const getTeacherSubjectResources = async () => {
  return authorizedGet(API_ENDPOINTS.GET_TEACHER_SUBJECT_RESOURCES);
};

// Get teacher subject resource by ID
export const getTeacherSubjectResourceById = async (resourceId) => {
  return authorizedGet(API_ENDPOINTS.GET_TEACHER_SUBJECT_RESOURCE_BY_ID(resourceId));
};

// Update teacher subject resource
export const updateTeacherSubjectResource = async (resourceId, formData) => {
  return authorizedPostFormData(API_ENDPOINTS.UPDATE_TEACHER_SUBJECT_RESOURCE(resourceId), formData);
};

// Delete teacher subject resource
export const deleteTeacherSubjectResource = async (resourceId) => {
  return authorizedDelete(API_ENDPOINTS.DELETE_TEACHER_SUBJECT_RESOURCE(resourceId));
};

// Teacher upload class resource
export const uploadTeacherClassResource = async (formData) => {
  return authorizedPostFormData(API_ENDPOINTS.TEACHER_UPLOAD_CLASS_RESOURCE, formData);
};

// Get teacher's class resources
export const getTeacherClassResources = async () => {
  return authorizedGet(API_ENDPOINTS.GET_TEACHER_CLASS_RESOURCES);
};

// Get teacher class resource by ID
export const getTeacherClassResourceById = async (resourceId) => {
  return authorizedGet(API_ENDPOINTS.GET_TEACHER_CLASS_RESOURCE_BY_ID(resourceId));
};

// Update teacher class resource
export const updateTeacherClassResource = async (resourceId, formData) => {
  return authorizedPostFormData(API_ENDPOINTS.UPDATE_TEACHER_CLASS_RESOURCE(resourceId), formData);
};

// Delete teacher class resource
export const deleteTeacherClassResource = async (resourceId) => {
  return authorizedDelete(API_ENDPOINTS.DELETE_TEACHER_CLASS_RESOURCE(resourceId));
};

// Admin Notice API functions
export const getAdminNotices = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ADMIN_NOTICES);
};

export const addAdminNotice = async (noticeData, attachmentFile = null) => {
  if (attachmentFile) {
    const formData = new FormData();
    Object.keys(noticeData).forEach(key => {
      if (noticeData[key] !== null && noticeData[key] !== undefined) {
        formData.append(key, noticeData[key]);
      }
    });
    if (attachmentFile) {
      formData.append('attachment', attachmentFile);
    }
    return authorizedPostFormData(API_ENDPOINTS.ADD_ADMIN_NOTICE, formData);
  } else {
    return authorizedPost(API_ENDPOINTS.ADD_ADMIN_NOTICE, noticeData);
  }
};

export const updateAdminNotice = async (id, noticeData, attachmentFile = null) => {
  if (attachmentFile) {
    const formData = new FormData();
    Object.keys(noticeData).forEach(key => {
      if (noticeData[key] !== null && noticeData[key] !== undefined) {
        formData.append(key, noticeData[key]);
      }
    });
    if (attachmentFile) {
      formData.append('attachment', attachmentFile);
    }
    return authorizedPutFormData(API_ENDPOINTS.UPDATE_ADMIN_NOTICE(id), formData);
  } else {
    return authorizedPut(API_ENDPOINTS.UPDATE_ADMIN_NOTICE(id), noticeData);
  }
};

export const deleteAdminNotice = async (id) => {
  return authorizedDelete(API_ENDPOINTS.DELETE_ADMIN_NOTICE(id));
};

// Teacher Notice API functions
export const getTeacherNotes = async () => {
  return authorizedGet(API_ENDPOINTS.GET_TEACHER_NOTES);
};

export const addTeacherNote = async (noteData) => {
  return authorizedPost(API_ENDPOINTS.ADD_TEACHER_NOTE, noteData);
};

export const updateTeacherNote = async (id, noteData) => {
  return authorizedPut(API_ENDPOINTS.UPDATE_TEACHER_NOTE(id), noteData);
};

export const deleteTeacherNote = async (id) => {
  return authorizedDelete(API_ENDPOINTS.DELETE_TEACHER_NOTE(id));
};

// Certificate endpoints
export const generateIdCard = async (user_id) => {
  return authorizedPost(API_ENDPOINTS.GENERATE_ID_CARD, { user_id });
};

export const generateMultipleIdCards = async (user_ids) => {
  return authorizedPost(API_ENDPOINTS.GENERATE_ID_CARDS, { user_ids });
};


// ============= Fee Management Functions =============

// Create Fee Head
export const createFeeHead = async (feeHeadData) => {
  return authorizedPost(API_ENDPOINTS.CREATE_FEE_HEAD, feeHeadData);
};

// Get All Fee Heads
export const getAllFeeHeads = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ALL_FEE_HEADS);
};

// Get Fee Head by ID
export const getFeeHeadById = async (id) => {
  return authorizedGet(API_ENDPOINTS.GET_FEE_HEAD_BY_ID(id));
};

// Update Fee Head
export const updateFeeHead = async (id, feeHeadData) => {
  return authorizedPut(API_ENDPOINTS.UPDATE_FEE_HEAD(id), feeHeadData);
};

// Delete Fee Head
export const deleteFeeHead = async (id) => {
  return authorizedDelete(API_ENDPOINTS.DELETE_FEE_HEAD(id));
};

// ============= Fee Structure Functions =============

// Create Fee Structure
export const createFeeStructure = async (feeStructureData) => {
  return authorizedPost(API_ENDPOINTS.CREATE_FEE_STRUCTURE, feeStructureData);
};

// Get All Fee Structures
export const getAllFeeStructures = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ALL_FEE_STRUCTURES);
};

// Get Fee Structure by ID
export const getFeeStructureById = async (id) => {
  return authorizedGet(API_ENDPOINTS.GET_FEE_STRUCTURE_BY_ID(id));
};

// Update Fee Structure
export const updateFeeStructure = async (id, feeStructureData) => {
  return authorizedPut(API_ENDPOINTS.UPDATE_FEE_STRUCTURE(id), feeStructureData);
};

// Delete Fee Structure
export const deleteFeeStructure = async (id) => {
  return authorizedDelete(API_ENDPOINTS.DELETE_FEE_STRUCTURE(id));
};

// ============= Fee Assignment Functions =============

// Assign Fee to Students
export const assignFeeToStudents = async (assignmentData) => {
  return authorizedPost(API_ENDPOINTS.ASSIGN_FEE_TO_STUDENTS, assignmentData);
};

// Assign Fee with Installments
export const assignFeeWithInstallments = async (assignmentData) => {
  return authorizedPost(API_ENDPOINTS.ASSIGN_FEE_WITH_INSTALLMENTS, assignmentData);
};

// Get All Fee Assignments
export const getAllFeeAssignments = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ALL_FEE_ASSIGNMENTS);
};

// Get Class Fee Assignment
export const getClassFeeAssignment = async () => {
  return authorizedGet(API_ENDPOINTS.GET_CLASS_FEE_ASSIGNMENT);
};

// Edit Class Fee Assignment
export const editClassFeeAssignment = async (assignmentData) => {
  return authorizedPut(API_ENDPOINTS.EDIT_CLASS_FEE_ASSIGNMENT, assignmentData);
};

// View Class Fee Assignment Students
export const viewClassFeeAssignmentStudents = async (classSectionId, feeStructureId) => {
  return authorizedGet(`${API_ENDPOINTS.VIEW_CLASS_FEE_ASSIGNMENT_STUDENTS}?class_section_id=${classSectionId}&fee_structure_id=${feeStructureId}`);
};

// Delete Class Fee Assignment
export const deleteClassFeeAssignment = async (classSectionId, feeStructureId) => {
  return authorizedDelete(`${API_ENDPOINTS.DELETE_CLASS_FEE_ASSIGNMENT}?class_section_id=${classSectionId}&fee_structure_id=${feeStructureId}`);
};

// Get Students by Class and Section
export const getStudentsByClassSection = async (classId, sectionId) => {
  return authorizedGet(API_ENDPOINTS.GET_STUDENTS_BY_CLASS_SECTION(classId, sectionId));
};

// ============= Student Fee Report Functions =============

// Get Student Fee Report
export const getStudentFeeReport = async (studentId) => {
  return authorizedGet(API_ENDPOINTS.GET_STUDENT_FEE_REPORT(studentId));
};

// Get Students Fee Summary by Class and Section
export const getStudentsFeesSummary = async (classId, sectionId) => {
  return authorizedGet(API_ENDPOINTS.GET_STUDENTS_FEE_SUMMARY(classId, sectionId));
};

// ============= Payment Records Functions =============

// Get All Payments
export const getAllPayments = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ALL_PAYMENTS);
};

// Get Payment Details by ID
export const getPaymentDetails = async (id) => {
  return authorizedGet(API_ENDPOINTS.GET_PAYMENT_DETAILS(id));
};

// Get Payment by ID
export const getPaymentById = async (id) => {
  return authorizedGet(API_ENDPOINTS.GET_PAYMENT_BY_ID(id));
};

// Create Payment
export const createPayment = async (paymentData) => {
  return authorizedPost(API_ENDPOINTS.CREATE_PAYMENT, paymentData);
};



// ADMIT CARD ENDPOINTS
export const getAllExamTermsForAdmitCard = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ALL_EXAM_TERMS_FOR_ADMIT_CARD);
};

export const getExamByTerm = async (examTermId) => {
  return authorizedGet(API_ENDPOINTS.GET_EXAM_BY_TERM(examTermId));
};

export const getExamScheduleByExam = async (examId) => {
  return authorizedGet(API_ENDPOINTS.GET_EXAM_SCHEDULE_BY_EXAM(examId));
};

export const getStudentAdmitCard = async (studentId, examId) => {
  return authorizedGet(API_ENDPOINTS.GET_STUDENT_ADMIT_CARD(studentId, examId));
};

export const getClassAdmitCards = async (classId, examId, classSectionId) => {
  return authorizedGet(API_ENDPOINTS.GET_CLASS_ADMIT_CARDS(classId, examId, classSectionId));
};

// EXAM TIMETABLE ENDPOINTS
export const createExamTimetable = async (timetableData) => {
  return authorizedPost(API_ENDPOINTS.CREATE_EXAM_TIMETABLE, timetableData);
};

export const getExamTimetableByClassAndExam = async (examId, classSectionId) => {
  return authorizedGet(API_ENDPOINTS.GET_EXAM_TIMETABLE_BY_CLASS_AND_EXAM(examId, classSectionId));
};

export const getExamTermDropdown = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ALL_EXAM_TERMS_FOR_ADMIT_CARD);
};

export const getExamDropdown = async (termId) => {
  return authorizedGet(API_ENDPOINTS.GET_EXAM_DROPDOWN(termId));
};

export const getClassScheduledExams = async (classSectionId) => {
  return authorizedGet(API_ENDPOINTS.GET_CLASS_SCHEDULED_EXAMS(classSectionId));
};

// DASHBOARD ENDPOINTS
export const getDashboardStats = async () => {
  return authorizedGet(API_ENDPOINTS.GET_DASHBOARD_STATS);
};

export const getMonthlyIncomeExpense = async () => {
  return authorizedGet(API_ENDPOINTS.GET_MONTHLY_INCOME_EXPENSE);
};

export const getPaymentModeCollection = async () => {
  return authorizedGet(API_ENDPOINTS.GET_PAYMENT_MODE_COLLECTION);
};

export const getClassWiseAttendance = async () => {
  return authorizedGet(API_ENDPOINTS.GET_CLASS_WISE_ATTENDANCE);
};

export const getNotices = async () => {
  return authorizedGet(API_ENDPOINTS.GET_NOTICES);
};

export const getMonthlyFeeCollection = async () => {
  return authorizedGet(API_ENDPOINTS.GET_MONTHLY_FEE_COLLECTION);
};

export const getFeeAssignmentCollection = async () => {
  return authorizedGet(API_ENDPOINTS.GET_FEE_ASSIGNMENT_COLLECTION);
};

export const getStudentDashboardStats = async () => {
  return authorizedGet(API_ENDPOINTS.GET_STUDENT_DASHBOARD_STATS);
};

export const getTodayClasses = async () => {
  return authorizedGet(API_ENDPOINTS.GET_TODAY_CLASSES);
};

export const getWeeklyTimetable = async () => {
  return authorizedGet(API_ENDPOINTS.GET_WEEKLY_TIMETABLE);
};

export const getPendingAssignments = async () => {
  return authorizedGet(API_ENDPOINTS.GET_PENDING_ASSIGNMENTS);
};

export const getStudentDashboardNotices = async () => {
  return authorizedGet(API_ENDPOINTS.GET_STUDENT_NOTICES);
};

export const getAcademicPerformance = async (examId) => {
  return authorizedGet(API_ENDPOINTS.GET_ACADEMIC_PERFORMANCE(examId));
};

export const getTeacherDashboardStats = async () => {
  return authorizedGet(API_ENDPOINTS.GET_TEACHER_DASHBOARD_STATS);
};

export const getTeacherTodayClasses = async () => {
  return authorizedGet(API_ENDPOINTS.GET_TEACHER_TODAY_CLASSES);
};

export const logoutUser = async () => {
  return authorizedPost(API_ENDPOINTS.LOGOUT, {});
};

// Exam Marks endpoints
export const registerStudentMarks = async (marksData) => {
  return authorizedPost(API_ENDPOINTS.REGISTER_STUDENT_MARKS, marksData);
};

export const getCompleteMarksheet = async (examId, classSectionId) => {
  return authorizedGet(API_ENDPOINTS.GET_COMPLETE_MARKSHEET(examId, classSectionId));
};

export const getStudentsBySubject = async (examId, classSectionId, subjectId) => {
  return authorizedGet(API_ENDPOINTS.GET_STUDENTS_BY_SUBJECT(examId, classSectionId, subjectId));
};

export const updateSubjectMarks = async (marksData) => {
  return authorizedPost(API_ENDPOINTS.UPDATE_SUBJECT_MARKS, marksData);
};

export const getStudentExamHistory = async (studentId) => {
  return authorizedGet(API_ENDPOINTS.GET_STUDENT_EXAM_HISTORY(studentId));
};

export const getStudentReportHistory = async ({ studentId } = {}) => {
  const normalizedStudentId = Number(studentId);
  if (!Number.isFinite(normalizedStudentId) || normalizedStudentId <= 0) {
    throw new Error('Valid student_id is required');
  }

  return authorizedGet(
    `${API_ENDPOINTS.GET_STUDENT_REPORT_HISTORY}?student_id=${normalizedStudentId}`
  );
};

export const getReportCardData = async (data) => {
  return authorizedPost(API_ENDPOINTS.GET_REPORT_CARD_DATA, data);
};

export const getPublishedResultsByExamTypes = async ({ examTypeIds = [], studentIds = [] } = {}) => {
  const normalizedExamTypeIds = (Array.isArray(examTypeIds) ? examTypeIds : [examTypeIds])
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id) && id > 0);

  const normalizedStudentIds = (Array.isArray(studentIds) ? studentIds : [studentIds])
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id) && id > 0);

  const params = new URLSearchParams();
  if (normalizedExamTypeIds.length > 0) {
    params.set('exam_type_ids', normalizedExamTypeIds.join(','));
  }
  normalizedStudentIds.forEach((id) => params.append('student_ids', String(id)));

  const query = params.toString();
  const endpoint = query
    ? `${API_ENDPOINTS.GET_PUBLISHED_RESULTS_BY_EXAM_TYPES}?${query}`
    : API_ENDPOINTS.GET_PUBLISHED_RESULTS_BY_EXAM_TYPES;

  return authorizedGet(endpoint);
};

export const getPublishedResultsByEventStudents = async ({ examEventId, studentIds = [] } = {}) => {
  const normalizedExamEventId = Number(examEventId);
  if (!Number.isFinite(normalizedExamEventId) || normalizedExamEventId <= 0) {
    throw new Error('Valid exam_event_id is required');
  }

  const normalizedStudentIds = (Array.isArray(studentIds) ? studentIds : [studentIds])
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id) && id > 0);

  const params = new URLSearchParams();
  params.set('exam_event_id', String(normalizedExamEventId));
  normalizedStudentIds.forEach((id) => params.append('student_id', String(id)));

  const endpoint = `${API_ENDPOINTS.GET_PUBLISHED_RESULTS_BY_EVENT_STUDENTS}?${params.toString()}`;
  return authorizedGet(endpoint);
};

export const getPublishedFailedStudentsByEvent = async ({ examEventId } = {}) => {
  const normalizedExamEventId = Number(examEventId);
  if (!Number.isFinite(normalizedExamEventId) || normalizedExamEventId <= 0) {
    throw new Error('Valid exam_event_id is required');
  }

  const endpoint = `${API_ENDPOINTS.GET_PUBLISHED_FAILED_STUDENTS_BY_EVENT}?exam_event_id=${normalizedExamEventId}`;
  return authorizedGet(endpoint);
};

export const getPublishedResultsClassWise = async ({ examEventId, classId } = {}) => {
  const normalizedExamEventId = Number(examEventId);
  const normalizedClassId = Number(classId);

  if (!Number.isFinite(normalizedExamEventId) || normalizedExamEventId <= 0) {
    throw new Error('Valid exam_event_id is required');
  }

  if (!Number.isFinite(normalizedClassId) || normalizedClassId <= 0) {
    throw new Error('Valid class_id is required');
  }

  const endpoint = `${API_ENDPOINTS.GET_PUBLISHED_RESULTS_CLASS_WISE}?exam_event_id=${normalizedExamEventId}&class_id=${normalizedClassId}`;
  return authorizedGet(endpoint);
};

export const getPublishedResultsSubjectWise = async ({ examEventId, classId, subjectId } = {}) => {
  const normalizedExamEventId = Number(examEventId);
  const normalizedClassId = Number(classId);
  const normalizedSubjectId = Number(subjectId);

  if (!Number.isFinite(normalizedExamEventId) || normalizedExamEventId <= 0) {
    throw new Error('Valid exam_event_id is required');
  }

  if (!Number.isFinite(normalizedClassId) || normalizedClassId <= 0) {
    throw new Error('Valid class_id is required');
  }

  if (!Number.isFinite(normalizedSubjectId) || normalizedSubjectId <= 0) {
    throw new Error('Valid subject_id is required');
  }

  const endpoint = `${API_ENDPOINTS.GET_PUBLISHED_RESULTS_SUBJECT_WISE}?exam_event_id=${normalizedExamEventId}&class_id=${normalizedClassId}&subject_id=${normalizedSubjectId}`;
  return authorizedGet(endpoint);
};

export const generateExamDocument = async (payload) => {
  return authorizedPost(API_ENDPOINTS.GENERATE_EXAM_DOCUMENT, payload);
};

// Student exam result endpoint
export const getStudentExamResult = async (examId) => {
  return authorizedGet(API_ENDPOINTS.GET_STUDENT_EXAM_RESULT(examId));
};
