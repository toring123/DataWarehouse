"use client"
import { useEffect, useState } from "react";
import Chart1 from "../charts/Chart1";

export default function Sales(){ 
    return (
        <div>
            <div>Quản lý bán hàng</div>
            <Chart1 />
        </div>
    );
}