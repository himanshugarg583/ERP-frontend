import React, { useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { MdMail, MdLock, MdPerson } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const schema = yup.object({
  name: yup.string().required("Name is required").min(2, "Name is too short"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const UnifiedSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");
    try {
      const { signupUser } = await import("../../helper/requests-method/apiMethods");
      await signupUser({ name: data.name, email: data.email, password: data.password });
      toast.success("Account created successfully");
      navigate("/login");
    } catch (err) {
      toast.error("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-center bg-cover px-3" style={{ backgroundImage: "url('/login-signup-bg.png')" }}>
      <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-4 sm:p-6 border border-white/60 mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Create your account</h1>
        </div>
        {/* Notifications are shown via toast; inline message suppressed */}
        <form onSubmit={handleSubmit(onSubmit, (errs) => {
          const message = errs?.name?.message || errs?.email?.message || errs?.password?.message || "Please check the form and try again.";
          toast.error(message);
        })} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="name">Full name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <MdPerson size={20} />
              </span>
              <input
                id="name"
                {...register("name")}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-0 focus:border-emerald-500 focus:outline-none"
                placeholder="Your name"
              />
            </div>
            {/* Inline errors suppressed in favor of toast */}
          </div>

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
                type="password"
                id="password"
                {...register("password")}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-0 focus:border-emerald-500 focus:outline-none"
                placeholder="Create a password"
              />
            </div>
            {/* Inline errors suppressed in favor of toast */}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {loading ? "Creating..." : "Sign up"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <button onClick={() => navigate("/login")} className="text-emerald-700 hover:underline cursor-pointer">Login</button>
        </div>
      </div>
    </main>
  );
};

export default UnifiedSignup;


