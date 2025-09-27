import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdMail, MdLock } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import React from "react";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
});

const testCredentials = {
  admin: { email: "admin@gmail.com", password: "Admin@123" },
  student: { email: "student@gmail.com", password: "Student@123" },
  teacher: { email: "teacher@gmail.com", password: "Teacher@123" },
  accountant: { email: "accountant@gmail.com", password: "Accountant@123" },
};

const UnifiedLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, getDashboardPath } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {}
  });

  // Autofill handler
  const autofill = (role) => {
    const creds = testCredentials[role];
    setValue("email", creds.email);
    setValue("password", creds.password);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");
    
    try {
      const result = await login(data.email, data.password);
      
      if (result.success) {
        // Redirect to the intended page or default dashboard
        const from = location.state?.from?.pathname || getDashboardPath();
        navigate(from, { replace: true });
      } else {
        setErrorMessage(result.error || "Login failed");
      }
    } catch (error) {
      setErrorMessage("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 transform hover:scale-[1.02] transition-all">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Sign In</h1>
          <p className="text-gray-600">Sign in to continue</p>
        </div>
        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <MdMail size={20} />
              </span>
              <input
                type="email"
                id="email"
                {...register("email")}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <MdLock size={20} />
              </span>
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                {...register("password")}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {passwordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Demo Credentials:</h3>
          <div className="space-y-2">
            {Object.entries(testCredentials).map(([role, creds]) => (
              <button
                key={role}
                onClick={() => autofill(role)}
                className="w-full text-left p-2 text-xs bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium capitalize">{role}:</span> {creds.email}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default UnifiedLogin; 