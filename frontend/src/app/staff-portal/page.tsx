"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldAlert } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuthStore } from "@/store/auth.store"
import toast from "react-hot-toast"

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type FormData = z.infer<typeof schema>

export default function StaffPortalPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [showPass, setShowPass] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      await login(data.email, data.password)
      const user = useAuthStore.getState().user
      
      // Strict role check
      if (user?.role === "CUSTOMER") {
        useAuthStore.getState().logout()
        toast.error("Access Denied: This portal is for staff only.")
        router.push("/login")
        return
      }

      toast.success("Staff Login Successful")
      router.push("/admin")
    } catch {
      toast.error("Invalid credentials")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-luxury-darker px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-luxury-card rounded-2xl shadow-xl border border-gray-100 dark:border-white/5 overflow-hidden"
      >
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-red-500" />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-2">Staff Portal</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Authorized personnel only.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="admin@hotelanand.com"
                  className="w-full pl-11 pr-4 py-3.5 border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-black/20 text-sm focus:outline-none focus:border-red-500 dark:text-white transition-colors"
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  {...register("password")}
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3.5 border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-black/20 text-sm focus:outline-none focus:border-red-500 dark:text-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 text-base font-medium text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Authenticate <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Quick Demo Logins for Testing */}
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/10">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  login("admin@hotelanand.com", "Admin@123").then(() => router.push("/admin"))
                }}
                className="text-xs py-2 px-3 border border-red-500/30 rounded-lg text-red-500 hover:bg-red-500/5 transition-colors"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  login("reception@hotelanand.com", "Receptionist@123").then(() => router.push("/admin"))
                }}
                className="text-xs py-2 px-3 border border-blue-500/30 rounded-lg text-blue-500 hover:bg-blue-500/5 transition-colors"
              >
                Receptionist
              </button>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  )
}
