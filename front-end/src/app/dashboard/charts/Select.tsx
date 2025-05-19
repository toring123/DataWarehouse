import { useEffect, useState } from "react";

type SelectProps = {
  name: string; // thêm name
  type: string;
  value: string;
  onChangeOption: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function Select({ name, type, value, onChangeOption }: SelectProps) {
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`http://26.83.102.88:8000/${type}`);
        const data = await response.json();
        setOptions(data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <select name={name} value={value} onChange={onChangeOption}>
      {loading ? (
        <option>loading</option>
      ) : (
        <>
          <option value="">--{type}--</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </>
      )}
    </select>
  );
}
