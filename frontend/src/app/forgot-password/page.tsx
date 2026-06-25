"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, ArrowRight, ArrowLeft } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import toast from "react-hot-toast"
import api from "@/lib/api"

const schema = z.object({
  email: z.string().email("Invalid email address"),
})

type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      await api.post("/auth/forgot-password", { email: data.email })
      setIsSuccess(true)
      toast.success("Password reset link sent to your email!")
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send reset link")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
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
            Reset<br />
            <span className="text-gold-400">Password</span>
          </h2>
          <p className="text-white/70 leading-relaxed max-w-sm">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-white dark:bg-luxury-dark">
        <div className="w-full max-w-md mx-auto">
          <Link href="/login" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gold-500 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Link>

          <div className="mb-10 text-center lg:text-left">
            <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white mb-2">Forgot Password?</h1>
            <p className="text-gray-500 dark:text-gray-400">No worries, we'll send you reset instructions.</p>
          </div>

          {isSuccess ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center p-8 bg-green-50 dark:bg-green-500/10 rounded-2xl border border-green-100 dark:border-green-500/20">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-2">Check your email</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                We sent a password reset link to your email address.
              </p>
              <button onClick={() => router.push("/login")} className="btn-gold w-full">
                Return to Login
              </button>
            </motion.div>
          ) : (
            <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <input
                    {...register("email")}
                    type="email"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all dark:text-white"
                    placeholder="you@example.com"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>}
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
                    Send Reset Link
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.form>
          )}
        </div>
      </div>
    </div>
  )
}
