import React from 'react'

function Dashboard({ user, onLogout }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Bienvenido, {user?.correo}</h2>
        <button onClick={onLogout}>Cerrar Sesión</button>
      </div>
      
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3>Dashboard del Sistema Bancario</h3>
        <p>Aquí irán las funciones del banco:</p>
        <ul>
          <li>Crear Cuentas</li>
          <li>Realizar Transacciones</li>
          <li>Consultar Estado de Cuenta</li>
        </ul>
        <p><strong>Para la prueba del login </strong> Usa cualquier correo y contraseña, luego ingresa el codigo 123456</p>
      </div>
    </div>
  )
}

export default Dashboard