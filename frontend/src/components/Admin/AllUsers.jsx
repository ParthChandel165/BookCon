import React, { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineDelete } from "react-icons/ai";
import { Button } from "@material-ui/core";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import styles from "../../styles/styles";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${server}/user/admin-all-users`, {
        withCredentials: true,
      });
      setUsers(res.data.users);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${server}/user/delete-user/${id}`, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      fetchUsers(); // refresh after deletion
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete user");
    }
  };

  const columns = [
    { field: "id", headerName: "User ID", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "email",
      headerName: "Email",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "role",
      headerName: "User Role",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "joinedAt",
      headerName: "Joined At",
      type: "text",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "action",
      headerName: "Actions",
      flex: 0.7,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => {
        return (
          <Button
            onClick={() => {
              setUserId(params.id);
              setOpen(true);
            }}
            className="text-red-500 hover:bg-red-100 p-2 rounded-lg"
          >
            <AiOutlineDelete size={20} />
          </Button>
        );
      },
    },
  ];

  const rows = users.map((item) => ({
    id: item._id,
    name: item.name,
    email: item.email,
    role: item.role,
    joinedAt: item.createdAt?.slice(0, 10),
  }));

  return (
    <div className="w-full flex justify-center pt-5">
      <div className="w-[97%]">
        <div className="w-full min-h-[45vh] bg-white rounded-lg shadow-lg p-4">
          <h5 className="text-[22px] font-Poppins pb-2">All Users</h5>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
            sx={{
              "& .MuiDataGrid-cell": {
                outline: "none",
              },
              "& .MuiDataGrid-columnHeaders": {
                outline: "none",
              },
              "& .MuiDataGrid-root": {
                border: "none",
              },
            }}
          />
        </div>
        {open && (
          <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
            <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded-lg shadow p-5">
              <div className="w-full flex justify-end cursor-pointer">
                <RxCross1 size={25} onClick={() => setOpen(false)} />
              </div>
              <h3 className="text-[25px] text-center py-5 font-Poppins text-[#000000cb]">
                Are you sure you want to delete this user?
              </h3>
              <div className="w-full flex items-center justify-center">
                <button
                  className={`${styles.button} text-white text-[18px] !h-[42px] mr-4`}
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className={`${styles.button} text-white text-[18px] !h-[42px] ml-4`}
                  onClick={() => {
                    setOpen(false);
                    handleDelete(userId);
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
