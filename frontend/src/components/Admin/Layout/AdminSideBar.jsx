import React, { useState, useEffect, useRef } from "react";
import { FiShoppingBag } from "react-icons/fi";
import { GrWorkshop } from "react-icons/gr";
import { RxDashboard } from "react-icons/rx";
import { CiMoneyBill } from "react-icons/ci";
import { Link } from "react-router-dom";
import { HiOutlineUserGroup } from "react-icons/hi";
import { BsHandbag } from "react-icons/bs";
import { MdOutlineLocalOffer } from "react-icons/md";
import { AiOutlineSetting, AiOutlineMenu } from "react-icons/ai";

const AdminSideBar = ({ active }) => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div>
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-white shadow-lg overflow-y-auto transition-transform duration-300 z-20 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-[250px] md:w-[300px] pt-[80px]`} // Added padding to avoid overlap
      >
        <div className="flex justify-center items-center py-4">
  <Link to="/">
    <img
      src="https://www.buffalolib.org/sites/default/files/users/cenblog/bookcon.png"
      alt="BookCon Logo"
      className="w-[170px] h-auto"
    />
  </Link>
</div>

        {/* Sidebar Items */}
        <div className="mt-6">
          {[
            { id: 1, label: "Dashboard", icon: <RxDashboard />, path: "/admin/dashboard" },
            { id: 2, label: "All Orders", icon: <FiShoppingBag />, path: "/admin-orders" },
            { id: 3, label: "All Sellers", icon: <GrWorkshop />, path: "/admin-sellers" },
            { id: 4, label: "All Users", icon: <HiOutlineUserGroup />, path: "/admin-users" },
            { id: 5, label: "All Products", icon: <BsHandbag />, path: "/admin-products" },
            { id: 6, label: "All Events", icon: <MdOutlineLocalOffer />, path: "/admin-events" },
            { id: 7, label: "Withdraw Request", icon: <CiMoneyBill />, path: "/admin-withdraw-request" },
            { id: 8, label: "Settings", icon: <AiOutlineSetting />, path: "/profile" }
          ].map((item) => (
            <div key={item.id} className="w-full p-2">
              <Link to={item.path} className="w-full flex items-center p-3 rounded-lg transition duration-200"
                style={{
                  backgroundColor: active === item.id ? "crimson" : "transparent",
                  color: active === item.id ? "white" : "#555",
                  borderRadius: active === item.id ? "50px" : "0px"
                }}
              >
                <div className="w-[35px] h-[35px] flex items-center justify-center rounded-full"
                  style={{
                    backgroundColor: active === item.id ? "white" : "transparent",
                    color: active === item.id ? "crimson" : "#555"
                  }}
                >
                  {item.icon}
                </div>
                <h5 className="hidden md:block pl-3 text-[18px] font-[400]">
                  {item.label}
                </h5>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Hamburger Button (Hidden when sidebar is open) */}
      {!isOpen && (
        <button
          className="p-3 text-black fixed bottom-5 left-5 z-30 bg-gray-200 rounded-full shadow-md"
          onClick={() => setIsOpen(true)}
        >
          <AiOutlineMenu size={25} />
        </button>
      )}
    </div>
  );
};

export default AdminSideBar;