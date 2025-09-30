import React from "react"
import { useForm } from "react-hook-form"
import { signIn } from "../hooks/useAuth"
import type { SignInValues } from "../Interfaces/UseAuthI"
import { useNavigate } from "react-router-dom"
import { setProfile } from "../hooks/useProfile"

const SignIn: React.FC = () => {
  const Nav = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (formData: SignInValues) => {
    try {
      const { error } = await signIn(formData)

      if (error) {
        console.error("Sign in error:", error)
        alert(error.message)
        return
      }

      await setProfile();
      Nav("/")
    } catch (err) {
      console.error(err)
      alert("An unexpected error occurred.")
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-50 items-center justify-center font-sans">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md sm:bg-white p-8 sm:rounded-2xl sm:shadow-lg sm:border border-slate-200"
        noValidate
      >
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Sign In</h1>
        <p className="mb-6 text-slate-500">Please sign in to your account.</p>

        <div className="mb-4 text-left">
          <label className="block mb-1 text-sm text-slate-700">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
            })}
            className="w-full px-3 py-2 rounded-md bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-6 text-left">
          <label className="block mb-1 text-sm text-slate-700">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum length is 6" },
            })}
            className="w-full px-3 py-2 rounded-md bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition disabled:opacity-60"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
        <p className="mt-4 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <a href="/sign-up" className="underline hover:text-blue-700">
            Sign Up
          </a>
        </p>
        <p className="mt-2 text-center text-sm text-slate-500">
          <a href="/reset-password" className="underline hover:text-blue-700">
            Forgot your password?
          </a>
        </p>
      </form>
    </div>
  )
}

export default SignIn