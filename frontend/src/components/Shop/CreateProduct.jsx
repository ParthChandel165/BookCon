"use client"

import { useEffect, useState } from "react"
import { AiOutlinePlusCircle } from "react-icons/ai"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { createProduct } from "../../redux/actions/product"
import { categoriesData } from "../../static/data"
import { toast } from "react-toastify"

const CreateProduct = () => {
  const { seller } = useSelector((state) => state.seller)
  const { success, error } = useSelector((state) => state.products)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [images, setImages] = useState([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState("")
  const [originalPrice, setOriginalPrice] = useState()
  const [discountPrice, setDiscountPrice] = useState()
  const [stock, setStock] = useState()

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
    if (success) {
      toast.success("Product created successfully!")
      navigate("/dashboard")
      window.location.reload()
    }
  }, [dispatch, error, success])

  const handleImageChange = (e) => {
    e.preventDefault()
    const files = Array.from(e.target.files)
    setImages((prevImages) => [...prevImages, ...files])
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newForm = new FormData()

    images.forEach((image) => {
      newForm.append("images", image)
    })
    newForm.append("name", name)
    newForm.append("description", description)
    newForm.append("category", category)
    newForm.append("tags", tags)
    newForm.append("originalPrice", originalPrice)
    newForm.append("discountPrice", discountPrice)
    newForm.append("stock", stock)
    newForm.append("shopId", seller._id)
    dispatch(createProduct(newForm))
  }

  return (
    <div className="w-[90%] 800px:w-[50%] bg-white shadow-md rounded-lg p-6 overflow-y-auto mx-auto my-8">
      <h5 className="text-2xl font-semibold text-gray-800 text-center mb-6">Create Product</h5>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={name}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your product name..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            cols="30"
            required
            rows="6"
            type="text"
            name="description"
            value={description}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your product description..."
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Choose a category</option>
            {categoriesData &&
              categoriesData.map((i) => (
                <option value={i.title} key={i.title}>
                  {i.title}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <input
            type="text"
            name="tags"
            value={tags}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter your product tags..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
            <input
              type="number"
              name="price"
              value={originalPrice}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="Enter your product price..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (With Discount) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={discountPrice}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              onChange={(e) => setDiscountPrice(e.target.value)}
              placeholder="Enter your product price with discount..."
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="stock"
            value={stock}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            onChange={(e) => setStock(e.target.value)}
            placeholder="Enter your product stock..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Images <span className="text-red-500">*</span>
          </label>
          <input type="file" name="" id="upload" className="hidden" multiple onChange={handleImageChange} />
          <div className="w-full flex items-center flex-wrap gap-2 mt-2">
            <label htmlFor="upload" className="cursor-pointer">
              <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-500 transition-colors">
                <AiOutlinePlusCircle size={30} className="text-gray-500" />
              </div>
            </label>
            {images &&
              images.map((i, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(i) || "/placeholder.svg"}
                    alt=""
                    className="h-[80px] w-[80px] object-cover rounded-lg border border-gray-200"
                  />
                </div>
              ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create Product
        </button>
      </form>
    </div>
  )
}

export default CreateProduct

