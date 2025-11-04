import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

const CreateExamTimetable = () => {
  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      examName: '',
      timetable: [{ subject: '', date: '', startTime: '', endTime: '', description: '' }],
    },
  });

  // Use useFieldArray to manage dynamic timetable entries
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'timetable',
  });

  // Handle form submission
  const onSubmit = (data) => {
    // Basic validation for timetable entries
    for (const entry of data.timetable) {
      if (new Date(`${entry.date} ${entry.startTime}`) >= new Date(`${entry.date} ${entry.endTime}`)) {
        alert('Start Time must be before End Time for each subject.');
        return;
      }
    }
    console.log('Timetable Data:', data);
    alert('Exam Timetable created successfully!');
  };

  return (
    <div className="w-full p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full">
        <h2 className="text-2xl font-bold text-violet-700 mb-6">Create Exam Timetable</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {/* Exam Name */}
            <div className="space-y-2">
              <label htmlFor="examName" className="block text-sm font-medium text-gray-700">
                Exam Name <span className="text-red-500">*</span>
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
                  {...register('examName', { required: 'Exam Name is required' })}
                  className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition-all duration-200 ${
                    errors.examName ? 'border-red-500' : ''
                  }`}
                  placeholder="e.g., Mid-Term Exam 2025"
                />
              </div>
              {errors.examName && (
                <p className="text-red-500 text-xs mt-1">{errors.examName.message}</p>
              )}
            </div>

            {/* Timetable Entries */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Timetable Entries</h3>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-gray-200 rounded-md relative"
                >
                  {/* Subject */}
                  <div className="space-y-2 md:col-span-3">
                    <label
                      htmlFor={`timetable.${index}.subject`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register(`timetable.${index}.subject`, { required: 'Subject is required' })}
                      className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition-all duration-200 ${
                        errors.timetable?.[index]?.subject ? 'border-red-500' : ''
                      }`}
                      placeholder="e.g., Mathematics"
                    />
                    {errors.timetable?.[index]?.subject && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.timetable[index].subject.message}
                      </p>
                    )}
                  </div>

                  {/* Date */}
                  <div className="space-y-2 md:col-span-3">
                    <label
                      htmlFor={`timetable.${index}.date`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      {...register(`timetable.${index}.date`, { required: 'Date is required' })}
                      className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition-all duration-200 ${
                        errors.timetable?.[index]?.date ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.timetable?.[index]?.date && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.timetable[index].date.message}
                      </p>
                    )}
                  </div>

                  {/* Start Time */}
                  <div className="space-y-2 md:col-span-2">
                    <label
                      htmlFor={`timetable.${index}.startTime`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Start Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      {...register(`timetable.${index}.startTime`, {
                        required: 'Start Time is required',
                      })}
                      className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.timetable?.[index]?.startTime ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.timetable?.[index]?.startTime && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.timetable[index].startTime.message}
                      </p>
                    )}
                  </div>

                  {/* End Time */}
                  <div className="space-y-2 md:col-span-2">
                    <label
                      htmlFor={`timetable.${index}.endTime`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      End Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      {...register(`timetable.${index}.endTime`, { required: 'End Time is required' })}
                      className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.timetable?.[index]?.endTime ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.timetable?.[index]?.endTime && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.timetable[index].endTime.message}
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
                  append({ subject: '', date: '', startTime: '', endTime: '', description: '' })
                }
                className="mt-2 px-4 py-2 bg-violet-100 text-violet-700 rounded-md font-medium hover:bg-violet-200 transition-all duration-200"
              >
                + Add Subject
              </button>
            </div>

            {/* Buttons */}
            <div className="flex justify-end pt-6 border-t border-gray-200 space-x-3">
              <button
                type="button"
                className="px-6 py-2.5 rounded-md border border-gray-300 font-medium hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                onClick={() => window.location.reload()} // Replace with reset() if needed
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-violet-600 text-white rounded-md font-medium hover:bg-violet-700 transition-all duration-200 transform hover:scale-105 hover:shadow-md"
              >
                Create Timetable
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExamTimetable;