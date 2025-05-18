import React, { useState } from 'react';

interface FilterInputsProps {
  allDimension: string[];
  onFilterChange: (values: Record<string, string[]>) => void;
}

const FilterInputs: React.FC<FilterInputsProps> = ({ allDimension, onFilterChange }) => {
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>(
    allDimension.reduce((acc, dim) => {
      acc[dim] = [''];
      return acc;
    }, {} as Record<string, string[]>)
  );

  const handleFilterChange = (dim: string, index: number, value: string) => {
    const newValues = [...filterValues[dim]];
    newValues[index] = value;
    setFilterValues({ ...filterValues, [dim]: newValues });
  };

  const handleAddInput = (dim: string) => {
    setFilterValues({
      ...filterValues,
      [dim]: [...filterValues[dim], ''],
    });
  };

  const handleRemoveInput = (dim: string, index: number) => {
    if (filterValues[dim].length <= 1) return;
    const newValues = filterValues[dim].filter((_, i) => i !== index);
    setFilterValues({
      ...filterValues,
      [dim]: newValues,
    });
  };

  const handleFilterSubmit = () => {
    onFilterChange(filterValues);
  };

  return (
    <div>
      {allDimension.map(dim => (
        <div key={dim} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <label style={{ minWidth: 60 }}>{dim}</label>
          {/* {filterValues[dim].map((val, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input
                value={val}
                onChange={e => handleFilterChange(dim, i, e.target.value)}
                placeholder={dim}
                style={{ width: 100 }}
              />
              {filterValues[dim].length > 1 && (
                <button onClick={() => handleRemoveInput(dim, i)} style={{ color: 'red' }}>−</button>
              )}
            </div>
          ))} */}
          <button onClick={() => handleAddInput(dim)}>+</button>
        </div>
      ))}
      <button onClick={handleFilterSubmit} style={{ marginTop: 16 }}>Lọc</button>
    </div>
  );
};

export default FilterInputs;
