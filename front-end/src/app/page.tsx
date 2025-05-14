'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Welcome to My Home Page</h1>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <Link
          href="/dashboard"
          style={{
            padding: '1rem 2.5rem',
            background: '#0070f3',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
            transition: 'background 0.2s'
          }}
        >
          About Us
        </Link>
        <Link
          href="/contact"
          style={{
            padding: '1rem 2.5rem',
            background: '#ff4081',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            boxShadow: '0 4px 14px 0 rgba(255,64,129,0.39)',
            transition: 'background 0.2s'
          }}
        >
          Contact
        </Link>
      </div>
    </main>
  );
}
