import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../server";
import { DataGrid } from "@material-ui/data-grid";
import { BsPencil } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";
import { toast } from "react-toastify";

const AllWithdraw = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [withdrawData, setWithdrawData] = useState();
  const [withdrawStatus, setWithdrawStatus] = useState("Processing");

  useEffect(() => {
    axios
      .get(`${server}/withdraw/get-all-withdraw-request`, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data.withdraws);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  }, []);

  const columns = [
    { field: "id", headerName: "Withdraw Id", minWidth: 150, flex: 0.7, headerAlign: 'center', align: 'center' },
    { field: "name", headerName: "Shop Name", minWidth: 180, flex: 1.4, headerAlign: 'center', align: 'center' },
    { field: "shopId", headerName: "Shop Id", minWidth: 180, flex: 1.4, headerAlign: 'center', align: 'center' },
    { field: "amount", headerName: "Amount", minWidth: 100, flex: 0.6, headerAlign: 'center', align: 'center' },
    { field: "status", headerName: "Status", type: "text", minWidth: 80, flex: 0.5, headerAlign: 'center', align: 'center' },
    { field: "createdAt", headerName: "Request Given At", type: "number", minWidth: 130, flex: 0.6, headerAlign: 'center', align: 'center' },
    {
      field: "updateStatus",
      headerName: "Update Status",
      type: "number",
      minWidth: 130,
      flex: 0.6,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <BsPencil
          size={20}
          className={`${params.row.status !== "Processing" ? "hidden" : ""} cursor-pointer`}
          onClick={() => setOpen(true) || setWithdrawData(params.row)}
        />
      ),
    },
  ];

  const handleSubmit = async () => {
    await axios
      .put(
        `${server}/withdraw/update-withdraw-request/${withdrawData.id}`,
        {
          sellerId: withdrawData.shopId,
          status: withdrawStatus,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Withdraw request updated successfully!");
        setData(res.data.withdraws);
        setOpen(false);
      });
  };

  const rows = data.map((item) => ({
    id: item._id,
    shopId: item.seller._id,
    name: item.seller.name,
    amount: "₹" + item.amount,
    status: item.status,
    createdAt: item.createdAt.slice(0, 10),
  }));

  return (
    <div className="w-full flex items-center pt-5 justify-center">
      <div className="w-[95%] bg-white">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </div>

      {open && (
        <div className="w-full fixed h-screen top-0 left-0 bg-[#00000031] z-[9999] flex items-center justify-center">
          <div className="w-[50%] min-h-[40vh] bg-white rounded shadow p-4">
            <div className="flex justify-end w-full">
              <RxCross1 size={25} onClick={() => setOpen(false)} />
            </div>
            <h1 className="text-[25px] text-center font-Poppins">
              Update Withdraw Status
            </h1>
            <br />
            <select
              onChange={(e) => setWithdrawStatus(e.target.value)}
              className="w-[200px] h-[35px] border rounded"
              value={withdrawStatus}
            >
              <option value="Processing">Processing</option>
              <option value="Succeed">Succeed</option>
              <option value="Failed">Failed</option>
            </select>
            <button
              type="submit"
              className={`block ${styles.button} text-white !h-[42px] mt-4 text-[18px]`}
              onClick={handleSubmit}
            >
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllWithdraw;