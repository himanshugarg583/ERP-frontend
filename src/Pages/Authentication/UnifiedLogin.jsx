import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
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
    </main>
  );
};

export default UnifiedLogin; 