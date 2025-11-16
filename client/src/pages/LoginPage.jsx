import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { authService } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);

      if (response && response.user) {
        login(response.user, null); // Your backend uses cookies, not tokens
        toast.success("Welcome back!");
        navigate("/chat");
      } else {
        toast.error(response?.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.error || error.message || "Login failed";
      toast.error(errorMessage);
      
      // Show helpful message for network errors
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        console.error('Backend connection failed. Please check:');
        console.error('1. Is the backend server running on http://localhost:3001?');
        console.error('2. Check CORS configuration in server/index.js');
        console.error('3. Verify VITE_SERVER_URL in .env file');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
              Chatify
            </h1>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400">
            Sign in to continue to your account
          </p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              {...register("email")}
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              error={errors.email?.message}
              icon={<Mail size={20} />}
              disabled={isLoading}
            />

            <div className="relative">
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="Enter your password"
                error={errors.password?.message}
                icon={<Lock size={20} />}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin mr-2" size={20} />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Demo Credentials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-neutral-100 dark:bg-neutral-700 rounded-lg"
        >
          <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Demo Credentials:
          </p>
          <div className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
            <p>Email: demo@chatify.com</p>
            <p>Password: demo123</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
