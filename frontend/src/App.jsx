import React, { useState, useEffect } from 'react'
import Login from './Login.jsx'
import Dashboard from './dashboard.jsx'
import Registro from './Registro.jsx'
import PaginaPrincipal from './PaginaPrincipal.jsx'
import Cuenta from './cuenta.jsx'
import Productos from './Productos_cliente.jsx'
import DashboardCliente from './dashboardCliente.jsx'
import VerificarSaldo from './estadoCuenta.jsx'
import Consignaciones from './consignaciones.jsx'
import Retiros from './retiros.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RecargarSaldo from './recargarSaldo.jsx'

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('user');
    if (usuarioGuardado) {
        setUser(JSON.parse(usuarioGuardado));
      }
    }, []);


  const handleLogin = (usuario) => {
    setUser(usuario);
    localStorage.setItem('user', JSON.stringify(usuario));
  };
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
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

        {/* Protegemos DashboardCliente con user */}
        <Route 
          path="/dashboardCliente" 
          element={
            user && user.correo ? (
                <DashboardCliente user={user} onLogout={handleLogout} />
            ) : (
                <h2>No estás autenticado</h2>
            )
          } 
        />

        <Route path="/registro" element={<Registro />} />
        <Route path ="/crear_cliente" element =  {<Cuenta/>}/>
        <Route path ="/productos_cliente" element =  {<Productos/>}/>
        
        {/* PASAMOS USER COMO PROP A LAS TRANSACCIONES */}
        <Route path='/verificarSaldo' element = {
          user ? <VerificarSaldo user={user} /> : <h2>No estas autenticado</h2>
        }/>
        <Route path='/consignaciones' element = {
          user ? <Consignaciones user={user} /> : <h2>No estas autenticado</h2>
        }/>
        <Route path='/retiros' element = {
          user ? <Retiros user={user} /> : <h2>No estas autenticado</h2>
        }/>
        <Route path='/recargarSaldo' element = {
          user ? <RecargarSaldo user={user} /> : <h2>No estas autenticado</h2>
        }/>

      </Routes>
    </Router>
  )
}

export default App