import React, { useEffect } from "react";
import styles from "../../styles/styles";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { MdBorderClear } from "react-icons/md";
import { Link } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../../redux/actions/order";
import { getAllSellers } from "../../redux/actions/sellers";
import Loader from "../Layout/Loader";

const AdminDashboardMain = ({ sidebarOpen }) => {
  const dispatch = useDispatch();
  const { adminOrders, adminOrderLoading } = useSelector((state) => state.order);
  const { sellers } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
    dispatch(getAllSellers());
  }, []);

  const adminEarning = adminOrders?.reduce((acc, item) => acc + item.totalPrice * 0.1, 0);
  const adminBalance = adminEarning?.toFixed(2);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 1 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 1,
      cellClassName: (params) => (params.getValue(params.id, "status") === "Delivered" ? "greenColor" : "redColor"),
    },
    { field: "itemsQty", headerName: "Items Qty", type: "number", minWidth: 130, flex: 1 },
    { field: "total", headerName: "Total", type: "number", minWidth: 130, flex: 1 },
    { field: "createdAt", headerName: "Order Date", type: "number", minWidth: 130, flex: 1 },
  ];

  const row = [];
  adminOrders?.forEach((item) => {
    row.push({
      id: item._id,
      itemsQty: item.cart?.reduce((acc, item) => acc + item.qty, 0),
      total: "₹" + item.totalPrice,
      status: item.status,
      createdAt: item.createdAt.slice(0, 10),
    });
  });

  return adminOrderLoading ? (
    <Loader />
  ) : (
    <div
      className={`p-6 transition-all duration-300`}
      style={{
        marginLeft: sidebarOpen ? "260px" : "auto",
        marginRight: sidebarOpen ? "0px" : "auto",
        width: sidebarOpen ? "calc(100% - 260px)" : "100%",
      }}
    >
      <h3 className="text-[24px] font-semibold pb-4">Dashboard Overview</h3>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Earnings Card */}
        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-xl transition">
          <AiOutlineMoneyCollect size={40} className="text-blue-500 mb-2" />
          <h3 className="text-gray-600 text-lg font-medium">Total Earnings</h3>
          <h5 className="text-2xl font-semibold mt-2 text-gray-900">₹ {adminBalance}</h5>
        </div>

        {/* Sellers Card */}
        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-xl transition">
          <MdBorderClear size={40} className="text-green-500 mb-2" />
          <h3 className="text-gray-600 text-lg font-medium">Total Sellers</h3>
          <h5 className="text-2xl font-semibold mt-2 text-gray-900">{sellers?.length}</h5>
          <Link to="/admin-sellers" className="text-blue-600 mt-2 hover:underline">
            View Sellers
          </Link>
        </div>

        {/* Orders Card */}
        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-xl transition">
          <AiOutlineMoneyCollect size={40} className="text-red-500 mb-2" />
          <h3 className="text-gray-600 text-lg font-medium">Total Orders</h3>
          <h5 className="text-2xl font-semibold mt-2 text-gray-900">{adminOrders?.length}</h5>
          <Link to="/admin-orders" className="text-blue-600 mt-2 hover:underline">
            View Orders
          </Link>
        </div>
      </div>

      {/* Latest Orders Table */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mt-8">
        <h3 className="text-[22px] font-semibold pb-4">Latest Orders</h3>
        <div className="w-full overflow-hidden rounded-lg">
          <DataGrid rows={row} columns={columns} pageSize={4} disableSelectionOnClick autoHeight />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardMain;
