import React, { useState, useEffect } from "react";
import { Form } from "react-router-dom";
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
    class_section_id: "", // This will be set from dropdown selection
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
      password: formData.password || "123456", // Default password
      dob: formData.dob || formData.dateOfBirth || "",
      roll_number: formData.roll_number || formData.rollNumber || formData.admissionNo || "",
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
        // Reset form after successful submission
        setFormData({
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
        
        // Reset file uploads
        setFiles({
          tc: null,
          marksheet: null,
          image: null,
          aadhar_card: null,
          sign: null,
        });
        
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

  return (
    <>
      <ToastContainer />
      <div className="">
        <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>

  <h2 className="text-xl font-bold mb-4">Student Details</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Admission No/Roll No. <span className="text-red-500">*</span>
      </label>
      <input
        name="admissionNo"
        value={formData.admissionNo}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded"
        placeholder="Enter Admission No/Roll No"
        type="text"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Student Name <span className="text-red-500">*</span>
      </label>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter Student Name"
        className="w-full px-3 py-2 border rounded border-gray-300"
        type="text"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Email <span className="text-red-500">*</span>
      </label>
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter Email"
        className="w-full px-3 py-2 border border-gray-300 rounded"
        type="email"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Class & Section <span className="text-red-500">*</span>
      </label>
      <select
        name="class_section_id"
        value={formData.class_section_id}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded"
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
      <label className="block text-sm font-medium text-gray-700">
        Date Of Birth <span className="text-red-500">*</span>
      </label>
      <input
        name="dob"
        value={formData.dob}
        onChange={handleChange}
        placeholder="YYYY-MM-DD"
        className="w-full px-3 py-2 border border-gray-300 rounded"
        type="date"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Gender <span className="text-red-500">*</span>
      </label>
      <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded"
        required
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Phone Number <span className="text-red-500">*</span>
      </label>
      <input
        name="phone_no"
        value={formData.phone_no}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded"
        placeholder="Enter Phone Number"
        type="tel"
        required
      />
    </div>

    {/* <div>
      <label className="block text-sm font-medium text-gray-700">
        Roll Number <span className="text-red-500">*</span>
      </label>
      <input
        name="roll_number"
        value={formData.roll_number}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded border-gray-300"
        placeholder="Enter Roll Number"
        type="text"
        required
      />
    </div> */}

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Password <span className="text-red-500">*</span>
      </label>
      <input
        name="password"
        value={formData.password}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded"
        placeholder="Enter Password"
        type="password"
        required
      />
    </div>

    {/* <div>
      <label className="block text-sm font-medium text-gray-700">
        Roll Number <span className="text-red-500">*</span>
      </label>
      <input
        name="roll_number"
        value={formData.roll_number}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded"
        placeholder="Enter Roll Number"
        type="text"
        required
      />
    </div> */}

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Aadhar No <span className="text-red-500">*</span>
      </label>
      <input
        name="Aadhar_no"
        value={formData.Aadhar_no}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded"
        placeholder="Enter Aadhar Number"
        type="text"
      />
    </div>
  </div>

  {/* Parent/Guardian Details */}
  <h2 className="text-xl font-bold mt-8 mb-4">Parent/Guardian Details</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Father Name <span className="text-red-500">*</span>
      </label>
      <input
        name="father_name"
        value={formData.father_name}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded mt-1"
        placeholder="Enter Father Name"
        type="text"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Mother Name <span className="text-red-500">*</span>
      </label>
      <input
        name="mother_name"
        value={formData.mother_name}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded"
        placeholder="Enter Mother Name"
        type="text"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Father Phone <span className="text-red-500">*</span>
      </label>
      <input
        name="father_phone"
        value={formData.father_phone}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded"
        placeholder="Enter Father Phone Number"
        type="tel"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Mother Phone <span className="text-red-500">*</span>
      </label>
      <input
        name="mother_phone"
        value={formData.mother_phone}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded"
        placeholder="Enter Mother Phone Number"
        type="tel"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Father Occupation <span className="text-red-500">*</span>
      </label>
      <input
        name="father_occupation"
        value={formData.father_occupation}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded"
        placeholder="Enter Father Occupation"
        type="text"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Mother Occupation <span className="text-red-500">*</span>
      </label>
      <input
        name="mother_occupation"
        value={formData.mother_occupation}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded"
        placeholder="Enter Mother Occupation"
        type="text"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Parent Email <span className="text-red-500">*</span>
      </label>
      <input
        name="parent_email_id"
        value={formData.parent_email_id}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded"
        placeholder="Enter Parent Email"
        type="email"
      />
    </div>
  </div>

  {/* Address & Other Details */}
  <h2 className="text-xl font-bold mt-8 mb-4">Address & Other Details</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="md:col-span-2">
      <label className="block text-gray-700">
        Address <span className="text-red-500">*</span>
      </label>
      <textarea
        name="address"
        value={formData.address}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded mt-1"
        placeholder="Enter Student Address"
        rows="3"
        required
      />
    </div>

    <div className="md:col-span-2">
      <label className="block text-gray-700">
        Previous School <span className="text-red-500">*</span>
      </label>
      <input
        name="previous_school_name"
        value={formData.previous_school_name}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded mt-1"
        placeholder="Enter Previous School Name"
        type="text"
      />
    </div>

    <div>
      <label className="block text-gray-700">
        Admission Date <span className="text-red-500">*</span>
      </label>
      <input
        name="admission_date"
        value={formData.admission_date}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded mt-1"
        type="date"
        required
      />
    </div>
  </div>

  {/* Documents */}
  <h2 className="text-xl font-bold mt-8 mb-4">Documents</h2>
  <table className="min-w-full bg-white">
    <thead>
      <tr>
        <th className="w-1/12 px-4 py-2 border">#</th>
        <th className="w-5/12 px-4 py-2 border">TITLE</th>
        <th className="w-6/12 px-4 py-2 border">DOCUMENTS</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="border px-4 py-2 text-center">1.</td>
        <td className="border px-4 py-2">
          <input
            type="text"
            value="TC (Transfer Certificate)"
            className="w-full bg-gray-200 p-2 rounded"
            readOnly
          />
        </td>
        <td className="border px-4 py-2">
          <input
            type="file"
            className="hidden"
            id="tcFile"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileChange('tc', e.target.files[0])}
          />
          <label
            htmlFor="tcFile"
            className="bg-indigo-900 text-white px-4 py-2 rounded cursor-pointer"
          >
            Choose File
          </label>
          <span className="ml-2">
            {files.tc ? files.tc.name : "No file chosen"}
          </span>
        </td>
      </tr>
      
      <tr>
        <td className="border px-4 py-2 text-center">2.</td>
        <td className="border px-4 py-2">
          <input
            type="text"
            value="Marksheet"
            className="w-full bg-gray-200 p-2 rounded"
            readOnly
          />
        </td>
        <td className="border px-4 py-2">
          <input
            type="file"
            className="hidden"
            id="marksheetFile"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileChange('marksheet', e.target.files[0])}
          />
          <label
            htmlFor="marksheetFile"
            className="bg-indigo-900 text-white px-4 py-2 rounded cursor-pointer"
          >
            Choose File
          </label>
          <span className="ml-2">
            {files.marksheet ? files.marksheet.name : "No file chosen"}
          </span>
        </td>
      </tr>
      
      <tr>
        <td className="border px-4 py-2 text-center">3.</td>
        <td className="border px-4 py-2">
          <input
            type="text"
            value="Student Photo"
            className="w-full bg-gray-200 p-2 rounded"
            readOnly
          />
        </td>
        <td className="border px-4 py-2">
          <input
            type="file"
            className="hidden"
            id="imageFile"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => handleFileChange('image', e.target.files[0])}
          />
          <label
            htmlFor="imageFile"
            className="bg-indigo-900 text-white px-4 py-2 rounded cursor-pointer"
          >
            Choose File
          </label>
          <span className="ml-2">
            {files.image ? files.image.name : "No file chosen"}
          </span>
        </td>
      </tr>
      
      <tr>
        <td className="border px-4 py-2 text-center">4.</td>
        <td className="border px-4 py-2">
          <input
            type="text"
            value="Aadhar Card"
            className="w-full bg-gray-200 p-2 rounded"
            readOnly
          />
        </td>
        <td className="border px-4 py-2">
          <input
            type="file"
            className="hidden"
            id="aadharFile"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileChange('aadhar_card', e.target.files[0])}
          />
          <label
            htmlFor="aadharFile"
            className="bg-indigo-900 text-white px-4 py-2 rounded cursor-pointer"
          >
            Choose File
          </label>
          <span className="ml-2">
            {files.aadhar_card ? files.aadhar_card.name : "No file chosen"}
          </span>
        </td>
      </tr>
      
      <tr>
        <td className="border px-4 py-2 text-center">5.</td>
        <td className="border px-4 py-2">
          <input
            type="text"
            value="Student Signature"
            className="w-full bg-gray-200 p-2 rounded"
            readOnly
          />
        </td>
        <td className="border px-4 py-2">
          <input
            type="file"
            className="hidden"
            id="signFile"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => handleFileChange('sign', e.target.files[0])}
          />
          <label
            htmlFor="signFile"
            className="bg-indigo-900 text-white px-4 py-2 rounded cursor-pointer"
          >
            Choose File
          </label>
          <span className="ml-2">
            {files.sign ? files.sign.name : "No file chosen"}
          </span>
        </td>
      </tr>
    </tbody>
  </table>

  {/* Submit Button */}
  <div className="mt-6 flex justify-end">
    <button
      type="submit"
      disabled={loading}
      className={`px-4 py-2 text-white rounded-md cursor-pointer ${
        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-900 hover:bg-indigo-800'
      }`}
    >
      {loading ? 'Adding Student...' : 'Submit'}
    </button>
  </div>
</form>
        </div>
      </div>
    </>
  );
};

export default CombinedForm;