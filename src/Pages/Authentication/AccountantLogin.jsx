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

const AccountantLogin = () => {
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
  //  navigate("/AccountantDashboard"); 
  // }

  
    const onSubmit = async (data) => {
      setLoading(true);
      setErrorMessage("");
      console.log(data);
  
      try {
        const response = await loginUser(data);
        console.log(response);
  
        if (response.role === "accountant") {
          navigate("/AccountantDashboard");
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
  //   console.log(data);
  //   try {
  //     const response = await axios.post("http://192.168.1.39:8001/user/login", data, {
  //       headers: { "Content-Type": "application/json" },
  //     });

  //     console.log(response.data);
  //     if (response.data.role === "ADMIN") {
  //       navigate("/AdminDashboard");
  //     }
  //   } catch (error) {
  //     console.error("Login Failed:", error);
  //     setErrorMessage(error.response?.data?.message || "Login failed. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <main className="flex justify-center items-center min-h-screen">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 transform hover:scale-[1.02] transition-all">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Accountant Sign In</h1>
          <p className="text-gray-600">Sign in to continue</p>
        </div>

        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transform hover:scale-[1.02] transition-all disabled:bg-gray-400"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AccountantLogin;
