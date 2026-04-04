import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaEye, FaEyeSlash, FaGraduationCap, FaUserShield, FaChalkboardTeacher, FaUserGraduate, FaCalculator } from "react-icons/fa";
import { MdMail, MdLock, MdSchool } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { getDashboardByKey } from "../../utils/dashboardCatalog";

import React from "react";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
});

const testCredentials = {
  admin: { label: "Admin", email: "admin@gmail.com", password: "Admin@123", icon: FaUserShield, color: "from-purple-500 to-indigo-600", expectedRole: "admin", targetPath: "/admin/dashboard" },
  teacher: { label: "Teacher", email: "teacher@gmail.com", password: "Teacher@123", icon: FaChalkboardTeacher, color: "from-blue-500 to-cyan-600", expectedRole: "teacher", targetPath: "/teacher/dashboard" },
  student: { label: "Student", email: "student@gmail.com", password: "Student@123", icon: FaUserGraduate, color: "from-green-500 to-emerald-600", expectedRole: "student", targetPath: "/student/dashboard" },
  accountant: { label: "Accountant", email: "accountant@gmail.com", password: "Accountant@123", icon: FaCalculator, color: "from-orange-500 to-red-600", expectedRole: "accountant", targetPath: "/AccountantDashboard" },
  librarian: { label: "Librarian", email: "librarian.demo@erp.local", password: "Library@123", icon: FaGraduationCap, color: "from-emerald-500 to-teal-600", expectedRole: "library", targetPath: "/LibraryDashboard" },
  onlinelearning: { label: "Online Learning", email: "onlinelearning@gmail.com", password: "Online@123", icon: FaChalkboardTeacher, color: "from-cyan-500 to-blue-600", expectedRole: "onlinelearning", targetPath: "/onlineLearningDash" },
  parents: { label: "Parents", email: "parents@gmail.com", password: "Parents@123", icon: FaUserShield, color: "from-rose-500 to-pink-600", expectedRole: "parent", targetPath: "/ParentDashboard" },
  staff: { label: "Staff", email: "staff.demo@erp.local", password: "Staff@123", icon: FaUserShield, color: "from-slate-500 to-slate-700", expectedRole: "staff", targetPath: "/StaffDashboard" },
  superadmin: { label: "Super Admin", email: "superadmin@gmail.com", password: "SuperAdmin@123", icon: FaUserShield, color: "from-indigo-600 to-violet-700", expectedRole: "superadmin", targetPath: "/superAdminDash" },
  "hr-dashboard": { label: "HR Dashboard", email: "hr.demo@erp.local", password: "Hr@12345", icon: FaUserShield, color: "from-fuchsia-500 to-purple-600", expectedRole: "admin", targetPath: "/hr/dashboard" },
  "admission-officer": { label: "Admission Officer", email: "admission.demo@erp.local", password: "Admission@123", icon: FaUserGraduate, color: "from-lime-500 to-emerald-600", expectedRole: "admin", targetPath: "/admission-officer/dashboard" },
  "transport-manager": { label: "Transport Manager", email: "transport.demo@erp.local", password: "Transport@123", icon: FaCalculator, color: "from-amber-500 to-orange-600", expectedRole: "staff", targetPath: "/transport-manager/dashboard" },
  "hostel-warden": { label: "Hostel Warden", email: "hostel.demo@erp.local", password: "Hostel@123", icon: FaUserGraduate, color: "from-sky-500 to-indigo-600", expectedRole: "staff", targetPath: "/hostel-warden/dashboard" },
};

const UnifiedLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, getDashboardPath } = useAuth();
  const preselectedDashboardKey = new URLSearchParams(location.search).get("dashboard");
  const [selectedDashboardKey, setSelectedDashboardKey] = useState(preselectedDashboardKey || null);
  const [selectedTargetPath, setSelectedTargetPath] = useState(null);
  const [selectedExpectedRole, setSelectedExpectedRole] = useState(null);
  const [selectedLoginLabel, setSelectedLoginLabel] = useState("");
  const selectedDashboard = getDashboardByKey(selectedDashboardKey);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const { register, handleSubmit, setValue, getValues } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {}
  });

  // Autofill handler
  const autofill = (credentialKey) => {
    const creds = testCredentials[credentialKey];
    setValue("email", creds.email);
    setValue("password", creds.password);
    setSelectedTargetPath(creds.targetPath || null);
    setSelectedExpectedRole(creds.expectedRole || null);
    setSelectedLoginLabel(creds.label || credentialKey);

    if (creds.dashboardKey) {
      setSelectedDashboardKey(creds.dashboardKey);
    }
  };

  // Hydrate remembered email
  useEffect(() => {
    const saved = localStorage.getItem("rememberEmail");
    if (saved) {
      setValue("email", saved);
      setRememberMe(true);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      const result = await login(data.email, data.password);
      
      if (result.success) {
        toast.success("Signed in successfully");
        // Remember email opt-in
        if (rememberMe) {
          localStorage.setItem("rememberEmail", data.email);
        } else {
          localStorage.removeItem("rememberEmail");
        }

        const fromPath = location.state?.from?.pathname;
        const roleDashboard = getDashboardPath();

        if (fromPath) {
          navigate(fromPath, { replace: true });
          return;
        }

        if (selectedTargetPath && selectedExpectedRole === result.user.role) {
          navigate(selectedTargetPath, { replace: true });
          return;
        }

        if (selectedTargetPath && selectedExpectedRole && selectedExpectedRole !== result.user.role) {
          toast.info(`Logged in as ${result.user.role}. Redirected to your role dashboard.`);
        }

        if (selectedDashboard && selectedDashboard.allowedRoles.includes(result.user.role)) {
          navigate(selectedDashboard.path, { replace: true });
          return;
        }

        if (selectedDashboard && !selectedDashboard.allowedRoles.includes(result.user.role)) {
          toast.info(`Your account role is ${result.user.role}. Redirected to your default dashboard.`);
        }

        navigate(roleDashboard, { replace: true });
      } else {
        toast.error(result.error || "Login failed");
      }
    } catch {
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const onInvalid = (formErrors) => {
    const message = formErrors?.email?.message || formErrors?.password?.message || "Please check the form and try again.";
    toast.error(message);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Lazy import to avoid coupling if API not ready
      const { requestPasswordReset } = await import("../../helper/requests-method/apiMethods");
      await requestPasswordReset(forgotEmail || getValues("email") || "");
      toast.success("Password reset link sent");
      setShowForgot(false);
    } catch {
      toast.error("Failed to send reset link. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
      </div>

      {/* Left Side - Illustration/Branding */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center items-center p-12 text-white"
      >
        <div className="max-w-md">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <MdSchool className="text-5xl" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">School ERP</h1>
                <p className="text-white/80 text-sm">Management System</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-lg text-white/90 mb-8">
              Manage your school operations seamlessly with our comprehensive ERP solution.
            </p>
            
            <div className="space-y-4">
              {[
                { icon: FaGraduationCap, text: "Student Management" },
                { icon: FaChalkboardTeacher, text: "Teacher Portal" },
                { icon: FaUserShield, text: "Admin Dashboard" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4"
                >
                  <item.icon className="text-2xl" />
                  <span className="text-white/90">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 relative z-10 flex items-center justify-center p-6 sm:p-12"
      >
        <div className="w-full max-w-md">
          {/* Glassmorphism Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/20"
          >
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
              <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl">
                <MdSchool className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">School ERP</h1>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h2>
              <p className="text-gray-600">Enter your credentials to access your account</p>
              {selectedLoginLabel ? (
                <div className="mt-3 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-700">
                  Selected profile: <span className="font-semibold">{selectedLoginLabel}</span>
                </div>
              ) : null}
            </div>

            <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
              {/* Email Input */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="space-y-2"
              >
                <label className="text-sm font-semibold text-gray-700" htmlFor="email">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MdMail className="text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    {...register("email")}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white/50 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all duration-300 text-gray-800 placeholder:text-gray-400"
                    placeholder="you@example.com"
                  />
                </div>
              </motion.div>

              {/* Password Input */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="space-y-2"
              >
                <label className="text-sm font-semibold text-gray-700" htmlFor="password">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MdLock className="text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                  </div>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    {...register("password")}
                    className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl bg-white/50 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all duration-300 text-gray-800 placeholder:text-gray-400"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    {passwordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
              </motion.div>

              {/* Remember Me & Forgot Password */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex items-center justify-between"
              >
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
                    checked={rememberMe} 
                    onChange={(e) => setRememberMe(e.target.checked)} 
                  />
                  <span className="group-hover:text-indigo-600 transition-colors">Remember me</span>
                </label>
                <button 
                  type="button" 
                  onClick={() => setShowForgot(true)} 
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </motion.div>

              {/* Login Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing In...
                  </span>
                ) : "Sign In"}
              </motion.button>
            </form>

            {/* Demo Credentials */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-8"
            >
              <p className="text-xs text-gray-500 text-center mb-3 font-medium">Quick Credentials:</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {Object.entries(testCredentials).map(([credentialKey, creds]) => {
                  const Icon = creds.icon;
                  return (
                    <motion.button
                      key={credentialKey}
                      onClick={() => autofill(credentialKey)}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative overflow-hidden p-3 rounded-xl bg-gradient-to-br ${creds.color} text-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group`}
                    >
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex flex-col items-center gap-1">
                        <Icon className="text-xl" />
                        <span className="text-xs font-semibold leading-tight text-center">{creds.label}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Sign Up Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="mt-8 text-center text-sm text-gray-600"
            >
              Don&apos;t have an account?{" "}
              <button 
                onClick={() => navigate("/signup")} 
                className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
              >
                Sign up
              </button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      {showForgot && createPortal(
        (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-pointer"
            onClick={() => setShowForgot(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h2>
              <p className="text-gray-600 mb-6">Enter your email address and we'll send you a link to reset your password.</p>
              
              <div className="relative group mb-6">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MdMail className="text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                </div>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white focus:border-indigo-600 focus:outline-none transition-all duration-300 text-gray-800"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowForgot(false)}
                  className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleForgotPassword}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg cursor-pointer"
                >
                  Send Link
                </button>
              </div>
            </motion.div>
          </motion.div>
        ),
        document.body
      )}

    </main>
  );
};

export default UnifiedLogin;