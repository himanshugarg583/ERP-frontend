import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addStudent, fetchClassDropdown } from '../../helper/requests-method/apiMethods';

const CombinedForm = () => {
  const [formData, setFormData] = useState({
    // Required API fields
    name: "",
    email: "",
    password: "",
    dob: "",
    roll_number: "",
    gender: "",
    class_name: "",
    address: "",
    admission_date: "",
    class_section_id: "",
    admission_no: "",
    phone_no: "",
    previous_school_name: "",
    father_name: "",
    mother_name: "",
    father_phone: "",
    mother_phone: "",
    parent_email_id: "",
    father_occupation: "",
    mother_occupation: "",
    Aadhar_no: "",

    // Additional form fields for UI compatibility
    admissionNo: "",
    class: "",
    section: "",
    rollNumber: "",
    biometricId: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    category: "",
    religion: "",
    caste: "",
    mobileNumber: "",
    bloodGroup: "",
    studentHouse: "",
    height: "",
    weight: "",
    admittedClass: "",
    asOnDate: "",
    referralBy: "",

    fatherName: "",
    fatherPhone: "",
    fatherDob: "",
    fatherOccupation: "",
    marriageAnniversary: "",
    motherName: "",
    motherPhone: "",
    motherDob: "",
    motherOccupation: "",
    guardianIs: "",
    guardianName: "",
    guardianRelation: "",
    guardianPhone: "",
    guardianEmail: "",
    guardianOccupation: "",
    guardianAddress: "",

    currentAddress: "",
    permanentAddress: "",
    isGuardianAddressCurrent: false,
    isPermanentAddressCurrent: false,
    feeGroup: "",
    routeList: "",
    busStop: "",
    hostelType: "",
    hostelName: "",
    aadharNo: "",
    fatherEmail: "",
    previousSchool: "",
  });

  // File state for document uploads
  const [files, setFiles] = useState({
    tc: null,
    marksheet: null,
    image: null,
    aadhar_card: null,
    sign: null,
  });
  const [showPassword, setShowPassword] = useState(false);

  // Class dropdown state
  const [classOptions, setClassOptions] = useState([]);
  const [classLoading, setClassLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch class dropdown data on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      setClassLoading(true);
      try {
        const response = await fetchClassDropdown();
        if (response && response.success && response.data) {
          setClassOptions(response.data);
        } else {
          console.error('Failed to fetch class dropdown:', response?.message);
          setClassOptions([]);
        }
      } catch (error) {
        console.error('Error fetching class dropdown:', error);
        toast.error('Failed to load class options');
        setClassOptions([]);
      } finally {
        setClassLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Special handling for class selection
    if (name === 'class_section_id') {
      const selectedClass = classOptions.find(option => option.id.toString() === value);
      if (selectedClass) {
        setFormData((prev) => ({
          ...prev,
          class_section_id: value,
          class_name: selectedClass.class_name
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Handle file changes for document uploads
  const handleFileChange = (fileType, file) => {
    setFiles(prev => ({
      ...prev,
      [fileType]: file
    }));
  };

  // Helper function to show toast notifications
  const showToast = (response, defaultMessage) => {
    if (response && response.success) {
      toast.success(response.message || defaultMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.error(response?.message || defaultMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Build API payload from form data
  const buildStudentPayload = () => {
    return {
      name: formData.name || formData.firstName || "",
      email: formData.email || "",
      password: formData.password || "123456",
      dob: formData.dob || formData.dateOfBirth || "",
      admission_no: formData.admission_no || formData.admissionNo || "",
      roll_number: formData.roll_number || formData.rollNumber || "",
      gender: formData.gender || "",
      class_name: formData.class_name || "",
      address: formData.address || formData.currentAddress || "",
      admission_date: formData.admission_date || new Date().toISOString().split('T')[0],
      class_section_id: parseInt(formData.class_section_id) || 1,
      phone_no: formData.phone_no || formData.mobileNumber || "",
      previous_school_name: formData.previous_school_name || formData.previousSchool || "",

      // Parent Details with correct field names
      father_name: formData.father_name || formData.fatherName || "",
      mother_name: formData.mother_name || formData.motherName || "",
      father_phone: formData.father_phone || formData.fatherPhone || "",
      mother_phone: formData.mother_phone || formData.motherPhone || "",
      parent_email_id: formData.parent_email_id || formData.guardianEmail || formData.fatherEmail || "",
      father_occupation: formData.father_occupation || formData.fatherOccupation || "",
      mother_occupation: formData.mother_occupation || formData.motherOccupation || "",
      Aadhar_no: formData.Aadhar_no || formData.aadharNo || "",
    };
  };

  // Reset form function
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      dob: "",
      roll_number: "",
      gender: "",
      class_name: "",
      address: "",
      admission_date: "",
      class_section_id: "",
      admission_no: "",
      phone_no: "",
      previous_school_name: "",
      father_name: "",
      mother_name: "",
      father_phone: "",
      mother_phone: "",
      parent_email_id: "",
      father_occupation: "",
      mother_occupation: "",
      Aadhar_no: "",
      admissionNo: "",
      class: "",
      section: "",
      rollNumber: "",
      biometricId: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      category: "",
      religion: "",
      caste: "",
      mobileNumber: "",
      bloodGroup: "",
      studentHouse: "",
      height: "",
      weight: "",
      admittedClass: "",
      asOnDate: "",
      referralBy: "",
      fatherName: "",
      fatherPhone: "",
      fatherDob: "",
      fatherOccupation: "",
      marriageAnniversary: "",
      motherName: "",
      motherPhone: "",
      motherDob: "",
      motherOccupation: "",
      guardianIs: "",
      guardianName: "",
      guardianRelation: "",
      guardianPhone: "",
      guardianEmail: "",
      guardianOccupation: "",
      guardianAddress: "",
      currentAddress: "",
      permanentAddress: "",
      isGuardianAddressCurrent: false,
      isPermanentAddressCurrent: false,
      feeGroup: "",
      routeList: "",
      busStop: "",
      hostelType: "",
      hostelName: "",
      aadharNo: "",
      fatherEmail: "",
      previousSchool: "",
    });
    setFiles({
      tc: null,
      marksheet: null,
      image: null,
      aadhar_card: null,
      sign: null,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = buildStudentPayload();
      console.log("API Payload:", payload);
      console.log("Files to upload:", files);

      const response = await addStudent(payload, files);

      if (response && response.success) {
        showToast(response, "Student added successfully!");
        resetForm();
      } else {
        showToast(response, "Failed to add student");
      }
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error(error?.response?.data?.message || "Failed to add student. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const documentList = [
    { id: 'tc', label: 'TC (Transfer Certificate)', accept: '.pdf,.jpg,.jpeg,.png' },
    { id: 'marksheet', label: 'Marksheet', accept: '.pdf,.jpg,.jpeg,.png' },
    { id: 'image', label: 'Student Photo', accept: '.jpg,.jpeg,.png' },
    { id: 'aadhar_card', label: 'Aadhar Card', accept: '.pdf,.jpg,.jpeg,.png' },
    { id: 'sign', label: 'Student Signature', accept: '.jpg,.jpeg,.png' },
  ];

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Student Details Section */}
        <div className="space-y-4">
          <h2 className="text-lg md:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
            Student Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Admission No. <span className="text-red-500">*</span>
              </label>
              <input
                name="admission_no"
                value={formData.admission_no}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                placeholder="Enter Admission No"
                type="text"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Roll No. <span className="text-red-500">*</span>
              </label>
              <input
                name="roll_number"
                value={formData.roll_number}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                placeholder="Enter Roll No"
                type="text"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Student Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Student Name"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                type="text"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                type="email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Class & Section <span className="text-red-500">*</span>
              </label>
              <select
                name="class_section_id"
                value={formData.class_section_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                required
                disabled={classLoading}
              >
                <option value="">
                  {classLoading ? "Loading classes..." : "Select Class & Section"}
                </option>
                {classOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.class_name} - {option.section_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Date Of Birth <span className="text-red-500">*</span>
              </label>
              <input
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                type="date"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                name="phone_no"
                value={formData.phone_no}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                placeholder="Enter Phone Number"
                type="tel"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pr-16 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                  placeholder="Enter Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-violet-700 hover:text-violet-800 font-medium cursor-pointer"
                >
                  {showPassword ? 'Hide' : 'View'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Aadhar No <span className="text-red-500">*</span>
              </label>
              <input
                name="Aadhar_no"
                value={formData.Aadhar_no}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                placeholder="Enter Aadhar Number"
                type="text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Admission Date <span className="text-red-500">*</span>
              </label>
              <input
                name="admission_date"
                value={formData.admission_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                type="date"
                required
              />
            </div>
          </div>
        </div>

        {/* Parent/Guardian Details Section */}
        <div className="space-y-4">
          <h2 className="text-lg md:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
            Parent/Guardian Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Father Name <span className="text-red-500">*</span>
              </label>
              <input
                name="father_name"
                value={formData.father_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                placeholder="Enter Father Name"
                type="text"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mother Name <span className="text-red-500">*</span>
              </label>
              <input
                name="mother_name"
                value={formData.mother_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                placeholder="Enter Mother Name"
                type="text"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Father Phone <span className="text-red-500">*</span>
              </label>
              <input
                name="father_phone"
                value={formData.father_phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                placeholder="Enter Father Phone Number"
                type="tel"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mother Phone <span className="text-red-500">*</span>
              </label>
              <input
                name="mother_phone"
                value={formData.mother_phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                placeholder="Enter Mother Phone Number"
                type="tel"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Father Occupation <span className="text-red-500">*</span>
              </label>
              <input
                name="father_occupation"
                value={formData.father_occupation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                placeholder="Enter Father Occupation"
                type="text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mother Occupation <span className="text-red-500">*</span>
              </label>
              <input
                name="mother_occupation"
                value={formData.mother_occupation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                placeholder="Enter Mother Occupation"
                type="text"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Parent Email <span className="text-red-500">*</span>
              </label>
              <input
                name="parent_email_id"
                value={formData.parent_email_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                placeholder="Enter Parent Email"
                type="email"
              />
            </div>
          </div>
        </div>

        {/* Address & Other Details Section */}
        <div className="space-y-4">
          <h2 className="text-lg md:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
            Address & Other Details
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition resize-none"
                placeholder="Enter Student Address"
                rows="3"
                required
              />
            </div>

            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Previous School
              </label>
              <input
                name="previous_school_name"
                value={formData.previous_school_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                placeholder="Enter Previous School Name"
                type="text"
              />
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="space-y-4">
          <h2 className="text-lg md:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
            Documents
          </h2>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100">
                  <th className="w-12 px-4 py-3 text-left text-sm font-semibold text-slate-700 border border-slate-300">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border border-slate-300">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border border-slate-300">Documents</th>
                </tr>
              </thead>
              <tbody>
                {documentList.map((doc, index) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-center text-sm text-slate-600 border border-slate-300">{index + 1}.</td>
                    <td className="px-4 py-3 border border-slate-300">
                      <input
                        type="text"
                        value={doc.label}
                        className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm"
                        readOnly
                      />
                    </td>
                    <td className="px-4 py-3 border border-slate-300">
                      <div className="flex items-center gap-3 flex-wrap">
                        <input
                          type="file"
                          className="hidden"
                          id={`${doc.id}File`}
                          accept={doc.accept}
                          onChange={(e) => handleFileChange(doc.id, e.target.files[0])}
                        />
                        <label
                          htmlFor={`${doc.id}File`}
                          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm whitespace-nowrap"
                        >
                          Choose File
                        </label>
                        <span className="text-sm text-slate-600 truncate max-w-xs">
                          {files[doc.id] ? files[doc.id].name : "No file chosen"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {documentList.map((doc, index) => (
              <div key={doc.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">{index + 1}. {doc.label}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    className="hidden"
                    id={`${doc.id}FileMobile`}
                    accept={doc.accept}
                    onChange={(e) => handleFileChange(doc.id, e.target.files[0])}
                  />
                  <label
                    htmlFor={`${doc.id}FileMobile`}
                    className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm text-center"
                  >
                    Choose File
                  </label>
                  {files[doc.id] && (
                    <span className="text-xs text-slate-600 break-words">
                      {files[doc.id].name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-medium"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 text-white rounded-lg font-medium transition-colors ${loading
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-violet-600 hover:bg-violet-700'
              }`}
          >
            {loading ? 'Adding Student...' : 'Submit'}
          </button>
        </div>
      </form>
    </>
  );
};

export default CombinedForm;
