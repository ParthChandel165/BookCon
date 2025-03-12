import { AiOutlineGift } from "react-icons/ai"
import { MdOutlineLocalOffer } from "react-icons/md"
import { FiPackage, FiShoppingBag } from "react-icons/fi"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { BiMessageSquareDetail } from "react-icons/bi"
import { backend_url } from "../../../server"

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller)

  return (
    <div className="w-full h-[70px] bg-white shadow-md sticky top-0 left-0 z-30 flex items-center justify-between px-6">
      <div>
        <Link to="/dashboard">
          <img
            src="https://www.buffalolib.org/sites/default/files/users/cenblog/bookcon.png"
            alt="BookCon Logo"
            className="w-[150px] h-auto"
          />
        </Link>
      </div>
      <div className="flex items-center">
        <div className="flex items-center gap-1">
          <Link to="/dashboard/cupouns" className="800px:block hidden relative group">
            <div className="p-2.5 rounded-full hover:bg-gray-100 transition-all duration-200">
              <AiOutlineGift color="#555" size={24} className="cursor-pointer" />
            </div>
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Coupons
            </span>
          </Link>

          <Link to="/dashboard-events" className="800px:block hidden relative group">
            <div className="p-2.5 rounded-full hover:bg-gray-100 transition-all duration-200">
              <MdOutlineLocalOffer color="#555" size={24} className="cursor-pointer" />
            </div>
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Events
            </span>
          </Link>

          <Link to="/dashboard-products" className="800px:block hidden relative group">
            <div className="p-2.5 rounded-full hover:bg-gray-100 transition-all duration-200">
              <FiShoppingBag color="#555" size={24} className="cursor-pointer" />
            </div>
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Products
            </span>
          </Link>

          <Link to="/dashboard-orders" className="800px:block hidden relative group">
            <div className="p-2.5 rounded-full hover:bg-gray-100 transition-all duration-200">
              <FiPackage color="#555" size={24} className="cursor-pointer" />
            </div>
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Orders
            </span>
          </Link>

          <Link to="/dashboard-messages" className="800px:block hidden relative group">
            <div className="p-2.5 rounded-full hover:bg-gray-100 transition-all duration-200">
              <BiMessageSquareDetail color="#555" size={24} className="cursor-pointer" />
            </div>
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Messages
            </span>
          </Link>

          <Link to={`/shop/${seller._id}`} className="ml-2">
            <div className="relative group">
              <img
                src={`${backend_url}${seller.avatar}`}
                alt="Seller Avatar"
                className="w-[40px] h-[40px] rounded-full object-cover border-2 border-gray-200 hover:border-crimson transition-all duration-200"
              />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                View Shop
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DashboardHeader

