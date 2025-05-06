import React, { useState, useEffect } from "react";
import { MdOutlineLocalOffer } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CiMoneyBill } from "react-icons/ci";
import { GrWorkshop } from "react-icons/gr";
import { backend_url } from "../../server";

const AdminHeader = () => {
  const { user } = useSelector((state) => state.user);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show for 3 seconds on page load
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  return (
    <div
      className={`w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <div>
        <Link to="/">
          <img
            src="https://www.buffalolib.org/sites/default/files/users/cenblog/bookcon.png"
            alt="BookCon Logo"
            className="w-[170px] h-auto"
          />
        </Link>
      </div>
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <Link to="/admin-withdraw-request" className="800px:block hidden">
            <CiMoneyBill color="#555" size={30} className="mx-5 cursor-pointer" />
          </Link>
          <Link to="/admin-events" className="800px:block hidden">
            <MdOutlineLocalOffer color="#555" size={30} className="mx-5 cursor-pointer" />
          </Link>
          <Link to="/admin-sellers" className="800px:block hidden">
            <GrWorkshop color="#555" size={30} className="mx-5 cursor-pointer" />
          </Link>
          <img
            src={`${user?.avatar}`}
            alt="User Avatar"
            className="w-[50px] h-[50px] rounded-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;