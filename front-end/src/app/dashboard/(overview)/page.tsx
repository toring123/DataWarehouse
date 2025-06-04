"use client"
import { useEffect, useState } from "react";
import Chart1 from "../charts/Chart1";
import Chart2 from "../charts/Chart2";

export default function Overview(){ 
    return (
        <div>
            <div style={{ fontWeight: 'bold', fontSize: '24px', marginBottom: '20px' }}>Tổng quan</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, marginRight: '10px' }}><Chart1 /></div>
                <div style={{ flex: 1, marginLeft: '10px' }}><Chart2 /></div>
            </div>
        </div>
    );
}
