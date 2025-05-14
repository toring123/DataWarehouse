'use client';
import React, { useState, useEffect } from 'react';

const timeDimensions = ['Năm', 'Quý', 'Tháng'];
const customerDimensions = ['Khách Hàng', 'Thành Phố', 'Bang'];
const productDimensions = ['Mặt Hàng', 'Mặt Hàng'];

type Props = {
  dimensions: string[];
  filters: Record<string, string>;
  onChangeDimensions: (dims: string[]) => void;
  onChangeFilters: (filters: Record<string, string>) => void;
};

export default function Controls({
  dimensions,
  filters,
  onChangeDimensions,
  onChangeFilters,
}: Props) {
  // State cho từng nhóm dimension
  const [selectedTimeDim, setSelectedTimeDim] = useState<string>('Tháng');
  const [selectedCustomerDim, setSelectedCustomerDim] = useState<string>('Khách Hàng');
  const [selectedProductDim, setSelectedProductDim] = useState<string>('Mặt Hàng');
  const [filterValues, setFilterValues] = useState<Record<string, string>>(filters);

  // Toggle state cho từng dimension
  const [useTime, setUseTime] = useState<boolean>(true);
  const [useCustomer, setUseCustomer] = useState<boolean>(true);
  const [useProduct, setUseProduct] = useState<boolean>(true);

  useEffect(() => {
    setFilterValues(filters);
  }, [filters]);

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

  const handleProductChange = (direction: number) => {
    const currentIdx = productDimensions.indexOf(selectedProductDim);
    let newIdx = currentIdx + direction;
    if (newIdx < 0) newIdx = 0;
    if (newIdx >= productDimensions.length) newIdx = customerDimensions.length - 1;
    setSelectedProductDim(productDimensions[newIdx]);
  };

  // Khi các dimension thay đổi, cập nhật dimensions prop
  useEffect(() => {
    // Loại bỏ các dimension cũ
    let dims = dimensions.filter(
      d =>
        !timeDimensions.includes(d) &&
        !customerDimensions.includes(d) &&
        !productDimensions.includes(d)
    );
    // Thêm các dimension đang bật
    if (useTime) dims.push(selectedTimeDim);
    if (useCustomer) dims.push(selectedCustomerDim);
    if (useProduct) dims.push(selectedProductDim);
    onChangeDimensions(dims);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTimeDim, selectedCustomerDim, selectedProductDim, useTime, useCustomer, useProduct]);

  // Xử lý filter
  const handleFilterChange = (dim: string, value: string) => {
    const newFilters = { ...filterValues, [dim]: value };
    setFilterValues(newFilters);
    onChangeFilters(newFilters);
  };

  return (
    <div style={{ marginBottom: 16 }}>
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
      <strong>Filters:</strong>
      {/* Filter cho từng dimension nếu đang bật */}
      {useTime && (
        <input
          key={selectedTimeDim}
          placeholder={selectedTimeDim}
          value={filterValues[selectedTimeDim] || ''}
          onChange={e => handleFilterChange(selectedTimeDim, e.target.value)}
          style={{ marginLeft: 8, width: 80 }}
        />
      )}
      {useCustomer && (
        <input
          key={selectedCustomerDim}
          placeholder={selectedCustomerDim}
          value={filterValues[selectedCustomerDim] || ''}
          onChange={e => handleFilterChange(selectedCustomerDim, e.target.value)}
          style={{ marginLeft: 8, width: 80 }}
        />
      )}
      {useProduct && (
        <input
          key={selectedProductDim}
          placeholder={selectedProductDim}
          value={filterValues[selectedProductDim] || ''}
          onChange={e => handleFilterChange(selectedProductDim, e.target.value)}
          style={{ marginLeft: 8, width: 80 }}
        />
      )}
    </div>
  );
}
