'use client';
import React, { useState, useEffect } from 'react';
import FilterInputs from './FilterInputs';


const factTables = ['banHang', 'kho']
const timeDimensions = ['Năm', 'Quý', 'Tháng'];
const customerDimensions = ['Bang', 'Thành Phố', 'Khách Hàng'];
const productDimensions = ['Mặt Hàng', 'Mặt Hàng'];
const storedDimensions = ['Bang', 'Thành phố', 'Cửa Hàng']
const allDimension = ['Năm', 'Quý', 'Tháng', 'Bang', 'Thành Phố', 'Khách Hàng', 'Mặt Hàng', 'Cửa Hàng'];

type Props = {
  fact: string;
  dimensions: string[];
  filters: Record<string, string[]>;
  onChangeFact: (factTable: string) => void
  onChangeDimensions: (dims: string[]) => void;
  onChangeFilters: (filters: Record<string, string[]>) => void;
};

export default function Controls({
  fact,
  dimensions,
  filters,
  onChangeFact,
  onChangeDimensions,
  onChangeFilters,
}: Props) {
  // State cho từng nhóm dimension
  const [selectedFactTable, setSelectedFactTable] = useState <string>('banHang');
  const [selectedTimeDim, setSelectedTimeDim] = useState<string>('Tháng');
  const [selectedCustomerDim, setSelectedCustomerDim] = useState<string>('Khách Hàng');
  const [selectedStoredDim, setSelectedStoredDim] = useState<string>('Cửa Hàng');
  const [selectedProductDim, setSelectedProductDim] = useState<string>('Mặt Hàng');
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>(filters);

  // Toggle state cho từng dimension
  const [useTime, setUseTime] = useState<boolean>(true);
  const [useCustomer, setUseCustomer] = useState<boolean>(false);
  const [useProduct, setUseProduct] = useState<boolean>(false);
  const [useStored, setUseStored] = useState<boolean>(false);

  // const [activeDims, setActiveDims] = useState<string[]>(dimensions);

  useEffect(() => {
    setFilterValues(filters);
  }, [filters]);

  const handleFactChange = (e: React.ChangeEvent<HTMLSelectElement>) =>{
    setSelectedFactTable(e.target.value)
  }
  // Xử lý chuyển dimension
  const handleTimeChange = (direction: number) => {
    const currentIdx = timeDimensions.indexOf(selectedTimeDim);
    let newIdx = currentIdx + direction;
    if (newIdx < 0) newIdx = 0;
    if (newIdx >= timeDimensions.length) newIdx = timeDimensions.length - 1;
    setSelectedTimeDim(timeDimensions[newIdx]);
  };

  const handleCustomerChange = (direction: number) => {
    const currentIdx = customerDimensions.indexOf(selectedCustomerDim);
    let newIdx = currentIdx + direction;
    if (newIdx < 0) newIdx = 0;
    if (newIdx >= customerDimensions.length) newIdx = customerDimensions.length - 1;
    setSelectedCustomerDim(customerDimensions[newIdx]);
  };

  const handleStoredChange = (direction: number) => {
    const currentIdx = storedDimensions.indexOf(selectedStoredDim);
    let newIdx = currentIdx + direction;
    if (newIdx < 0) newIdx = 0;
    if (newIdx >= storedDimensions.length) newIdx = storedDimensions.length - 1;
    setSelectedStoredDim(storedDimensions[newIdx]);
  };

  const handleProductChange = (direction: number) => {
    const currentIdx = productDimensions.indexOf(selectedProductDim);
    let newIdx = currentIdx + direction;
    if (newIdx < 0) newIdx = 0;
    if (newIdx >= productDimensions.length) newIdx = customerDimensions.length - 1;
    setSelectedProductDim(productDimensions[newIdx]);
  };

  // Khi các dimension thay đổi, cập nhật dimensions prop
  useEffect(() => {

    let dims: string[] = [];

    // Loại bỏ các dimension cũ
    dims = dimensions.filter(
      d =>
        !timeDimensions.includes(d) &&
        !customerDimensions.includes(d) &&
        !productDimensions.includes(d) &&
        !storedDimensions.includes(d)
    );

    // Thêm các dimension đang bật, theo logic mới
    if (useTime) {
      if (selectedTimeDim === 'Tháng') {
        dims.push('Năm', 'Quý', 'Tháng');
      } else if (selectedTimeDim === 'Quý') {
        dims.push('Năm', 'Quý');
      } else if (selectedTimeDim === 'Năm') {
        dims.push('Năm');
      }
    }

    if (selectedFactTable === 'banHang') {
        if (useCustomer) {
          if (selectedCustomerDim === 'Khách Hàng') {
            dims.push('Bang', 'Thành Phố', 'Khách Hàng');
          } else if (selectedCustomerDim === 'Thành Phố') {
            dims.push('Bang', 'Thành Phố');
          } else if (selectedCustomerDim === 'Bang') {
            dims.push('Bang');
          }
        }
    }
    else {
      if (useStored) {
        if (selectedStoredDim === 'Cửa Hàng') {
          dims.push('Bang', 'Thành phố', 'Cửa Hàng');
        } else if (selectedStoredDim === 'Thành phố') {
          dims.push('Bang', 'Thành phố');
        } else if (selectedStoredDim === 'Bang') {
          dims.push('Bang');
        }
      }
    }


    if (useProduct) {
      dims.push(selectedProductDim); // Product không có hierarchy, cứ thế thêm vào
    }

    // Loại bỏ các dimension trùng lặp
    dims = [...new Set(dims)];

    // setActiveDims(dims);
    onChangeDimensions(dims);

    onChangeFact(selectedFactTable);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTimeDim, selectedCustomerDim, selectedProductDim, useTime, useCustomer, useProduct, selectedFactTable, selectedStoredDim, useStored]);

  return (
    <div style={{ marginBottom: 16 }}>
      <strong>Fact:</strong>
      <select value = {selectedFactTable} onChange = {handleFactChange}>
        {factTables.map((factTable, index) =>{
          return <option key = {index} value = {factTable}>
            {factTable}
          </option>
        })}
      </select>
      <br/>
      <strong>Dimensions:</strong>
      {/* Time dimension group */}
      <span style={{ marginLeft: 8 }}>
        <label>
          <input
            type="checkbox"
            checked={useTime}
            onChange={() => setUseTime(!useTime)}
            style={{ marginRight: 4 }}
          />
          <strong>Time:</strong>
        </label>
        <button type="button" onClick={() => handleTimeChange(-1)} disabled={!useTime} style={{ marginLeft: 4 }}>▲</button>
        <span style={{ margin: '0 8px', color: useTime ? undefined : '#aaa' }}>{selectedTimeDim}</span>
        <button type="button" onClick={() => handleTimeChange(1)} disabled={!useTime}>▼</button>
      </span>
      {selectedFactTable === 'Fact_BanHang' ? (
        <span style={{ marginLeft: 16 }}>
          <label>
            <input
              type="checkbox"
              checked={useCustomer}
              onChange={() => setUseCustomer(!useCustomer)}
              style={{ marginRight: 4 }}
            />
            <strong>Customer:</strong>
          </label>
          <button type="button" onClick={() => handleCustomerChange(-1)} disabled={!useCustomer} style={{ marginLeft: 4 }}>▲</button>
          <span style={{ margin: '0 8px', color: useCustomer ? undefined : '#aaa' }}>{selectedCustomerDim}</span>
          <button type="button" onClick={() => handleCustomerChange(1)} disabled={!useCustomer}>▼</button>
        </span>
      ) : (
        <span style={{ marginLeft: 16 }}>
          <label>
            <input
              type="checkbox"
              checked={useStored}
              onChange={() => setUseStored(!useStored)}
              style={{ marginRight: 4 }}
            />
            <strong>Store:</strong>
          </label>
          <button type="button" onClick={() => handleStoredChange(-1)} disabled={!useStored} style={{ marginLeft: 4 }}>▲</button>
          <span style={{ margin: '0 8px', color: useStored ? undefined : '#aaa' }}>{selectedStoredDim}</span>
          <button type="button" onClick={() => handleStoredChange(1)} disabled={!useStored}>▼</button>
        </span>
      )}
      <span style={{ marginLeft: 16 }}>
        <label>
          <input
            type="checkbox"
            checked={useProduct}
            onChange={() => setUseProduct(!useProduct)}
            style={{ marginRight: 4 }}
          />
          <strong>Product:</strong>
        </label>
        <button type="button" onClick={() => handleProductChange(-1)} disabled={!useProduct} style={{ marginLeft: 4 }}>▲</button>
        <span style={{ margin: '0 8px', color: useProduct ? undefined : '#aaa' }}>{selectedProductDim}</span>
        <button type="button" onClick={() => handleProductChange(1)} disabled={!useProduct}>▼</button>
      </span>
      <br />
      {/* filter */}
      <FilterInputs allDimension={allDimension} onFilterChange={onChangeFilters}/>
    </div>
  );
}
