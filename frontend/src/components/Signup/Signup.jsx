"use client"

import { useState } from "react"
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineMail,
  AiOutlineUser,
  AiOutlineLock,
} from "react-icons/ai"
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

  const handleImageUpload = async (file) => {
    const uploadPreset = "hackathonform"
    const cloudName = "dgjqg72wo"
    const formData = new FormData()

    formData.append("file", file)
    formData.append("upload_preset", uploadPreset)

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      return response.data.secure_url
    } catch (error) {
      console.error("Cloudinary upload error:", error)
      return null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    let avatarUrl = ""

    // Upload avatar to Cloudinary
    if (avatar) {
      avatarUrl = await handleImageUpload(avatar)
      if (!avatarUrl) {
        toast.error("Failed to upload profile image.")
        setIsLoading(false)
        return
      }
    }

    try {
      const response = await axios.post(
        `${server}/user/create-user`,
        {
          name,
          email,
          password,
          avatar: avatarUrl,
        },
        { headers: { "Content-Type": "application/json" } }
      )

      toast.success(response.data.message)
      setName("")
      setEmail("")
      setPassword("")
      setAvatar(null)
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-700 to-orange-600 p-8 relative">
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
            <h2 className="mt-6 text-center text-3xl font-bold text-white">Join BookCon</h2>
            <p className="mt-2 text-center text-amber-200">Create your account and start your reading journey</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <div className="relative">
                  <AiOutlineUser className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 pr-3 py-3 w-full border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                  <AiOutlineMail className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 pr-3 py-3 w-full border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <AiOutlineLock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type={visible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 py-3 w-full border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                    required
                  />
                  <div className="absolute right-3 top-3">
                    {visible ? (
                      <AiOutlineEye onClick={() => setVisible(false)} className="cursor-pointer text-gray-400" />
                    ) : (
                      <AiOutlineEyeInvisible onClick={() => setVisible(true)} className="cursor-pointer text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Avatar */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Profile Picture</label>
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-amber-200">
                    {avatar ? (
                      <img src={URL.createObjectURL(avatar)} alt="avatar" className="h-full w-full object-cover" />
                    ) : (
                      <RxAvatar className="h-10 w-10 text-gray-400" />
                    )}
                  </div>
                  <label
                    htmlFor="file-input"
                    className="px-4 py-2 bg-white border rounded-md shadow-sm text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                  >
                    Upload a photo
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => setAvatar(e.target.files[0])}
                      className="sr-only"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">JPG, JPEG or PNG. Max 1MB.</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg font-medium shadow hover:from-amber-700 hover:to-orange-700 transition disabled:opacity-70"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>

              {/* Link */}
              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-amber-600 hover:text-amber-500 font-medium">
                  Sign in
                </Link>
              </p>
            </form>

            {/* Quote */}
            <div className="mt-8 bg-amber-50 p-4 rounded-lg border border-amber-100">
              <p className="text-sm italic text-gray-700 text-center">
                "The more that you read, the more things you will know. The more that you learn, the more places you'll go."
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