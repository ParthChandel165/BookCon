import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import AllProducts from "../../components/Shop/AllProducts";
import GenreChart from "../../components/Shop/GenreChart";

const ShopAllProducts = () => {
    const { id: shopId } = useParams(); // Get the shopId from the URL
    const { seller } = useSelector((state) => state.seller);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, [shopId]);

    return (
        <div>
            <DashboardHeader />
            <div className="flex justify-between w-full">
                <div className="w-[80px] 800px:w-[330px]">
                    <DashboardSideBar active={3} />
                </div>
                <div className="w-full justify-center flex flex-col items-center">
                    {/* Ensure that GenreChart receives the shopId prop */}
                    {!loading && <GenreChart shopId={seller?._id || shopId} />}
                    {/* Optionally render loading spinner while data is loading */}
                    <AllProducts shopId={shopId} />
                </div>
            </div>
        </div>
    );
};

export default ShopAllProducts;
