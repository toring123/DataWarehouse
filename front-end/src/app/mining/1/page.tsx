'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Mining_1() {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
 
  const fetchTopics = async () => {
    try {
      const response = await axios.get('http://26.83.102.88:8000/topic');
      setTopics(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };
    
  const postTopic = async (topic) => {
    if (!topic) {
      setData([]);
      return;
    }
    
    setDataLoading(true);
    try {
      const send_data = {"topic": topic};
      const response = await axios.post('http://26.83.102.88:8000/detailPaperPerTopic', send_data, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    postTopic(selectedTopic);
  }, [selectedTopic]);

  const handleChange = (e) => {
    setSelectedTopic(e.target.value);
  };

  if (loading) {
    return <div>Đang tải danh mục...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="topic-select">Chọn chủ đề: </label>
        <select 
          id="topic-select"
          value={selectedTopic} 
          onChange={handleChange}
          style={{ padding: '8px', fontSize: '16px' }}
        >
          <option value="">Chọn danh mục</option>
          {topics.map((topic, index) => (
            <option key={index} value={topic.topic}>
              {topic.topic}
            </option>
          ))}
        </select>
      </div>

      {dataLoading && <div>Đang tải dữ liệu...</div>}

      {!dataLoading && data.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Kết quả cho chủ đề: {selectedTopic}</h3>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            border: '1px solid #ddd'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                {Object.keys(data[0]).map((key, index) => (
                  <th key={index} style={{ 
                    border: '1px solid #ddd', 
                    padding: '12px',
                    textAlign: 'left',
                    fontWeight: 'bold'
                  }}>
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} style={{ 
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9' 
                }}>
                  {Object.values(item).map((value, valueIndex) => (
                    <td key={valueIndex} style={{ 
                      border: '1px solid #ddd', 
                      padding: '12px',
                      verticalAlign: 'top'
                    }}>
                      {
                       String(value)
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!dataLoading && selectedTopic && data.length === 0 && (
        <div style={{ marginTop: '20px', color: '#666' }}>
          Không có dữ liệu cho chủ đề này.
        </div>
      )}
    </div>
  );
}
