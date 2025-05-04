import React, { useState, useEffect, useRef } from "react";
import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import { RxPerson } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import {
  MdOutlineAdminPanelSettings,
  MdOutlineTrackChanges,
} from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const ProfileSidebar = ({ active, setActive }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);

  const logoutHandler = () => {
    const navigate = useNavigate();
  
    axios
      .get(`${server}/user/logout`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message); 
        localStorage.removeItem("authToken");  
        sessionStorage.removeItem("authToken");
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.response.data.message);
        toast.error("Error logging out, please try again!"); // Optional error toast
      });
  };

  const handleOutsideClick = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setSidebarVisible(false);
    }
  };

  useEffect(() => {
    if (sidebarVisible) {
      document.body.addEventListener("click", handleOutsideClick);
    } else {
      document.body.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.body.removeEventListener("click", handleOutsideClick);
    };
  }, [sidebarVisible]);

  return (
    <div>
      {/* Sidebar */}
      {sidebarVisible && (
        <div
          ref={sidebarRef}
          className="fixed left-0 w-[220px] h-[calc(100vh-60px)] bg-grey-300 shadow-lg z-10 p-4 pt-8 top-[100px] sm:w-[250px] sm:top-[144px] transition-all duration-500 ease-in-out opacity-100"
          style={{
            transform: sidebarVisible ? "translateX(0)" : "translateX(-100%)",
            opacity: sidebarVisible ? "1" : "0",
          }}
        >
          {/* Close Button */}
          <div
            className="text-black text-3xl fixed top-5 right-5 z-3 cursor-pointer opacity-100 transition-opacity duration-500 ease-in-out"
            onClick={() => setSidebarVisible(false)}
          >
            <span className="text-3xl text-gray-600">×</span>
          </div>

          {/* Sidebar Content */}
          <div className="flex flex-col justify-between h-full mt-12">
            <div>
              {/* Profile Link */}
              <div
                className={`flex items-center cursor-pointer w-full mb-8 p-3 rounded-lg ${active === 1 ? "bg-red-500 text-white" : ""}`}
                onClick={() => setActive(1)}
              >
                <RxPerson size={20} color={active === 1 ? "white" : ""} />
                <span className={`pl-3 ${active === 1 ? "text-white" : ""}`}>Profile</span>
              </div>

              <div
                className={`flex items-center cursor-pointer w-full mb-8 p-3 rounded-lg ${active === 6 ? "bg-red-500 text-white" : ""}`}
                onClick={() => setActive(6)}
              >
                <RiLockPasswordLine size={20} color={active === 6 ? "white" : ""} />
                <span className={`pl-3 ${active === 6 ? "text-white" : ""}`}>Change Password</span>
              </div>

              {/* Non-admin Users */}
              {user && user?.role !== "Admin" && (
                <>
                  <div
                    className={`flex items-center cursor-pointer w-full mb-8 p-3 rounded-lg ${active === 2 ? "bg-red-500 text-white" : ""}`}
                    onClick={() => setActive(2)}
                  >
                    <HiOutlineShoppingBag size={20} color={active === 2 ? "white" : ""} />
                    <span className={`pl-3 ${active === 2 ? "text-white" : ""}`}>Orders</span>
                  </div>

                  <div
                    className={`flex items-center cursor-pointer w-full mb-8 p-3 rounded-lg ${active === 3 ? "bg-red-500 text-white" : ""}`}
                    onClick={() => setActive(3)}
                  >
                    <HiOutlineReceiptRefund size={20} color={active === 3 ? "white" : ""} />
                    <span className={`pl-3 ${active === 3 ? "text-white" : ""}`}>Refunds</span>
                  </div>

                  <div
                    className={`flex items-center cursor-pointer w-full mb-8 p-3 rounded-lg ${active === 4 ? "bg-red-500 text-white" : ""}`}
                    onClick={() => setActive(4) || navigate("/inbox")}
                  >
                    <AiOutlineMessage size={20} color={active === 4 ? "white" : ""} />
                    <span className={`pl-3 ${active === 4 ? "text-white" : ""}`}>Inbox</span>
                  </div>

                  <div
                    className={`flex items-center cursor-pointer w-full mb-8 p-3 rounded-lg ${active === 5 ? "bg-red-500 text-white" : ""}`}
                    onClick={() => setActive(5)}
                  >
                    <MdOutlineTrackChanges size={20} color={active === 5 ? "white" : ""} />
                    <span className={`pl-3 ${active === 5 ? "text-white" : ""}`}>Track Order</span>
                  </div>

                  <div
                    className={`flex items-center cursor-pointer w-full mb-8 p-3 rounded-lg ${active === 7 ? "bg-red-500 text-white" : ""}`}
                    onClick={() => setActive(7)}
                  >
                    <TbAddressBook size={20} color={active === 7 ? "white" : ""} />
                    <span className={`pl-3 ${active === 7 ? "text-white" : ""}`}>Address</span>
                  </div>
                </>
              )}

              {/* Admin Users */}
              {user && user?.role === "Admin" && (
                <Link to="/admin/dashboard">
                  <div
                    className={`flex items-center cursor-pointer w-full mb-8 p-3 rounded-lg ${active === 8 ? "bg-red-500 text-white" : ""}`}
                    onClick={() => setActive(8)}
                  >
                    <MdOutlineAdminPanelSettings size={20} color={active === 8 ? "white" : ""} />
                    <span className={`pl-3 ${active === 8 ? "text-white" : ""}`}>Admin Dashboard</span>
                  </div>
                </Link>
              )}

              {/* Logout */}
              <div
                className={`flex items-center cursor-pointer w-full mb-8 p-3 rounded-lg ${active === 9 ? "bg-red-500 text-white" : ""}`}
                onClick={logoutHandler}
              >
                <AiOutlineLogin size={20} color={active === 9 ? "white" : ""} />
                <span className={`pl-3 ${active === 9 ? "text-white" : ""}`}>Logout</span>
              </div>
            </div>

            {/* Close Hamburger Icon at the bottom */}
            <div
              className="lg:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 p-4 cursor-pointer opacity-100 transition-opacity duration-500 ease-in-out"
              onClick={() => setSidebarVisible(false)}
            >
              <span className="text-3xl">☰</span>
            </div>
          </div>
        </div>
      )}

      {/* Hamburger Icon when Sidebar is Hidden */}
      {!sidebarVisible && (
        <button
          className="p-3 text-black fixed bottom-5 left-5 z-30 opacity-100 transition-opacity duration-500 ease-in-out"
          onClick={() => setSidebarVisible(true)} // Toggle visibility
        >
          <span className="text-3xl">☰</span>
        </button>
      )}
    </div>
  );
};

export default ProfileSidebar;
