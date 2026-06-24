"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import api from "@/lib/api"
import toast from "react-hot-toast"
import { useAuthStore } from "@/store/auth.store"
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google"

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "placeholder_client_id"

const schema = z.object({
  firstName: z.string().min(2, "First name required"),
  lastName: z.string().min(2, "Last name required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type FormData = z.infer<typeof schema>

function SignupContent() {
  const router = useRouter()
  const { googleLogin } = useAuthStore()
  const [showPass, setShowPass] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      await api.post("/auth/register", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      })
      toast.success("Account created! Please check your email to verify.")
      router.push("/login")
    } catch {
      toast.error("Registration failed. Email may already exist.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true)
      try {
        await googleLogin(tokenResponse.access_token)
        toast.success("Account created successfully!")
        router.push("/dashboard")
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Google registration failed")
      } finally {
        setIsLoading(false)
      }
    },
    onError: () => toast.error("Google registration failed")
  })

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-luxury-darker">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <Link href="/">
            <span className="font-serif text-3xl font-bold">
              Hotel <span className="text-gold-500">The Anand</span>
            </span>
          </Link>
          <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mt-4 mb-1">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Join us for exclusive benefits and easy bookings</p>
        </div>

        <div className="luxury-card p-8">
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
              <span className="px-2 bg-white dark:bg-luxury-dark text-gray-500">Or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input {...register("firstName")} placeholder="Rahul" className="w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-sm focus:outline-none focus:border-gold-500 dark:text-white" />
                </div>
                {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input {...register("lastName")} placeholder="Sharma" className="w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-sm focus:outline-none focus:border-gold-500 dark:text-white" />
                </div>
                {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input {...register("email")} type="email" placeholder="your@email.com" className="w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-sm focus:outline-none focus:border-gold-500 dark:text-white" />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone (optional)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input {...register("phone")} type="tel" placeholder="+91-9296985454" className="w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-sm focus:outline-none focus:border-gold-500 dark:text-white" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input {...register("password")} type={showPass ? "text" : "password"} placeholder="••••••••" className="w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-sm focus:outline-none focus:border-gold-500 dark:text-white" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input {...register("confirmPassword")} type={showPass ? "text" : "password"} placeholder="••••••••" className="w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-sm focus:outline-none focus:border-gold-500 dark:text-white" />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              By signing up you agree to our{" "}
              <Link href="/terms" className="text-gold-500">Terms</Link> and{" "}
              <Link href="/privacy-policy" className="text-gold-500">Privacy Policy</Link>
            </p>

            <button type="submit" disabled={isLoading} className="btn-gold w-full justify-center py-3.5 disabled:opacity-50">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (<>Create Account <ArrowRight className="w-4 h-4" /></>)}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-gold-500 font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <SignupContent />
    </GoogleOAuthProvider>
  )
}
