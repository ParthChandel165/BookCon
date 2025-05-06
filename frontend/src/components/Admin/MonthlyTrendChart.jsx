import React, { useEffect, useState } from "react";
import { server } from "../../server";
import {
    Chart as ChartJS,
    LineElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    Title,
    PointElement, // Add PointElement for complete chart rendering
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement, // Register PointElement
    Title,
    Tooltip,
    Legend
);

const MonthlyTrendChart = () => {
    const [monthlyData, setMonthlyData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Make sure to include authentication token if needed
        const requestOptions = {
            method: 'GET',
            credentials: 'include', // This includes cookies in the request
            headers: {
                'Content-Type': 'application/json',
                // Add any auth headers if you're using token-based auth
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        };

        fetch(`${server}/product/admin-product-stats`, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (data.success && data.monthlyTrend) {
                    setMonthlyData(data.monthlyTrend);
                } else {
                    throw new Error("Invalid data format");
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching monthly trend data:", err);
                setError(`Failed to fetch monthly trend data: ${err.message}`);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="text-center py-4">Loading monthly data...</div>;
    }

    if (error) {
        return <div className="text-red-500 py-4">{error}</div>;
    }

    // Format data for the line chart
    const chartFormattedData = monthlyData
        ? {
              labels: monthlyData.map((item) => item._id),
              datasets: [
                  {
                      label: "Product Creation Trend",
                      data: monthlyData.map((item) => item.count),
                      fill: false,
                      borderColor: "rgba(75, 192, 192, 1)",
                      backgroundColor: "rgba(75, 192, 192, 0.5)",
                      tension: 0.1,
                      pointRadius: 5,
                      pointHoverRadius: 7,
                  },
              ],
          }
        : null;

    // Chart options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Monthly Product Creation Trend",
                font: {
                    size: 16,
                    weight: "bold",
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="w-full p-4 bg-white rounded-lg shadow-sm mb-6">
            <div className="mb-4">
                <h2 className="text-xl font-semibold">Monthly Product Creation Trend</h2>
            </div>

            {monthlyData ? (
                <div className="relative h-80">
                    <Line data={chartFormattedData} options={options} />
                </div>
            ) : (
                <p>No monthly data available</p>
            )}
        </div>
    );
};

export default MonthlyTrendChart;