'use client';
import { useState } from 'react';

export default function Mining_2() {
  const [topPercent, setTopPercent] = useState(0.05);
  const [monthA, setMonthA] = useState(10);
  const [monthB, setMonthB] = useState(12);
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://26.83.102.88:8000/topPaperPerTopic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          top_percent: topPercent,
          month_A: monthA,
          month_B: monthB
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setResponseData(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTopPercent(0.05);
    setMonthA(10);
    setMonthB(12);
    setResponseData(null);
    setError(null);
  };

  // Function to render data as table
  const renderDataTable = (data) => {
    if (!data) return null;

    // If data is an array of objects
    if (Array.isArray(data) && data.length > 0) {
      const headers = Object.keys(data[0]);
      
      return (
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '10px'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              {headers.map((header, index) => (
                <th key={index} style={{
                  border: '1px solid #dee2e6',
                  padding: '12px 8px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  color: '#495057'
                }}>
                  {header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} style={{
                backgroundColor: rowIndex % 2 === 0 ? '#ffffff' : '#f8f9fa'
              }}>
                {headers.map((header, colIndex) => (
                  <td key={colIndex} style={{
                    border: '1px solid #dee2e6',
                    padding: '10px 8px',
                    color: '#495057'
                  }}>
                    {typeof row[header] === 'object' 
                      ? JSON.stringify(row[header]) 
                      : String(row[header])
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    // If data is an object
    if (typeof data === 'object' && data !== null) {
      return (
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '10px'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{
                border: '1px solid #dee2e6',
                padding: '12px 8px',
                textAlign: 'left',
                fontWeight: 'bold',
                color: '#495057',
                width: '30%'
              }}>
                Property
              </th>
              <th style={{
                border: '1px solid #dee2e6',
                padding: '12px 8px',
                textAlign: 'left',
                fontWeight: 'bold',
                color: '#495057'
              }}>
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map(([key, value], index) => (
              <tr key={index} style={{
                backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa'
              }}>
                <td style={{
                  border: '1px solid #dee2e6',
                  padding: '10px 8px',
                  fontWeight: 'bold',
                  color: '#495057'
                }}>
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
                </td>
                <td style={{
                  border: '1px solid #dee2e6',
                  padding: '10px 8px',
                  color: '#495057'
                }}>
                  {typeof value === 'object' 
                    ? JSON.stringify(value, null, 2) 
                    : String(value)
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    // Fallback for other data types
    return (
      <div style={{
        padding: '10px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        {String(data)}
      </div>
    );
  };

  return (
    <div style={{ 
      maxWidth: 800, // Increased width for table display
      margin: '40px auto', 
      fontFamily: 'sans-serif',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#fff'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
      Thống kê các topic dựa trên tỷ lệ phần trăm bài báo có nhiều lượt truy cập nhất trong một khoảng thời gian

      </h2>

      {/* Top Percent Slider */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="top_percent" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Top phần trăm bài báo: {(topPercent * 100).toFixed(1)}%
        </label>
        <input
          type="range"
          id="top_percent"
          min="0.01"
          max="1"
          step="0.01"
          value={topPercent}
          onChange={(e) => setTopPercent(Number(e.target.value))}
          style={{ 
            width: '100%', 
            height: '6px',
            background: '#ddd',
            borderRadius: '3px',
            outline: 'none'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
          <span>1%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Month A Input */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="month_a" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Tháng bắt đầu:
        </label>
        <input
          type="number"
          id="month_a"
          value={monthA}
          onChange={(e) => setMonthA(Number(e.target.value))}
          min="1"
          max="12"
          style={{ 
            width: '100%', 
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
      </div>

      {/* Month B Input */}
      <div style={{ marginBottom: '30px' }}>
        <label htmlFor="month_b" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Tháng kết thúc:
        </label>
        <input
          type="number"
          id="month_b"
          value={monthB}
          onChange={(e) => setMonthB(Number(e.target.value))}
          min="1"
          max="12"
          style={{ 
            width: '100%', 
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          style={{ 
            flex: 1,
            padding: '12px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s'
          }}
        >
          {loading ? 'Processing...' : 'Submit'}
        </button>
        
        <button 
          onClick={handleReset}
          disabled={loading}
          style={{ 
            padding: '12px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Reset
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{ 
          padding: '12px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Response Data Display as Table */}
      {responseData && (
        <div style={{ 
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '4px'
        }}>
          <div style={{ 
            backgroundColor: '#ffffff',
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '500px'
          }}>
            {renderDataTable(responseData)}
          </div>
        </div>
      )}
    </div>
  );
}
