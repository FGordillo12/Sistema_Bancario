import React, { useState } from 'react'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [codigo, setCodigo] = useState('')
  const [paso, setPaso] = useState(1)

  const handleLogin = async (e) => {
    e.preventDefault()
    console.log('Login attempt:', email, password)
    
    // Simulamos el envío del código
    setPaso(2)
  }

  const verificarCodigo = async (e) => {
    e.preventDefault()
    console.log('Verificar código:', codigo)
    
    // Simulamos login exitoso
    onLogin({ id: '1', email: email })
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Sistema Bancario - Login</h2>
      
      {paso === 1 ? (
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px' }}>
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: '10px' }}>
            Iniciar Sesión
          </button>
        </form>
      ) : (
        <form onSubmit={verificarCodigo}>
          <p>Se ha enviado un código de verificación a tu email</p>
          <p><strong>Usar el codigo 123456</strong></p>
          <div style={{ marginBottom: '15px' }}>
            <input 
              type="text" 
              placeholder="Código de verificación" 
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required 
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: '10px' }}>
            Verificar
          </button>
        </form>
      )}
    </div>
  )
}

export default Login