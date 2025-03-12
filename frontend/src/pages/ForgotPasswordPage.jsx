"use client"

import { useState } from "react"
import { AiOutlineMail, AiOutlineArrowLeft } from "react-icons/ai"
import axios from "axios"
import { toast } from "react-toastify"
import { server } from "../server"
import { Link } from "react-router-dom"

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await axios.post(`${server}/user/forgot-password`, { email })
      toast.success(res.data.message)
      // Keep loading state for a moment to give user feedback
      setTimeout(() => setIsLoading(false), 500)
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-700 to-orange-600 p-8 relative">
            {/* Decorative book elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-2 left-4 w-8 h-20 bg-white rounded-r-lg transform rotate-12"></div>
              <div className="absolute top-4 left-16 w-8 h-16 bg-white rounded-r-lg transform rotate-6"></div>
              <div className="absolute top-6 left-28 w-8 h-24 bg-white rounded-r-lg transform -rotate-3"></div>
              <div className="absolute top-2 right-12 w-8 h-18 bg-white rounded-l-lg transform -rotate-12"></div>
              <div className="absolute top-5 right-24 w-8 h-22 bg-white rounded-l-lg transform -rotate-6"></div>
            </div>

            <h2 className="text-center text-3xl font-bold text-white relative z-10">Forgot Your Password?</h2>
            <p className="mt-2 text-center text-amber-200 relative z-10">
              Don't worry, we'll help you get back to your bookshelf
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AiOutlineMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                    required
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">We'll send a password reset link to this email</p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200 disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending Reset Link...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </div>
            </form>

            {/* Back to login */}
            <div className="mt-6">
              <Link
                to="/login"
                className="flex items-center justify-center text-sm text-amber-600 hover:text-amber-500"
              >
                <AiOutlineArrowLeft className="mr-1" />
                Back to Login
              </Link>
            </div>

            {/* Book quote */}
            <div className="mt-8 bg-amber-50 p-4 rounded-lg border border-amber-100">
              <p className="text-sm italic text-gray-700 text-center">"Books are a uniquely portable magic."</p>
              <p className="text-xs text-right mt-1 text-gray-500">- Stephen King</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage

