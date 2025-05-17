'use client';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Controls from './Controls';
import DataTable from './DataTable';
import { RootState, AppDispatch } from '@/store/store';
import { setDimensions, setFilters, fetchOlapData, setFact } from '@/store/olapSlice';

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { fact, dimensions, filters, data, status } = useSelector((state: RootState) => state.olap);

  useEffect(() => {
    dispatch(fetchOlapData({ fact, dimensions, filters }));
  }, [fact, dimensions, filters, dispatch]);

  return (
    <div>
      <h2>OLAP Dashboard</h2>
      <Controls
        fact = {fact}
        dimensions={dimensions}
        filters={filters}
        onChangeFact = {f => dispatch(setFact(f))}
        onChangeDimensions={dims => dispatch(setDimensions(dims))}
        onChangeFilters={f => dispatch(setFilters(f))}
      />
      {status === 'loading' ? <p>Loading...</p> : <DataTable data={data} dimensions={dimensions} />}
    </div>
  );
}
