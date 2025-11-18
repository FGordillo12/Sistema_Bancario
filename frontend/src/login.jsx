import React from 'react'

const login = () => {
  return (
    <main className='contenedor-principal'>
        <div className='caja-fondo'>
            <h1>Iniciar Sesión</h1>
            <div className='formulario'>
                <form>
                    <input type='email' placeholder='Correo Electrónico' required />
                    <input type='password' placeholder='Contraseña' required />
                    <button type='submit'>Iniciar Sesión</button>
                </form>
            </div>
        </div>

    </main>
  )
}

export default login