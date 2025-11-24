import React from 'react'
import '../CSS/dashboard.css'
import { useNavigate } from 'react-router-dom';

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    onLogout();      // limpia el usuario
    navigate("/");   // redirige a la ruta que quieras
  };
  return (
    <div>
      <header>
        <nav className='encabezado'>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Bienvenido {user?.correo}</h2>
            </div>
            <button className= 'cerrarsesion' onClick={cerrarSesion}>Cerrar Sesión</button>
        </nav>
      </header>
      
      <main className='caja_principal'>
        <section className='modulos'>
          <h1>FUNCIONALIDADES CLIENTE</h1>
          <div className='modulos_contenido'> 
              <div className='contenido' onClick={() => navigate('/consignaciones')}>
                <img src = "/IMAGENES/consignaciones.png"/>
                <h2>Consignaciones</h2>
              </div>

              <div className='contenido' onClick={ () => navigate ('/retiros')}>
                <img src = "/IMAGENES/retiros.png"/>
                <h2>Retiros</h2>
              </div>

              <div className='contenido' onClick={ () => navigate ('/verificarSaldo')}>
                <img src = "/IMAGENES/aprobar-banca.png"/>
                <h2>Verificar Saldo</h2>
              </div>

              <div className='contenido' onClick={ () => navigate ('/recargarSaldo')}>
                <img src = "/IMAGENES/recargar-saldo.png"/>
                <h2>Recargar Saldo</h2>
              </div>
          </div>
          
        </section>
        
      </main>
    </div>
  )
}

export default Dashboard