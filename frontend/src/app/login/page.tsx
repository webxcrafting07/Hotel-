"use client"
import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuthStore } from "@/store/auth.store"
import toast from "react-hot-toast"
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google"

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "placeholder_client_id"

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type FormData = z.infer<typeof schema>

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, googleLogin } = useAuthStore()
  const [showPass, setShowPass] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      await login(data.email, data.password)
      toast.success("Welcome back!")
      const user = useAuthStore.getState().user
      const redirectUrl = searchParams.get("redirect")
      if (redirectUrl) {
        router.push(redirectUrl)
      } else if (user?.role === "CUSTOMER") {
        router.push("/dashboard")
      } else {
        router.push("/admin")
      }
    } catch {
      toast.error("Invalid credentials")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true)
      try {
        await googleLogin(tokenResponse.access_token)
        toast.success("Welcome back!")
        const user = useAuthStore.getState().user
        const redirectUrl = searchParams.get("redirect")
        if (redirectUrl) {
          router.push(redirectUrl)
        } else if (user?.role === "CUSTOMER") {
          router.push("/dashboard")
        } else {
          router.push("/admin")
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Google login failed")
      } finally {
        setIsLoading(false)
      }
    },
    onError: () => toast.error("Google login failed")
  })

  return (
    <div className="min-h-screen flex">
      {/* Left - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-luxury opacity-80" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <Link href="/" className="mb-16">
            <span className="font-serif text-sm tracking-widest text-gold-400 uppercase">Hotel</span>
            <p className="font-serif text-4xl font-bold text-white">The Anand</p>
          </Link>
          <h2 className="font-serif text-4xl font-light mb-4">
            Welcome<br />
            <span className="text-gold-400">Back</span>
          </h2>
          <p className="text-white/70 leading-relaxed max-w-sm">
            Your luxury experience awaits. Sign in to manage your bookings, access exclusive offers, and enjoy personalized service.
          </p>
          <div className="mt-12 flex items-center gap-4">
            <div className="w-12 h-0.5 bg-gold-500" />
            <p className="text-gold-400 text-sm tracking-widest">Puri, Odisha</p>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white dark:bg-luxury-dark">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <Link href="/" className="lg:hidden block mb-8">
              <span className="font-serif text-2xl font-bold">
                Hotel <span className="text-gold-500">The Anand</span>
              </span>
            </Link>
            <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white mb-2">Sign In</h1>
            <p className="text-gray-500 dark:text-gray-400">Access your account and reservations</p>
          </div>

          <button
            type="button"
            onClick={() => handleGoogleLogin()}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-luxury-card text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors mb-6 disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="font-medium">Continue with Google</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-luxury-dark text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="your@email.com"
                  className="w-full pl-11 pr-4 py-3.5 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-sm focus:outline-none focus:border-gold-500 dark:text-white transition-colors"
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
                  className="w-full pl-11 pr-11 py-3.5 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-sm focus:outline-none focus:border-gold-500 dark:text-white transition-colors"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-gold-500" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-sm text-gold-500 hover:text-gold-600">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-gold w-full justify-center py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
              <Link href="/signup" className="text-gold-500 font-medium hover:text-gold-600">
                Create account
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/10">
            <p className="text-xs text-gray-400 text-center mb-4">Demo Accounts</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Super Admin", email: "admin@hotelanand.com", pass: "Admin@123" },
                { label: "Receptionist", email: "reception@hotelanand.com", pass: "Receptionist@123" },
                { label: "Customer", email: "customer@example.com", pass: "Customer@123" },
              ].map((demo) => (
                <button
                  key={demo.label}
                  type="button"
                  onClick={() => {
                    login(demo.email, demo.pass).then(() => {
                      const user = useAuthStore.getState().user
                      router.push(user?.role === "CUSTOMER" ? "/dashboard" : "/admin")
                    })
                  }}
                  className="text-xs py-2 px-3 border border-gold-500/30 rounded-lg text-gold-500 hover:bg-gold-500/5 transition-colors"
                >
                  {demo.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <LoginContent />
      </Suspense>
    </GoogleOAuthProvider>
  )
}
