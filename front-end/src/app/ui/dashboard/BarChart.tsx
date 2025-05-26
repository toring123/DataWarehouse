"use client";
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

// Đăng ký các thành phần cần thiết
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export type ChartDataItem = {
  "Tháng"?: number;
  "Quý"?: number;
  "Năm": number;
  "Tổng Số Lượng Nhập": number;
  "Tổng Số Lượng Xuất": number;
};

export type BarChartProps = {
  chartData: ChartDataItem[];
  type?: "Tháng" | "Quý" | "Năm";
};

const BarChart: React.FC<BarChartProps> = ({ chartData, type = "Tháng" }) => {
  let labels: string[] = [];
  let revenueData: number[] = [];
  let quantityData: number[] = [];

  if (type === "Tháng") {
    labels = chartData.map(item => `Th${item["Tháng"]}/${item["Năm"]}`);
  } else if (type === "Quý") {
    labels = chartData.map(item => `Q${item["Quý"]}/${item["Năm"]}`);
  } else if (type === "Năm") {
    labels = chartData.map(item => `${item["Năm"]}`);
  }

  revenueData = chartData.map(item => item["Tổng Số Lượng Nhập"]);
  quantityData = chartData.map(item => item["Tổng Số Lượng Xuất"]);

  const data = {
    labels,
    datasets: [
      {
        label: "Tổng số lượng nhập",
        data: revenueData,
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        yAxisID: "y",
      },
      {
        label: "Tổng số lượng xuất",
        data: quantityData,
        backgroundColor: "rgba(255, 99, 132, 0.7)",
        yAxisID: "y1",
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Biểu đồ Cột Tổng số lượng nhập & Tổng số lượng xuất theo thời gian",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text:
            type === "Tháng"
              ? "Tháng/Năm"
              : type === "Quý"
              ? "Quý/Năm"
              : "Năm",
        },
      },
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Tổng số lượng nhập",
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "Tổng số lượng xuất",
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
