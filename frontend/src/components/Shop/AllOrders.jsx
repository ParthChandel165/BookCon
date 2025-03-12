"use client"

import { Button } from "@material-ui/core"
import { DataGrid } from "@material-ui/data-grid"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import Loader from "../Layout/Loader"
import { getAllOrdersOfShop } from "../../redux/actions/order"
import { AiOutlineEye } from "react-icons/ai"

const AllOrders = () => {
  const { orders, isLoading } = useSelector((state) => state.order)
  const { seller } = useSelector((state) => state.seller)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id))
  }, [dispatch])

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 150,
      flex: 0.7,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <div className="font-medium text-gray-800">{params.value}</div>,
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
      flex: 1,
      minWidth: 100,
      headerName: "Action",
      type: "number",
      sortable: false,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        return (
          <Link to={`/order/${params.id}`}>
            <Button
              className="px-4 py-2 rounded-md bg-gray-50 hover:bg-gray-100"
              startIcon={<AiOutlineEye size={18} />}
            >
              View
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
        itemsQty: item.cart.length,
        total: "₹" + item.totalPrice,
        status: item.status,
      })
    })

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">All Orders</h2>
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
              pageSize={10}
              disableSelectionOnClick
              autoHeight
              className="custom-data-grid"
            />
          </div>
        </div>
      )}
    </>
  )
}

export default AllOrders

