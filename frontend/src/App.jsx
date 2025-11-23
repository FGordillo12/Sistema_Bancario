import React, { useState } from 'react'
import Login from './Login.jsx'
import Dashboard from './dashboard.jsx'
import Registro from './Registro.jsx'
import PaginaPrincipal from './PaginaPrincipal.jsx'
import Cuenta from './cuenta.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (usuario) => {
    setUser(usuario);  // guardamos el usuario recibido desde Login
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PaginaPrincipal />} />

        {/* Enviamos onLogin para guardar usuario en App */}
        <Route 
          path="/login" 
          element={<Login onLogin={handleLogin} />} 
        />

        {/* Protegemos Dashboard con user */}
        <Route 
          path="/dashboard" 
          element={
            user && user.correo ? (
                <Dashboard user={user} onLogout={handleLogout} />
            ) : (
                <h2>No estás autenticado</h2>
            )

          } 
        />

        <Route path="/registro" element={<Registro />} />
        <Route path ="/crear_cliente" element =  {<Cuenta/>}/>
      </Routes>
    </Router>
  )
}

export default App
