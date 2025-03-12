"use client"

import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMail, AiOutlineUser, AiOutlineLock } from "react-icons/ai"
import { RxAvatar } from "react-icons/rx"
import { Link } from "react-router-dom"
import axios from "axios"
import { server } from "../../server"
import { toast } from "react-toastify"

const Signup = () => {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [visible, setVisible] = useState(false)
  const [avatar, setAvatar] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // file upload
  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    setAvatar(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)

    const config = { headers: { "Content-Type": "multipart/form-data" } }
    const newForm = new FormData()

    newForm.append("file", avatar)
    newForm.append("name", name)
    newForm.append("email", email)
    newForm.append("password", password)

    axios
      .post(`${server}/user/create-user`, newForm, config)
      .then((res) => {
        toast.success(res.data.message)
        setName("")
        setEmail("")
        setPassword("")
        setAvatar(null)
        setIsLoading(false)
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Something went wrong!")
        setIsLoading(false)
      })
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

            <div className="flex justify-center relative z-10">
              <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-md">
                <AiOutlineUser className="h-8 w-8 text-amber-700" />
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-white">Join BookMarket</h2>
            <p className="mt-2 text-center text-amber-200">Create your account and start your reading journey</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AiOutlineUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AiOutlineMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                    required
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
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                    required
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

              {/* Avatar */}
              <div className="space-y-2">
                <label htmlFor="avatar" className="text-sm font-medium text-gray-700">
                  Profile Picture
                </label>
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-amber-200">
                    {avatar ? (
                      <img
                        src={URL.createObjectURL(avatar) || "/placeholder.svg"}
                        alt="avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <RxAvatar className="h-10 w-10 text-gray-400" />
                    )}
                  </div>
                  <label
                    htmlFor="file-input"
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <span>Upload a photo</span>
                    <input
                      type="file"
                      name="avatar"
                      id="file-input"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleFileInputChange}
                      className="sr-only"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">JPG, JPEG or PNG. Max 1MB.</p>
              </div>

              {/* Submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
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
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>

              {/* Sign in link */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link to="/login" className="font-medium text-amber-600 hover:text-amber-500">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>

            {/* Book quote */}
            <div className="mt-8 bg-amber-50 p-4 rounded-lg border border-amber-100">
              <p className="text-sm italic text-gray-700 text-center">
                "The more that you read, the more things you will know. The more that you learn, the more places you'll
                go."
              </p>
              <p className="text-xs text-right mt-1 text-gray-500">- Dr. Seuss</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup

