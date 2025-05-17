import React from 'react';

type Props = {
  data: any[];
  dimensions: string[];
};

export default function DataTable({ data, dimensions }: Props) {
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
          <th style={{ border: '1px solid #333', background: '#f6f6f6', textAlign: 'center' }}>Tổng số lượng</th>
          <th style={{ border: '1px solid #333', background: '#f6f6f6', textAlign: 'center' }}>Tổng doanh thu</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {dimensions.map(dim => (
              <td key={dim} style={{ border: '1px solid #333', textAlign: 'center' }}>{row[dim]}</td>
            ))}
            <td style={{ border: '1px solid #333', textAlign: 'center' }}>{row['Tổng Số Lượng']}</td>
            <td style={{ border: '1px solid #333', textAlign: 'center' }}>{row['Tổng Doanh Thu']}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
