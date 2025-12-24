import { useState } from "react";
import axios from "axios"; 
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaApple } from "react-icons/fa";
import { MdMail, MdLock } from "react-icons/md";
import { useNavigate } from "react-router";
import { loginUser } from "../../helper/requests-method/apiMethods";

// Yup validation schema
const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
});

const TeacherLogin = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  // const onSubmit = async (data) => {
  //   navigate("/TeacherPortal");
  // };

  
    const onSubmit = async (data) => {
      setLoading(true);
      setErrorMessage("");
  
      try {
        const response = await loginUser(data);
        
        if (response.success && response.token && response.role) {
          // Store token and user data in localStorage
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('userData', JSON.stringify({
            id: response.id || null,
            email: data.email,
            role: response.role.toLowerCase(),
            name: response.name || 'Teacher',
            token: response.token
          }));
          
          // Navigate based on role
          if (response.role.toLowerCase() === "teacher") {
            navigate("/teacher/dashboard", { replace: true });
          } else {
            setErrorMessage("Invalid role for teacher login");
          }
        } else {
          setErrorMessage(response.message || "Login failed. Please try again.");
        }
      } catch (error) {
        console.error("Login Failed:", error);
        setErrorMessage(
          error.response?.data?.message || "Login failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };


  // const onSubmit = async (data) => {
  //   setLoading(true);
  //   setErrorMessage("");
  //   try {
  //     const response = await axios.post("http://192.168.1.39:8001/user/login", data, {
  //       headers: { "Content-Type": "application/json" },
  //     });

  //     if (response.data.role === "TEACHER") {
  //       navigate("/TeacherPortal");
  //     }
  //   } catch (error) {
  //     setErrorMessage(error.response?.data?.message || "Login failed. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <main className="flex justify-center items-center min-h-screen">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 transform hover:scale-[1.02] transition-all">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Teacher Sign In</h1>
          <p className="text-gray-600">Sign in to continue</p>
        </div>

        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Email Input */}
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Password Input */}
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
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
              <span
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer"
                onClick={togglePassword}
              >
                {passwordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </span>
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="w-4 h-4 border-gray-300 text-blue-600" />
              <span className="ml-2 text-sm">Remember me</span>
            </label>
            <a href="forgetpassword.html" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Social Login */}
          <div className="relative py-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button type="button" className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FaGoogle size={20} />
            </button>
            <button type="button" className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FaFacebook size={20} />
            </button>
            <button type="button" className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FaApple size={20} />
            </button>
          </div>

          {/* Signup Link */}
          <p className="text-center text-sm">
            Don't have an account?
            <a href="register.html" className="text-blue-600 hover:underline ml-1">Sign up</a>
          </p>
        </form>
      </div>
    </main>
  );
};

export default TeacherLogin;
