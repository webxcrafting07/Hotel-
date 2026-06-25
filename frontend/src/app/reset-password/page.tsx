"use client"
import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import toast from "react-hot-toast"
import api from "@/lib/api"

const schema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

type FormData = z.infer<typeof schema>

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  
  const [showPass, setShowPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-luxury-dark">
        <div className="text-center">
          <h2 className="text-2xl font-serif text-gray-900 dark:text-white mb-4">Invalid Link</h2>
          <p className="text-gray-500 mb-6">The password reset link is invalid or has expired.</p>
          <Link href="/forgot-password" className="btn-gold">Request New Link</Link>
        </div>
      </div>
    )
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      await api.post("/auth/reset-password", { token, password: data.password })
      toast.success("Password reset successful!")
      router.push("/login")
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to reset password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542314831-c53cd4b85ca4?w=1200&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-luxury opacity-80" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <Link href="/" className="mb-16">
            <span className="font-serif text-sm tracking-widest text-gold-400 uppercase">Hotel</span>
            <p className="font-serif text-4xl font-bold text-white">The Anand</p>
          </Link>
          <h2 className="font-serif text-4xl font-light mb-4">
            Create New<br />
            <span className="text-gold-400">Password</span>
          </h2>
          <p className="text-white/70 leading-relaxed max-w-sm">
            Enter your new password below. Make sure it's strong and secure.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-white dark:bg-luxury-dark">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white mb-2">New Password</h1>
            <p className="text-gray-500 dark:text-gray-400">Please enter your new password.</p>
          </div>

          <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPass ? "text" : "password"}
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all dark:text-white"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPass ? "text" : "password"}
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all dark:text-white"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-2 text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-gold py-4 flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full" /></div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
