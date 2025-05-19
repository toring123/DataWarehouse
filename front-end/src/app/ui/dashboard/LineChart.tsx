"use client";
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Định nghĩa kiểu dữ liệu cho từng điểm dữ liệu
export type ChartDataItem = {
  "Tháng"?: number;
  "Quý"?: number;
  "Năm": number;
  "Tổng Số Lượng": number;
  "Tổng Doanh Thu": number;
};

// Định nghĩa kiểu props cho component
export type LineChartProps = {
  chartData: ChartDataItem[];
  type?: "Tháng" | "Quý" | "Năm";
};

const LineChart: React.FC<LineChartProps> = ({ chartData, type = "Tháng" }) => {
  let labels: string[] = [];
  let revenueData: number[] = [];
  let quantityData: number[] = [];

  // Xử lý nhãn tùy theo loại thời gian
  if (type === "Tháng") {
    labels = chartData.map(item => `Th${item['Tháng']}/${item['Năm']}`);
  } else if (type === "Quý") {
    labels = chartData.map(item => `Q${item['Quý']}/${item['Năm']}`);
  } else if (type === "Năm") {
    labels = chartData.map(item => `${item['Năm']}`);
  }

  revenueData = chartData.map(item => item["Tổng Doanh Thu"]);
  quantityData = chartData.map(item => item["Tổng Số Lượng"]);

  const data = {
    labels,
    datasets: [
      {
        label: "Doanh thu",
        data: revenueData,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75,192,192,0.2)",
        yAxisID: "y",
        tension: 0.3
      },
      {
        label: "Số lượng",
        data: quantityData,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255,99,132,0.2)",
        yAxisID: "y1",
        tension: 0.3
      }
    ]
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false
    },
    stacked: false,
    plugins: {
      legend: {
        position: "top" as const
      },
      title: {
        display: true,
        text: "Biểu đồ Doanh thu & Số lượng bán ra theo thời gian"
      }
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
              : "Năm"
        }
      },
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Doanh thu"
        }
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false
        },
        title: {
          display: true,
          text: "Số lượng"
        }
      }
    }
  };

  return <Line data = {data} options={options} />;
};

export default LineChart;
