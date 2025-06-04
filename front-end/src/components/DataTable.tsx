import React from 'react';

type Props = {
  fact: string;
  data: any[];
  dimensions: string[];
};

export default function DataTable({ fact, data, dimensions }: Props) {
  return (
    <table
      style={{
        width: '100%',
        marginTop: 16,
        borderCollapse: 'collapse',
        border: '2px solid #333'
      }}
    >
      <thead>
        <tr>
          {dimensions.map(dim => (
            <th
              key={dim}
              style={{
                border: '1px solid #333',
                background: '#f6f6f6',
                textAlign: 'center'
              }}
            >
              {dim}
            </th>
          ))}
          {fact === 'banHang_3d' ? (
            <>
              <th style={{ border: '1px solid #333', background: '#f6f6f6', textAlign: 'center' }}>Tổng số lượng</th>
              <th style={{ border: '1px solid #333', background: '#f6f6f6', textAlign: 'center' }}>Tổng doanh thu</th>
            </>
          ) : (
            <>
              <th style={{ border: '1px solid #333', background: '#f6f6f6', textAlign: 'center' }}>Tổng số lượng nhập</th>
              <th style={{ border: '1px solid #333', background: '#f6f6f6', textAlign: 'center' }}>Tổng số lượng xuất</th>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {dimensions.map(dim => (
              <td key={dim} style={{ border: '1px solid #333', textAlign: 'center' }}>{row[dim]}</td>
            ))}
            {fact === 'banHang_3d' ? (
              <>
                <td style={{ border: '1px solid #333', textAlign: 'center' }}>{row['Tổng Số Lượng']}</td>
                <td style={{ border: '1px solid #333', textAlign: 'center' }}>{row['Tổng Doanh Thu']}</td>
              </>
            ) : (
              <>
                <td style={{ border: '1px solid #333', textAlign: 'center' }}>{row['Tổng Số Lượng Nhập']}</td>
                <td style={{ border: '1px solid #333', textAlign: 'center' }}>{row['Tổng Số Lượng Xuất']}</td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
