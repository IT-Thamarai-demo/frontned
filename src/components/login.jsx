import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import * as z from "zod";

// Validation Schema
const schema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const API_URL = import.meta.env.REACT_APP_API_URL;


const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (formData) => {
    setLoading(true);
    setServerError("");

    try {
      const response = await axios.post(`${API_URL}/api/users/login`, formData);
      localStorage.setItem("token", response.data.token);
      alert("Login successful!");
      navigate("/profile");
    } catch (error) {
      setServerError(error.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className=" w-screen min-h-screen flex justify-center items-center h-screen bg-gray-900  w-100%"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 text-white w-100%"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {serverError && <p className="text-red-500 text-sm mb-4">{serverError}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        <p className="text-center mt-4 text-sm">
          Don't have an account? 
          <span className="text-blue-400 cursor-pointer" onClick={() => navigate("/signup")}>
            {" "}Sign Up
          </span>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Login;
