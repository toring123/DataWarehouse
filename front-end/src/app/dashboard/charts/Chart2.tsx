"use client"
import BarChart, { ChartDataItem } from "@/app/ui/dashboard/BarChart";
import { useEffect, useState } from "react";

const TYPES = ["Năm", "Quý", "Tháng"];

const inputStyle = {
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14,
    width: "100%",
};

const buttonStyle = {
    padding: "8px 16px",
    borderRadius: 6,
    border: "none",
    backgroundColor: "#007BFF",
    color: "#fff",
    fontSize: 16,
    cursor: "pointer",
};

export default function Chart2() {
    const [data, setData] = useState<ChartDataItem[]>([]);
    const [typeIndex, setTypeIndex] = useState<number>(1); // 0: Năm, 1: Quý, 2: Tháng

    // State cho filter
    const [filters, setFilters] = useState({
        cuaHang: "",
        thanhPho: "",
        bang: "",
        matHang: ""
    });

    useEffect(() => {
        // Xác định dimension phù hợp với type
        let dimensions = ["Năm"];
        if (TYPES[typeIndex] === "Quý") {
            dimensions.push("Quý");
        } else if (TYPES[typeIndex] === "Tháng") {
            dimensions.push("Tháng");
        }
        const postData = {
            cube: 'kho_3d',
            dimensions,
            filters: {
                ...(filters.cuaHang && { "Cửa Hàng": filters.cuaHang }),
                ...(filters.thanhPho && { "Thành Phố": filters.thanhPho }),
                ...(filters.bang && { "Bang": filters.bang }),
                ...(filters.matHang && { "Mặt Hàng": filters.matHang }),
            }
        };
        fetch('http://26.83.102.88:8000/dw', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        })
        .then(res => res.json())
        .then(d => setData(d));
    }, [typeIndex, filters]);

    const handleTypeChange = (direction: "left" | "right") => {
        setTypeIndex(prev => {
            if (direction === "left") {
                return prev === 0 ? TYPES.length - 1 : prev - 1;
            } else {
                return prev === TYPES.length - 1 ? 0 : prev + 1;
            }
        });
    };

    // Xử lý thay đổi filter
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div style={{ padding: 24, maxWidth: 800, margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
            <BarChart chartData={data} type={TYPES[typeIndex]} />

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, margin: "24px 0" }}>
                <button onClick={() => handleTypeChange("left")} style={buttonStyle}>&larr;</button>
                <span style={{ fontWeight: "bold", fontSize: 18 }}>{TYPES[typeIndex]}</span>
                <button onClick={() => handleTypeChange("right")} style={buttonStyle}>&rarr;</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16 }}>
                <input
                    type="text"
                    name="cuaHang"
                    placeholder="Cửa Hàng"
                    value={filters.cuaHang}
                    onChange={handleFilterChange}
                    style={inputStyle}
                />
                <input
                    type="text"
                    name="thanhPho"
                    placeholder="Thành Phố"
                    value={filters.thanhPho}
                    onChange={handleFilterChange}
                    style={inputStyle}
                />
                <input
                    type="text"
                    name="bang"
                    placeholder="Bang"
                    value={filters.bang}
                    onChange={handleFilterChange}
                    style={inputStyle}
                />
                <input
                    type="text"
                    name="matHang"
                    placeholder="Mặt Hàng"
                    value={filters.matHang}
                    onChange={handleFilterChange}
                    style={inputStyle}
                />
            </div>
        </div>

    );
}
