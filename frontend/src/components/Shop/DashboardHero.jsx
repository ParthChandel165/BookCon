"use client"

import { useEffect } from "react"
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai"
import { Link } from "react-router-dom"
import { MdBorderClear } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import { getAllOrdersOfShop } from "../../redux/actions/order"
import { getAllProductsShop } from "../../redux/actions/product"
import { Button } from "@material-ui/core"
import { DataGrid } from "@material-ui/data-grid"

const DashboardHero = () => {
  const dispatch = useDispatch()
  const { orders } = useSelector((state) => state.order)
  const { seller } = useSelector((state) => state.seller)
  const { products } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id))
    dispatch(getAllProductsShop(seller._id))
  }, [dispatch])

  const availableBalance = seller?.availableBalance.toFixed(2)

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 150,
      flex: 0.7,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <div className="font-medium text-gray-800 truncate">{params.value}</div>,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        const status = params.getValue(params.id, "status")
        return (
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              status === "Delivered" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
            }`}
          >
            {status}
          </div>
        )
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <div className="font-medium">{params.value}</div>,
    },
    {
      field: " ",
      flex: 0.5,
      minWidth: 100,
      headerName: "",
      type: "number",
      sortable: false,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        return (
          <Link to={`/order/${params.id}`}>
            <Button>
              <AiOutlineArrowRight size={20} />
            </Button>
          </Link>
        )
      },
    },
  ]

  const row = []

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.reduce((acc, item) => acc + item.qty, 0),
        total: "US$ " + item.totalPrice,
        status: item.status,
      })
    })

  return (
    <div className="w-full p-8">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard Overview</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Account Balance Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-50 rounded-full mr-4">
              <AiOutlineMoneyCollect size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">Account Balance</h3>
              <p className="text-sm text-gray-500">(with 10% service charge)</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">₹{availableBalance}</h2>
            <Link to="/dashboard-withdraw-money">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                Withdraw Money →
              </button>
            </Link>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-purple-50 rounded-full mr-4">
              <MdBorderClear size={24} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">All Orders</h3>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">{orders && orders.length}</h2>
            <Link to="/dashboard-orders">
              <button className="text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors">
                View Orders →
              </button>
            </Link>
          </div>
        </div>

        {/* Products Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-50 rounded-full mr-4">
              <AiOutlineMoneyCollect size={24} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">All Products</h3>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">{products && products.length}</h2>
            <Link to="/dashboard-products">
              <button className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors">
                View Products →
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800">Latest Orders</h3>
        </div>
        <div
          className="w-full"
          style={{
            "& .super-app-theme--header": {
              backgroundColor: "#f9fafb",
            },
          }}
        >
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={5}
            disableSelectionOnClick
            autoHeight
            className="custom-data-grid"
          />
        </div>
      </div>
    </div>
  )
}

export default DashboardHero

