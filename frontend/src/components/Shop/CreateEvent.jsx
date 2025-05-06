"use client"

import { useEffect, useState } from "react"
import { AiOutlinePlusCircle } from "react-icons/ai"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { categoriesData } from "../../static/data"
import { toast } from "react-toastify"
import { createevent } from "../../redux/actions/event"
import axios from "axios"

const CreateEvent = () => {
  const { seller } = useSelector((state) => state.seller)
  const { success, error } = useSelector((state) => state.events)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [images, setImages] = useState([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState("")
  const [originalPrice, setOriginalPrice] = useState("")
  const [discountPrice, setDiscountPrice] = useState("")
  const [stock, setStock] = useState("")
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const today = new Date().toISOString().slice(0, 10)
  const minEndDate = startDate ? new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) : ""

  const handleStartDateChange = (e) => {
    const date = new Date(e.target.value)
    const minEnd = new Date(date.getTime() + 3 * 24 * 60 * 60 * 1000)
    setStartDate(date)
    setEndDate(null)
    document.getElementById("end-date").min = minEnd.toISOString().slice(0, 10)
  }

  const handleEndDateChange = (e) => {
    setEndDate(new Date(e.target.value))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setImages((prev) => [...prev, ...files])
  }

  const uploadToCloudinary = async (image) => {
    const formData = new FormData()
    formData.append("file", image)
    formData.append("upload_preset", "hackathonform") // 
    formData.append("cloud_name", "dgjqg72wo") // 

    const res = await axios.post("https://api.cloudinary.com/v1_1/dgjqg72wo/image/upload", formData)
    return res.data.secure_url
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (images.length === 0) {
        toast.error("Please upload at least one image.")
        return
      }

      const uploadedImageUrls = await Promise.all(images.map(uploadToCloudinary))

      const newForm = new FormData()
      newForm.append("name", name)
      newForm.append("description", description)
      newForm.append("category", category)
      newForm.append("tags", tags)
      newForm.append("originalPrice", originalPrice)
      newForm.append("discountPrice", discountPrice)
      newForm.append("stock", stock)
      newForm.append("shopId", seller._id)
      newForm.append("start_Date", startDate.toISOString())
      newForm.append("Finish_Date", endDate.toISOString())

      uploadedImageUrls.forEach((url) => newForm.append("images", url))

      dispatch(createevent(newForm))
    } catch (err) {
      toast.error("Image upload failed.")
      console.error(err)
    }
  }

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
    if (success) {
      toast.success("Event created successfully!")
      navigate("/dashboard-events")
      window.location.reload()
    }
  }, [dispatch, error, success])

  return (
    <div className="w-[90%] 800px:w-[50%] bg-white shadow-md rounded-lg p-6 overflow-y-auto mx-auto my-8">
      <h5 className="text-2xl font-semibold text-gray-800 text-center mb-6">Create Event</h5>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="6"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Choose a category</option>
            {categoriesData.map((i) => (
              <option key={i.title} value={i.title}>{i.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (With Discount) <span className="text-red-500">*</span></label>
            <input
              type="number"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Stock <span className="text-red-500">*</span></label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Start Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              value={startDate ? startDate.toISOString().slice(0, 10) : ""}
              onChange={handleStartDateChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={today}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event End Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              value={endDate ? endDate.toISOString().slice(0, 10) : ""}
              onChange={handleEndDateChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={minEndDate}
              disabled={!startDate}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images <span className="text-red-500">*</span></label>
          <input type="file" id="upload" className="hidden" multiple onChange={handleImageChange} />
          <div className="w-full flex items-center flex-wrap gap-2 mt-2">
            <label htmlFor="upload" className="cursor-pointer">
              <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-500">
                <AiOutlinePlusCircle size={30} className="text-gray-500" />
              </div>
            </label>
            {images.map((img, i) => (
              <img
                key={i}
                src={URL.createObjectURL(img)}
                alt=""
                className="h-[80px] w-[80px] object-cover rounded-lg border"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create Event
        </button>
      </form>
    </div>
  )
}

export default CreateEvent