import React from 'react'
import '../CSS/Registro.css';
const Registro = () => {
  return (
    <main className='contenedor-principal'>
        <div className='caja-fondo'>
            <h1>Registro</h1>
            <div className='formulario'>
                <form>
                    <input type='text' placeholder='Nombre Completo' required />
                    <input type='email' placeholder='Correo Electrónico' required />
                    <input type='password' placeholder='Contraseña' required />
                    <button type='submit'>Registrarse</button>
                </form>

            </div>

        </div>

    </main>
  )
}

export default Registro