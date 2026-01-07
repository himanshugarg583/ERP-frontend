import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { 
  createExamTimetable, 
  getExamTermDropdown, 
  getExamDropdown, 
  fetchClassDropdown,
  getSubjectsByClass 
} from '../../helper/requests-method/apiMethods';

const CreateExamTimetable = () => {
  const [examTerms, setExamTerms] = useState([]);
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      exam_id: '',
      class_section_id: '',
      remarks: '',
      timetable: [{ subject_id: '', exam_date: '', max_marks: '', passing_marks: '' }],
    },
  });

  // Use useFieldArray to manage dynamic timetable entries
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'timetable',
  });

  // Fetch exam terms on mount
  useEffect(() => {
    const fetchExamTerms = async () => {
      try {
        const response = await getExamTermDropdown();
        if (response?.data) {
          setExamTerms(response.data);
        }
      } catch (error) {
        console.error('Error fetching exam terms:', error);
      }
    };
    fetchExamTerms();
  }, []);

  // Fetch classes on mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetchClassDropdown();
        if (response?.data) {
          setClasses(response.data);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchClasses();
  }, []);

  // Fetch exams when term is selected
  useEffect(() => {
    if (selectedTerm) {
      const fetchExams = async () => {
        try {
          const response = await getExamDropdown(selectedTerm);
          if (response?.data) {
            setExams(response.data);
          }
        } catch (error) {
          console.error('Error fetching exams:', error);
        }
      };
      fetchExams();
    } else {
      setExams([]);
      setSelectedExam('');
    }
  }, [selectedTerm]);

  // Fetch subjects when class is selected
  useEffect(() => {
    if (selectedClass) {
      const fetchSubjects = async () => {
        try {
          const response = await getSubjectsByClass(selectedClass);
          if (response?.data) {
            setSubjects(response.data);
          }
        } catch (error) {
          console.error('Error fetching subjects:', error);
        }
      };
      fetchSubjects();
    } else {
      setSubjects([]);
    }
  }, [selectedClass]);

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        exam_id: parseInt(data.exam_id),
        class_section_id: parseInt(data.class_section_id),
        remarks: data.remarks,
        timetable: data.timetable.map(entry => ({
          subject_id: parseInt(entry.subject_id),
          exam_date: entry.exam_date,
          max_marks: parseInt(entry.max_marks),
          passing_marks: parseInt(entry.passing_marks)
        }))
      };

      const response = await createExamTimetable(payload);
      if (response?.success) {
        alert('Exam Timetable created successfully!');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error creating exam timetable:', error);
      alert('Failed to create exam timetable. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full">
        <h2 className="text-2xl font-bold text-violet-700 mb-6">Create Exam Timetable</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {/* Exam Term Dropdown */}
            <div className="space-y-2">
              <label htmlFor="examTerm" className="block text-sm font-medium text-gray-700">
                Exam Term <span className="text-red-500">*</span>
              </label>
              <select
                id="examTerm"
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition-all duration-200"
                required
              >
                <option value="">Select Exam Term</option>
                {examTerms.map((term) => (
                  <option key={term.id} value={term.id}>
                    {term.term_name} ({term.academic_year})
                  </option>
                ))}
              </select>
            </div>

            {/* Exam Dropdown */}
            <div className="space-y-2">
              <label htmlFor="exam_id" className="block text-sm font-medium text-gray-700">
                Exam <span className="text-red-500">*</span>
              </label>
              <select
                id="exam_id"
                {...register('exam_id', { required: 'Exam is required' })}
                value={selectedExam}
                onChange={(e) => {
                  setSelectedExam(e.target.value);
                  setValue('exam_id', e.target.value);
                }}
                disabled={!selectedTerm}
                className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition-all duration-200 ${
                  !selectedTerm ? 'bg-gray-100 cursor-not-allowed' : ''
                } ${errors.exam_id ? 'border-red-500' : ''}`}
              >
                <option value="">Select Exam</option>
                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.exam_name}
                  </option>
                ))}
              </select>
              {errors.exam_id && (
                <p className="text-red-500 text-xs mt-1">{errors.exam_id.message}</p>
              )}
            </div>

            {/* Class Section Dropdown */}
            <div className="space-y-2">
              <label htmlFor="class_section_id" className="block text-sm font-medium text-gray-700">
                Class - Section <span className="text-red-500">*</span>
              </label>
              <select
                id="class_section_id"
                {...register('class_section_id', { required: 'Class section is required' })}
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setValue('class_section_id', e.target.value);
                }}
                className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition-all duration-200 ${
                  errors.class_section_id ? 'border-red-500' : ''
                }`}
              >
                <option value="">Select Class - Section</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.class_name} - {cls.section_name}
                  </option>
                ))}
              </select>
              {errors.class_section_id && (
                <p className="text-red-500 text-xs mt-1">{errors.class_section_id.message}</p>
              )}
            </div>

            {/* Remarks */}
            <div className="space-y-2">
              <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
                Remarks
              </label>
              <textarea
                id="remarks"
                {...register('remarks')}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition-all duration-200"
                placeholder="Enter any remarks or notes"
                rows="3"
              />
            </div>

            {/* Timetable Entries */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Exam Schedule</h3>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-gray-200 rounded-md relative"
                >
                  {/* Subject */}
                  <div className="space-y-2 md:col-span-3">
                    <label
                      htmlFor={`timetable.${index}.subject_id`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register(`timetable.${index}.subject_id`, { required: 'Subject is required' })}
                      disabled={!selectedClass}
                      className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition-all duration-200 ${
                        !selectedClass ? 'bg-gray-100 cursor-not-allowed' : ''
                      } ${errors.timetable?.[index]?.subject_id ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((subject) => (
                        <option key={subject.subject_id} value={subject.subject_id}>
                          {subject.name} ({subject.subject_code})
                        </option>
                      ))}
                    </select>
                    {errors.timetable?.[index]?.subject_id && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.timetable[index].subject_id.message}
                      </p>
                    )}
                  </div>

                  {/* Date */}
                  <div className="space-y-2 md:col-span-3">
                    <label
                      htmlFor={`timetable.${index}.exam_date`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Exam Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      {...register(`timetable.${index}.exam_date`, { required: 'Date is required' })}
                      className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition-all duration-200 ${
                        errors.timetable?.[index]?.exam_date ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.timetable?.[index]?.exam_date && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.timetable[index].exam_date.message}
                      </p>
                    )}
                  </div>

                  {/* Max Marks */}
                  <div className="space-y-2 md:col-span-2">
                    <label
                      htmlFor={`timetable.${index}.max_marks`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Max Marks <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      {...register(`timetable.${index}.max_marks`, {
                        required: 'Max marks is required',
                        min: { value: 1, message: 'Must be at least 1' }
                      })}
                      className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition-all duration-200 ${
                        errors.timetable?.[index]?.max_marks ? 'border-red-500' : ''
                      }`}
                      placeholder="100"
                    />
                    {errors.timetable?.[index]?.max_marks && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.timetable[index].max_marks.message}
                      </p>
                    )}
                  </div>

                  {/* Passing Marks */}
                  <div className="space-y-2 md:col-span-2">
                    <label
                      htmlFor={`timetable.${index}.passing_marks`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Passing Marks <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      {...register(`timetable.${index}.passing_marks`, { 
                        required: 'Passing marks is required',
                        min: { value: 1, message: 'Must be at least 1' }
                      })}
                      className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition-all duration-200 ${
                        errors.timetable?.[index]?.passing_marks ? 'border-red-500' : ''
                      }`}
                      placeholder="33"
                    />
                    {errors.timetable?.[index]?.passing_marks && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.timetable[index].passing_marks.message}
                      </p>
                    )}
                  </div>

                  {/* Remove Button */}
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
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
                        <path d="M3 6h18" />
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}

              {/* Add Subject Button */}
              <button
                type="button"
                onClick={() =>
                  append({ subject_id: '', exam_date: '', max_marks: '', passing_marks: '' })
                }
                disabled={!selectedClass}
                className={`mt-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  !selectedClass 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                }`}
              >
                + Add Subject
              </button>
            </div>

            {/* Buttons */}
            <div className="flex justify-end pt-6 border-t border-gray-200 space-x-3">
              <button
                type="button"
                className="px-6 py-2.5 rounded-md border border-gray-300 font-medium hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                onClick={() => window.location.reload()}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2.5 bg-violet-600 text-white rounded-md font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-md ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-violet-700'
                }`}
              >
                {isSubmitting ? 'Creating...' : 'Create Timetable'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExamTimetable;