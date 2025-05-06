"use client"

import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMail, AiOutlineUser, AiOutlineLock, AiOutlineShop } from "react-icons/ai"
import { RxAvatar } from "react-icons/rx"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { server } from "../../server"
import { toast } from "react-toastify"

const ShopCreate = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [address, setAddress] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [avatar, setAvatar] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState("")
  const [password, setPassword] = useState("")
  const [visible, setVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0]
    setAvatar(file)

    // Create FormData to upload the image to Cloudinary
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "hackathonform")
    try {
      const res = await axios.post("https://api.cloudinary.com/v1_1/dgjqg72wo/image/upload", formData)
      setAvatarUrl(res.data.secure_url)  // Cloudinary URL for the uploaded image
    } catch (error) {
      toast.error("Image upload failed!")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Create FormData for submitting the shop data including the Cloudinary URL for the avatar
    const newForm = new FormData()
    newForm.append("avatarUrl", avatarUrl)  // Add the Cloudinary URL here
    newForm.append("name", name)
    newForm.append("email", email)
    newForm.append("password", password)
    newForm.append("zipCode", zipCode)
    newForm.append("address", address)
    newForm.append("phoneNumber", phoneNumber)

    try {
      const res = await axios.post(`${server}/shop/create-shop`, newForm)
      toast.success(res.data.message)
      setName("")
      setEmail("")
      setPassword("")
      setAvatar(null)
      setAvatarUrl("")
      setZipCode("")
      setAddress("")
      setPhoneNumber("")
      navigate("/shop-login")
      window.location.reload()
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
              {/* Optionally add decorative elements here */}
            </div>
            <div className="flex justify-center relative z-10">
              <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-md">
                <AiOutlineShop className="h-8 w-8 text-amber-700" />
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-white">Register as a Seller</h2>
            <p className="mt-2 text-center text-amber-200">Create your shop and start selling</p>
          </div>
          {/* Form */}
          <div className="p-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Shop Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">Shop Name</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AiOutlineUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    id="name" 
                    placeholder="Your Shop Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm" 
                    required 
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AiOutlineMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="shop@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm" 
                    required 
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
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
                      <AiOutlineEye className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-500" onClick={() => setVisible(false)} />
                    ) : (
                      <AiOutlineEyeInvisible className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-500" onClick={() => setVisible(true)} />
                    )}
                  </div>
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">Phone Number</label>
                <div className="relative rounded-md shadow-sm">
                  <input 
                    type="number" 
                    id="phoneNumber" 
                    placeholder="Phone Number" 
                    value={phoneNumber} 
                    onChange={(e) => setPhoneNumber(e.target.value)} 
                    className="block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm" 
                    required 
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium text-gray-700">Address</label>
                <div className="relative rounded-md shadow-sm">
                  <input 
                    type="text" 
                    id="address" 
                    placeholder="Shop Address" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    className="block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm" 
                    required 
                  />
                </div>
              </div>

              {/* Zip Code */}
              <div className="space-y-2">
                <label htmlFor="zipCode" className="text-sm font-medium text-gray-700">Zip Code</label>
                <div className="relative rounded-md shadow-sm">
                  <input 
                    type="number" 
                    id="zipCode" 
                    placeholder="Zip Code" 
                    value={zipCode} 
                    onChange={(e) => setZipCode(e.target.value)} 
                    className="block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm" 
                    required 
                  />
                </div>
              </div>

              {/* Avatar */}
              <div className="space-y-2">
                <label htmlFor="avatar" className="text-sm font-medium text-gray-700">Profile Picture</label>
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-amber-200">
                    {avatar ? (
                      <img src={URL.createObjectURL(avatar)} alt="avatar" className="h-full w-full object-cover" />
                    ) : (
                      <RxAvatar className="h-10 w-10 text-gray-400" />
                    )}
                  </div>
                  <label htmlFor="file-input" className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                    <span>Upload a file</span>
                    <input type="file" name="avatar" id="file-input" onChange={handleFileInputChange} accept=".jpg,.jpeg,.png" className="sr-only" />
                  </label>
                </div>
                <p className="text-xs text-gray-500">JPG, JPEG or PNG. Max 1MB.</p>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200 disabled:opacity-70"
                >
                  {isLoading ? "Creating Shop..." : "Create Shop"}
                </button>
              </div>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link to="/shop-login" className="font-medium text-amber-600 hover:text-amber-500">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
            {/* Book Quote */}
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

export default ShopCreate
