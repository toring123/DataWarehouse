'use client'
import Dashboard from '@/components/Dashboard';
import { store } from '@/store/store';
import { Provider } from 'react-redux';

export default function DashboardPage() {
  return (
    <Provider store={store}>
      <div style={{ maxWidth: 800, margin: '40px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
        <Dashboard />
      </div>
    </Provider>
  );
}