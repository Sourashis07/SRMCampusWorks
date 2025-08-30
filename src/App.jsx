import React from 'react'

function App() {
  return React.createElement('div', 
    { style: { minHeight: '100vh', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
    React.createElement('div', 
      { style: { textAlign: 'center' } },
      React.createElement('h1', 
        { style: { fontSize: '2rem', fontWeight: 'bold', color: '#111', marginBottom: '1rem' } },
        'Campus Works'
      ),
      React.createElement('p', 
        { style: { fontSize: '1.2rem', color: '#666', marginBottom: '2rem' } },
        'Your Campus Freelance Platform'
      ),
      React.createElement('button', 
        { style: { backgroundColor: '#2563eb', color: 'white', padding: '12px 32px', borderRadius: '8px', border: 'none', fontSize: '1.1rem', cursor: 'pointer' } },
        'Get Started'
      )
    )
  )
}

export default App;