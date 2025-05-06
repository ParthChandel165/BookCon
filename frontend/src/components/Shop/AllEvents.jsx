"use client"

import { Button } from "@material-ui/core"
import { DataGrid } from "@material-ui/data-grid"
import { useEffect, useState } from "react"
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai"
import { Link } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"  // Import toast from react-toastify
import Loader from "../Layout/Loader"

const AllEvents = () => {
  const [events, setEvents] = useState([]) // State for events
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [eventToDelete, setEventToDelete] = useState(null)
  const [isLoading, setIsLoading] = useState(true) // Loading state

  useEffect(() => {
    // Fetch all events on component mount
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`/api/v2/event/get-all-events-shop`)
        setEvents(response.data.events)
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        toast.error("Failed to load events.")
      }
    }

    fetchEvents()
  }, [])

  const handleDeleteClick = (id) => {
    setEventToDelete(id)
    setShowConfirmation(true)
  }

  const confirmDelete = async () => {
    if (eventToDelete) {
      try {
        // Make a DELETE request to delete the event
        const response = await axios.delete(`/api/v2/event/delete-event/${eventToDelete}`)
        
        if (response.status === 200) {
          setShowConfirmation(false)
          // Remove the deleted event from the state
          setEvents(events.filter((event) => event._id !== eventToDelete))
          toast.success("Event deleted successfully.")
        }
      } catch (error) {
        setShowConfirmation(false)
        toast.error("Failed to delete event.")
      }
    }
  }

  const cancelDelete = () => {
    setEventToDelete(null)
    setShowConfirmation(false)
  }

  const columns = [
    {
      field: "id",
      headerName: "Event ID",
      minWidth: 150,
      flex: 0.7,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <div className="font-medium text-gray-800 truncate">{params.value}</div>,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.6,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <div className="font-medium">{params.value}</div>,
    },
    {
      field: "Stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.5,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div className={`font-medium ${params.value < 10 ? "text-red-600" : "text-gray-800"}`}>{params.value}</div>
      ),
    },
    {
      field: "sold",
      headerName: "Sold",
      type: "number",
      minWidth: 130,
      flex: 0.6,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "Preview",
      flex: 0.5,
      minWidth: 100,
      headerName: "View",
      sortable: false,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <Link to={`/product/${params.id}?isEvent=true`}>
          <Button className="min-w-[30px] p-1 rounded-full bg-blue-50 hover:bg-blue-100">
            <AiOutlineEye size={18} className="text-blue-600" />
          </Button>
        </Link>
      ),
    },
    {
      field: "Delete",
      flex: 0.5,
      minWidth: 100,
      headerName: "Delete",
      sortable: false,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <Button
          onClick={() => handleDeleteClick(params.id)}
          className="min-w-[30px] p-1 rounded-full bg-red-50 hover:bg-red-100"
        >
          <AiOutlineDelete size={18} className="text-red-600" />
        </Button>
      ),
    },
  ]

  const rows = events.map((item) => ({
    id: item._id,
    name: item.name,
    price: "₹" + item.discountPrice,
    Stock: item.stock,
    sold: item.sold_out,
  }))

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">All Events</h2>
          </div>
          <div className="w-full">
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              disableSelectionOnClick
              autoHeight
              className="custom-data-grid"
            />
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AllEvents