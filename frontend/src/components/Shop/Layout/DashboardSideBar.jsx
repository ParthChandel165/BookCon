import { AiOutlineFolderAdd, AiOutlineGift } from "react-icons/ai"
import { FiPackage, FiShoppingBag } from "react-icons/fi"
import { MdOutlineLocalOffer } from "react-icons/md"
import { RxDashboard } from "react-icons/rx"
import { VscNewFile } from "react-icons/vsc"
import { CiMoneyBill, CiSettings } from "react-icons/ci"
import { Link } from "react-router-dom"
import { BiMessageSquareDetail } from "react-icons/bi"
import { HiOutlineReceiptRefund } from "react-icons/hi"

const DashboardSideBar = ({ active }) => {
  const menuItems = [
    {
      id: 1,
      title: "Dashboard",
      icon: RxDashboard,
      link: "/dashboard",
    },
    {
      id: 2,
      title: "All Orders",
      icon: FiShoppingBag,
      link: "/dashboard-orders",
    },
    {
      id: 3,
      title: "All Products",
      icon: FiPackage,
      link: "/dashboard-products",
    },
    {
      id: 4,
      title: "Create Product",
      icon: AiOutlineFolderAdd,
      link: "/dashboard-create-product",
    },
    {
      id: 5,
      title: "All Events",
      icon: MdOutlineLocalOffer,
      link: "/dashboard-events",
    },
    {
      id: 6,
      title: "Create Event",
      icon: VscNewFile,
      link: "/dashboard-create-event",
    },
    {
      id: 7,
      title: "Withdraw Money",
      icon: CiMoneyBill,
      link: "/dashboard-withdraw-money",
    },
    {
      id: 8,
      title: "Shop Inbox",
      icon: BiMessageSquareDetail,
      link: "/dashboard-messages",
    },
    {
      id: 9,
      title: "Discount Codes",
      icon: AiOutlineGift,
      link: "/dashboard-coupouns",
    },
    {
      id: 10,
      title: "Refunds",
      icon: HiOutlineReceiptRefund,
      link: "/dashboard-refunds",
    },
    {
      id: 11,
      title: "Settings",
      icon: CiSettings,
      link: "/settings",
    },
  ]

  return (
    <div className="w-full h-[90vh] bg-white shadow-sm overflow-y-auto sticky top-0 left-0 z-10 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      <div className="py-3">
        {menuItems.map((item) => (
          <div key={item.id} className="w-full">
            <Link to={item.link} className="w-full block">
              <div
                className={`flex items-center px-4 py-3.5 ${active === item.id ? "bg-gray-100" : "hover:bg-gray-50"} transition-all duration-200`}
              >
                <item.icon size={22} color={active === item.id ? "crimson" : "#555"} />
                <h5
                  className={`hidden 800px:block pl-3 text-[15px] font-medium ${
                    active === item.id ? "text-crimson" : "text-[#555]"
                  }`}
                >
                  {item.title}
                </h5>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DashboardSideBar

