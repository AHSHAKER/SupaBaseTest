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
    <div className="min-h-screen flex bg-green-500 text-white items-center justify-center font-sans text-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white/10 p-8 rounded-md shadow-md"
        noValidate
      >
        <h1 className="text-4xl font-semibold mb-4">Sign In</h1>
        <p className="mb-6 text-white/80">Please sign in to your account.</p>

        <div className="mb-4 text-left">
          <label className="block mb-1 text-sm">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
            })}
            className="w-full px-3 py-2 rounded bg-white/20 border border-white/30 focus:outline-none"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-200">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-6 text-left">
          <label className="block mb-1 text-sm">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum length is 6" },
            })}
            className="w-full px-3 py-2 rounded bg-white/20 border border-white/30 focus:outline-none"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-200">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 rounded bg-white text-green-700 font-semibold hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
        <p className="mt-4 text-center text-sm text-white/80">
          Don't have an account?{" "}
          <a href="/sign-up" className="underline hover:text-white">
            Sign Up
          </a>
        </p>
        <p className="mt-2 text-center text-sm text-white/80">
          <a href="/reset-password" className="underline hover:text-white">
            Forgot your password?
          </a>
        </p>
      </form>
    </div>
  )
}

export default SignIn
