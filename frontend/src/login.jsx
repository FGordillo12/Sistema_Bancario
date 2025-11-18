import React from 'react'

const Login = () => {
  const [Correo, setCorreo] = React.useState('');
  const [Contraseña, setContraseña] = React.useState('');
  const [mensaje, setMensaje] = React.useState('');

  const handleSubmit = async (e) => {
        e.preventDefault();

        const datos = {
          email: Correo,
          password: Contraseña
        }

      try {
        const respuesta = await fetch("http://localhost:3000/apis/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        });

        const data = await respuesta.json();
        setMensaje(data.message || "Login exitoso");

        // Limpia campos
        setCorreo("");
        setContraseña("");

      } catch (error) {
        console.error("Error en login:", error);
        setMensaje("Error de servidor");
      }
    };
  return (
    <main className='contenedor-principal'>
        <div className='caja-fondo'>
            <h1>Iniciar Sesión</h1>
            <div className='formulario'>
                <form onSubmit={handleSubmit}>
                    <input type='email' placeholder='Correo Electrónico' required value={Correo} onChange={ (e) =>setCorreo(e.target.value) } />
                    <input type='password' placeholder='Contraseña' required value={Contraseña} onChange={ (e) => setContraseña(e.target.value)} />
                    <button type='submit'>Iniciar Sesión</button>
                </form>
                {mensaje && <p>{mensaje}</p>}
            </div>
            
        </div>
    </main>
  )
}

export default Login