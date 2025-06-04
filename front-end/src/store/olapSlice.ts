import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

type OLAPState = {
  cube: string;
  dimensions: string[];
  filters: Record<string, string[]>;
  data: any[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
};

const initialState: OLAPState = {
  cube: "banHang_3d",
  dimensions: ['Năm'],
  filters: {},
  data: [],
  status: 'idle'
};

const API_KEY = 'http://26.83.102.88:8000/dw'
const API_TEST = 'http://localhost:3000/api/olap-data'
export const fetchOlapData = createAsyncThunk(
  'olap/fetchOlapData',
  async ({ cube, dimensions, filters }: { cube: string, dimensions: string[], filters: Record<string, string[]> }) => {
    const res = await fetch(`${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cube, dimensions, filters })
    });
    return res.json();
  }
);

const olapSlice = createSlice({
  name: 'olap',
  initialState,
  reducers: {
    setCube(state, action: PayloadAction<string>){
      state.cube = action.payload;
    },
    setDimensions(state, action: PayloadAction<string[]>) {
      state.dimensions = action.payload;
    },
    setFilters(state, action: PayloadAction<Record<string, string[]>>) {
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

export const { setCube, setDimensions, setFilters } = olapSlice.actions;
export default olapSlice.reducer;
