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
      const { error } = await signUp(formData);

      if (error) {
        console.error("Sign up error:", error);
        alert(error.message);
        return;
      }

      alert("Sign up successful!");
      Nav("/sign-in");
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex bg-yellow-500 text-white items-center p-30 justify-center font-sans">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-8 bg-yellow-600/90 rounded-md text-left"
        noValidate
      >
        <h1 className="text-4xl font-semibold text-center">Sign Up</h1>
        <p className="mt-2 text-white/80 text-center">Create your account.</p>

        <label className="block mt-4">
          <span className="text-sm">Full name</span>
          <input
            {...register("full_name")}
            className="mt-1 w-full px-3 py-2 rounded bg-yellow-700 text-white placeholder-yellow-300 focus:outline-none"
            placeholder="Jane Doe"
          />
        </label>

        <label className="block mt-4">
          <span className="text-sm">Phone</span>
          <input
            {...register("phone")}
            type="tel"
            className="mt-1 w-full px-3 py-2 rounded bg-yellow-700 text-white placeholder-yellow-300 focus:outline-none"
            placeholder="+1 555-555-5555"
          />
        </label>

        <label className="block mt-4">
          <span className="text-sm">Address</span>
          <input
            {...register("address")}
            className="mt-1 w-full px-3 py-2 rounded bg-yellow-700 text-white placeholder-yellow-300 focus:outline-none"
            placeholder="123 Main St"
          />
        </label>

        <label className="block mt-4">
          <span className="text-sm">City</span>
          <input
            {...register("city")}
            className="mt-1 w-full px-3 py-2 rounded bg-yellow-700 text-white placeholder-yellow-300 focus:outline-none"
            placeholder="City"
          />
        </label>

        <label className="block mt-4">
          <span className="text-sm">Country</span>
          <input
            {...register("country")}
            className="mt-1 w-full px-3 py-2 rounded bg-yellow-700 text-white placeholder-yellow-300 focus:outline-none"
            placeholder="Country"
          />
        </label>

        <label className="block mt-6">
          <span className="text-sm">Email</span>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            })}
            className="mt-1 w-full px-3 py-2 rounded bg-yellow-700 text-white placeholder-yellow-300 focus:outline-none"
            placeholder="you@example.com"
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email && (
            <span className="text-xs text-red-200 mt-1">{errors.email.message}</span>
          )}
        </label>

        <label className="block mt-4">
          <span className="text-sm">Password</span>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" },
            })}
            className="mt-1 w-full px-3 py-2 rounded bg-yellow-700 text-white placeholder-yellow-300 focus:outline-none"
            placeholder="••••••••"
            aria-invalid={errors.password ? "true" : "false"}
          />
          {errors.password && (
            <span className="text-xs text-red-200 mt-1">{errors.password.message}</span>
          )}
        </label>

        <label className="block mt-4">
          <span className="text-sm">Confirm Password</span>
          <input
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => value === watch("password") || "Passwords do not match",
            })}
            type="password"
            className="mt-1 w-full px-3 py-2 rounded bg-yellow-700 text-white placeholder-yellow-300 focus:outline-none"
            placeholder="••••••••"
            aria-invalid={errors.confirmPassword ? "true" : "false"}
          />
          {errors.confirmPassword && (
            <span className="text-xs text-red-200 mt-1">{errors.confirmPassword.message}</span>
          )}
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full py-2 rounded bg-white text-yellow-600 font-semibold hover:opacity-95 disabled:opacity-70"
        >
          {isSubmitting ? "Signing up..." : "Sign Up"}
        </button>

        <p className="mt-4 text-center text-sm text-white/80">
          Already have an account?{" "}
          <a href="/sign-in" className="underline hover:text-white">
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignUp;