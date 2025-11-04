import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useState } from "react";
import { addTeacher } from "../../helper/requests-method/apiMethods";
const CreateTeacher = ({formtitle}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      name: "", // Changed from teacherName to name
      password: "",
      gender: "",
      mobile: "", // API field name
      dob: "",
      qualification: "",
      currentaddress: "", // API field name
      permenantaddress: "", // API field name (matches API typo)
      salary: "",
      joining_date: "", // API field name
      image: null,
      role: "",
    },
  });
  
  const [loading, setLoading] = useState(false); // Add loading state
  // Form Submission
  const onSubmit = async (data) => {
    console.log(data, "Teacher form data");
    setLoading(true);
    
    try {
      // Prepare API payload with correct field names
      const teacherPayload = {
        name: data.name,
        email: data.email,
        password: data.password,
        qualification: data.qualification,
        dob: data.dob,
        gender: data.gender,
        salary: data.salary,
        joining_date: data.joining_date,
        permenantaddress: data.permenantaddress, // API field name (with typo)
        mobile: data.mobile,
        currentaddress: data.currentaddress
      };
      
      // Get image file if provided
      const imageFile = data.image && data.image[0] ? data.image[0] : null;
      
      console.log("API Payload:", teacherPayload);
      console.log("Image file:", imageFile);
      
      const response = await addTeacher(teacherPayload, imageFile);
      
      if (response && response.success) {
        toast.success(response.message || "Teacher added successfully!");
        reset(); // Reset form after successful submission
      } else {
        toast.error(response?.message || "Failed to add teacher");
      }
    } catch (error) {
      console.error("Error adding teacher:", error);
      toast.error(error?.response?.data?.message || "An error occurred while submitting the form");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="w-full p-4">
     <div className="w-full mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-violet-700">{formtitle}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Teacher Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Teacher Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("name", { required: "Teacher Name is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="Teacher Name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender <span className="text-red-500">*</span>
            </label>
            <div className="mt-2 flex items-center">
              <input
                type="radio"
                id="male"
                value="Male"
                {...register("gender", { required: "Gender is required" })}
                className="h-4 w-4 text-violet-600 border-gray-300 focus:ring-violet-600"
              />
              <label htmlFor="male" className="ml-2 text-gray-700">Male</label>
              <input
                type="radio"
                id="female"
                value="Female"
                {...register("gender")}
                className="ml-6 h-4 w-4 text-violet-600 border-gray-300 focus:ring-violet-600"
              />
              <label htmlFor="female" className="ml-2 text-gray-700">Female</label>
            </div>
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender.message}</p>
            )}
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mobile <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("mobile", {
                required: "Mobile is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Mobile must be 10 digits",
                },
              })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="Mobile"
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm">{errors.mobile.message}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register("dob", { required: "Date of Birth is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-violet-600"
            />
            {errors.dob && (
              <p className="text-red-500 text-sm">{errors.dob.message}</p>
            )}
          </div>

          {/* Qualification */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Qualification <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("qualification", { required: "Qualification is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="Qualification"
            />
            {errors.qualification && (
              <p className="text-red-500 text-sm">{errors.qualification.message}</p>
            )}
          </div>

          {/* Current Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("currentaddress", { required: "Current Address is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="Current Address"
            />
            {errors.currentaddress && (
              <p className="text-red-500 text-sm">{errors.currentaddress.message}</p>
            )}
          </div>

          {/* Permanent Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Permanent Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("permenantaddress", { required: "Permanent Address is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="Permanent Address"
            />
            {errors.permenantaddress && (
              <p className="text-red-500 text-sm">{errors.permenantaddress.message}</p>
            )}
          </div>

          {/* Joining Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Joining Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register("joining_date", { required: "Joining Date is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-violet-600"
            />
            {errors.joining_date && (
              <p className="text-red-500 text-sm">{errors.joining_date.message}</p>
            )}
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Salary <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("salary", {
                required: "Salary is required",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Salary must be a number",
                },
              })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Salary"
            />
            {errors.salary && (
              <p className="text-red-500 text-sm">{errors.salary.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              {...register("image", { required: "false" })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image.message}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              {...register("role", { required: "Role is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="">Select Role</option>
              <option value="teacher">Teacher</option>
              <option value="staff">Staff</option>
              <option value="staff">Librarian</option>
              <option value="staff">Accontant</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm">{errors.role.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-md"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Teacher"}
        </button>
        
      </form>
    </div>
   </div>
  );
};

export default CreateTeacher;