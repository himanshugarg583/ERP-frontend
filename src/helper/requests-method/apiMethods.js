// Staff ID Card endpoints
export const generateStaffIdCard = async (user_id) => {
  return authorizedPost(API_ENDPOINTS.GENERATE_SATFF_ID_CARD, { user_id });
};

export const generateMultipleStaffIdCards = async (user_ids) => {
  return authorizedPost(API_ENDPOINTS.GENERATE_SATFF_ID_CARDS, { user_ids });
};
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Backend base URL

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
    GET_ALL_FEE_ASSIGNMENTS: '/admin/fees_collection/getAllFeeAssignments',
    GET_STUDENTS_BY_CLASS_SECTION: (classId, sectionId) => `/admin/fees_collection/getStudentsByClassSection?class_id=${classId}&section_id=${sectionId}`,
    GET_STUDENT_FEE_REPORT: (studentId) => `/admin/fees_collection/getStudentFeeReport/${studentId}`,
    GET_STUDENTS_FEE_SUMMARY: (classId, sectionId) => `/admin/fees_collection/getStudentsFeeSummary?class_id=${classId}&section_id=${sectionId}`,
    GET_ALL_PAYMENTS: '/admin/fees_collection/getAllPayments',
    GET_PAYMENT_BY_ID: (id) => `/admin/fees_collection/getPayment/${id}`,
    CREATE_PAYMENT: '/admin/fees_collection/createPayment',
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
  MARK_ATTENDANCE: '/admin/studentsAttendance/markClassAttendance',
  // student leave endpoints
  GET_ALL_LEAVES: '/admin/studentLeave/getAllLeaves',
  APPLY_LEAVE: '/admin/studentLeave/applyLeave',
  GET_LEAVE_BY_ID: (id) => `/admin/studentLeave/getLeave/${id}`,
  UPDATE_LEAVE: (id) => `/admin/studentLeave/updateLeaveStatus/${id}`,

  // student information endpoints
  GET_ALL_STUDENTS: '/admin/studentInfo/getAllStudents',
  GET_STUDENT_STATES: '/admin/studentInfo/getStudentStats',
  UPDATE_STUDENT: (id) => `/api/admin/updateStudent/${id}`,
  DELETE_STUDENT: (id) => `/api/admin/softDeleteStudent/${id}`,
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
  GET_EXAM_SCHEDULE_BY_EXAM: (examId) => `/admin/dropdown/getExamScheduleByExam?exam_id=${examId}`,
  GET_STUDENT_ADMIT_CARD: (studentId, examTermId) => `/admin/admitCard/getStudentAdmitCard?student_id=${studentId}&exam_schedule_id=${examTermId}`,
  GET_CLASS_ADMIT_CARDS: (classId) => `/admin/admitCard/getClassAdmitCards/${classId}`,
  GET_STUDENTS_EXAM_LIST: (classId, examTermId,classSectionId) => `/admin/admitCard/getExamStudentList?term_id=${classId}&exam_id=${examTermId}&class_section_id=${classSectionId}`,
 
  // exam timetable endpoints
  CREATE_EXAM_TIMETABLE: '/admin/examTimetable/createExamTimetable',
  GET_CLASS_SCHEDULED_EXAMS: (classSectionId) => `/admin/examTimetable/getClassScheduledExams/${classSectionId}`,
  


  // student report endpoints
  GET_STUDENT_REPORT_BY_DATE: (className, sectionName, date) => `admin/studentsAttendance/attendanceReportByDate?class_name=${className}&section_name=${sectionName}&date=${date}`,
  GET_STUDENT_REPORT_BY_MONTH: (className, sectionName, month, year) => `admin/studentsAttendance/monthlyAttendanceReport?class_name=${className}&section_name=${sectionName}&month=${month}&year=${year}`,
  GET_CLASS_WISE_SUMMARY: (date) => `admin/studentsAttendance/classWiseSummary?date=${date}`,

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
  ADD_SUBJECTS: '/api/classSubject/addSubject',
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
  GETS_STUDENTS_BY_CLASS: (classId) => `/classattendance/getClassStudentList/${classId}`,
  MARK_CLASS_ATTENDANCE: '/classattendance/markClassAttendance',
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
  // get student profile and change password
  GET_STUDENT_PROFILE: '/student/setting/getProfile',
  CHANGE_STUDENT_PASSWORD: '/student/setting/changePassword',

  // Student leave endpoints
  GET_STUDENT_LEAVES: '/student/leave/getMyLeaves',
  APPLY_STUDENT_LEAVE: '/student/leave/applyLeave',
  DELETE_STUDENT_LEAVE: (id) => `/student/leave/deleteLeave/${id}`,

  //student notice endpoints
  GET_STUDENT_NOTICES: '/student/notice/getNoticesForMe',
  

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

// Fetch all admission enquiries
export const fetchAllEnquiries = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ALL_ENQUIRIES);
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

// Get students by class
export const getStudentsByClass = async (classId) => {
  return authorizedGet(API_ENDPOINTS.GET_STUDENTS_BY_CLASS(classId));
};

// Mark class attendance
export const markClassAttendance = async (attendanceData) => {
  return authorizedPost(API_ENDPOINTS.MARK_CLASS_ATTENDANCE, attendanceData);
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
export const getStudentInstallments = async () => {
  return authorizedGet(API_ENDPOINTS.GET_STUDENT_INSTALLMENTS);
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

// Get All Fee Assignments
export const getAllFeeAssignments = async () => {
  return authorizedGet(API_ENDPOINTS.GET_ALL_FEE_ASSIGNMENTS);
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

export const getStudentAdmitCard = async (studentId, examTermId) => {
  return authorizedGet(API_ENDPOINTS.GET_STUDENT_ADMIT_CARD(studentId, examTermId));
};

export const getClassAdmitCards = async (classId) => {
  return authorizedGet(API_ENDPOINTS.GET_CLASS_ADMIT_CARDS(classId));
};

