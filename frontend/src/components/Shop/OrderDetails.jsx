"use client"

import { useEffect, useState } from "react"
import { BsFillBagFill } from "react-icons/bs"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"
import { backend_url, server } from "../../server"
import { getAllOrdersOfShop } from "../../redux/actions/order"
import { useDispatch, useSelector } from "react-redux"

const OrderDetails = () => {
  const { orders, isLoading } = useSelector((state) => state.order)
  const { seller } = useSelector((state) => state.seller)
  const dispatch = useDispatch()

  const [status, setStatus] = useState("")
  const navigate = useNavigate()

  const { id } = useParams()

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id))
  }, [dispatch])

  const data = orders && orders.find((item) => item._id === id)

  const orderUpdateHandler = async (e) => {
    await axios
      .put(
        `${server}/order/update-order-status/${id}`,
        {
          status,
        },
        { withCredentials: true },
      )
      .then((res) => {
        toast.success("Order updated!")
        navigate("/dashboard-orders")
      })
      .catch((error) => {
        toast.error(error.response.data.message)
      })
  }

  const refundOrderUpdateHandler = async (e) => {
    await axios
      .put(
        `${server}/order/order-refund-success/${id}`,
        {
          status,
        },
        { withCredentials: true },
      )
      .then((res) => {
        toast.success("Order updated!")
        dispatch(getAllOrdersOfShop(seller._id))
      })
      .catch((error) => {
        toast.error(error.response.data.message)
      })
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <div className="flex items-center">
            <div className="p-2 bg-red-50 rounded-full mr-3">
              <BsFillBagFill size={24} className="text-crimson" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-800">Order Details</h1>
          </div>
          <Link to="/dashboard-orders">
            <button className="px-4 py-2 bg-red-50 text-crimson rounded-md font-medium hover:bg-red-100 transition-colors">
              Order List
            </button>
          </Link>
        </div>

        <div className="flex flex-wrap justify-between items-center mb-6 text-gray-600">
          <div>
            <span className="font-medium">Order ID:</span> #{data?._id?.slice(0, 8)}
          </div>
          <div>
            <span className="font-medium">Placed On:</span> {data?.createdAt?.slice(0, 10)}
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h2>
          <div className="space-y-4">
            {data &&
              data?.cart.map((item, index) => (
                <div key={index} className="flex items-start p-3 border rounded-lg hover:bg-gray-50">
                  <img
                    src={`${backend_url}/${item.images[0]}`}
                    alt="Product item"
                    className="w-[60px] h-[60px] object-cover rounded-md"
                  />
                  <div className="ml-4">
                    <h5 className="font-medium text-gray-800">{item.name}</h5>
                    <p className="text-gray-600">
                      ₹{item.discountPrice} x {item.qty}
                    </p>
                  </div>
                </div>
              ))}
          </div>
          <div className="mt-4 pt-4 border-t text-right">
            <h5 className="text-lg">
              Total Price: <span className="font-bold text-gray-800">₹{data?.totalPrice}</span>
            </h5>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Shipping Address</h4>
            <div className="space-y-2 text-gray-700">
              <p>{data?.shippingAddress.address1 + " " + data?.shippingAddress.address2}</p>
              <p>{data?.shippingAddress.country}</p>
              <p>{data?.shippingAddress.city}</p>
              <p>{data?.user?.phoneNumber}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Payment Info</h4>
            <p className="text-gray-700">
              Status:{" "}
              <span
                className={`font-medium ${data?.paymentInfo?.status === "Paid" ? "text-green-600" : "text-orange-600"}`}
              >
                {data?.paymentInfo?.status ? data?.paymentInfo?.status : "Not Paid"}
              </span>
            </p>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Order Status</h4>

          {data?.status !== "Processing refund" && data?.status !== "Refund Success" && (
            <div className="mb-4">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full md:w-[300px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {["Processing", "Transferred to delivery partner", "Shipping", "Received", "On the way", "Delivered"]
                  .slice(
                    [
                      "Processing",
                      "Transferred to delivery partner",
                      "Shipping",
                      "Received",
                      "On the way",
                      "Delivered",
                    ].indexOf(data?.status),
                  )
                  .map((option, index) => (
                    <option value={option} key={index}>
                      {option}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {(data?.status === "Processing refund" || data?.status === "Refund Success") && (
            <div className="mb-4">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full md:w-[300px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {["Processing refund", "Refund Success"]
                  .slice(["Processing refund", "Refund Success"].indexOf(data?.status))
                  .map((option, index) => (
                    <option value={option} key={index}>
                      {option}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <button
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={data?.status !== "Processing refund" ? orderUpdateHandler : refundOrderUpdateHandler}
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails

