import React from 'react';

type Props = {
  data: any[];
};

export default function DataTable({ data }: Props) {
  if (!data || data.length === 0) return <p>Không có dữ liệu để hiển thị.</p>;

  const columns = Object.keys(data[0]);

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
          {columns.map((col) => (
            <th
              key={col}
              style={{
                border: '1px solid #333',
                background: '#f6f6f6',
                textAlign: 'center'
              }}
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {columns.map((col) => (
              <td key={col} style={{ border: '1px solid #333', textAlign: 'center' }}>
                {row[col]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
