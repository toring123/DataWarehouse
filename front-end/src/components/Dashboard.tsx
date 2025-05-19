'use client';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Controls from './Controls';
import DataTable from './DataTable';
import { RootState, AppDispatch } from '@/store/store';
import { setDimensions, setFilters, fetchOlapData, setCube } from '@/store/olapSlice';

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { cube, dimensions, filters, data, status } = useSelector((state: RootState) => state.olap);

  useEffect(() => {
    dispatch(fetchOlapData({ cube, dimensions, filters }));
  }, [cube, dimensions, filters, dispatch]);

  return (
    <div>
      <h2>OLAP Dashboard</h2>
      <Controls
        cube = {cube}
        dimensions={dimensions}
        filters={filters}
        onChangeCube= {f => dispatch(setCube(f))}
        onChangeDimensions={dims => dispatch(setDimensions(dims))}
        onChangeFilters={f => dispatch(setFilters(f))}
      />
      {status === 'loading' ? <p>Loading...</p> : <DataTable data={data} />}
    </div>
  );
}
