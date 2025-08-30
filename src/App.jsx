import React from 'react'

function App() {
  const handleGetStarted = () => {
    window.location.href = '/login'
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111', marginBottom: '1rem' }}>
          Campus Works
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
          Your Campus Freelance Platform
        </p>
        <button 
          onClick={handleGetStarted}
          style={{ backgroundColor: '#2563eb', color: 'white', padding: '12px 32px', borderRadius: '8px', border: 'none', fontSize: '1.1rem', cursor: 'pointer' }}
        >
          Get Started
        </button>
      </div>
    </div>
  )
}

export default App;