"use client"

import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMail, AiOutlineLock, AiOutlineShop } from "react-icons/ai"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { server } from "../../server"
import { toast } from "react-toastify"

const ShopLogin = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [visible, setVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await axios.post(
        `${server}/shop/login-shop`,
        {
          email,
          password,
        },
        { withCredentials: true },
      )
      toast.success("Login Success!")
      navigate("/dashboard")
      window.location.reload(true)
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed!")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-800 to-orange-700 p-8 relative">
            {/* Decorative book elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-2 left-4 w-8 h-20 bg-white rounded-r-lg transform rotate-12"></div>
              <div className="absolute top-4 left-16 w-8 h-16 bg-white rounded-r-lg transform rotate-6"></div>
              <div className="absolute top-6 left-28 w-8 h-24 bg-white rounded-r-lg transform -rotate-3"></div>
              <div className="absolute top-2 right-12 w-8 h-18 bg-white rounded-l-lg transform -rotate-12"></div>
              <div className="absolute top-5 right-24 w-8 h-22 bg-white rounded-l-lg transform -rotate-6"></div>
            </div>

            <div className="flex justify-center relative z-10">
              <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-md">
                <AiOutlineShop className="h-8 w-8 text-amber-800" />
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-white">Bookseller Login</h2>
            <p className="mt-2 text-center text-amber-200">Access your bookstore dashboard</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email */}
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
                    name="email"
                    id="email"
                    autoComplete="email"
                    required
                    placeholder="bookstore@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AiOutlineLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={visible ? "text" : "password"}
                    name="password"
                    id="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {visible ? (
                      <AiOutlineEye
                        className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-500"
                        onClick={() => setVisible(false)}
                      />
                    ) : (
                      <AiOutlineEyeInvisible
                        className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-500"
                        onClick={() => setVisible(true)}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="remember-me"
                    id="remember-me"
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href=".forgot-password" className="font-medium text-amber-600 hover:text-amber-500">
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* Submit button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200"
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
                      Signing in...
                    </>
                  ) : (
                    "Sign in to Dashboard"
                  )}
                </button>
              </div>

              {/* Sign up link */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Don't have a seller account?{" "}
                  <Link to="/shop-create" className="font-medium text-amber-600 hover:text-amber-500">
                    Register as Seller
                  </Link>
                </p>
              </div>
            </form>

            {/* Divider */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Seller Benefits</span>
                </div>
              </div>

              {/* Benefits */}
              <div className="mt-6 bg-amber-50 p-4 rounded-lg border border-amber-100">
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-center">
                    <span className="mr-2 text-amber-600">✓</span>
                    Manage your book inventory
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-amber-600">✓</span>
                    Track sales and analytics
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-amber-600">✓</span>
                    Connect with book lovers
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopLogin

