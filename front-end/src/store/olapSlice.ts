import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

type OLAPState = {
  dimensions: string[];
  filters: Record<string, string>;
  data: any[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
};

const initialState: OLAPState = {
  dimensions: ['Tháng', 'Khách Hàng', 'Mặt Hàng'],
  filters: {},
  data: [],
  status: 'idle'
};

export const fetchOlapData = createAsyncThunk(
  'olap/fetchOlapData',
  async ({ dimensions, filters }: { dimensions: string[], filters: Record<string, string> }) => {
    const res = await fetch('/api/olap-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dimensions, filters })
    });
    return res.json();
  }
);

const olapSlice = createSlice({
  name: 'olap',
  initialState,
  reducers: {
    setDimensions(state, action: PayloadAction<string[]>) {
      state.dimensions = action.payload;
    },
    setFilters(state, action: PayloadAction<Record<string, string>>) {
      state.filters = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchOlapData.pending, state => { state.status = 'loading'; })
      .addCase(fetchOlapData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchOlapData.rejected, state => {
        state.status = 'failed';
      });
  }
});

export const { setDimensions, setFilters } = olapSlice.actions;
export default olapSlice.reducer;
