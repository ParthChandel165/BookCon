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
    PointElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const MonthlyTrendChart = () => {
    const [trendData, setTrendData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
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
                if (data?.success && Array.isArray(data?.hourlyTrend)) {
                    // Changed from monthlyTrend to hourlyTrend to match backend response
                    setTrendData(data.hourlyTrend);
                } else {
                    console.error("Unexpected response format:", data);
                    throw new Error("Invalid data format received from server");
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching trend data:", err);
                setError(`Failed to fetch trend data: ${err.message}`);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="text-center py-4">Loading trend data...</div>;
    }

    if (error) {
        return <div className="text-red-500 py-4">{error}</div>;
    }

    // Format labels nicely if data is hourly: "May 4, 9 AM"
    const chartFormattedData = trendData
        ? {
              labels: trendData.map((item) => {
                  const [year, month, day, hour] = item._id.split("-").map(Number);
                  const date = new Date(year, month - 1, day, hour);
                  return date.toLocaleString("en-US", {
                      hour: "numeric",
                      hour12: true,
                      day: "numeric",
                      month: "short",
                  });
              }),
              datasets: [
                  {
                      label: "Hourly Product Creation Trend",
                      data: trendData.map((item) => item.count),
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

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Hourly Product Creation Trend",
                font: {
                    size: 16,
                    weight: "bold",
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0, // Only show whole numbers
                    stepSize: 1,  // Step by 1
                }
            },
        },
    };

    return (
        <div className="w-full p-4 bg-white rounded-lg shadow-sm mb-6">
            <div className="mb-4">
                <h2 className="text-xl font-semibold">Hourly Product Creation Trend</h2>
            </div>

            {chartFormattedData && chartFormattedData.labels.length > 0 ? (
                <div className="relative h-80">
                    <Line data={chartFormattedData} options={options} />
                </div>
            ) : (
                <p>No trend data available</p>
            )}
        </div>
    );
};

export default MonthlyTrendChart;