import { NextRequest, NextResponse } from 'next/server';
import factData from '@/data/factTable.json';

type FactRow = {
    "Tháng": number;
    "Quý": number;
    "Năm": number;
    "Khách Hàng": string;
    "Thành Phố": string;
    "Bang": string;
    "Mặt Hàng": string;
    "Tổng số lượng": number;
    "Tổng doanh thu": number;
};
  

export async function POST(req: NextRequest) {
  const { dimensions, filters } = await req.json();

  // Lọc dữ liệu (slice, dice)
  let filtered = (factData as FactRow[]).filter(row =>
    Object.entries(filters || {}).every(([dim, val]) =>
      val ? String(row[dim as keyof FactRow]) === String(val) : true
    )
  );

  // Gom nhóm theo dimensions (roll up, drill down)
  let grouped: Record<string, any> = {};
  filtered.forEach(row => {
    const key = dimensions.map((dim: string) => row[dim as keyof FactRow]).join('|');
    if (!grouped[key]) {
      grouped[key] = { ...Object.fromEntries(dimensions.map((dim: string) => [dim, row[dim as keyof FactRow]])), sales: 0, profit: 0 };
    }
    grouped[key].sales += row["Tổng số lượng"];
    grouped[key].profit += row["Tổng doanh thu"];
  });

  return NextResponse.json(Object.values(grouped));
}
