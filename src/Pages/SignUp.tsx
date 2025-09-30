import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../Schema/SignUpSchema";
import { signUp } from "../hooks/useAuth";
import type { SignUpValues } from "../Interfaces/UseAuthI";
import { useNavigate } from "react-router-dom";

const SignUp: React.FC = () => {
  const Nav = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (formData: SignUpValues) => {
    try {
      const { data, error } = await signUp(formData);
      console.log(data, error);

      if (error) {
        console.error("Sign up error:", error);
        alert(error.message);
        return;
      }

      alert("We sent you a confirmation email. Please check your inbox to verify your account before signing in.");
      Nav("/sign-in");
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen sm:py-3 flex bg-slate-50 items-center justify-center font-sans">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md sm:bg-white p-8 sm:rounded-2xl sm:shadow-lg sm:border border-slate-200"
        noValidate
      >
        <h1 className="text-3xl font-bold text-slate-800 mb-2 text-center">Sign Up</h1>
        <p className="mb-6 text-slate-500 text-center">Create your account.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <label className="block">
            <span className="text-sm text-slate-700">Full name</span>
            <input
              {...register("full_name")}
              className="mt-1 w-full px-3 py-2 rounded-md bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              placeholder="Jane Doe"
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-700">Phone</span>
            <input
              {...register("phone")}
              type="tel"
              className="mt-1 w-full px-3 py-2 rounded-md bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              placeholder="+1 555-555-5555"
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-700">Address</span>
            <input
              {...register("address")}
              className="mt-1 w-full px-3 py-2 rounded-md bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              placeholder="123 Main St"
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-700">City</span>
            <input
              {...register("city")}
              className="mt-1 w-full px-3 py-2 rounded-md bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              placeholder="City"
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-700">Country</span>
            <input
              {...register("country")}
              className="mt-1 w-full px-3 py-2 rounded-md bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              placeholder="Country"
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-700">Email</span>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              })}
              className="mt-1 w-full px-3 py-2 rounded-md bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              placeholder="you@example.com"
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <span className="text-xs text-red-500 mt-1">{errors.email.message}</span>
            )}
          </label>
        </div>

        <label className="block mb-4">
          <span className="text-sm text-slate-700">Password</span>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" },
            })}
            className="mt-1 w-full px-3 py-2 rounded-md bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            placeholder="••••••••"
            aria-invalid={errors.password ? "true" : "false"}
          />
          {errors.password && (
            <span className="text-xs text-red-500 mt-1">{errors.password.message}</span>
          )}
        </label>

        <label className="block mb-4">
          <span className="text-sm text-slate-700">Confirm Password</span>
          <input
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => value === watch("password") || "Passwords do not match",
            })}
            type="password"
            className="mt-1 w-full px-3 py-2 rounded-md bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            placeholder="••••••••"
            aria-invalid={errors.confirmPassword ? "true" : "false"}
          />
          {errors.confirmPassword && (
            <span className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</span>
          )}
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition disabled:opacity-60"
        >
          {isSubmitting ? "Signing up..." : "Sign Up"}
        </button>

        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <a href="/sign-in" className="underline hover:text-blue-700">
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignUp;