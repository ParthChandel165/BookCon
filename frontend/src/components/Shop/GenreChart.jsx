import React, { useEffect, useState } from "react";
import { server } from "../../server";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const GenreChart = ({ shopId }) => {
    const [genreData, setGenreData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chartType, setChartType] = useState("pie"); // can use bar also

    useEffect(() => {
        if (!shopId) {
            setError("Shop ID is missing.");
            setLoading(false);
            return;
        }

        fetch(`${server}/product/genre-chart/${shopId}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.success && data.chartData) {
                    setGenreData(data.chartData);
                    setLoading(false);
                } else {
                    throw new Error("Invalid data format");
                }
            })
            .catch((err) => {
                console.error("Error fetching genre data:", err);
                setError("Failed to fetch genre data");
                setLoading(false);
            });
    }, [shopId]);

    if (loading) {
        return <div className="text-center py-4">Loading genre data...</div>;
    }

    if (error) {
        return <div className="text-red-500 py-4">{error}</div>;
    }

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
                text: "Book Genre Distribution",
                font: {
                    size: 16,
                    weight: "bold",
                },
            },
        },
    };

    // format data for charts
    const chartFormattedData = genreData
        ? {
              labels: genreData.labels,
              datasets: [
                  {
                      label: "Number of Books",
                      data: genreData.datasets[0].data,
                      backgroundColor: [
                          "rgba(255, 99, 132, 0.6)",
                          "rgba(54, 162, 235, 0.6)",
                          "rgba(255, 206, 86, 0.6)",
                          "rgba(75, 192, 192, 0.6)",
                          "rgba(153, 102, 255, 0.6)",
                          "rgba(255, 159, 64, 0.6)",
                          "rgba(199, 199, 199, 0.6)",
                          "rgba(83, 102, 255, 0.6)",
                          "rgba(40, 159, 64, 0.6)",
                          "rgba(210, 199, 199, 0.6)",
                      ],
                      borderColor: [
                          "rgba(255, 99, 132, 1)",
                          "rgba(54, 162, 235, 1)",
                          "rgba(255, 206, 86, 1)",
                          "rgba(75, 192, 192, 1)",
                          "rgba(153, 102, 255, 1)",
                          "rgba(255, 159, 64, 1)",
                          "rgba(199, 199, 199, 1)",
                          "rgba(83, 102, 255, 1)",
                          "rgba(40, 159, 64, 1)",
                          "rgba(210, 199, 199, 1)",
                      ],
                      borderWidth: 1,
                  },
              ],
          }
        : null;

    return (
        <div className="w-full p-4 bg-white rounded-lg shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                    Book Genre Distribution
                </h2>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setChartType("pie")}
                        className={`px-3 py-1 rounded-md ${
                            chartType === "pie"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200"
                        }`}
                    >
                        Pie Chart
                    </button>
                    <button
                        onClick={() => setChartType("bar")}
                        className={`px-3 py-1 rounded-md ${
                            chartType === "bar"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200"
                        }`}
                    >
                        Bar Chart
                    </button>
                </div>
            </div>

            {genreData ? (
                <div className="relative h-80">
                    {chartType === "pie" ? (
                        <Pie data={chartFormattedData} options={options} />
                    ) : (
                        <Bar data={chartFormattedData} options={options} />
                    )}
                </div>
            ) : (
                <p>No genre data available</p>
            )}

            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                {genreData &&
                    genreData.labels.map((label, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 p-3 rounded-md border-l-4"
                            style={{
                                borderLeftColor:
                                    chartFormattedData.datasets[0]
                                        .backgroundColor[index % 10],
                            }}
                        >
                            <div className="font-medium">{label}</div>
                            <div className="text-lg">
                                {genreData.datasets[0].data[index]} books
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default GenreChart;
