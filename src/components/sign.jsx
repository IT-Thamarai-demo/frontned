import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import * as z from "zod";

// Validation Schema using Zod
const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const API_URL = process.env.REACT_APP_API_URL;


const SignIn = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // React Hook Form with Zod validation
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  // Handle form submission
  const onSubmit = async (formData) => {
    setLoading(true);
    setServerError("");

    try {
      const response = await axios.post(`${API_URL}/api/users/register`, formData);
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      setServerError(error.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="w-screen min-h-scrren flex flex-col justify-center items-center min-h-screen bg-gray-900 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Intro Section */}
      <motion.div 
        className="text-center text-white mb-8"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1 className="text-3xl font-bold">🚀 Welcome to Our TODO App!</h1>
        <p className="text-gray-400 mt-2 text-lg">
          Sign up to access exclusive features, manage your profile, and stay connected with our community.
        </p>
      </motion.div>

      <motion.div 
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 text-white"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>

        {serverError && <p className="text-red-500 text-sm mb-4">{serverError}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input 
              type="text" {...register("name")} placeholder="Full Name" 
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.name && <p className="text-red-400 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <input 
              type="email" {...register("email")} placeholder="Email" 
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <input 
              type="password" {...register("password")} placeholder="Password" 
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.password && <p className="text-red-400 text-sm">{errors.password.message}</p>}
          </div>

          <motion.button 
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </motion.button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account? 
          <span className="text-blue-400 cursor-pointer" onClick={() => navigate("/login")}>
            {" "}Log in
          </span>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default SignIn;
