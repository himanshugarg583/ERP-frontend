import axios from 'axios';

const API_BASE_URL = 'https://xd363v4j-5000.inc1.devtunnels.ms'; // Backend base URL

// Centralized endpoints
export const API_ENDPOINTS = {
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
  ADD_TEACHER: '/admin/hr/register/addTeacher',
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
  GET_ATTENDANCE_REPORT: '/admin/studentsAttendance/getAttendanceReport'


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
