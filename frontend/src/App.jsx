import React, { useState } from 'react'
import Login from './login.jsx'
import Dashboard from './dashboard.jsx'

function App() {
  const [user, setUser] = useState(null)

  return (
    <div style={{ padding: '20px' }}>
      {!user ? (
        <Login onLogin={setUser} />
      ) : (
        <Dashboard user={user} onLogout={() => setUser(null)} />
      )}
    </div>
  )
}

export default App