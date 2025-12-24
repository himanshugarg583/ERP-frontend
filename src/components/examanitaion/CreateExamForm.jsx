import React, { useState } from 'react';

const CreateExamForm = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    examName: '',
    startDate: '',
    endDate: '',
    resultDate: '',
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.examName || !formData.startDate || !formData.endDate || !formData.resultDate) {
      alert('Please fill in all required fields.');
      return;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      alert('Start Date must be before End Date.');
      return;
    }
    if (new Date(formData.endDate) > new Date(formData.resultDate)) {
      alert('Result Publication Date must be after End Date.');
      return;
    }
    // Log form data (replace with API call or other logic)
    console.log('Form Submitted:', formData);
    alert('Exam created successfully!');
  };

  return (
    <div className='w-full p-4'>
            <div className="w-full  bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl m-2">
                
                <div className="p-8">
                    <h1 className="text-2xl font-bold mb-6 text-violet-700">Create New Examination</h1>
        

                    <form>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="examName" className="block text-sm font-medium">
                                        Examination Name
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                                <path d="M2 17l10 5 10-5" />
                                                <path d="M2 12l10 5 10-5" />
                                            </svg>
                                        </span>
                                        <input
                                            type="text"
                                            id="examName"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition-all duration-200"
                                            placeholder="Mid-Term Examination 2025"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="startDate" className="block text-sm font-medium">
                                            Start Date
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                    <line x1="16" y1="2" x2="16" y2="6" />
                                                    <line x1="8" y1="2" x2="8" y2="6" />
                                                    <line x1="3" y1="10" x2="21" y2="10" />
                                                </svg>
                                            </span>
                                            <input
                                                type="date"
                                                id="startDate"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition-all duration-200"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="endDate" className="block text-sm font-medium">
                                            End Date
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                    <line x1="16" y1="2" x2="16" y2="6" />
                                                    <line x1="8" y1="2" x2="8" y2="6" />
                                                    <line x1="3" y1="10" x2="21" y2="10" />
                                                </svg>
                                            </span>
                                            <input
                                                type="date"
                                                id="endDate"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition-all duration-200"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="resultDate" className="block text-sm font-medium">
                                            Result Publication Date
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                    <line x1="16" y1="2" x2="16" y2="6" />
                                                    <line x1="8" y1="2" x2="8" y2="6" />
                                                    <line x1="3" y1="10" x2="21" y2="10" />
                                                </svg>
                                            </span>
                                            <input
                                                type="date"
                                                id="resultDate"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="examDescription" className="block text-sm font-medium">
                                        Examination Description (Optional)
                                    </label>
                                    <textarea
                                        id="examDescription"
                                        rows="4"
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition-all duration-200"
                                        placeholder="Enter any additional information about the examination..."
                                    ></textarea>
        
                                </div>

                                {/* <details className="bg-primary-50 p-4 rounded-md">
                                    <summary className="font-medium cursor-pointer text-primary-700 hover:text-primary-900 transition-colors duration-200">
                                        Advanced Options
                                    </summary>
                                    <div className="mt-4 space-y-4">
                                        <div className="flex items-center">
                                            <input
                                                id="sendNotification"
                                                type="checkbox"
                                                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                            />
                                            <label htmlFor="sendNotification" className="ml-2 block text-sm">
                                                Send notification to students and parents
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                id="publishToPortal"
                                                type="checkbox"
                                                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                            />
                                            <label htmlFor="publishToPortal" className="ml-2 block text-sm">
                                                Publish examination schedule to student portal
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                id="lockGrades"
                                                type="checkbox"
                                                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                            />
                                            <label htmlFor="lockGrades" className="ml-2 block text-sm">
                                                Lock grades after result publication
                                            </label>
                                        </div>
                                    </div>
                                </details> */}

                            </div>

                            <div className="flex justify-end pt-6 border-t border-gray-200 space-x-3">
                                <button
                                    type="button"
                                    className="px-6 py-2.5 rounded-md border border-gray-300 font-medium hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-violet-600 text-white rounded-md font-medium hover:bg-violet-700 transition-all duration-200 transform hover:scale-105 hover:shadow-md"
                                >
                                    Create Examination
                                </button>
                             
                            </div>
                        </div>
                    </form>

                </div>

            </div>
    </div>

  );
};

export default CreateExamForm;