import React, { useEffect } from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import AllProducts from "../components/Admin/AllProducts";
import MonthlyTrendChart from "../components/Admin/MonthlyTrendChart"; 
import { useSelector } from "react-redux"; // Assuming you're using Redux for auth

const AdminDashboardProducts = () => {
  const { user } = useSelector((state) => state.user); // Access user from Redux state
  
  // Optional: Check if admin before rendering protected content
  useEffect(() => {
    if(user && user.role !== "Admin") {
      console.warn("This page requires admin privileges");
      // Optional: Redirect to login page or show error
    }
  }, [user]);

  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={5} />
          </div>
          <div className="w-full p-6">
            {/* Chart no longer requires shopId */}
            <MonthlyTrendChart />
            <AllProducts />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardProducts;