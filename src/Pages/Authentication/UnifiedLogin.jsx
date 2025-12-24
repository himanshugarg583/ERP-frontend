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
import React from "react";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
});

const testCredentials = {
  admin: { email: "admin@gmail.com", password: "Admin@123", icon: FaUserShield, color: "from-purple-500 to-indigo-600" },
  teacher: { email: "teacher@gmail.com", password: "Teacher@123", icon: FaChalkboardTeacher, color: "from-blue-500 to-cyan-600" },
  student: { email: "student@gmail.com", password: "Student@123", icon: FaUserGraduate, color: "from-green-500 to-emerald-600" },
  accountant: { email: "accountant@gmail.com", password: "Accountant@123", icon: FaCalculator, color: "from-orange-500 to-red-600" },
};

const UnifiedLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, getDashboardPath } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {}
  });

  // Autofill handler
  const autofill = (role) => {
    const creds = testCredentials[role];
    setValue("email", creds.email);
    setValue("password", creds.password);
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
    setErrorMessage("");
    
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
        // Redirect to the intended page or default dashboard
        const from = location.state?.from?.pathname || getDashboardPath();
        navigate(from, { replace: true });
      } else {
        toast.error(result.error || "Login failed");
      }
    } catch (error) {
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
    setErrorMessage("");
    try {
      // Lazy import to avoid coupling if API not ready
      const { requestPasswordReset } = await import("../../helper/requests-method/apiMethods");
      await requestPasswordReset(forgotEmail || getValues("email") || "");
      toast.success("Password reset link sent");
      setShowForgot(false);
    } catch (err) {
      toast.error("Failed to send reset link. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-center bg-cover px-3" style={{ backgroundImage: "url('/login-signup-bg.png')" }}>
      <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-4 sm:p-6 border border-white/60 mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back</h1>
        </div>
        {/* Notifications are shown via toast; inline message suppressed */}
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-0 focus:border-emerald-500 focus:outline-none"
                placeholder="you@email.com"
              />
            </div>
            {/* Inline errors suppressed in favor of toast */}
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
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-white focus:ring-0 focus:border-emerald-500 focus:outline-none"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {passwordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            {/* Inline errors suppressed in favor of toast */}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" className="accent-emerald-600" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              Remember me
            </label>
            <button type="button" onClick={() => setShowForgot(true)} className="text-sm text-emerald-700 hover:underline cursor-pointer">Forgot password?</button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-2 p-4 rounded-lg">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(testCredentials).map(([role, creds]) => (
              <button
                key={role}
                onClick={() => autofill(role)}
                className="text-left p-2 text-xs cursor-pointer bg-white border border-gray-200 shadow-md hover:shadow-sm rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium capitalize">{role}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account? <button onClick={() => navigate("/signup")} className="text-emerald-700 hover:underline cursor-pointer">Sign up</button>
        </div>

        {showForgot && createPortal(
          (
            <div className="fixed inset-0 z-[1000] cursor-pointer" onClick={() => setShowForgot(false)}>
              {/* Full-page image underlay */}
              <div className="absolute inset-0 bg-center bg-cover" style={{ backgroundImage: "url('/login-signup-bg.png')" }}></div>
              {/* Subtle gradient tint */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/70 via-white/60 to-blue-50/70"></div>
              {/* Dark scrim */}
              <div className="absolute inset-0 bg-black/40"></div>
              {/* Centered modal */}
              <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4">
                <div className="w-full max-w-sm sm:max-w-md bg-white rounded-xl shadow-lg p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
                  <h2 className="text-lg font-semibold mb-2">Reset your password</h2>
                  <p className="text-sm text-gray-600 mb-4">Enter your email to receive a password reset link.</p>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 bg-white focus:ring-0 focus:border-emerald-500 focus:outline-none"
                  />
                  <div className="flex gap-3 justify-end">
                    <button onClick={() => setShowForgot(false)} className="px-4 py-2 rounded-lg border cursor-pointer">Cancel</button>
                    <button onClick={handleForgotPassword} className="px-4 py-2 rounded-lg bg-emerald-600 text-white cursor-pointer">Send link</button>
                  </div>
                </div>
              </div>
            </div>
          ),
          document.body
        )}
      </div>

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
              <p className="text-xs text-gray-500 text-center mb-3 font-medium">Quick Login As:</p>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(testCredentials).map(([role, creds]) => {
                  const Icon = creds.icon;
                  return (
                    <motion.button
                      key={role}
                      onClick={() => autofill(role)}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative overflow-hidden p-3 rounded-xl bg-gradient-to-br ${creds.color} text-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group`}
                    >
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex flex-col items-center gap-1">
                        <Icon className="text-xl" />
                        <span className="text-xs font-semibold capitalize">{role}</span>
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